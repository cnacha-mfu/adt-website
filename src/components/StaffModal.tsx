'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StaffMember, StaffRole } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { HiMail, HiPhone, HiX, HiExternalLink } from 'react-icons/hi';
import { MdOutlineMenuBook, MdFormatQuote, MdOpenInNew } from 'react-icons/md';
import { programMembership, programList } from '@/lib/program-membership';

const roleColors: Record<StaffRole, string> = {
  dean:       '#F5A623',
  assoc_dean: '#0CC8D4',
  faculty:    '#22EBF8',
  researcher: '#A78BFA',
  staff:      '#94A3B8',
  secretary:  '#C084FC',
};

function getRoleBadge(role: StaffRole, title: string, language: string) {
  if (role === 'dean') return language === 'en' ? 'Dean' : 'คณบดี';
  if (role === 'assoc_dean') {
    if (title.toLowerCase().includes('assistant'))
      return language === 'en' ? 'Assistant Dean' : 'ผู้ช่วยคณบดี';
    return language === 'en' ? 'Associate Dean' : 'รองคณบดี';
  }
  if (role === 'faculty')    return language === 'en' ? 'Faculty'        : 'คณาจารย์';
  if (role === 'researcher') return language === 'en' ? 'Researcher'     : 'นักวิจัย';
  if (role === 'secretary')  return language === 'en' ? 'Secretary'      : 'เลขานุการ';
  return language === 'en' ? 'Technical Staff' : 'นักวิชาการคอมพิวเตอร์';
}

/** Strip academic/military prefixes and degree suffixes so OpenAlex can match the name */
function cleanNameForSearch(name: string): string {
  return name
    .replace(/Assoc\.Prof\.\s*/gi, '')
    .replace(/Asst\.Prof\.\s*/gi, '')
    .replace(/Prof\.\s*/gi, '')
    .replace(/Acting\s+Sub-Lt\.\s*/gi, '')
    .replace(/Gp\.Capt\.\s*/gi, '')
    .replace(/Sub-Lt\.\s*/gi, '')
    .replace(/Dr\.\s*/gi, '')
    .replace(/Lect\.\s*/gi, '')
    .replace(/,\s*(Ph\.D|D\.Eng|D\.Tech|M\.Sc|M\.Eng|M\.S|B\.Sc|B\.Eng|MBA)\.?.*$/gi, '')
    .trim();
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
  open_access: { is_oa: boolean; oa_url: string | null };
}

interface Props {
  member: StaffMember;
  onClose: () => void;
}

