'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import ScrollReveal from './ScrollReveal';
import {
  MdOutlineWifi, MdMemory, MdOutlineTrendingUp,
  MdOutlineCode, MdOutlineMovieFilter,
  MdOutlineAutoAwesome, MdOutlineEngineering, MdOutlineScience,
} from 'react-icons/md';
import { HiArrowRight, HiX, HiChevronLeft, HiChevronRight, HiPhotograph } from 'react-icons/hi';

interface GalleryImage { id: string; url: string; caption: string; }

type Level = 'undergrad' | 'grad';

const programs = {
  undergrad: [
    {
      id: 'digital-engineering',
      icon: MdOutlineWifi,
      degree: 'B.Eng.',
      years: 4,
      name: 'Digital Engineering & Communications',
      nameTH: 'วิศวกรรมดิจิทัลและการสื่อสาร',
      desc: 'Design and develop digital communication systems, networks, and modern telecommunications infrastructure.',
      descTH: 'ออกแบบและพัฒนาระบบการสื่อสารดิจิทัล เครือข่าย และโครงสร้างพื้นฐานโทรคมนาคมสมัยใหม่',
      color: '#9B111E',
    },
    {
      id: 'computer-engineering-beng',
      icon: MdMemory,
      degree: 'B.Eng.',
      years: 4,
      name: 'Computer Engineering',
      nameTH: 'วิศวกรรมคอมพิวเตอร์',
      desc: 'Hardware-software integration, embedded systems, and the engineering principles behind modern computing.',
      descTH: 'การรวมฮาร์ดแวร์และซอฟต์แวร์ ระบบฝังตัว และหลักวิศวกรรมเบื้องหลังการประมวลผลสมัยใหม่',
      color: '#EF4444',
    },
    {
      id: 'digital-business',
      icon: MdOutlineTrendingUp,
      degree: 'B.Sc.',
      years: 4,
      name: 'Digital Technology for Business Innovation',
      nameTH: 'เทคโนโลยีดิจิทัลเพื่อนวัตกรรมทางธุรกิจ',
      desc: 'Apply digital tools to solve business challenges, drive innovation, and create competitive advantage.',
      descTH: 'ประยุกต์เครื่องมือดิจิทัลแก้ปัญหาธุรกิจ ขับเคลื่อนนวัตกรรม และสร้างความได้เปรียบเชิงแข่งขัน',
      color: '#8B5CF6',
    },
    {
      id: 'software-engineering',
      icon: MdOutlineCode,
      degree: 'B.Eng.',
      years: 4,
      name: 'Software Engineering',
      nameTH: 'วิศวกรรมซอฟต์แวร์',
      desc: 'Systematic design, development, testing, and maintenance of large-scale software systems.',
      descTH: 'การออกแบบ พัฒนา ทดสอบ และบำรุงรักษาระบบซอฟต์แวร์ขนาดใหญ่อย่างเป็นระบบ',
      color: '#22C55E',
    },
    {
      id: 'multimedia',
      icon: MdOutlineMovieFilter,
      degree: 'B.Sc.',
      years: 4,
      name: 'Multimedia Technology & Animation',
      nameTH: 'เทคโนโลยีมัลติมีเดียและการสร้างภาพเคลื่อนไหว',
      desc: 'Creative digital media production, 2D/3D animation, motion graphics, and interactive design.',
      descTH: 'การผลิตสื่อดิจิทัลเชิงสร้างสรรค์ แอนิเมชัน 2D/3D กราฟิกเคลื่อนไหว และการออกแบบโต้ตอบ',
      color: '#F97316',
    },
  ],
  grad: [
    {
      id: 'digital-transformation-msc',
      icon: MdOutlineAutoAwesome,
      degree: 'M.Sc.',
      years: 2,
      name: 'Digital Transformation Technology',
      nameTH: 'เทคโนโลยีการแปลงเป็นดิจิทัล',
      desc: 'Advanced strategies for enterprise digital transformation, cloud ecosystems, AI integration, and data-driven decision making.',
      descTH: 'กลยุทธ์ขั้นสูงสำหรับการแปลงองค์กรสู่ดิจิทัล ระบบคลาวด์ การบูรณาการ AI และการตัดสินใจเชิงข้อมูล',
      color: '#0CC8D4',
    },
    {
      id: 'computer-engineering-meng',
      icon: MdOutlineEngineering,
      degree: 'M.Eng.',
      years: 2,
      name: 'Computer Engineering',
      nameTH: 'วิศวกรรมคอมพิวเตอร์',
      desc: 'Research-driven mastery of advanced computer architecture, parallel computing, and intelligent systems.',
      descTH: 'การวิจัยเชิงลึกด้านสถาปัตยกรรมคอมพิวเตอร์ขั้นสูง การประมวลผลแบบขนาน และระบบอัจฉริยะ',
      color: '#EF4444',
    },
    {
      id: 'computer-engineering-phd',
      icon: MdOutlineScience,
      degree: 'Ph.D.',
      years: 3,
      name: 'Computer Engineering',
      nameTH: 'วิศวกรรมคอมพิวเตอร์',
      desc: 'Original doctoral research at the frontier of computing, pushing boundaries in AI, systems, and emerging technologies.',
      descTH: 'การวิจัยระดับปริญญาเอกในแนวหน้าของการประมวลผล AI ระบบ และเทคโนโลยีเกิดใหม่',
      color: '#EF4444',
    },
  ],
};

