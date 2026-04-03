'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ImageUpload from '@/components/admin/ImageUpload';
import { NewsItem, NewsCategory } from '@/lib/types';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarLine, RiStarFill } from 'react-icons/ri';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import { format } from 'date-fns';

const CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Event' },
  { value: 'research', label: 'Research' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'announcement', label: 'Announcement' },
];

const catColors: Record<NewsCategory, string> = {
  news: '#0CC8D4',
  event: '#F5A623',
  research: '#22EBF8',
  achievement: '#A78BFA',
  announcement: '#F87171',
};

const EMPTY: Omit<NewsItem, 'id'> = {
  title: '', titleTH: '', excerpt: '', excerptTH: '',
  content: '', contentTH: '',
  image: 'https://placehold.co/800x500/0D1830/0CC8D4?text=News',
  category: 'news', publishDate: new Date().toISOString().split('T')[0],
  author: '', authorTH: '', featured: false, active: true
};

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

export default function NewsAdmin() {
  const { data, addNews, updateNews, deleteNews } = useApp();
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = [...data.news].sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">News Management</h1>
          <p className="text-ink-secondary text-sm">{data.news.length} total · {data.news.filter(n => n.active).length} published</p>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="admin-btn-primary flex items-center gap-2">
            <RiAddLine size={16} /> Add Article
          </button>
        )}
      </div>

      {adding && (
        <NewsForm
          initial={EMPTY}
          onSave={d => { addNews(d); setAdding(false); }}
          onCancel={() => setAdding(false)}
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
