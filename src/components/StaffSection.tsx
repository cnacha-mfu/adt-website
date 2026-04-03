'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StaffMember, StaffRole } from '@/lib/types';
import { HiArrowRight } from 'react-icons/hi';
import ScrollReveal from './ScrollReveal';
import StaffModal from './StaffModal';

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
  if (role === 'faculty')    return language === 'en' ? 'Faculty'    : 'คณาจารย์';
  if (role === 'researcher') return language === 'en' ? 'Researcher' : 'นักวิจัย';
  if (role === 'secretary')  return language === 'en' ? 'Secretary'  : 'เลขานุการ';
  return language === 'en' ? 'Technical Staff' : 'นักวิชาการคอมพิวเตอร์';
}

function StaffCard({ member, delay = 0, onClick }: { member: StaffMember; delay?: number; onClick: () => void }) {
  const { language } = useApp();
  const roleColor = roleColors[member.role];
  const badgeLabel = getRoleBadge(member.role, member.title, language);
  const name = language === 'en' ? member.name : member.nameTH;
  const title = language === 'en' ? member.title : member.titleTH;

  return (
    <ScrollReveal delay={delay} direction="up">
      <button
        onClick={onClick}
        className="w-full glass-card rounded-2xl p-6 gradient-border group hover:-translate-y-2 transition-all duration-300 hover:shadow-card-hover flex flex-col items-center text-center h-full cursor-pointer"
      >
        {/* Glowing ring + photo */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-5 transition-all duration-300"
          style={{ boxShadow: `0 0 0 2px #1A2D4A` }}>
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 0 2px ${roleColor}` }}
          />
          <Image src={member.photo} alt={name} fill className="object-cover" unoptimized />
        </div>

        {/* Role badge */}
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider mb-3"
          style={{ color: roleColor, borderColor: `${roleColor}30`, background: `${roleColor}10` }}
        >
          {badgeLabel}
        </span>

        <h3 className="font-syne font-bold text-sm text-ink-primary mb-1.5 leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-ink-muted text-xs leading-snug line-clamp-2 mb-4">{title}</p>

        {/* Expertise */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-4 flex-1">
          {(language === 'en' ? member.expertise : member.expertiseTH).slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-border/60 text-ink-muted border border-border/50">
              {tag}
            </span>
          ))}
        </div>

        {/* Tap hint */}
        <span className="text-teal text-[10px] font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 mt-auto">
          {language === 'en' ? 'View profile' : 'ดูโปรไฟล์'}
        </span>
      </button>
    </ScrollReveal>
  );
}

export default function StaffSection() {
  const { data, language } = useApp();
  const [selected, setSelected] = useState<StaffMember | null>(null);

  const active = data.staff.filter(s => s.active).sort((a, b) => a.order - b.order).slice(0, 6);

  if (!active.length) return null;

  return (
    <section id="staff" className="py-20 bg-deep relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal/3 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <ScrollReveal className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-0.5 bg-teal" />
              <span className="text-teal text-xs font-medium tracking-widest uppercase">
                {language === 'en' ? 'Our People' : 'บุคลากรของเรา'}
              </span>
            </div>
            <h2 className="font-syne font-bold text-3xl lg:text-4xl text-ink-primary pb-1">
              {language === 'en' ? 'Faculty & Staff' : 'คณาจารย์และบุคลากร'}
            </h2>
          </div>
          <Link href="/staff" className="hidden md:flex items-center gap-2 text-teal text-sm font-medium hover:gap-3 transition-all group">
            {language === 'en' ? 'View all' : 'ดูทั้งหมด'}
            <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {active.map((member, i) => (
            <StaffCard key={member.id} member={member} delay={i * 70} onClick={() => setSelected(member)} />
          ))}
        </div>
      </div>

      {selected && <StaffModal member={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
