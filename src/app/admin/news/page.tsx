'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ImageUpload from '@/components/admin/ImageUpload';
import { NewsItem, NewsCategory } from '@/lib/types';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarLine, RiStarFill } from 'react-icons/ri';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import { HiLink, HiX, HiCheckCircle } from 'react-icons/hi';
import { FaFacebook } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';
import { format } from 'date-fns';

const CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'news',         label: 'News'         },
  { value: 'event',        label: 'Event'        },
  { value: 'research',     label: 'Research'     },
  { value: 'achievement',  label: 'Achievement'  },
  { value: 'announcement', label: 'Announcement' },
];

const catColors: Record<NewsCategory, string> = {
  news:         '#0CC8D4',
  event:        '#F5A623',
  research:     '#22EBF8',
  achievement:  '#A78BFA',
  announcement: '#F87171',
};

const EMPTY: Omit<NewsItem, 'id'> = {
  title: '', titleTH: '', excerpt: '', excerptTH: '',
  content: '', contentTH: '',
  image: 'https://placehold.co/800x500/0D1830/0CC8D4?text=News',
  category: 'news', publishDate: new Date().toISOString().split('T')[0],
  author: '', authorTH: '', featured: false, active: true,
};

// ── Facebook import modal ─────────────────────────────────────────────────────

type ImportState = 'idle' | 'loading' | 'preview' | 'error';

interface ImportResult extends Omit<NewsItem, 'id'> {}

