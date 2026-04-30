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
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\\\//g, '/').replace(/\\u0025/g, '%');
}

const IMAGE_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Accept':          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer':         'https://www.facebook.com/',
} as const;

function looksLikeImage(ct: string, buf: Buffer): boolean {
  if (!ct.startsWith('image/')) return false;
  // JPEG=FFD8FF, PNG=89504E47, GIF=47494638, WEBP=52494646…57454250
  const b = buf;
  return (
    (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) ||
    (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) ||
    (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) ||
    (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[8] === 0x57)
  );
}

// Walk through Facebook's redirect/photo-page hops to land on a real image
async function resolveFacebookImage(initialUrl: string, depth = 0): Promise<{ buf: Buffer; mime: string } | null> {
  if (depth > 3) return null;
  let resp: Response;
  try {
    resp = await fetch(initialUrl, { headers: IMAGE_HEADERS, redirect: 'follow' });
  } catch (e) {
    console.error('[facebook-import] image fetch failed:', e);
    return null;
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  const ct = (resp.headers.get('content-type') || '').split(';')[0].toLowerCase();

  if (looksLikeImage(ct, buf)) return { buf, mime: ct };

  // Got HTML — likely an FB JS redirect page or a photo viewer page. Find the real URL.
  const html = buf.toString('utf8');
  // 1. JS location.href redirect
  let m = html.match(/location\.href\s*=\s*["']([^"']+)["']/i);
  // 2. Meta refresh
  if (!m) m = html.match(/<meta[^>]+http-equiv=["']?refresh["']?[^>]+url=([^"'>]+)/i);
  // 3. Direct og:image in this page
  if (!m) {
    m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  }
  // 4. scontent CDN URL anywhere in the document
  if (!m) m = html.match(/(https?:\\?\/\\?\/scontent[^"'\s\\]+\.(?:jpg|jpeg|png|webp))/i);
  if (!m) return null;
  return resolveFacebookImage(decodeEntities(m[1]), depth + 1);
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

    const ogImage  = extractMeta(html, 'og:image:secure_url') || extractMeta(html, 'og:image');
    const ogDesc   = extractMeta(html, 'og:description');
    const ogTitle  = extractMeta(html, 'og:title');

    // Build a list of candidate image URLs to try in order of preference.
    const candidates: string[] = [];
    if (ogImage) candidates.push(ogImage);
    // scontent.* CDN URLs scraped directly from the page HTML (often higher quality and bypass redirect pages)
    const scontentRe = /https?:\\?\/\\?\/scontent[^"'\s\\]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s\\]*)?/gi;
    for (const m of html.matchAll(scontentRe)) {
      const u = decodeEntities(m[0]);
      if (!candidates.includes(u)) candidates.push(u);
    }

    // ── 2. Download & save image ──────────────────────────────────────────────
    let savedImageUrl = 'https://placehold.co/800x500/0D1830/0CC8D4?text=News';
    let imageBase64   = '';
    let imageMime     = 'image/jpeg';

    for (const candidate of candidates) {
      const got = await resolveFacebookImage(candidate);
      if (!got) continue;
      imageMime   = got.mime;
      imageBase64 = got.buf.toString('base64');
      const ext      = imageMime === 'image/png' ? '.png' : imageMime === 'image/webp' ? '.webp' : '.jpg';
      const filename = `fb-${Date.now()}${ext}`;
      const dir      = path.join(process.cwd(), 'public', 'uploads', 'news');
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), got.buf);
      savedImageUrl = `/uploads/news/${filename}`;
      break;
    }
    if (savedImageUrl.includes('placehold.co')) {
      console.warn('[facebook-import] no usable image found among', candidates.length, 'candidates');
    }

    // ── 3. Gemini: extract text from image + bilingual translation ────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `You are an EXTRACTOR-AND-TRANSLATOR for a Thai Facebook post from Mae Fah Luang University's School of Applied Digital Technology (ADT). You are NOT a writer, marketer, or summariser. You only convey what is literally there.

Source from the post (likely Thai):
- FB page name (IGNORE — this is just the Facebook page name, NOT the post title): ${ogTitle || '(not available)'}
- Post description (likely the actual post body or image caption): ${ogDesc  || '(not available)'}
- Image:       OCR every visible Thai/English line from the image — body copy, dates, times, venues, names, captions, footers.

IMPORTANT: ogTitle is virtually always the Facebook page name (e.g. "ADTschool MFU", "School of Applied Digital Technology", "ADT MFU"). DO NOT use it as the news title. The real title must come from the post body or the image headline.

═══ HARD ANTI-HALLUCINATION RULES — read carefully ═══
You MUST NOT add anything that does not literally appear in the post text or the image. In particular, NEVER include any of these unless they are visibly present:
  ✗ Sign-off taglines (e.g. "ADT MFU: Creating Digital Innovations for Society", "นวัตกรรมดิจิทัลเพื่อสังคม")
  ✗ Generic call-to-action phrases ("Scan the QR Code", "สแกน QR Code", "ลงทะเบียนที่นี่", "Register here", "For more information…", "สำหรับข้อมูลเพิ่มเติม…")
  ✗ Phone numbers, names like "Khun Somsri" / "คุณสมศรี", emails, URLs that aren't visibly in the source
  ✗ Boilerplate institution descriptions
  ✗ Sentences inferred from the topic (e.g. inventing the purpose of an event, prescribing benefits, listing tracks/agendas not stated)
If you are unsure whether a sentence is in the source — OMIT IT. A shorter, faithful output is correct; a padded one is wrong.

═══ Two-step workflow ═══
STEP 1 — Assemble Thai content (verbatim)
Collect every piece of Thai text from the post + image. Preserve exact wording, titles (ผศ.ดร., รศ.ดร., อาจารย์, นักศึกษา …), proper nouns, and dates as they appear. Do not summarise, paraphrase, or fill gaps.

STEP 2 — Translate Thai → English (faithful)
Render STEP 1 in natural professional English. Translate everything that is there; add nothing that isn't. Keep "Mae Fah Luang University" / "School of Applied Digital Technology (ADT)".

Return ONLY this JSON object (no markdown fences, no preamble):
{
  "titleTH":   "Concise Thai news title (≤80 chars) — derive it from the headline of the post body or image. NEVER use the FB page name. If the post starts with a clear headline, use that; otherwise compose a short factual title summarising the event/announcement (e.g. 'สำนักวิชา ADT จัดอบรม Generative AI สำหรับครู เชียงราย').",
  "titleEN":   "Faithful English translation of titleTH (≤80 chars). NEVER 'ADTschool MFU' or similar page-name strings.",
  "contentTH": "Full Thai content (post text + all image text, exactly as written)",
  "contentEN": "Faithful English translation of contentTH",
  "category":  "one of: news | event | research | achievement | announcement",
  "author":    "Author / organising unit ONLY if literally stated; otherwise 'ADT, Mae Fah Luang University'",
  "authorTH":  "ผู้เขียน/หน่วยงาน เฉพาะที่ปรากฏในโพสต์ มิเช่นนั้นใช้ 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ มฟล.'"
}

Final reminder: if a tagline, contact info, or call-to-action is NOT visibly in the source, leave it out. An empty field is better than an invented one.`;

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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.15, topP: 0.8 },
          }),
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
      contentEN?: string; contentTH?: string;
      category?: string; author?: string; authorTH?: string;
    };

    return NextResponse.json({
      title:      extracted.titleEN   ?? '',
      titleTH:    extracted.titleTH   ?? '',
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
