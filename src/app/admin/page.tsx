'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RiUserLine, RiMegaphoneLine, RiNewspaperLine, RiArrowRightLine } from 'react-icons/ri';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import { HiDatabase, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { format } from 'date-fns';

function StatCard({ value, label, color, href, icon: Icon }: {
  value: number; label: string; color: string; href: string; icon: React.ElementType;
}) {
  return (
    <Link href={href} className="glass-card rounded-2xl p-6 gradient-border group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover block">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
          <Icon size={22} />
        </div>
        <RiArrowRightLine className="text-ink-muted group-hover:text-teal transition-colors" size={18} />
      </div>
      <p className="font-bebas text-4xl mb-1" style={{ color }}>{value}</p>
      <p className="text-ink-secondary text-sm">{label}</p>
    </Link>
  );
}

type MigrateStatus = 'idle' | 'scanning' | 'ready' | 'migrating' | 'done' | 'error' | 'nothing';

interface LocalPreview {
  staff: number;
  highlights: number;
  news: number;
  programImages: number;
  raw: object;
}

export default function AdminDashboard() {
  const { data, resetToDefaults } = useApp();
  const [migrateStatus, setMigrateStatus] = useState<MigrateStatus>('idle');
  const [preview, setPreview] = useState<LocalPreview | null>(null);
  const [migrateCounts, setMigrateCounts] = useState<LocalPreview | null>(null);
  const [migrateError, setMigrateError] = useState('');

  const scanLocalStorage = () => {
    setMigrateStatus('scanning');
    try {
      // Try all known version keys
      const keys = ['adt-website-data-v6','adt-website-data-v5','adt-website-data-v4','adt-website-data-v3','adt-website-data-v2','adt-website-data'];
      let parsed: any = null;
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (raw) { parsed = JSON.parse(raw); break; }
      }

      // Program images stored separately
      let programImages: Record<string, string> = {};
      try {
        const imgRaw = localStorage.getItem('adt-program-images');
        if (imgRaw) programImages = JSON.parse(imgRaw);
      } catch {}

      if (!parsed && Object.keys(programImages).length === 0) {
        setMigrateStatus('nothing');
        return;
      }

      const merged = { ...parsed, programImages: { ...(parsed?.programImages ?? {}), ...programImages } };
      setPreview({
        staff: merged.staff?.length ?? 0,
        highlights: merged.highlights?.length ?? 0,
        news: merged.news?.length ?? 0,
        programImages: Object.keys(merged.programImages ?? {}).length,
        raw: merged,
      });
      setMigrateStatus('ready');
    } catch (e) {
      setMigrateError(String(e));
      setMigrateStatus('error');
    }
  };

  const runMigration = async () => {
    if (!preview) return;
    setMigrateStatus('migrating');
    try {
      const res = await fetch('/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preview.raw),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Migration failed');
      setMigrateCounts({ ...json.counts, raw: {} });
      setMigrateStatus('done');
      // Clear localStorage after successful migration
      ['adt-website-data-v6','adt-website-data-v5','adt-website-data-v4','adt-website-data-v3','adt-website-data-v2','adt-website-data','adt-program-images'].forEach(k => localStorage.removeItem(k));
    } catch (e) {
      setMigrateError(String(e));
      setMigrateStatus('error');
    }
  };

  const activeStaff = data.staff.filter(s => s.active).length;
  const activeHighlights = data.highlights.filter(h => h.active).length;
  const activeNews = data.news.filter(n => n.active).length;

  const recentNews = data.news.slice(0, 5);
  const recentHighlights = data.highlights.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">Dashboard</h1>
        <p className="text-ink-secondary text-sm">Overview of the ADT website content</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard value={activeStaff} label="Active Staff Members" color="#0CC8D4" href="/admin/staff" icon={RiUserLine} />
        <StatCard value={activeHighlights} label="Active Highlights" color="#F5A623" href="/admin/highlights" icon={RiMegaphoneLine} />
        <StatCard value={activeNews} label="Published News" color="#22EBF8" href="/admin/news" icon={RiNewspaperLine} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent news */}
        <div className="glass-card rounded-2xl p-6 gradient-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-semibold text-base text-ink-primary">Recent News</h2>
            <Link href="/admin/news" className="text-teal text-xs hover:underline flex items-center gap-1">
              Manage <RiArrowRightLine size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-ink-primary text-sm font-medium truncate">{item.title}</p>
                  <p className="text-ink-muted text-xs">{format(new Date(item.publishDate), 'MMM d, yyyy')} · {item.category}</p>
                </div>
                {item.active ? <BsCheckCircleFill className="text-teal shrink-0" size={14} /> : <BsXCircleFill className="text-red-400 shrink-0" size={14} />}
              </div>
            ))}
          </div>
        </div>

        {/* Active highlights */}
        <div className="glass-card rounded-2xl p-6 gradient-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-semibold text-base text-ink-primary">Highlights</h2>
            <Link href="/admin/highlights" className="text-teal text-xs hover:underline flex items-center gap-1">
              Manage <RiArrowRightLine size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentHighlights.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-ink-primary text-sm font-medium truncate">{item.title}</p>
                  <p className="text-ink-muted text-xs capitalize">{item.type} · {format(new Date(item.startDate), 'MMM d, yyyy')}</p>
                </div>
                {item.active ? <BsCheckCircleFill className="text-teal shrink-0" size={14} /> : <BsXCircleFill className="text-red-400 shrink-0" size={14} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Migrate from localStorage */}
      <div className="mt-6 p-5 rounded-2xl border border-teal/20 bg-teal/5">
        <div className="flex items-center gap-2 mb-1">
          <HiDatabase className="text-teal" size={16} />
          <h3 className="font-syne font-semibold text-sm text-ink-primary">Migrate Browser Data to SQLite</h3>
        </div>
        <p className="text-ink-muted text-xs mb-4">
          If you had data saved in the browser (localStorage) before the SQLite migration, use this to import it to the server database.
        </p>

        {migrateStatus === 'idle' && (
          <button onClick={scanLocalStorage} className="admin-btn-secondary flex items-center gap-2">
            <HiDatabase size={14} /> Scan Browser Storage
          </button>
        )}

        {migrateStatus === 'scanning' && (
          <p className="text-ink-muted text-xs">Scanning...</p>
        )}

        {migrateStatus === 'nothing' && (
          <div className="flex items-center gap-2 text-ink-muted text-xs">
            <HiCheckCircle className="text-teal" size={14} />
            No localStorage data found — already migrated or nothing to migrate.
          </div>
        )}

        {migrateStatus === 'ready' && preview && (
          <div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Staff', value: preview.staff, color: '#0CC8D4' },
                { label: 'Highlights', value: preview.highlights, color: '#F5A623' },
                { label: 'News', value: preview.news, color: '#22EBF8' },
                { label: 'Program Images', value: preview.programImages, color: '#A78BFA' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-surface rounded-xl p-3 text-center border border-border">
                  <p className="font-bebas text-2xl" style={{ color }}>{value}</p>
                  <p className="text-ink-muted text-[10px]">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={runMigration} className="admin-btn-primary flex items-center gap-2">
              <HiDatabase size={14} /> Import to SQLite
            </button>
          </div>
        )}

        {migrateStatus === 'migrating' && (
          <p className="text-teal text-xs animate-pulse">Migrating data to SQLite...</p>
        )}

        {migrateStatus === 'done' && migrateCounts && (
          <div className="flex items-start gap-2">
            <HiCheckCircle className="text-teal shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-ink-primary text-sm font-medium">Migration complete</p>
              <p className="text-ink-muted text-xs mt-0.5">
                Imported: {migrateCounts.staff} staff · {migrateCounts.highlights} highlights · {migrateCounts.news} news · {migrateCounts.programImages} program images.
                Browser storage cleared.
              </p>
            </div>
          </div>
        )}

        {migrateStatus === 'error' && (
          <div className="flex items-start gap-2">
            <HiExclamationCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-red-400 text-sm font-medium">Migration failed</p>
              <p className="text-ink-muted text-xs mt-0.5">{migrateError}</p>
              <button onClick={() => setMigrateStatus('idle')} className="admin-btn-secondary mt-2 text-xs">Try Again</button>
            </div>
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="mt-4 p-5 rounded-2xl border border-red-900/30 bg-red-900/10">
        <h3 className="font-syne font-semibold text-sm text-ink-primary mb-1">Reset to Default Data</h3>
        <p className="text-ink-muted text-xs mb-3">This will restore all staff, highlights, and news to the original sample data.</p>
        <button
          onClick={() => { if (confirm('Reset all data to defaults? This cannot be undone.')) resetToDefaults(); }}
          className="admin-btn-danger"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
