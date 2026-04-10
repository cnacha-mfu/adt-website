export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { ensureReady } from '@/lib/db';
import type { StaffMember, Highlight, NewsItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      staff?: StaffMember[];
      highlights?: Highlight[];
      news?: NewsItem[];
      programImages?: Record<string, string>;
    };

    const pool = await ensureReady();
    const client = await pool.connect();
    const counts = { staff: 0, highlights: 0, news: 0, programImages: 0 };

    try {
      await client.query('BEGIN');

      for (const s of body.staff ?? []) {
        await client.query(
          `INSERT INTO staff (id,name,name_th,title,title_th,role,department,department_th,
             email,phone,photo,bio,bio_th,expertise,expertise_th,orcid_id,sort_order,active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
           ON CONFLICT(id) DO UPDATE SET
             name=EXCLUDED.name, name_th=EXCLUDED.name_th, title=EXCLUDED.title,
             title_th=EXCLUDED.title_th, role=EXCLUDED.role, department=EXCLUDED.department,
             department_th=EXCLUDED.department_th, email=EXCLUDED.email, phone=EXCLUDED.phone,
             photo=EXCLUDED.photo, bio=EXCLUDED.bio, bio_th=EXCLUDED.bio_th,
             expertise=EXCLUDED.expertise, expertise_th=EXCLUDED.expertise_th,
             orcid_id=EXCLUDED.orcid_id, sort_order=EXCLUDED.sort_order, active=EXCLUDED.active`,
          [s.id, s.name, s.nameTH, s.title, s.titleTH, s.role, s.department, s.departmentTH,
           s.email, s.phone ?? null, s.photo, s.bio, s.bioTH,
           JSON.stringify(s.expertise ?? []), JSON.stringify(s.expertiseTH ?? []),
           s.orcidId ?? null, s.order ?? 0, s.active]
        );
        counts.staff++;
      }

      for (const h of body.highlights ?? []) {
        await client.query(
          `INSERT INTO highlights (id,title,title_th,description,description_th,image,type,
             start_date,end_date,cta_text,cta_text_th,cta_url,active,sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT(id) DO UPDATE SET
             title=EXCLUDED.title, title_th=EXCLUDED.title_th, description=EXCLUDED.description,
             description_th=EXCLUDED.description_th, image=EXCLUDED.image, type=EXCLUDED.type,
             start_date=EXCLUDED.start_date, end_date=EXCLUDED.end_date,
             cta_text=EXCLUDED.cta_text, cta_text_th=EXCLUDED.cta_text_th,
             cta_url=EXCLUDED.cta_url, active=EXCLUDED.active, sort_order=EXCLUDED.sort_order`,
          [h.id, h.title, h.titleTH, h.description, h.descriptionTH, h.image, h.type,
           h.startDate, h.endDate ?? null, h.ctaText ?? null, h.ctaTextTH ?? null, h.ctaUrl ?? null,
           h.active, h.order ?? 0]
        );
        counts.highlights++;
      }

      for (const n of body.news ?? []) {
        await client.query(
          `INSERT INTO news (id,title,title_th,excerpt,excerpt_th,content,content_th,image,
             category,publish_date,author,author_th,featured,active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT(id) DO UPDATE SET
             title=EXCLUDED.title, title_th=EXCLUDED.title_th, excerpt=EXCLUDED.excerpt,
             excerpt_th=EXCLUDED.excerpt_th, content=EXCLUDED.content, content_th=EXCLUDED.content_th,
             image=EXCLUDED.image, category=EXCLUDED.category, publish_date=EXCLUDED.publish_date,
             author=EXCLUDED.author, author_th=EXCLUDED.author_th,
             featured=EXCLUDED.featured, active=EXCLUDED.active`,
          [n.id, n.title, n.titleTH, n.excerpt, n.excerptTH, n.content, n.contentTH, n.image,
           n.category, n.publishDate, n.author, n.authorTH, n.featured, n.active]
        );
        counts.news++;
      }

      for (const [programId, url] of Object.entries(body.programImages ?? {})) {
        await client.query(
          'INSERT INTO program_images (program_id, url) VALUES ($1, $2) ON CONFLICT (program_id) DO UPDATE SET url = EXCLUDED.url',
          [programId, url]
        );
        counts.programImages++;
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    console.error('[migrate]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
