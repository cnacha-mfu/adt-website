'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiSearch, HiExternalLink, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { MdOutlineMenuBook, MdFormatQuote } from 'react-icons/md';
import { BsUnlockFill } from 'react-icons/bs';

interface OAAuthor {
  author: { display_name: string; orcid: string | null };
  institutions: { display_name: string }[];
}

interface OAWork {
  id: string;
  doi: string | null;
  title: string;
  publication_year: number;
  cited_by_count: number;
  primary_location: {
    source: { display_name: string } | null;
    landing_page_url: string | null;
  } | null;
  authorships: OAAuthor[];
  open_access: { is_oa: boolean; oa_url: string | null };
}

interface OAMeta {
  count: number;
  per_page: number;
  page: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

export default function ResearchPage() {
  const { language } = useApp();
  const [works, setWorks]     = useState<OAWork[]>([]);
  const [meta, setMeta]       = useState<OAMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(1);
  const [q, setQ]             = useState('');
  const [inputQ, setInputQ]   = useState('');
  const [year, setYear]       = useState('');

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q)    params.set('q', q);
      if (year) params.set('year', year);

      const res = await fetch(`/api/publications?${params}`);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      setWorks(data.results ?? []);
      setMeta(data.meta ?? null);
    } catch {
      setError('Failed to load publications. Please try again.');
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }, [page, q, year]);

  useEffect(() => { fetchWorks(); }, [fetchWorks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQ(inputQ.trim());
  };

  const totalPages = meta ? Math.ceil(meta.count / meta.per_page) : 0;

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-24 pb-20">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">ADT</span>
          </div>
          <h1 className="font-bebas text-5xl lg:text-7xl text-ink-primary mb-2">
            {language === 'en' ? 'Research Publications' : 'ผลงานวิจัย'}
          </h1>
          <p className="text-ink-secondary text-sm max-w-lg">
            {language === 'en'
              ? 'Peer-reviewed articles by faculty and researchers at Mae Fah Luang University, sourced from OpenAlex.'
              : 'บทความวิชาการโดยคณาจารย์และนักวิจัย มหาวิทยาลัยแม่ฟ้าหลวง จากฐานข้อมูล OpenAlex'}
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="text"
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                placeholder={language === 'en' ? 'Search title or author…' : 'ค้นหาชื่อบทความหรือผู้แต่ง…'}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-colors"
              />
            </div>
            <select
              value={year}
              onChange={e => { setYear(e.target.value); setPage(1); }}
              className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink-secondary focus:outline-none focus:border-teal transition-colors"
            >
              <option value="">{language === 'en' ? 'All years' : 'ทุกปี'}</option>
              {YEAR_OPTIONS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal hover:bg-teal-bright text-void font-semibold text-sm rounded-lg transition-colors"
            >
              {language === 'en' ? 'Search' : 'ค้นหา'}
            </button>
          </form>
        </div>

        {/* Results count */}
        {meta && !loading && (
          <div className="max-w-7xl mx-auto px-6 mb-5">
            <p className="text-ink-muted text-sm">
              {language === 'en'
                ? `${meta.count.toLocaleString()} articles found`
                : `พบ ${meta.count.toLocaleString()} บทความ`}
              {q && ` ${language === 'en' ? 'for' : 'สำหรับ'} "${q}"`}
            </p>
          </div>
        )}

        {/* List */}
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-border rounded w-3/4 mb-3" />
                  <div className="h-3 bg-border/60 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-border/60 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 text-ink-muted">{error}</div>
          ) : works.length === 0 ? (
            <div className="text-center py-24 text-ink-muted">
              {language === 'en' ? 'No articles found.' : 'ไม่พบบทความ'}
            </div>
          ) : (
            <div className="space-y-4">
              {works.map(work => {
                const url  = work.doi ?? work.primary_location?.landing_page_url ?? null;
                const source = work.primary_location?.source?.display_name;
                const authors = work.authorships.slice(0, 5).map(a => a.author.display_name);
                const moreAuthors = work.authorships.length > 5 ? work.authorships.length - 5 : 0;

                return (
                  <article key={work.id} className="glass-card rounded-xl p-5 gradient-border group hover:border-teal/20 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MdOutlineMenuBook size={18} className="text-teal" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Title */}
                        <h2 className="font-syne font-semibold text-sm text-ink-primary leading-snug mb-2 group-hover:text-teal transition-colors">
                          {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {work.title}
                              <HiExternalLink size={11} className="inline ml-1 opacity-60" />
                            </a>
                          ) : work.title}
                        </h2>

                        {/* Authors */}
                        <p className="text-ink-muted text-xs mb-2 leading-relaxed">
                          {authors.join(', ')}
                          {moreAuthors > 0 && <span className="text-ink-faint"> +{moreAuthors} more</span>}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3">
                          {source && (
                            <span className="text-ink-secondary text-xs italic truncate max-w-xs">{source}</span>
                          )}
                          <span className="text-ink-muted text-xs">{work.publication_year}</span>

                          {work.cited_by_count > 0 && (
                            <span className="flex items-center gap-1 text-xs text-ink-muted">
                              <MdFormatQuote size={13} />
                              {work.cited_by_count}
                            </span>
                          )}

                          {work.open_access.is_oa && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-gold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                              <BsUnlockFill size={9} /> Open Access
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg bg-surface border border-border text-ink-secondary hover:text-teal hover:border-teal/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <HiChevronLeft size={16} />
              </button>
              <span className="text-ink-muted text-sm">
                {language === 'en' ? `Page ${page} of ${totalPages}` : `หน้า ${page} จาก ${totalPages}`}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg bg-surface border border-border text-ink-secondary hover:text-teal hover:border-teal/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <HiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
