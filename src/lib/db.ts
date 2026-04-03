import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import type { StaffMember, Highlight, NewsItem } from './types';
import { initialData } from './initial-data';
import type { ProgramData } from './programs-data';
import { programs as programsSeed } from './programs-data';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'adt.db');

// ── Schema ──────────────────────────────────────────────────────────────────

function initSchema(db: Database.Database) {
  db.exec(`
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
      active INTEGER NOT NULL DEFAULT 1
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
      active INTEGER NOT NULL DEFAULT 1,
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
      featured INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
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

  // Seed if not already done
  const seeded = db.prepare('SELECT value FROM app_meta WHERE key = ?').get('seeded') as { value: string } | undefined;
  if (!seeded) {
    seedData(db);
    db.prepare('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)').run('seeded', 'true');
  }

  // Seed programs table if it is empty (handles existing DBs created before programs table was added)
  const programCount = (db.prepare('SELECT COUNT(*) as c FROM programs').get() as { c: number }).c;
  if (programCount === 0) {
    const insertProgram = db.prepare(`
      INSERT OR IGNORE INTO programs (id, level, degree, degree_full_en, degree_full_th, years, credits,
        name, name_th, color, description, description_th, careers, curriculum_structure, features,
        fees, fees_per_semester, official_url)
      VALUES (@id, @level, @degree, @degree_full_en, @degree_full_th, @years, @credits,
        @name, @name_th, @color, @description, @description_th, @careers, @curriculum_structure,
        @features, @fees, @fees_per_semester, @official_url)
    `);
    const seedPrograms = db.transaction(() => {
      for (const p of programsSeed) {
        insertProgram.run({
          id: p.id, level: p.level, degree: p.degree,
          degree_full_en: p.degreeFullEN, degree_full_th: p.degreeFullTH,
          years: p.years, credits: p.credits,
          name: p.name, name_th: p.nameTH,
          color: p.color, description: p.description, description_th: p.descriptionTH,
          careers: JSON.stringify(p.careers),
          curriculum_structure: JSON.stringify(p.curriculumStructure),
          features: JSON.stringify(p.features),
          fees: p.fees, fees_per_semester: p.feesPerSemester,
          official_url: p.officialUrl,
        });
      }
    });
    seedPrograms();
  }
}

function seedData(db: Database.Database) {
  const insertStaff = db.prepare(`
    INSERT OR IGNORE INTO staff
      (id, name, name_th, title, title_th, role, department, department_th,
       email, phone, photo, bio, bio_th, expertise, expertise_th, orcid_id,
       sort_order, active)
    VALUES
      (@id, @name, @name_th, @title, @title_th, @role, @department, @department_th,
       @email, @phone, @photo, @bio, @bio_th, @expertise, @expertise_th, @orcid_id,
       @sort_order, @active)
  `);

  const insertHighlight = db.prepare(`
    INSERT OR IGNORE INTO highlights
      (id, title, title_th, description, description_th, image, type,
       start_date, end_date, cta_text, cta_text_th, cta_url, active, sort_order)
    VALUES
      (@id, @title, @title_th, @description, @description_th, @image, @type,
       @start_date, @end_date, @cta_text, @cta_text_th, @cta_url, @active, @sort_order)
  `);

  const insertNews = db.prepare(`
    INSERT OR IGNORE INTO news
      (id, title, title_th, excerpt, excerpt_th, content, content_th, image,
       category, publish_date, author, author_th, featured, active)
    VALUES
      (@id, @title, @title_th, @excerpt, @excerpt_th, @content, @content_th, @image,
       @category, @publish_date, @author, @author_th, @featured, @active)
  `);

  const seedAll = db.transaction(() => {
    for (const s of initialData.staff) {
      insertStaff.run({
        id: s.id,
        name: s.name,
        name_th: s.nameTH,
        title: s.title,
        title_th: s.titleTH,
        role: s.role,
        department: s.department,
        department_th: s.departmentTH,
        email: s.email,
        phone: s.phone ?? null,
        photo: s.photo,
        bio: s.bio,
        bio_th: s.bioTH,
        expertise: JSON.stringify(s.expertise),
        expertise_th: JSON.stringify(s.expertiseTH),
        orcid_id: s.orcidId ?? null,
        sort_order: s.order,
        active: s.active ? 1 : 0,
      });
    }

    for (const h of initialData.highlights) {
      insertHighlight.run({
        id: h.id,
        title: h.title,
        title_th: h.titleTH,
        description: h.description,
        description_th: h.descriptionTH,
        image: h.image,
        type: h.type,
        start_date: h.startDate,
        end_date: h.endDate ?? null,
        cta_text: h.ctaText ?? null,
        cta_text_th: h.ctaTextTH ?? null,
        cta_url: h.ctaUrl ?? null,
        active: h.active ? 1 : 0,
        sort_order: h.order,
      });
    }

    for (const n of initialData.news) {
      insertNews.run({
        id: n.id,
        title: n.title,
        title_th: n.titleTH,
        excerpt: n.excerpt,
        excerpt_th: n.excerptTH,
        content: n.content,
        content_th: n.contentTH,
        image: n.image,
        category: n.category,
        publish_date: n.publishDate,
        author: n.author,
        author_th: n.authorTH,
        featured: n.featured ? 1 : 0,
        active: n.active ? 1 : 0,
      });
    }

    // Seed program images
    const insertImg = db.prepare('INSERT OR IGNORE INTO program_images (program_id, url) VALUES (?, ?)');
    for (const [programId, url] of Object.entries(initialData.programImages)) {
      insertImg.run(programId, url);
    }

    // Seed programs
    const insertProgram = db.prepare(`
      INSERT OR IGNORE INTO programs (id, level, degree, degree_full_en, degree_full_th, years, credits,
        name, name_th, color, description, description_th, careers, curriculum_structure, features,
        fees, fees_per_semester, official_url)
      VALUES (@id, @level, @degree, @degree_full_en, @degree_full_th, @years, @credits,
        @name, @name_th, @color, @description, @description_th, @careers, @curriculum_structure,
        @features, @fees, @fees_per_semester, @official_url)
    `);
    for (const p of programsSeed) {
      insertProgram.run({
        id: p.id, level: p.level, degree: p.degree,
        degree_full_en: p.degreeFullEN, degree_full_th: p.degreeFullTH,
        years: p.years, credits: p.credits,
        name: p.name, name_th: p.nameTH,
        color: p.color, description: p.description, description_th: p.descriptionTH,
        careers: JSON.stringify(p.careers),
        curriculum_structure: JSON.stringify(p.curriculumStructure),
        features: JSON.stringify(p.features),
        fees: p.fees, fees_per_semester: p.feesPerSemester,
        official_url: p.officialUrl,
      });
    }
  });

  seedAll();
}

// ── Singleton ────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!global.__db) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    global.__db = new Database(DB_PATH);
    global.__db.pragma('journal_mode = WAL');
    initSchema(global.__db);
  }
  return global.__db;
}

// ── Row ↔ TypeScript converters ──────────────────────────────────────────────

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
    active: (row.active as number) === 1,
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
    active: (row.active as number) === 1,
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
    featured: (row.featured as number) === 1,
    active: (row.active as number) === 1,
  };
}

// ── Staff CRUD ───────────────────────────────────────────────────────────────

export function getAllStaff(): StaffMember[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM staff ORDER BY sort_order ASC, name ASC').all();
  return (rows as Record<string, unknown>[]).map(rowToStaff);
}

export function createStaff(s: Omit<StaffMember, 'id'>): StaffMember {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO staff
      (id, name, name_th, title, title_th, role, department, department_th,
       email, phone, photo, bio, bio_th, expertise, expertise_th, orcid_id,
       sort_order, active)
    VALUES
      (@id, @name, @name_th, @title, @title_th, @role, @department, @department_th,
       @email, @phone, @photo, @bio, @bio_th, @expertise, @expertise_th, @orcid_id,
       @sort_order, @active)
  `).run({
    id,
    name: s.name,
    name_th: s.nameTH,
    title: s.title,
    title_th: s.titleTH,
    role: s.role,
    department: s.department,
    department_th: s.departmentTH,
    email: s.email,
    phone: s.phone ?? null,
    photo: s.photo,
    bio: s.bio,
    bio_th: s.bioTH,
    expertise: JSON.stringify(s.expertise),
    expertise_th: JSON.stringify(s.expertiseTH),
    orcid_id: s.orcidId ?? null,
    sort_order: s.order,
    active: s.active ? 1 : 0,
  });
  return rowToStaff(db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as Record<string, unknown>);
}

