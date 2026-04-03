import { NextRequest, NextResponse } from 'next/server';

const BASE   = 'https://api.openalex.org';
const MAILTO = 'admin@mfu.ac.th';

const SELECT_FIELDS = [
  'id', 'doi', 'title', 'publication_year', 'cited_by_count',
  'primary_location', 'authorships', 'open_access',
].join(',');

async function resolveAuthorId(name: string): Promise<string | null> {
  const url = `${BASE}/authors?search=${encodeURIComponent(name)}&per_page=1&mailto=${MAILTO}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0]?.id ?? null;
}

export async function GET(req: NextRequest) {
  const sp     = req.nextUrl.searchParams;
  const page   = sp.get('page')   ?? '1';
  const q      = sp.get('q')      ?? '';
  const year   = sp.get('year')   ?? '';
  const author = sp.get('author') ?? '';
  const orcid  = sp.get('orcid')  ?? '';
  const limit  = sp.get('limit')  ?? '20';

  const filterParts: string[] = ['type:article'];
  let resolvedAuthorId: string | null = null;

  if (orcid) {
    filterParts.push(`authorships.author.orcid:https://orcid.org/${orcid}`);
  } else if (author) {
    resolvedAuthorId = await resolveAuthorId(author);
    if (!resolvedAuthorId) {
      return NextResponse.json({
        meta: { count: 0, per_page: Number(limit), page: 1 },
        results: [],
        authorId: null,
      });
    }
    filterParts.push(`authorships.author.id:${resolvedAuthorId}`);
  } else {
    filterParts.push('authorships.institutions.display_name.search:mae fah luang');
    if (year) filterParts.push(`publication_year:${year}`);
  }

  const filter = filterParts.join(',');
  const otherParams = new URLSearchParams({
    sort:     'publication_year:desc',
    per_page: limit,
    page,
    mailto:   MAILTO,
    select:   SELECT_FIELDS,
  });
  if (q) otherParams.set('search', q);

  const url = `${BASE}/works?filter=${filter}&${otherParams}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': `ADT-MFU-Website/1.0 (mailto:${MAILTO})` },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `OpenAlex error: ${res.status}`, detail: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ ...data, authorId: resolvedAuthorId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