export default function StaffModal({ member, onClose }: Props) {
  const { language } = useApp();

  const name       = language === 'en' ? member.name       : member.nameTH;
  const title      = language === 'en' ? member.title      : member.titleTH;
  const department = language === 'en' ? member.department : member.departmentTH;
  const bio        = language === 'en' ? member.bio        : member.bioTH;
  const expertise  = language === 'en' ? member.expertise  : member.expertiseTH;
  const color      = roleColors[member.role];
  const badge      = getRoleBadge(member.role, member.title, language);

  const memberPrograms = (programMembership[member.id] ?? [])
    .map(pid => programList.find(p => p.id === pid))
    .filter(Boolean) as typeof programList;

  const [pubs, setPubs]               = useState<OAWork[]>([]);
  const [pubsLoading, setPubsLoading] = useState(false);
  const [pubsTotal, setPubsTotal]     = useState(0);
  const [authorPageUrl, setAuthorPageUrl] = useState('');

  const showPublications = member.role === 'faculty' || member.role === 'researcher'
    || member.role === 'dean' || member.role === 'assoc_dean';

  useEffect(() => {
    if (!showPublications) return;
    setPubsLoading(true);
    const params = new URLSearchParams({ limit: '10' });
    if (member.orcidId) {
      params.set('orcid', member.orcidId);
    } else {
      params.set('author', cleanNameForSearch(member.name));
    }

    fetch(`/api/publications?${params}`)
      .then(r => r.json())
      .then(data => {
        setPubs(data.results ?? []);
        setPubsTotal(data.meta?.count ?? 0);
        if (data.authorId) setAuthorPageUrl(data.authorId);
      })
      .catch(() => {})
      .finally(() => setPubsLoading(false));
  }, [member, showPublications]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-2xl glass-card rounded-3xl overflow-hidden gradient-border shadow-2xl max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Colour bar */}
        <div className="h-1.5 w-full shrink-0" style={{ background: color }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-ink-muted hover:text-teal hover:border-teal/40 transition-all z-10"
        >
          <HiX size={15} />
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* ── Header: large photo left, info right ── */}
          <div className="flex items-stretch gap-0">
            {/* Photo — tall square covering the full header height */}
            <div className="relative w-52 shrink-0 self-stretch min-h-[13rem]">
              <Image src={member.photo} alt={name} fill className="object-cover object-top" unoptimized />
              {/* gradient overlay on right edge to blend into content */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0D1830]/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1830]/60 to-transparent" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 p-6 flex flex-col justify-center" style={{ borderLeft: `2px solid ${color}30` }}>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-3 self-start"
                style={{ color, borderColor: `${color}40`, background: `${color}15` }}
              >
                {badge}
              </span>
              <h2 className="font-syne font-bold text-xl text-ink-primary leading-snug mb-1">
                {name}
              </h2>
              <p className="text-ink-secondary text-sm leading-snug mb-1">{title}</p>
              {department && (
                <p className="text-ink-muted text-xs leading-snug">{department}</p>
              )}

              {/* Program tags */}
              {memberPrograms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {memberPrograms.map(p => (
                    <span key={p.id}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{ color: p.color, background: `${p.color}18` }}
                    >
                      {language === 'en' ? p.label : p.labelTH}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pb-8 pt-5 space-y-5">
            {/* Bio */}
            {bio && (
              <p className="text-ink-secondary text-sm leading-relaxed">{bio}</p>
            )}

            {/* Expertise */}
            {expertise.length > 0 && (
              <div>
                <p className="text-ink-muted text-[10px] uppercase tracking-widest mb-2">
                  {language === 'en' ? 'Expertise' : 'ความเชี่ยวชาญ'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {expertise.map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg border border-border/60 bg-border/40 text-ink-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {showPublications && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-ink-muted text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <MdOutlineMenuBook size={12} />
                    {language === 'en' ? 'Publications' : 'ผลงานวิจัย'}
                    {pubsTotal > 0 && !pubsLoading && (
                      <span className="text-ink-faint normal-case tracking-normal ml-1">
                        ({language === 'en' ? `${pubsTotal} total` : `ทั้งหมด ${pubsTotal}`})
                      </span>
                    )}
                  </p>
                  {authorPageUrl && !pubsLoading && (
                    <a
                      href={authorPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-teal hover:underline"
                    >
                      {language === 'en' ? 'View all' : 'ดูทั้งหมด'}
                      <MdOpenInNew size={11} />
                    </a>
                  )}
                </div>

                {pubsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse rounded-lg bg-surface p-3">
                        <div className="h-3 bg-border rounded w-full mb-1.5" />
                        <div className="h-2.5 bg-border/60 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : pubs.length === 0 ? (
                  <p className="text-ink-muted text-xs italic">
                    {language === 'en' ? 'No indexed publications found.' : 'ไม่พบผลงานในฐานข้อมูล'}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                    {pubs.map(pub => {
                      const url    = pub.doi ?? pub.primary_location?.landing_page_url ?? null;
                      const source = pub.primary_location?.source?.display_name;
                      return (
                        <div key={pub.id} className="rounded-lg bg-surface border border-border/60 p-3 hover:border-teal/30 transition-colors">
                          <p className="text-ink-primary text-xs leading-snug mb-1.5 line-clamp-2">
                            {url ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                                {pub.title}
                                <HiExternalLink size={10} className="inline ml-1 opacity-60" />
                              </a>
                            ) : pub.title}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {source && (
                              <span className="text-ink-muted text-[10px] italic truncate max-w-[180px]">{source}</span>
                            )}
                            <span className="text-ink-muted text-[10px]">{pub.publication_year}</span>
                            {pub.cited_by_count > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-ink-muted">
                                <MdFormatQuote size={11} />{pub.cited_by_count}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Contact */}
            <div className="border-t border-border pt-4 space-y-2.5">
              {member.email && (
                <a href={`mailto:${member.email}`}
                  className="flex items-center gap-2.5 text-sm text-ink-secondary hover:text-teal transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-teal/40 transition-colors shrink-0">
                    <HiMail size={13} className="text-ink-muted group-hover:text-teal transition-colors" />
                  </div>
                  {member.email}
                </a>
              )}
              {member.phone && (
                <a href={`tel:${member.phone}`}
                  className="flex items-center gap-2.5 text-sm text-ink-secondary hover:text-teal transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-teal/40 transition-colors shrink-0">
                    <HiPhone size={13} className="text-ink-muted group-hover:text-teal transition-colors" />
                  </div>
                  {member.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