export function updateStaff(id: string, s: Partial<StaffMember>): StaffMember | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return null;

  const merged = { ...existing };
  if (s.name !== undefined) merged.name = s.name;
  if (s.nameTH !== undefined) merged.name_th = s.nameTH;
  if (s.title !== undefined) merged.title = s.title;
  if (s.titleTH !== undefined) merged.title_th = s.titleTH;
  if (s.role !== undefined) merged.role = s.role;
  if (s.department !== undefined) merged.department = s.department;
  if (s.departmentTH !== undefined) merged.department_th = s.departmentTH;
  if (s.email !== undefined) merged.email = s.email;
  if (s.phone !== undefined) merged.phone = s.phone ?? null;
  if (s.photo !== undefined) merged.photo = s.photo;
  if (s.bio !== undefined) merged.bio = s.bio;
  if (s.bioTH !== undefined) merged.bio_th = s.bioTH;
  if (s.expertise !== undefined) merged.expertise = JSON.stringify(s.expertise);
  if (s.expertiseTH !== undefined) merged.expertise_th = JSON.stringify(s.expertiseTH);
  if (s.orcidId !== undefined) merged.orcid_id = s.orcidId ?? null;
  if (s.order !== undefined) merged.sort_order = s.order;
  if (s.active !== undefined) merged.active = s.active ? 1 : 0;

  db.prepare(`
    UPDATE staff SET
      name = @name, name_th = @name_th, title = @title, title_th = @title_th,
      role = @role, department = @department, department_th = @department_th,
      email = @email, phone = @phone, photo = @photo, bio = @bio, bio_th = @bio_th,
      expertise = @expertise, expertise_th = @expertise_th, orcid_id = @orcid_id,
      sort_order = @sort_order, active = @active
    WHERE id = @id
  `).run({ ...merged, id });

  return rowToStaff(db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteStaff(id: string): void {
  getDb().prepare('DELETE FROM staff WHERE id = ?').run(id);
}

// ── Highlights CRUD ──────────────────────────────────────────────────────────

export function getAllHighlights(): Highlight[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM highlights ORDER BY sort_order ASC').all();
  return (rows as Record<string, unknown>[]).map(rowToHighlight);
}

export function createHighlight(h: Omit<Highlight, 'id'>): Highlight {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO highlights
      (id, title, title_th, description, description_th, image, type,
       start_date, end_date, cta_text, cta_text_th, cta_url, active, sort_order)
    VALUES
      (@id, @title, @title_th, @description, @description_th, @image, @type,
       @start_date, @end_date, @cta_text, @cta_text_th, @cta_url, @active, @sort_order)
  `).run({
    id,
    title: h.title,
    title_th: h.titleTH,
    description: h.description,
    description_th: h.descriptionTH,
    image: h.image,
    type: h.type,
    start_date: h.startDate,
    end_date: h.endDate ?? null,
    cta_text: h.ctaText ?? null,
    cta_text_th: h.ctaTextTH ?? null,
    cta_url: h.ctaUrl ?? null,
    active: h.active ? 1 : 0,
    sort_order: h.order,
  });
  return rowToHighlight(db.prepare('SELECT * FROM highlights WHERE id = ?').get(id) as Record<string, unknown>);
}

export function updateHighlight(id: string, h: Partial<Highlight>): Highlight | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM highlights WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return null;

  const merged = { ...existing };
  if (h.title !== undefined) merged.title = h.title;
  if (h.titleTH !== undefined) merged.title_th = h.titleTH;
  if (h.description !== undefined) merged.description = h.description;
  if (h.descriptionTH !== undefined) merged.description_th = h.descriptionTH;
  if (h.image !== undefined) merged.image = h.image;
  if (h.type !== undefined) merged.type = h.type;
  if (h.startDate !== undefined) merged.start_date = h.startDate;
  if (h.endDate !== undefined) merged.end_date = h.endDate ?? null;
  if (h.ctaText !== undefined) merged.cta_text = h.ctaText ?? null;
  if (h.ctaTextTH !== undefined) merged.cta_text_th = h.ctaTextTH ?? null;
  if (h.ctaUrl !== undefined) merged.cta_url = h.ctaUrl ?? null;
  if (h.active !== undefined) merged.active = h.active ? 1 : 0;
  if (h.order !== undefined) merged.sort_order = h.order;

  db.prepare(`
    UPDATE highlights SET
      title = @title, title_th = @title_th,
      description = @description, description_th = @description_th,
      image = @image, type = @type, start_date = @start_date, end_date = @end_date,
      cta_text = @cta_text, cta_text_th = @cta_text_th, cta_url = @cta_url,
      active = @active, sort_order = @sort_order
    WHERE id = @id
  `).run({ ...merged, id });

  return rowToHighlight(db.prepare('SELECT * FROM highlights WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteHighlight(id: string): void {
  getDb().prepare('DELETE FROM highlights WHERE id = ?').run(id);
}

// ── News CRUD ────────────────────────────────────────────────────────────────

export function getAllNews(): NewsItem[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM news ORDER BY publish_date DESC').all();
  return (rows as Record<string, unknown>[]).map(rowToNews);
}

export function createNews(n: Omit<NewsItem, 'id'>): NewsItem {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO news
      (id, title, title_th, excerpt, excerpt_th, content, content_th, image,
       category, publish_date, author, author_th, featured, active)
    VALUES
      (@id, @title, @title_th, @excerpt, @excerpt_th, @content, @content_th, @image,
       @category, @publish_date, @author, @author_th, @featured, @active)
  `).run({
    id,
    title: n.title,
    title_th: n.titleTH,
    excerpt: n.excerpt,
    excerpt_th: n.excerptTH,
    content: n.content,
    content_th: n.contentTH,
    image: n.image,
    category: n.category,
    publish_date: n.publishDate,
    author: n.author,
    author_th: n.authorTH,
    featured: n.featured ? 1 : 0,
    active: n.active ? 1 : 0,
  });
  return rowToNews(db.prepare('SELECT * FROM news WHERE id = ?').get(id) as Record<string, unknown>);
}

