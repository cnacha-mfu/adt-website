'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ImageUpload from '@/components/admin/ImageUpload';
import { StaffMember, StaffRole } from '@/lib/types';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiDragMove2Line } from 'react-icons/ri';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

const ROLES: { value: StaffRole; label: string }[] = [
  { value: 'dean', label: 'Dean' },
  { value: 'assoc_dean', label: 'Associate Dean' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'staff', label: 'Staff' },
];

const EMPTY: Omit<StaffMember, 'id'> = {
  name: '', nameTH: '', title: '', titleTH: '', role: 'faculty',
  department: '', departmentTH: '', email: '', phone: '',
  photo: 'https://placehold.co/400x400/0D1830/0CC8D4?text=Photo',
  bio: '', bioTH: '', expertise: [], expertiseTH: [], order: 99, active: true
};

function StaffForm({ initial, onSave, onCancel }: {
  initial: Omit<StaffMember, 'id'>;
  onSave: (data: Omit<StaffMember, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (key: keyof typeof form, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="glass-card rounded-2xl p-6 gradient-border mb-6">
      <h2 className="font-syne font-semibold text-base text-ink-primary mb-6">
        {(initial as StaffMember).id ? 'Edit Staff Member' : 'Add New Staff Member'}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="admin-label">Full Name (EN)</label><input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div><label className="admin-label">ชื่อ-นามสกุล (TH)</label><input className="admin-input" value={form.nameTH} onChange={e => set('nameTH', e.target.value)} /></div>
        <div><label className="admin-label">Title (EN)</label><input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div><label className="admin-label">ตำแหน่ง (TH)</label><input className="admin-input" value={form.titleTH} onChange={e => set('titleTH', e.target.value)} /></div>
        <div>
          <label className="admin-label">Role</label>
          <select className="admin-input" value={form.role} onChange={e => set('role', e.target.value as StaffRole)}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div><label className="admin-label">Email</label><input className="admin-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div><label className="admin-label">Phone</label><input className="admin-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
        <div><label className="admin-label">Department (EN)</label><input className="admin-input" value={form.department} onChange={e => set('department', e.target.value)} /></div>
        <div><label className="admin-label">แผนก (TH)</label><input className="admin-input" value={form.departmentTH} onChange={e => set('departmentTH', e.target.value)} /></div>
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.photo}
            onChange={url => set('photo', url)}
            folder="staff"
            label="Photo"
            aspectRatio="aspect-square"
          />
        </div>
        <div><label className="admin-label">Display Order</label><input className="admin-input" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} /></div>
        <div className="sm:col-span-2"><label className="admin-label">Expertise (EN, comma-separated)</label><input className="admin-input" value={form.expertise.join(', ')} onChange={e => set('expertise', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} /></div>
        <div className="sm:col-span-2"><label className="admin-label">ความเชี่ยวชาญ (TH, คั่นด้วยจุลภาค)</label><input className="admin-input" value={form.expertiseTH.join(', ')} onChange={e => set('expertiseTH', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} /></div>
        <div className="sm:col-span-2"><label className="admin-label">Bio (EN)</label><textarea className="admin-input min-h-24 resize-y" value={form.bio} onChange={e => set('bio', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="admin-label">ประวัติ (TH)</label><textarea className="admin-input min-h-24 resize-y" value={form.bioTH} onChange={e => set('bioTH', e.target.value)} /></div>
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

export default function StaffAdmin() {
  const { data, addStaff, updateStaff, deleteStaff } = useApp();
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = [...data.staff].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">Staff Management</h1>
          <p className="text-ink-secondary text-sm">{data.staff.length} total · {data.staff.filter(s => s.active).length} active</p>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="admin-btn-primary flex items-center gap-2">
            <RiAddLine size={16} /> Add Staff
          </button>
        )}
      </div>

      {adding && (
        <StaffForm
          initial={EMPTY}
          onSave={data => { addStaff(data); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      )}

      {editing && (
        <StaffForm
          initial={editing}
          onSave={data => { updateStaff(editing.id, data); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="space-y-3">
        {sorted.map(member => (
          <div key={member.id} className="glass-card rounded-xl p-4 gradient-border flex items-center gap-4 group">
            <RiDragMove2Line className="text-ink-muted shrink-0 cursor-grab" size={18} />
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={member.photo} alt={member.name} fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-ink-primary font-medium text-sm truncate">{member.name}</p>
              <p className="text-ink-muted text-xs truncate">{member.title}</p>
              <p className="text-ink-muted text-xs capitalize">{member.role.replace('_', ' ')} · Order: {member.order}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => updateStaff(member.id, { active: !member.active })}
                title={member.active ? 'Deactivate' : 'Activate'}
              >
                {member.active
                  ? <BsCheckCircleFill className="text-teal" size={18} />
                  : <BsXCircleFill className="text-ink-muted hover:text-red-400" size={18} />
                }
              </button>
              <button
                onClick={() => { setAdding(false); setEditing(member); }}
                className="p-2 rounded-lg hover:bg-teal/10 text-ink-muted hover:text-teal transition-colors"
              >
                <RiEditLine size={16} />
              </button>
              <button
                onClick={() => { if (confirm(`Delete ${member.name}?`)) deleteStaff(member.id); }}
                className="p-2 rounded-lg hover:bg-red-900/20 text-ink-muted hover:text-red-400 transition-colors"
              >
                <RiDeleteBinLine size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
