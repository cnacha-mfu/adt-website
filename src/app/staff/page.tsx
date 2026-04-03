'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { StaffMember, StaffRole } from '@/lib/types';
import { useState } from 'react';
import StaffModal from '@/components/StaffModal';
import { programMembership, programList } from '@/lib/program-membership';

const roleOrder: StaffRole[] = ['dean', 'assoc_dean', 'faculty', 'researcher', 'staff', 'secretary'];
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
  if (role === 'faculty')    return language === 'en' ? 'Faculty'   : 'คณาจารย์';
  if (role === 'researcher') return language === 'en' ? 'Researcher': 'นักวิจัย';
  if (role === 'secretary')  return language === 'en' ? 'Secretary' : 'เลขานุการ';
  return language === 'en' ? 'Technical Staff' : 'นักวิชาการคอมพิวเตอร์';
}

type RoleFilter = 'all' | 'management' | 'faculty' | 'staff' | 'secretary';

export default function StaffPage() {
  const { data, language } = useApp();
  const [roleFilter, setRoleFilter]       = useState<RoleFilter>('all');
  const [programFilter, setProgramFilter] = useState('');
  const [selected, setSelected]           = useState<StaffMember | null>(null);

  const active = data.staff
    .filter(s => {
      if (!s.active) return false;
      // Program filter takes full precedence — show everyone in that program regardless of role
      if (programFilter) return (programMembership[s.id] ?? []).includes(programFilter);
      if (roleFilter === 'management') return s.role === 'dean' || s.role === 'assoc_dean';
      if (roleFilter === 'secretary')  return s.role === 'secretary';
      if (roleFilter === 'staff')      return s.role === 'staff';
      if (roleFilter === 'faculty')    return s.role === 'faculty' || s.role === 'researcher';
      return true;
    })
    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role) || a.order - b.order);

  const roleFilters: { value: RoleFilter; label: string; labelTH: string }[] = [
    { value: 'all',        label: 'All',        labelTH: 'ทั้งหมด' },
    { value: 'management', label: 'Management', labelTH: 'ผู้บริหาร' },
    { value: 'faculty',    label: 'Faculty',    labelTH: 'คณาจารย์' },
    { value: 'staff',      label: 'Technical',  labelTH: 'นักวิชาการ' },
    { value: 'secretary',  label: 'Secretary',  labelTH: 'เลขานุการ' },
  ];

  const showProgramFilter = roleFilter === 'all' || roleFilter === 'faculty';

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-24 pb-20">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">ADT</span>
          </div>
          <h1 className="font-bebas text-5xl lg:text-7xl text-ink-primary mb-3">
            Faculty & Staff
          </h1>
          <p className="text-ink-secondary max-w-lg">
            {language === 'en'
              ? 'Meet the passionate educators and researchers shaping the future of digital technology.'
              : 'พบกับนักการศึกษาและนักวิจัยที่มีความมุ่งมั่นซึ่งกำลังสร้างอนาคตของเทคโนโลยีดิจิทัล'}
          </p>
        </div>

        {/* Role filters */}
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="flex flex-wrap gap-2">
            {roleFilters.map(f => (
              <button
                key={f.value}
                onClick={() => { setRoleFilter(f.value); setProgramFilter(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  roleFilter === f.value
                    ? 'bg-teal text-void border-teal'
                    : 'bg-surface border-border text-ink-secondary hover:border-teal/40 hover:text-teal'
                }`}
              >
                {language === 'en' ? f.label : f.labelTH}
              </button>
            ))}
          </div>
        </div>

        {/* Program filters */}
        {showProgramFilter && (
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setProgramFilter('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  programFilter === ''
                    ? 'bg-ink-primary text-void border-ink-primary'
                    : 'bg-surface border-border text-ink-secondary hover:text-ink-primary hover:border-border'
                }`}
              >
                {language === 'en' ? 'All Programs' : 'ทุกหลักสูตร'}
              </button>
              {programList.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProgramFilter(programFilter === p.id ? '' : p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    programFilter === p.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={programFilter === p.id
                    ? { background: p.color, color: '#fff', borderColor: p.color }
                    : { background: `${p.color}12`, color: p.color, borderColor: `${p.color}40` }
                  }
                >
                  {language === 'en' ? p.label : p.labelTH}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Staff grid */}
        <div className="max-w-7xl mx-auto px-6">
          {active.length === 0 ? (
            <div className="text-center py-24 text-ink-muted">No staff found.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {active.map(member => {
                const name       = language === 'en' ? member.name : member.nameTH;
                const title      = language === 'en' ? member.title : member.titleTH;
                const roleColor  = roleColors[member.role];
                const badgeLabel = getRoleBadge(member.role, member.title, language);
                const expertise  = language === 'en' ? member.expertise : member.expertiseTH;
                const memberPrograms = (programMembership[member.id] ?? [])
                  .map(pid => programList.find(p => p.id === pid))
                  .filter(Boolean) as typeof programList;

                return (
                  <button
                    key={member.id}
                    onClick={() => setSelected(member)}
                    className="w-full glass-card rounded-2xl p-5 gradient-border group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover flex flex-col items-center text-center cursor-pointer"
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 transition-all duration-300"
                      style={{ boxShadow: `0 0 0 2px #1A2D4A` }}>
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 0 2px ${roleColor}` }} />
                      <Image src={member.photo} alt={name} fill className="object-cover" unoptimized />
                    </div>

                    <span
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider mb-2"
                      style={{ color: roleColor, borderColor: `${roleColor}30`, background: `${roleColor}10` }}
                    >
                      {badgeLabel}
                    </span>
                    <h3 className="font-syne font-bold text-sm text-ink-primary leading-snug mb-1 line-clamp-2 group-hover:text-teal transition-colors">
                      {name}
                    </h3>
                    <p className="text-ink-muted text-xs leading-snug line-clamp-2 mb-3">{title}</p>

                    {/* Program tags */}
                    {memberPrograms.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mb-2">
                        {memberPrograms.map(p => (
                          <span key={p.id}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded"
                            style={{ color: p.color, background: `${p.color}18` }}
                          >
                            {language === 'en' ? p.label : p.labelTH}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {expertise.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-border/60 text-ink-muted border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-teal text-[10px] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'en' ? 'View profile' : 'ดูโปรไฟล์'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
      {selected && <StaffModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