export function updateNews(id: string, n: Partial<NewsItem>): NewsItem | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return null;

  const merged = { ...existing };
  if (n.title !== undefined) merged.title = n.title;
  if (n.titleTH !== undefined) merged.title_th = n.titleTH;
  if (n.excerpt !== undefined) merged.excerpt = n.excerpt;
  if (n.excerptTH !== undefined) merged.excerpt_th = n.excerptTH;
  if (n.content !== undefined) merged.content = n.content;
  if (n.contentTH !== undefined) merged.content_th = n.contentTH;
  if (n.image !== undefined) merged.image = n.image;
  if (n.category !== undefined) merged.category = n.category;
  if (n.publishDate !== undefined) merged.publish_date = n.publishDate;
  if (n.author !== undefined) merged.author = n.author;
  if (n.authorTH !== undefined) merged.author_th = n.authorTH;
  if (n.featured !== undefined) merged.featured = n.featured ? 1 : 0;
  if (n.active !== undefined) merged.active = n.active ? 1 : 0;

  db.prepare(`
    UPDATE news SET
      title = @title, title_th = @title_th,
      excerpt = @excerpt, excerpt_th = @excerpt_th,
      content = @content, content_th = @content_th,
      image = @image, category = @category, publish_date = @publish_date,
      author = @author, author_th = @author_th,
      featured = @featured, active = @active
    WHERE id = @id
  `).run({ ...merged, id });

  return rowToNews(db.prepare('SELECT * FROM news WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteNews(id: string): void {
  getDb().prepare('DELETE FROM news WHERE id = ?').run(id);
}

// ── Program Images ───────────────────────────────────────────────────────────

export function getProgramImages(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT program_id, url FROM program_images').all() as { program_id: string; url: string }[];
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.program_id] = row.url;
  }
  return result;
}