export default function ProgramsSection() {
  const { language, data } = useApp();
  const [active, setActive] = useState<Level>('undergrad');
  const [galleryProgram, setGalleryProgram] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const openGallery = async (programId: string) => {
    setGalleryLoading(true);
    setGalleryProgram(programId);
    setGalleryIndex(0);
    const res = await fetch(`/api/program-gallery/${programId}`);
    const { images } = await res.json();
    setGalleryImages(images ?? []);
    setGalleryLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = galleryProgram ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [galleryProgram]);

  const list = programs[active];

  return (
    <section id="programs" className="py-20 bg-void relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Header */}
        <ScrollReveal className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Education' : 'การศึกษา'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-syne font-bold text-3xl lg:text-4xl text-ink-primary pb-1">
                {language === 'en' ? 'Degree Programs' : 'หลักสูตร'}
              </h2>
              <p className="text-ink-secondary mt-2 text-sm">
                {language === 'en'
                  ? '8 programs across undergraduate and graduate levels'
                  : '8 หลักสูตร ระดับปริญญาตรีและบัณฑิตศึกษา'
                }
              </p>
            </div>

            {/* Tab toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border self-start sm:self-auto">
              {(['undergrad', 'grad'] as Level[]).map(level => (
                <button
                  key={level}
                  onClick={() => setActive(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === level
                      ? 'bg-teal text-void shadow-teal-glow'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {level === 'undergrad'
                    ? (language === 'en' ? 'Undergraduate' : 'ปริญญาตรี')
                    : (language === 'en' ? 'Graduate' : 'บัณฑิตศึกษา')
                  }
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Program cards */}
        <div className={`grid gap-5 ${active === 'undergrad' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {list.map((prog, i) => (
            <ScrollReveal key={`${active}-${i}`} delay={i * 60} direction="up">
              <div className="glass-card rounded-2xl overflow-hidden gradient-border group hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">

                {/* Cover image (if set) */}
                {data.programImages?.[prog.id] && (
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={data.programImages[prog.id]}
                      alt={prog.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                {/* Icon + meta */}
                <div className="flex items-start gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${prog.color}15`, color: prog.color }}
                  >
                    <prog.icon size={22} />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ color: prog.color, background: `${prog.color}15` }}
                    >
                      {prog.degree}
                    </span>
                    <p className="text-ink-muted text-[10px] mt-0.5">
                      {prog.years} {language === 'en' ? 'years' : 'ปี'}
                    </p>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-syne font-bold text-base mb-1.5 leading-snug transition-colors" style={{ color: prog.color }}>
                  {language === 'en' ? prog.name : prog.nameTH}
                </h3>

                {/* Description */}
                <p className="text-ink-secondary text-sm leading-relaxed flex-1">
                  {language === 'en' ? prog.desc : prog.descTH}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 hover:gap-2.5 group/link"
                    style={{ color: prog.color }}
                  >
                    {language === 'en' ? 'Learn more' : 'ดูรายละเอียด'}
                    <HiArrowRight size={11} className="transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal className="mt-10 flex justify-center" delay={100}>
          <a
            href="https://adt.mfu.ac.th/it-course/it-bachelor/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-border bg-surface/50 hover:border-teal/40 hover:bg-teal/5 text-ink-primary font-semibold px-8 py-3 rounded-xl transition-all duration-300 text-sm group"
          >
            {language === 'en' ? 'All programs on official site' : 'หลักสูตรทั้งหมดบนเว็บไซต์ทางการ'}
            <HiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </ScrollReveal>

      </div>

      {/* Gallery lightbox */}
      {galleryProgram && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md"
          onClick={() => setGalleryProgram(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col glass-card rounded-3xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <p className="font-syne font-semibold text-sm text-ink-primary">
                {(() => {
                  const all = [...programs.undergrad, ...programs.grad];
                  const p = all.find(x => x.id === galleryProgram);
                  return language === 'en' ? p?.name : p?.nameTH;
                })()}
              </p>
              <div className="flex items-center gap-3">
                {galleryImages.length > 0 && (
                  <span className="text-ink-muted text-xs">{galleryIndex + 1} / {galleryImages.length}</span>
                )}
                <button onClick={() => setGalleryProgram(null)} className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-ink-muted hover:text-ink-primary transition-colors">
                  <HiX size={14} />
                </button>
              </div>
            </div>

            {/* Image area */}
            <div className="relative flex-1 min-h-0 bg-void" style={{ height: '60vh' }}>
              {galleryLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-muted gap-2">
                  <HiPhotograph size={40} />
                  <p className="text-sm">{language === 'en' ? 'No photos yet' : 'ยังไม่มีรูปภาพ'}</p>
                </div>
              ) : (
                <>
                  <Image
                    src={galleryImages[galleryIndex].url}
                    alt={galleryImages[galleryIndex].caption || ''}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setGalleryIndex(i => (i - 1 + galleryImages.length) % galleryImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-void/70 backdrop-blur-sm border border-border flex items-center justify-center text-ink-primary hover:text-teal transition-colors"
                      >
                        <HiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setGalleryIndex(i => (i + 1) % galleryImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-void/70 backdrop-blur-sm border border-border flex items-center justify-center text-ink-primary hover:text-teal transition-colors"
                      >
                        <HiChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto shrink-0 border-t border-border">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setGalleryIndex(i)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${i === galleryIndex ? 'ring-2 ring-teal' : 'opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
