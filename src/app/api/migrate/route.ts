export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToStaff, rowToHighlight, rowToNews } from '@/lib/db';
import type { StaffMember, Highlight, NewsItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      staff?: StaffMember[];
      highlights?: Highlight[];
      news?: NewsItem[];
      programImages?: Record<string, string>;
    };

    const db = getDb();

    const upsertStmt = db.prepare(`
      INSERT INTO staff (id, name, name_th, title, title_th, role, department, department_th,
        email, phone, photo, bio, bio_th, expertise, expertise_th, orcid_id, sort_order, active)
      VALUES (@id, @name, @name_th, @title, @title_th, @role, @department, @department_th,
        @email, @phone, @photo, @bio, @bio_th, @expertise, @expertise_th, @orcid_id, @sort_order, @active)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name, name_th=excluded.name_th, title=excluded.title,
        title_th=excluded.title_th, role=excluded.role, department=excluded.department,
        department_th=excluded.department_th, email=excluded.email, phone=excluded.phone,
        photo=excluded.photo, bio=excluded.bio, bio_th=excluded.bio_th,
        expertise=excluded.expertise, expertise_th=excluded.expertise_th,
        orcid_id=excluded.orcid_id, sort_order=excluded.sort_order, active=excluded.active
    `);

    const upsertHighlight = db.prepare(`
      INSERT INTO highlights (id, title, title_th, description, description_th, image, type,
        start_date, end_date, cta_text, cta_text_th, cta_url, active, sort_order)
      VALUES (@id, @title, @title_th, @description, @description_th, @image, @type,
        @start_date, @end_date, @cta_text, @cta_text_th, @cta_url, @active, @sort_order)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title, title_th=excluded.title_th, description=excluded.description,
        description_th=excluded.description_th, image=excluded.image, type=excluded.type,
        start_date=excluded.start_date, end_date=excluded.end_date, cta_text=excluded.cta_text,
        cta_text_th=excluded.cta_text_th, cta_url=excluded.cta_url, active=excluded.active,
        sort_order=excluded.sort_order
    `);

    const upsertNews = db.prepare(`
      INSERT INTO news (id, title, title_th, excerpt, excerpt_th, content, content_th, image,
        category, publish_date, author, author_th, featured, active)
      VALUES (@id, @title, @title_th, @excerpt, @excerpt_th, @content, @content_th, @image,
        @category, @publish_date, @author, @author_th, @featured, @active)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title, title_th=excluded.title_th, excerpt=excluded.excerpt,
        excerpt_th=excluded.excerpt_th, content=excluded.content, content_th=excluded.content_th,
        image=excluded.image, category=excluded.category, publish_date=excluded.publish_date,
        author=excluded.author, author_th=excluded.author_th, featured=excluded.featured,
        active=excluded.active
    `);

    const upsertImage = db.prepare(`
      INSERT INTO program_images (program_id, url) VALUES (@program_id, @url)
      ON CONFLICT(program_id) DO UPDATE SET url=excluded.url
    `);

    const counts = { staff: 0, highlights: 0, news: 0, programImages: 0 };

    const migrate = db.transaction(() => {
      for (const s of body.staff ?? []) {
        upsertStmt.run({
          id: s.id,
          name: s.name, name_th: s.nameTH,
          title: s.title, title_th: s.titleTH,
          role: s.role,
          department: s.department, department_th: s.departmentTH,
          email: s.email, phone: s.phone ?? null,
          photo: s.photo,
          bio: s.bio, bio_th: s.bioTH,
          expertise: JSON.stringify(s.expertise ?? []),
          expertise_th: JSON.stringify(s.expertiseTH ?? []),
          orcid_id: s.orcidId ?? null,
          sort_order: s.order ?? 0,
          active: s.active ? 1 : 0,
        });
        counts.staff++;
      }

      for (const h of body.highlights ?? []) {
        upsertHighlight.run({
          id: h.id,
          title: h.title, title_th: h.titleTH,
          description: h.description, description_th: h.descriptionTH,
          image: h.image, type: h.type,
          start_date: h.startDate, end_date: h.endDate ?? null,
          cta_text: h.ctaText ?? null, cta_text_th: h.ctaTextTH ?? null,
          cta_url: h.ctaUrl ?? null,
          active: h.active ? 1 : 0,
          sort_order: h.order ?? 0,
        });
        counts.highlights++;
      }

      for (const n of body.news ?? []) {
        upsertNews.run({
          id: n.id,
          title: n.title, title_th: n.titleTH,
          excerpt: n.excerpt, excerpt_th: n.excerptTH,
          content: n.content, content_th: n.contentTH,
          image: n.image, category: n.category,
          publish_date: n.publishDate,
          author: n.author, author_th: n.authorTH,
          featured: n.featured ? 1 : 0,
          active: n.active ? 1 : 0,
        });
        counts.news++;
      }

      for (const [programId, url] of Object.entries(body.programImages ?? {})) {
        upsertImage.run({ program_id: programId, url });
        counts.programImages++;
      }
    });

    migrate();

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    console.error('[migrate]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