export function setProgramImage(programId: string, url: string): void {
  getDb().prepare('INSERT OR REPLACE INTO program_images (program_id, url) VALUES (?, ?)').run(programId, url);
}

// ── Program Gallery ──────────────────────────────────────────────────────────

export interface ProgramGalleryImage {
  id: string;
  programId: string;
  url: string;
  caption: string;
  captionTH: string;
  order: number;
}

export function getGallery(programId: string): ProgramGalleryImage[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM program_gallery WHERE program_id = ? ORDER BY sort_order ASC').all(programId);
  return rows.map((r: any) => ({
    id: r.id, programId: r.program_id, url: r.url,
    caption: r.caption, captionTH: r.caption_th, order: r.sort_order,
  }));
}

export function addGalleryImage(programId: string, url: string, caption = '', captionTH = ''): ProgramGalleryImage {
  const db = getDb();
  const id = uuidv4();
  const maxRow: any = db.prepare('SELECT MAX(sort_order) as m FROM program_gallery WHERE program_id = ?').get(programId);
  const order = (maxRow?.m ?? -1) + 1;
  db.prepare('INSERT INTO program_gallery (id, program_id, url, caption, caption_th, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, programId, url, caption, captionTH, order);
  return { id, programId, url, caption, captionTH, order };
}

export function deleteGalleryImage(id: string): string | null {
  const db = getDb();
  const row: any = db.prepare('SELECT url FROM program_gallery WHERE id = ?').get(id);
  if (!row) return null;
  db.prepare('DELETE FROM program_gallery WHERE id = ?').run(id);
  return row.url;
}

// ── Programs CRUD ────────────────────────────────────────────────────────────

function rowToProgram(row: any): ProgramData {
  return {
    id: row.id, level: row.level, degree: row.degree,
    degreeFullEN: row.degree_full_en, degreeFullTH: row.degree_full_th,
    years: row.years, credits: row.credits,
    name: row.name, nameTH: row.name_th,
    color: row.color, description: row.description, descriptionTH: row.description_th,
    careers: JSON.parse(row.careers ?? '[]'),
    curriculumStructure: JSON.parse(row.curriculum_structure ?? '[]'),
    features: JSON.parse(row.features ?? '[]'),
    fees: row.fees, feesPerSemester: row.fees_per_semester,
    officialUrl: row.official_url,
  };
}

export function getAllPrograms(): ProgramData[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM programs').all() as any[]).map(rowToProgram);
}

export function getProgramById(id: string): ProgramData | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM programs WHERE id = ?').get(id) as any;
  return row ? rowToProgram(row) : null;
}

