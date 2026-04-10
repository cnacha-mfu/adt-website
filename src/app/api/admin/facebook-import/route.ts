export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractMeta(html: string, property: string): string {
  const re1 = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? decodeEntities(m[1]) : '';
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url || !url.includes('facebook.com')) {
      return NextResponse.json({ error: 'Invalid Facebook URL' }, { status: 400 });
    }

    // ── 1. Fetch Facebook page (OG tags are served to crawlers) ───────────────
    const pageResp = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });
    const html = await pageResp.text();

    const ogImage  = extractMeta(html, 'og:image');
    const ogDesc   = extractMeta(html, 'og:description');
    const ogTitle  = extractMeta(html, 'og:title');

    // ── 2. Download & save OG image ───────────────────────────────────────────
    let savedImageUrl = 'https://placehold.co/800x500/0D1830/0CC8D4?text=News';
    let imageBase64   = '';
    let imageMime     = 'image/jpeg';

    if (ogImage) {
      try {
        const imgResp   = await fetch(ogImage);
        const imgBuffer = Buffer.from(await imgResp.arrayBuffer());
        imageMime       = (imgResp.headers.get('content-type') || 'image/jpeg').split(';')[0];
        imageBase64     = imgBuffer.toString('base64');

        const ext      = imageMime === 'image/png' ? '.png' : imageMime === 'image/webp' ? '.webp' : '.jpg';
        const filename = `fb-${Date.now()}${ext}`;
        const dir      = path.join(process.cwd(), 'public', 'uploads', 'news');
        if (!existsSync(dir)) await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), imgBuffer);
        savedImageUrl = `/uploads/news/${filename}`;
      } catch (e) {
        console.error('[facebook-import] image download failed:', e);
      }
    }

    // ── 3. Gemini: extract text from image + bilingual translation ────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `You are helping import a Facebook post from Mae Fah Luang University's School of Applied Digital Technology (ADT) into a bilingual news website (Thai/English).

Facebook post title: ${ogTitle || '(not available)'}
Facebook post description: ${ogDesc || '(not available)'}

Carefully read the post (and image if provided — extract all visible text from it) and return a JSON object with these exact keys:

{
  "titleEN": "Concise English title (max 80 chars)",
  "titleTH": "ชื่อบทความภาษาไทย (ไม่เกิน 80 ตัวอักษร)",
  "excerptEN": "1–2 sentence English summary",
  "excerptTH": "สรุปภาษาไทย 1–2 ประโยค",
  "contentEN": "Full English content — translate completely, preserve all details",
  "contentTH": "เนื้อหาภาษาไทยฉบับเต็ม — แปลให้ครบถ้วน",
  "category": "one of: news | event | research | achievement | announcement",
  "author": "Author or 'ADT, Mae Fah Luang University' if not specified",
  "authorTH": "ผู้เขียน หรือ 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ มฟล.' ถ้าไม่ระบุ"
}

Rules:
- Original Thai → translate to English for EN fields; keep Thai for TH fields
- Original English → translate to Thai for TH fields; keep English for EN fields
- Extract every visible text line from the image (dates, times, locations, names)
- Pick the most accurate category
- Return ONLY valid JSON, no markdown fences`;

    const parts: unknown[] = [{ text: prompt }];
    // Only include image if it's under ~1 MB base64 to avoid payload issues
    if (imageBase64 && imageBase64.length < 1_000_000) {
      parts.push({ inlineData: { mimeType: imageMime, data: imageBase64 } });
    }

    // Retry up to 3 times on transient 503/429 errors
    let geminiResp: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 2000 * attempt));
      geminiResp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts }] }),
        }
      );
      if (geminiResp.ok || (geminiResp.status !== 503 && geminiResp.status !== 429)) break;
    }

    if (!geminiResp!.ok) {
      const err = await geminiResp!.text();
      console.error('[facebook-import] Gemini error:', err);
      return NextResponse.json({ error: `Gemini API error: ${geminiResp!.status}` }, { status: 502 });
    }

    const geminiData = await geminiResp!.json() as {
      candidates?: { content: { parts: { text: string }[] } }[];
    };
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[facebook-import] No JSON in Gemini response:', rawText);
      return NextResponse.json({ error: 'Could not parse Gemini response', raw: rawText }, { status: 500 });
    }

    const extracted = JSON.parse(jsonMatch[0]) as {
      titleEN?: string; titleTH?: string;
      excerptEN?: string; excerptTH?: string;
      contentEN?: string; contentTH?: string;
      category?: string; author?: string; authorTH?: string;
    };

    return NextResponse.json({
      title:      extracted.titleEN   ?? '',
      titleTH:    extracted.titleTH   ?? '',
      excerpt:    extracted.excerptEN ?? '',
      excerptTH:  extracted.excerptTH ?? '',
      content:    extracted.contentEN ?? '',
      contentTH:  extracted.contentTH ?? '',
      category:   extracted.category  ?? 'news',
      author:     extracted.author    ?? 'ADT, Mae Fah Luang University',
      authorTH:   extracted.authorTH  ?? 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ มฟล.',
      image:      savedImageUrl,
      publishDate: new Date().toISOString().split('T')[0],
      featured:   false,
      active:     true,
    });

  } catch (err) {
    console.error('[facebook-import]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
