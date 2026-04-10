import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import type { StaffMember, Highlight, NewsItem } from './types';
import { initialData } from './initial-data';
import type { ProgramData } from './programs-data';
import { programs as programsSeed } from './programs-data';

// ── Pool singleton ────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __pgReady: Promise<void> | undefined;
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
    global.__pgReady = initDb(global.__pgPool);
  }
  return global.__pgPool;
}

export async function ensureReady(): Promise<Pool> {
  const pool = getPool();
  await global.__pgReady;
  return pool;
}

// ── Schema + Seed ─────────────────────────────────────────────────────────────

async function initDb(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    // DDL — all idempotent
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_th TEXT NOT NULL,
        title TEXT NOT NULL,
        title_th TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT NOT NULL,
        department_th TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        photo TEXT NOT NULL,
        bio TEXT NOT NULL,
        bio_th TEXT NOT NULL,
        expertise TEXT NOT NULL DEFAULT '[]',
        expertise_th TEXT NOT NULL DEFAULT '[]',
        orcid_id TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT TRUE
      );
      CREATE TABLE IF NOT EXISTS highlights (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_th TEXT NOT NULL,
        description TEXT NOT NULL,
        description_th TEXT NOT NULL,
        image TEXT NOT NULL,
        type TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        cta_text TEXT,
        cta_text_th TEXT,
        cta_url TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_th TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        excerpt_th TEXT NOT NULL,
        content TEXT NOT NULL,
        content_th TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        publish_date TEXT NOT NULL,
        author TEXT NOT NULL,
        author_th TEXT NOT NULL,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        active BOOLEAN NOT NULL DEFAULT TRUE
      );
      CREATE TABLE IF NOT EXISTS program_images (
        program_id TEXT PRIMARY KEY,
        url TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS program_gallery (
        id TEXT PRIMARY KEY,
        program_id TEXT NOT NULL,
        url TEXT NOT NULL,
        caption TEXT NOT NULL DEFAULT '',
        caption_th TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL DEFAULT 'undergrad',
        degree TEXT NOT NULL DEFAULT '',
        degree_full_en TEXT NOT NULL DEFAULT '',
        degree_full_th TEXT NOT NULL DEFAULT '',
        years INTEGER NOT NULL DEFAULT 4,
        credits INTEGER NOT NULL DEFAULT 120,
        name TEXT NOT NULL DEFAULT '',
        name_th TEXT NOT NULL DEFAULT '',
        color TEXT NOT NULL DEFAULT '#0CC8D4',
        description TEXT NOT NULL DEFAULT '',
        description_th TEXT NOT NULL DEFAULT '',
        careers TEXT NOT NULL DEFAULT '[]',
        curriculum_structure TEXT NOT NULL DEFAULT '[]',
        features TEXT NOT NULL DEFAULT '[]',
        fees TEXT NOT NULL DEFAULT '',
        fees_per_semester TEXT NOT NULL DEFAULT '',
        official_url TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Seed once
    const { rows: seeded } = await client.query("SELECT value FROM app_meta WHERE key = 'seeded'");
    if (seeded.length === 0) {
      await client.query('BEGIN');
      try {
        await seedData(client);
        await client.query("INSERT INTO app_meta (key, value) VALUES ('seeded', 'true') ON CONFLICT DO NOTHING");
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    // Seed programs if table is empty (handles DBs created before programs table was added)
    const { rows: pc } = await client.query('SELECT COUNT(*) as c FROM programs');
    if (parseInt(pc[0].c) === 0) {
      await client.query('BEGIN');
      try {
        await seedPrograms(client);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

async function seedData(client: PoolClient): Promise<void> {
  for (const s of initialData.staff) {
    await client.query(
      `INSERT INTO staff (id,name,name_th,title,title_th,role,department,department_th,
         email,phone,photo,bio,bio_th,expertise,expertise_th,orcid_id,sort_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT DO NOTHING`,
      [s.id, s.name, s.nameTH, s.title, s.titleTH, s.role, s.department, s.departmentTH,
       s.email, s.phone ?? null, s.photo, s.bio, s.bioTH,
       JSON.stringify(s.expertise), JSON.stringify(s.expertiseTH),
       s.orcidId ?? null, s.order, s.active]
    );
  }
  for (const h of initialData.highlights) {
    await client.query(
      `INSERT INTO highlights (id,title,title_th,description,description_th,image,type,
         start_date,end_date,cta_text,cta_text_th,cta_url,active,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT DO NOTHING`,
      [h.id, h.title, h.titleTH, h.description, h.descriptionTH, h.image, h.type,
       h.startDate, h.endDate ?? null, h.ctaText ?? null, h.ctaTextTH ?? null, h.ctaUrl ?? null,
       h.active, h.order]
    );
  }
  for (const n of initialData.news) {
    await client.query(
      `INSERT INTO news (id,title,title_th,excerpt,excerpt_th,content,content_th,image,
         category,publish_date,author,author_th,featured,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT DO NOTHING`,
      [n.id, n.title, n.titleTH, n.excerpt, n.excerptTH, n.content, n.contentTH, n.image,
       n.category, n.publishDate, n.author, n.authorTH, n.featured, n.active]
    );
  }
  for (const [programId, url] of Object.entries(initialData.programImages)) {
    await client.query(
      'INSERT INTO program_images (program_id, url) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [programId, url]
    );
  }
  await seedPrograms(client);
}

async function seedPrograms(client: PoolClient): Promise<void> {
  for (const p of programsSeed) {
    await client.query(
      `INSERT INTO programs (id,level,degree,degree_full_en,degree_full_th,years,credits,
         name,name_th,color,description,description_th,careers,curriculum_structure,features,
         fees,fees_per_semester,official_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT DO NOTHING`,
      [p.id, p.level, p.degree, p.degreeFullEN, p.degreeFullTH, p.years, p.credits,
       p.name, p.nameTH, p.color, p.description, p.descriptionTH,
       JSON.stringify(p.careers), JSON.stringify(p.curriculumStructure), JSON.stringify(p.features),
       p.fees, p.feesPerSemester, p.officialUrl]
    );
  }
}

// ── Row converters ────────────────────────────────────────────────────────────

export function rowToStaff(row: Record<string, unknown>): StaffMember {
  return {
    id: row.id as string,
    name: row.name as string,
    nameTH: row.name_th as string,
    title: row.title as string,
    titleTH: row.title_th as string,
    role: row.role as StaffMember['role'],
    department: row.department as string,
    departmentTH: row.department_th as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? undefined,
    photo: row.photo as string,
    bio: row.bio as string,
    bioTH: row.bio_th as string,
    expertise: JSON.parse((row.expertise as string) || '[]'),
    expertiseTH: JSON.parse((row.expertise_th as string) || '[]'),
    orcidId: (row.orcid_id as string | null) ?? undefined,
    order: row.sort_order as number,
    active: row.active as boolean,
  };
}

export function rowToHighlight(row: Record<string, unknown>): Highlight {
  return {
    id: row.id as string,
    title: row.title as string,
    titleTH: row.title_th as string,
    description: row.description as string,
    descriptionTH: row.description_th as string,
    image: row.image as string,
    type: row.type as Highlight['type'],
    startDate: row.start_date as string,
    endDate: (row.end_date as string | null) ?? undefined,
    ctaText: (row.cta_text as string | null) ?? undefined,
    ctaTextTH: (row.cta_text_th as string | null) ?? undefined,
    ctaUrl: (row.cta_url as string | null) ?? undefined,
    active: row.active as boolean,
    order: row.sort_order as number,
  };
}

export function rowToNews(row: Record<string, unknown>): NewsItem {
  return {
    id: row.id as string,
    title: row.title as string,
    titleTH: row.title_th as string,
    excerpt: row.excerpt as string,
    excerptTH: row.excerpt_th as string,
    content: row.content as string,
    contentTH: row.content_th as string,
    image: row.image as string,
    category: row.category as NewsItem['category'],
    publishDate: row.publish_date as string,
    author: row.author as string,
    authorTH: row.author_th as string,
    featured: row.featured as boolean,
    active: row.active as boolean,
  };
}

// ── Staff CRUD ────────────────────────────────────────────────────────────────

export async function getAllStaff(): Promise<StaffMember[]> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM staff ORDER BY sort_order ASC, name ASC');
  return rows.map(rowToStaff);
}

export async function createStaff(s: Omit<StaffMember, 'id'>): Promise<StaffMember> {
  const pool = await ensureReady();
  const id = uuidv4();
  await pool.query(
    `INSERT INTO staff (id,name,name_th,title,title_th,role,department,department_th,
       email,phone,photo,bio,bio_th,expertise,expertise_th,orcid_id,sort_order,active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [id, s.name, s.nameTH, s.title, s.titleTH, s.role, s.department, s.departmentTH,
     s.email, s.phone ?? null, s.photo, s.bio, s.bioTH,
     JSON.stringify(s.expertise), JSON.stringify(s.expertiseTH),
     s.orcidId ?? null, s.order, s.active]
  );
  const { rows } = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
  return rowToStaff(rows[0]);
}

export async function updateStaff(id: string, s: Partial<StaffMember>): Promise<StaffMember | null> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
  if (!rows.length) return null;
  const r = rows[0];
  await pool.query(
    `UPDATE staff SET name=$1,name_th=$2,title=$3,title_th=$4,role=$5,department=$6,
       department_th=$7,email=$8,phone=$9,photo=$10,bio=$11,bio_th=$12,
       expertise=$13,expertise_th=$14,orcid_id=$15,sort_order=$16,active=$17
     WHERE id=$18`,
    [
      s.name          ?? r.name,
      s.nameTH        ?? r.name_th,
      s.title         ?? r.title,
      s.titleTH       ?? r.title_th,
      s.role          ?? r.role,
      s.department    ?? r.department,
      s.departmentTH  ?? r.department_th,
      s.email         ?? r.email,
      s.phone         !== undefined ? (s.phone ?? null) : r.phone,
      s.photo         ?? r.photo,
      s.bio           ?? r.bio,
      s.bioTH         ?? r.bio_th,
      s.expertise     !== undefined ? JSON.stringify(s.expertise)   : r.expertise,
      s.expertiseTH   !== undefined ? JSON.stringify(s.expertiseTH) : r.expertise_th,
      s.orcidId       !== undefined ? (s.orcidId ?? null) : r.orcid_id,
      s.order         ?? r.sort_order,
      s.active        !== undefined ? s.active : r.active,
      id,
    ]
  );
  const { rows: updated } = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
  return rowToStaff(updated[0]);
}

export async function deleteStaff(id: string): Promise<void> {
  const pool = await ensureReady();
  await pool.query('DELETE FROM staff WHERE id = $1', [id]);
}

// ── Highlights CRUD ───────────────────────────────────────────────────────────

export async function getAllHighlights(): Promise<Highlight[]> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM highlights ORDER BY sort_order ASC');
  return rows.map(rowToHighlight);
}

export async function createHighlight(h: Omit<Highlight, 'id'>): Promise<Highlight> {
  const pool = await ensureReady();
  const id = uuidv4();
  await pool.query(
    `INSERT INTO highlights (id,title,title_th,description,description_th,image,type,
       start_date,end_date,cta_text,cta_text_th,cta_url,active,sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [id, h.title, h.titleTH, h.description, h.descriptionTH, h.image, h.type,
     h.startDate, h.endDate ?? null, h.ctaText ?? null, h.ctaTextTH ?? null, h.ctaUrl ?? null,
     h.active, h.order]
  );
  const { rows } = await pool.query('SELECT * FROM highlights WHERE id = $1', [id]);
  return rowToHighlight(rows[0]);
}

export async function updateHighlight(id: string, h: Partial<Highlight>): Promise<Highlight | null> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM highlights WHERE id = $1', [id]);
  if (!rows.length) return null;
  const r = rows[0];
  await pool.query(
    `UPDATE highlights SET title=$1,title_th=$2,description=$3,description_th=$4,
       image=$5,type=$6,start_date=$7,end_date=$8,cta_text=$9,cta_text_th=$10,
       cta_url=$11,active=$12,sort_order=$13
     WHERE id=$14`,
    [
      h.title         ?? r.title,
      h.titleTH       ?? r.title_th,
      h.description   ?? r.description,
      h.descriptionTH ?? r.description_th,
      h.image         ?? r.image,
      h.type          ?? r.type,
      h.startDate     ?? r.start_date,
      h.endDate       !== undefined ? (h.endDate ?? null)   : r.end_date,
      h.ctaText       !== undefined ? (h.ctaText ?? null)   : r.cta_text,
      h.ctaTextTH     !== undefined ? (h.ctaTextTH ?? null) : r.cta_text_th,
      h.ctaUrl        !== undefined ? (h.ctaUrl ?? null)    : r.cta_url,
      h.active        !== undefined ? h.active  : r.active,
      h.order         ?? r.sort_order,
      id,
    ]
  );
  const { rows: updated } = await pool.query('SELECT * FROM highlights WHERE id = $1', [id]);
  return rowToHighlight(updated[0]);
}

export async function deleteHighlight(id: string): Promise<void> {
  const pool = await ensureReady();
  await pool.query('DELETE FROM highlights WHERE id = $1', [id]);
}

// ── News CRUD ─────────────────────────────────────────────────────────────────

export async function getAllNews(): Promise<NewsItem[]> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM news ORDER BY publish_date DESC');
  return rows.map(rowToNews);
}

export async function createNews(n: Omit<NewsItem, 'id'>): Promise<NewsItem> {
  const pool = await ensureReady();
  const id = uuidv4();
  await pool.query(
    `INSERT INTO news (id,title,title_th,excerpt,excerpt_th,content,content_th,image,
       category,publish_date,author,author_th,featured,active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [id, n.title, n.titleTH, n.excerpt, n.excerptTH, n.content, n.contentTH, n.image,
     n.category, n.publishDate, n.author, n.authorTH, n.featured, n.active]
  );
  const { rows } = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
  return rowToNews(rows[0]);
}

export async function updateNews(id: string, n: Partial<NewsItem>): Promise<NewsItem | null> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
  if (!rows.length) return null;
  const r = rows[0];
  await pool.query(
    `UPDATE news SET title=$1,title_th=$2,excerpt=$3,excerpt_th=$4,content=$5,content_th=$6,
       image=$7,category=$8,publish_date=$9,author=$10,author_th=$11,featured=$12,active=$13
     WHERE id=$14`,
    [
      n.title       ?? r.title,
      n.titleTH     ?? r.title_th,
      n.excerpt     ?? r.excerpt,
      n.excerptTH   ?? r.excerpt_th,
      n.content     ?? r.content,
      n.contentTH   ?? r.content_th,
      n.image       ?? r.image,
      n.category    ?? r.category,
      n.publishDate ?? r.publish_date,
      n.author      ?? r.author,
      n.authorTH    ?? r.author_th,
      n.featured    !== undefined ? n.featured : r.featured,
      n.active      !== undefined ? n.active   : r.active,
      id,
    ]
  );
  const { rows: updated } = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
  return rowToNews(updated[0]);
}

export async function deleteNews(id: string): Promise<void> {
  const pool = await ensureReady();
  await pool.query('DELETE FROM news WHERE id = $1', [id]);
}

// ── Program Images ────────────────────────────────────────────────────────────

export async function getProgramImages(): Promise<Record<string, string>> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT program_id, url FROM program_images');
  const result: Record<string, string> = {};
  for (const row of rows) result[row.program_id] = row.url;
  return result;
}

export async function setProgramImage(programId: string, url: string): Promise<void> {
  const pool = await ensureReady();
  await pool.query(
    'INSERT INTO program_images (program_id, url) VALUES ($1, $2) ON CONFLICT (program_id) DO UPDATE SET url = EXCLUDED.url',
    [programId, url]
  );
}

// ── Program Gallery ───────────────────────────────────────────────────────────

export interface ProgramGalleryImage {
  id: string;
  programId: string;
  url: string;
  caption: string;
  captionTH: string;
  order: number;
}

export async function getGallery(programId: string): Promise<ProgramGalleryImage[]> {
  const pool = await ensureReady();
  const { rows } = await pool.query(
    'SELECT * FROM program_gallery WHERE program_id = $1 ORDER BY sort_order ASC',
    [programId]
  );
  return rows.map(r => ({
    id: r.id, programId: r.program_id, url: r.url,
    caption: r.caption, captionTH: r.caption_th, order: r.sort_order,
  }));
}

export async function addGalleryImage(programId: string, url: string, caption = '', captionTH = ''): Promise<ProgramGalleryImage> {
  const pool = await ensureReady();
  const id = uuidv4();
  const { rows } = await pool.query(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM program_gallery WHERE program_id = $1',
    [programId]
  );
  const order = rows[0].next_order;
  await pool.query(
    'INSERT INTO program_gallery (id, program_id, url, caption, caption_th, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
    [id, programId, url, caption, captionTH, order]
  );
  return { id, programId, url, caption, captionTH, order };
}

export async function deleteGalleryImage(id: string): Promise<string | null> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT url FROM program_gallery WHERE id = $1', [id]);
  if (!rows.length) return null;
  const url = rows[0].url as string;
  await pool.query('DELETE FROM program_gallery WHERE id = $1', [id]);
  return url;
}

// ── Programs CRUD ─────────────────────────────────────────────────────────────

function rowToProgram(row: Record<string, unknown>): ProgramData {
  return {
    id: row.id as string, level: row.level as ProgramData['level'], degree: row.degree as string,
    degreeFullEN: row.degree_full_en as string, degreeFullTH: row.degree_full_th as string,
    years: row.years as number, credits: row.credits as number,
    name: row.name as string, nameTH: row.name_th as string,
    color: row.color as string, description: row.description as string,
    descriptionTH: row.description_th as string,
    careers: JSON.parse((row.careers as string) ?? '[]'),
    curriculumStructure: JSON.parse((row.curriculum_structure as string) ?? '[]'),
    features: JSON.parse((row.features as string) ?? '[]'),
    fees: row.fees as string, feesPerSemester: row.fees_per_semester as string,
    officialUrl: row.official_url as string,
  };
}

export async function getAllPrograms(): Promise<ProgramData[]> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM programs');
  return rows.map(rowToProgram);
}

export async function getProgramById(id: string): Promise<ProgramData | null> {
  const pool = await ensureReady();
  const { rows } = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
  return rows.length ? rowToProgram(rows[0]) : null;
}

export async function updateProgram(id: string, updates: Partial<ProgramData>): Promise<ProgramData | null> {
  const pool = await ensureReady();
  const map: Record<string, string> = {
    description: 'description', descriptionTH: 'description_th',
    careers: 'careers', curriculumStructure: 'curriculum_structure',
    features: 'features', fees: 'fees', feesPerSemester: 'fees_per_semester',
    officialUrl: 'official_url', degreeFullEN: 'degree_full_en', degreeFullTH: 'degree_full_th',
    name: 'name', nameTH: 'name_th', credits: 'credits', years: 'years', color: 'color',
  };
  const setClauses: string[] = [];
  const values: unknown[] = [];
  for (const [key, col] of Object.entries(map)) {
    if (key in updates) {
      const val = (updates as Record<string, unknown>)[key];
      values.push(typeof val === 'object' ? JSON.stringify(val) : val);
      setClauses.push(`${col} = $${values.length}`);
    }
  }
  if (!setClauses.length) return getProgramById(id);
  values.push(id);
  await pool.query(`UPDATE programs SET ${setClauses.join(', ')} WHERE id = $${values.length}`, values);
  return getProgramById(id);
}

// ── Reset ─────────────────────────────────────────────────────────────────────

export async function resetToDefaults(): Promise<void> {
  const pool = await ensureReady();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM staff');
    await client.query('DELETE FROM highlights');
    await client.query('DELETE FROM news');
    await client.query('DELETE FROM program_images');
    await client.query('DELETE FROM programs');
    await client.query("DELETE FROM app_meta WHERE key = 'seeded'");
    await seedData(client);
    await client.query("INSERT INTO app_meta (key, value) VALUES ('seeded', 'true') ON CONFLICT DO NOTHING");
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