export function updateProgram(id: string, updates: Partial<ProgramData>): ProgramData | null {
  const db = getDb();
  const fields: string[] = [];
  const values: any = {};
  const map: Record<string, string> = {
    description: 'description', descriptionTH: 'description_th',
    careers: 'careers', curriculumStructure: 'curriculum_structure',
    features: 'features', fees: 'fees', feesPerSemester: 'fees_per_semester',
    officialUrl: 'official_url', degreeFullEN: 'degree_full_en', degreeFullTH: 'degree_full_th',
    name: 'name', nameTH: 'name_th', credits: 'credits', years: 'years', color: 'color',
  };
  for (const [key, col] of Object.entries(map)) {
    if (key in updates) {
      const val = (updates as any)[key];
      fields.push(`${col} = @${col}`);
      values[col] = (typeof val === 'object') ? JSON.stringify(val) : val;
    }
  }
  if (!fields.length) return getProgramById(id);
  values.id = id;
  db.prepare(`UPDATE programs SET ${fields.join(', ')} WHERE id = @id`).run(values);
  return getProgramById(id);
}

// ── Reset ────────────────────────────────────────────────────────────────────

export function resetToDefaults(): void {
  const db = getDb();
  const reset = db.transaction(() => {
    db.prepare('DELETE FROM staff').run();
    db.prepare('DELETE FROM highlights').run();
    db.prepare('DELETE FROM news').run();
    db.prepare('DELETE FROM program_images').run();
    db.prepare('DELETE FROM programs').run();
    db.prepare('DELETE FROM app_meta WHERE key = ?').run('seeded');
    seedData(db);
    db.prepare('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)').run('seeded', 'true');
  });
  reset();
}
