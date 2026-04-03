'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ImageUpload from '@/components/admin/ImageUpload';
import { Highlight, HighlightType } from '@/lib/types';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { BsCheckCircleFill, BsXCircleFill, BsCalendarEventFill, BsTrophyFill, BsMegaphoneFill, BsStarFill } from 'react-icons/bs';
import { format } from 'date-fns';

const TYPES: { value: HighlightType; label: string; Icon: React.ElementType; color: string }[] = [
  { value: 'event',        label: 'Event',        Icon: BsCalendarEventFill, color: '#0CC8D4' },
  { value: 'celebration',  label: 'Celebration',  Icon: BsStarFill,          color: '#F5A623' },
  { value: 'achievement',  label: 'Achievement',  Icon: BsTrophyFill,        color: '#22EBF8' },
  { value: 'announcement', label: 'Announcement', Icon: BsMegaphoneFill,     color: '#A78BFA' },
];

const EMPTY: Omit<Highlight, 'id'> = {
  title: '', titleTH: '', description: '', descriptionTH: '',
  image: 'https://placehold.co/1200x600/0D1830/0CC8D4?text=Highlight',
  type: 'event', startDate: '', endDate: '', ctaText: '', ctaTextTH: '', ctaUrl: '',
  active: true, order: 99
};

function HighlightForm({ initial, onSave, onCancel }: {
  initial: Omit<Highlight, 'id'>;
  onSave: (data: Omit<Highlight, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (key: keyof typeof form, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="glass-card rounded-2xl p-6 gradient-border mb-6">
      <h2 className="font-syne font-semibold text-base text-ink-primary mb-6">
        {(initial as Highlight).id ? 'Edit Highlight' : 'Add New Highlight'}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="admin-label">Title (EN)</label><input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div><label className="admin-label">ชื่อ (TH)</label><input className="admin-input" value={form.titleTH} onChange={e => set('titleTH', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">Description (EN)</label><textarea className="admin-input min-h-20 resize-y" value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">คำอธิบาย (TH)</label><textarea className="admin-input min-h-20 resize-y" value={form.descriptionTH} onChange={e => set('descriptionTH', e.target.value)} /></div>
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.image}
            onChange={url => set('image', url)}
            folder="highlights"
            label="Image"
            aspectRatio="aspect-video"
          />
        </div>
        <div>
          <label className="admin-label">Type</label>
          <select className="admin-input" value={form.type} onChange={e => set('type', e.target.value as HighlightType)}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div><label className="admin-label">Display Order</label><input className="admin-input" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} /></div>
        <div><label className="admin-label">Start Date</label><input className="admin-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} /></div>
        <div><label className="admin-label">End Date (optional)</label><input className="admin-input" type="date" value={form.endDate || ''} onChange={e => set('endDate', e.target.value)} /></div>
        <div><label className="admin-label">CTA Text (EN)</label><input className="admin-input" value={form.ctaText || ''} onChange={e => set('ctaText', e.target.value)} /></div>
        <div><label className="admin-label">ข้อความปุ่ม (TH)</label><input className="admin-input" value={form.ctaTextTH || ''} onChange={e => set('ctaTextTH', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">CTA URL</label><input className="admin-input" value={form.ctaUrl || ''} onChange={e => set('ctaUrl', e.target.value)} /></div>
        <div className="flex items-center gap-3">
          <label className="admin-label mb-0">Active</label>
          <button type="button" onClick={() => set('active', !form.active)}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${form.active ? 'bg-teal' : 'bg-border'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.active ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} className="admin-btn-primary">Save</button>
        <button onClick={onCancel} className="admin-btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

export default function HighlightsAdmin() {
  const { data, addHighlight, updateHighlight, deleteHighlight } = useApp();
  const [editing, setEditing] = useState<Highlight | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = [...data.highlights].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">Highlights Management</h1>
          <p className="text-ink-secondary text-sm">{data.highlights.length} total · {data.highlights.filter(h => h.active).length} active</p>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="admin-btn-primary flex items-center gap-2">
            <RiAddLine size={16} /> Add Highlight
          </button>
        )}
      </div>

      {adding && (
        <HighlightForm
          initial={EMPTY}
          onSave={data => { addHighlight(data); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      )}

      {editing && (
        <HighlightForm
          initial={editing}
          onSave={data => { updateHighlight(editing.id, data); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {sorted.map(item => {
          const typeCfg = TYPES.find(t => t.value === item.type)!;
          return (
            <div key={item.id} className="glass-card rounded-xl overflow-hidden gradient-border group">
              <div className="relative h-40 overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover opacity-70" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${typeCfg.color}20`, color: typeCfg.color, border: `1px solid ${typeCfg.color}30` }}>
                  <typeCfg.Icon size={10} /> {typeCfg.label}
                </div>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => updateHighlight(item.id, { active: !item.active })}
                    className="p-1.5 rounded-lg bg-black/40 backdrop-blur text-white/70 hover:text-white"
                  >
                    {item.active ? <BsCheckCircleFill className="text-teal" size={14} /> : <BsXCircleFill className="text-red-400" size={14} />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-ink-primary font-semibold text-sm mb-1 line-clamp-1">{item.title}</p>
                <p className="text-ink-muted text-xs mb-3">
                  {item.startDate ? format(new Date(item.startDate), 'MMM d, yyyy') : '—'}
                  {item.endDate ? ` — ${format(new Date(item.endDate), 'MMM d, yyyy')}` : ''}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setAdding(false); setEditing(item); }}
                    className="flex items-center gap-1.5 admin-btn-secondary py-1.5 px-3 text-xs">
                    <RiEditLine size={13} /> Edit
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${item.title}"?`)) deleteHighlight(item.id); }}
                    className="flex items-center gap-1.5 admin-btn-danger py-1.5 px-3 text-xs">
                    <RiDeleteBinLine size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