function FacebookImportModal({
  onImport,
  onClose,
}: {
  onImport: (data: Omit<NewsItem, 'id'>) => void;
  onClose: () => void;
}) {
  const [fbUrl, setFbUrl]       = useState('');
  const [state, setState]       = useState<ImportState>('idle');
  const [result, setResult]     = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleExtract() {
    if (!fbUrl.trim()) return;
    setState('loading');
    setErrorMsg('');
    try {
      const resp = await fetch('/api/admin/facebook-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fbUrl.trim() }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Import failed');
      setResult(json as ImportResult);
      setState('preview');
    } catch (e) {
      setErrorMsg(String(e));
      setState('error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-deep rounded-2xl border border-border shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <FaFacebook className="text-blue-400" size={18} />
            </div>
            <div>
              <p className="text-ink-primary font-semibold text-sm">Import from Facebook</p>
              <p className="text-ink-muted text-xs">Powered by Gemini AI · extracts text + auto-translates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary transition-colors">
            <HiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* URL input */}
          <div>
            <label className="admin-label">Facebook Post URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
                <input
                  className="admin-input pl-9"
                  placeholder="https://www.facebook.com/share/p/..."
                  value={fbUrl}
                  onChange={e => { setFbUrl(e.target.value); if (state !== 'idle') { setState('idle'); setResult(null); } }}
                  onKeyDown={e => e.key === 'Enter' && handleExtract()}
                />
              </div>
              <button
                onClick={handleExtract}
                disabled={state === 'loading' || !fbUrl.trim()}
                className="admin-btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {state === 'loading' ? (
                  <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Extracting…</>
                ) : (
                  <><MdAutoAwesome size={14} /> Extract</>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {state === 'error' && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Preview */}
          {state === 'preview' && result && (
            <>
              <div className="rounded-xl border border-teal/25 bg-teal/5 px-4 py-2.5 flex items-center gap-2 text-teal text-xs font-medium">
                <HiCheckCircle size={14} /> Content extracted and translated successfully
              </div>

              {/* Image preview */}
              {result.image && !result.image.includes('placehold.co') && (
                <div className="w-full rounded-xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.image} alt="preview" className="w-full object-cover max-h-64" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <PreviewField label="Title (EN)" value={result.title}
                  onChange={v => setResult(r => r ? { ...r, title: v } : r)} />
                <PreviewField label="ชื่อบทความ (TH)" value={result.titleTH}
                  onChange={v => setResult(r => r ? { ...r, titleTH: v } : r)} />
                <PreviewField label="Excerpt (EN)" value={result.excerpt} multiline
                  onChange={v => setResult(r => r ? { ...r, excerpt: v } : r)} />
                <PreviewField label="สรุป (TH)" value={result.excerptTH} multiline
                  onChange={v => setResult(r => r ? { ...r, excerptTH: v } : r)} />
                <PreviewField label="Content (EN)" value={result.content} multiline tall
                  onChange={v => setResult(r => r ? { ...r, content: v } : r)} />
                <PreviewField label="เนื้อหา (TH)" value={result.contentTH} multiline tall
                  onChange={v => setResult(r => r ? { ...r, contentTH: v } : r)} />
                <div>
                  <label className="admin-label">Category</label>
                  <select className="admin-input" value={result.category}
                    onChange={e => setResult(r => r ? { ...r, category: e.target.value as NewsCategory } : r)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <PreviewField label="Author (EN)" value={result.author}
                  onChange={v => setResult(r => r ? { ...r, author: v } : r)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { onImport(result); onClose(); }}
                  className="admin-btn-primary flex items-center gap-2"
                >
                  <RiAddLine size={15} /> Add to News
                </button>
                <button onClick={() => { setState('idle'); setResult(null); setFbUrl(''); }}
                  className="admin-btn-secondary">
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewField({
  label, value, onChange, multiline, tall,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; tall?: boolean;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {multiline ? (
        <textarea
          className={`admin-input resize-y ${tall ? 'min-h-32' : 'min-h-16'}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input className="admin-input" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

// ── News form ─────────────────────────────────────────────────────────────────

function NewsForm({ initial, onSave, onCancel }: {
  initial: Omit<NewsItem, 'id'>;
  onSave: (data: Omit<NewsItem, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (key: keyof typeof form, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="glass-card rounded-2xl p-6 gradient-border mb-6">
      <h2 className="font-syne font-semibold text-base text-ink-primary mb-6">
        {(initial as NewsItem).id ? 'Edit News' : 'Add New Article'}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="admin-label">Title (EN)</label><input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div><label className="admin-label">ชื่อบทความ (TH)</label><input className="admin-input" value={form.titleTH} onChange={e => set('titleTH', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">Excerpt (EN)</label><textarea className="admin-input min-h-16 resize-y" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">สรุป (TH)</label><textarea className="admin-input min-h-16 resize-y" value={form.excerptTH} onChange={e => set('excerptTH', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">Content (EN)</label><textarea className="admin-input min-h-32 resize-y" value={form.content} onChange={e => set('content', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">เนื้อหา (TH)</label><textarea className="admin-input min-h-32 resize-y" value={form.contentTH} onChange={e => set('contentTH', e.target.value)} /></div>
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.image}
            onChange={url => set('image', url)}
            folder="news"
            label="Image"
            aspectRatio="aspect-video"
          />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <select className="admin-input" value={form.category} onChange={e => set('category', e.target.value as NewsCategory)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div><label className="admin-label">Publish Date</label><input className="admin-input" type="date" value={form.publishDate} onChange={e => set('publishDate', e.target.value)} /></div>
        <div><label className="admin-label">Author (EN)</label><input className="admin-input" value={form.author} onChange={e => set('author', e.target.value)} /></div>
        <div><label className="admin-label">ผู้เขียน (TH)</label><input className="admin-input" value={form.authorTH} onChange={e => set('authorTH', e.target.value)} /></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="admin-label mb-0">Active</label>
            <button type="button" onClick={() => set('active', !form.active)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${form.active ? 'bg-teal' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.active ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="admin-label mb-0">Featured</label>
            <button type="button" onClick={() => set('featured', !form.featured)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${form.featured ? 'bg-gold' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.featured ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} className="admin-btn-primary">Save</button>
        <button onClick={onCancel} className="admin-btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsAdmin() {
  const { data, addNews, updateNews, deleteNews } = useApp();
  const [editing, setEditing]         = useState<NewsItem | null>(null);
  const [adding, setAdding]           = useState(false);
  const [prefill, setPrefill]         = useState<Omit<NewsItem, 'id'>>(EMPTY);
  const [showImport, setShowImport]   = useState(false);

  const sorted = [...data.news].sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  function handleImport(data: Omit<NewsItem, 'id'>) {
    setPrefill(data);
    setEditing(null);
    setAdding(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">News Management</h1>
          <p className="text-ink-secondary text-sm">{data.news.length} total · {data.news.filter(n => n.active).length} published</p>
        </div>
        {!adding && !editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="admin-btn-secondary flex items-center gap-2"
              title="Import from Facebook post"
            >
              <FaFacebook size={14} /> Import from Facebook
            </button>
            <button
              onClick={() => { setPrefill(EMPTY); setAdding(true); }}
              className="admin-btn-primary flex items-center gap-2"
            >
              <RiAddLine size={16} /> Add Article
            </button>
          </div>
        )}
      </div>

      {showImport && (
        <FacebookImportModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {adding && (
        <NewsForm
          initial={prefill}
          onSave={d => { addNews(d); setAdding(false); setPrefill(EMPTY); }}
          onCancel={() => { setAdding(false); setPrefill(EMPTY); }}
        />
      )}

      {editing && (
        <NewsForm
          initial={editing}
          onSave={d => { updateNews(editing.id, d); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="space-y-3">
        {sorted.map(item => {
          const color = catColors[item.category];
          return (
            <div key={item.id} className="glass-card rounded-xl p-4 gradient-border flex items-center gap-4 group">
              <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover opacity-80" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                    {item.category}
                  </span>
                  {item.featured && <RiStarFill className="text-gold" size={13} />}
                </div>
                <p className="text-ink-primary font-medium text-sm truncate">{item.title}</p>
                <p className="text-ink-muted text-xs">{format(new Date(item.publishDate), 'MMM d, yyyy')} · {item.author}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateNews(item.id, { featured: !item.featured })} title="Toggle featured"
                  className="p-2 rounded-lg hover:bg-gold/10 text-ink-muted hover:text-gold transition-colors">
                  {item.featured ? <RiStarFill size={15} className="text-gold" /> : <RiStarLine size={15} />}
                </button>
                <button onClick={() => updateNews(item.id, { active: !item.active })} title="Toggle active">
                  {item.active
                    ? <BsCheckCircleFill className="text-teal" size={16} />
                    : <BsXCircleFill className="text-ink-muted hover:text-red-400" size={16} />
                  }
                </button>
                <button onClick={() => { setAdding(false); setEditing(item); }}
                  className="p-2 rounded-lg hover:bg-teal/10 text-ink-muted hover:text-teal transition-colors">
                  <RiEditLine size={15} />
                </button>
                <button onClick={() => { if (confirm(`Delete "${item.title}"?`)) deleteNews(item.id); }}
                  className="p-2 rounded-lg hover:bg-red-900/20 text-ink-muted hover:text-red-400 transition-colors">
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
