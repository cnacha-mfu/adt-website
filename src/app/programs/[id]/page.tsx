'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import type { ProgramData } from '@/lib/programs-data';
import {
  MdOutlineWifi, MdMemory, MdOutlineTrendingUp,
  MdOutlineCode, MdOutlineMovieFilter,
  MdOutlineAutoAwesome, MdOutlineEngineering, MdOutlineScience,
} from 'react-icons/md';
import Image from 'next/image';
import {
  HiArrowLeft, HiArrowRight, HiExternalLink,
  HiAcademicCap, HiBriefcase, HiBookOpen, HiSparkles,
  HiCurrencyDollar, HiPhotograph, HiX, HiChevronLeft, HiChevronRight,
} from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal';

const iconMap: Record<string, React.ElementType> = {
  'digital-engineering':          MdOutlineWifi,
  'computer-engineering-beng':    MdMemory,
  'digital-business':             MdOutlineTrendingUp,
  'software-engineering':         MdOutlineCode,
  'multimedia':                   MdOutlineMovieFilter,
  'digital-transformation-msc':   MdOutlineAutoAwesome,
  'computer-engineering-meng':    MdOutlineEngineering,
  'computer-engineering-phd':     MdOutlineScience,
};

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useApp();

  const [program, setProgram] = useState<ProgramData | null>(null);
  const [otherPrograms, setOtherPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/programs/${id}`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch('/api/programs').then(r => r.json()),
      fetch(`/api/program-gallery/${id}`).then(r => r.ok ? r.json() : { images: [] }),
    ])
      .then(([detail, all, gallery]) => {
        const prog: ProgramData = detail.program;
        const allProgs: ProgramData[] = all.programs ?? [];
        setProgram(prog);
        setOtherPrograms(
          allProgs.filter(p => p.level === prog.level && p.id !== prog.id).slice(0, 3)
        );
        setGalleryImages(gallery.images ?? []);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? Math.min(i + 1, galleryImages.length - 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, galleryImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink-secondary text-sm">Loading program...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !program) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink-muted text-lg mb-4">Program not found.</p>
            <Link href="/#programs" className="text-teal hover:underline text-sm">
              Back to Programs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[program.id] ?? HiAcademicCap;
  const isGrad = program.level === 'grad';

  return (
    <div className="min-h-screen bg-void">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: program.color }}
        />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-ink-muted text-xs mb-8">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#programs" className="hover:text-teal transition-colors">Programs</Link>
            <span>/</span>
            <span className="text-ink-secondary">{language === 'en' ? program.name : program.nameTH}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${program.color}18`, color: program.color }}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                    style={{ color: program.color, background: `${program.color}18` }}
                  >
                    {program.degree}
                  </span>
                  <p className="text-ink-muted text-xs mt-1">
                    {program.years} {language === 'en' ? 'years' : 'ปี'} &nbsp;·&nbsp; {program.credits} {language === 'en' ? 'credits' : 'หน่วยกิต'}
                    &nbsp;·&nbsp;
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{ color: program.color, background: `${program.color}15` }}
                    >
                      {isGrad
                        ? (language === 'en' ? 'Graduate' : 'บัณฑิตศึกษา')
                        : (language === 'en' ? 'Undergraduate' : 'ปริญญาตรี')
                      }
                    </span>
                  </p>
                </div>
              </div>

              <h1 className="font-bebas text-5xl lg:text-6xl text-ink-primary leading-[0.95] uppercase mb-3">
                {language === 'en' ? program.name : program.nameTH}
              </h1>
              <p className="font-syne text-sm mb-6" style={{ color: program.color }}>
                {language === 'en' ? program.degreeFullEN : program.degreeFullTH}
              </p>
              <p className="text-ink-secondary text-base leading-relaxed mb-8">
                {language === 'en' ? program.description : program.descriptionTH}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={program.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-void transition-all hover:shadow-lg"
                  style={{ background: program.color }}
                >
                  {language === 'en' ? 'View Official Page' : 'หน้าหลักสูตรทางการ'}
                  <HiExternalLink size={14} />
                </a>
                <Link
                  href="/#programs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface/50 hover:border-teal/40 hover:bg-teal/5 text-ink-primary font-semibold text-sm transition-all"
                >
                  <HiArrowLeft size={14} />
                  {language === 'en' ? 'All Programs' : 'หลักสูตรทั้งหมด'}
                </Link>
              </div>
            </div>

            {/* Right — Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: HiAcademicCap,
                  label: language === 'en' ? 'Degree' : 'ปริญญา',
                  value: program.degree,
                },
                {
                  icon: HiBookOpen,
                  label: language === 'en' ? 'Duration' : 'ระยะเวลา',
                  value: `${program.years} ${language === 'en' ? 'years' : 'ปี'}`,
                },
                {
                  icon: HiSparkles,
                  label: language === 'en' ? 'Credits' : 'หน่วยกิต',
                  value: `${program.credits} ${language === 'en' ? 'credits' : 'หน่วยกิต'}`,
                },
                {
                  icon: HiCurrencyDollar,
                  label: language === 'en' ? 'Tuition/semester' : 'ค่าเล่าเรียน/เทอม',
                  value: program.feesPerSemester,
                },
              ].map(({ icon: StatIcon, label, value }) => (
                <div key={label} className="glass-card rounded-2xl p-5 gradient-border">
                  <StatIcon className="mb-2 opacity-70" style={{ color: program.color }} size={20} />
                  <p className="text-ink-muted text-xs mb-0.5">{label}</p>
                  <p className="font-syne font-bold text-ink-primary text-base">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="py-16 bg-deep/30">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <HiBriefcase style={{ color: program.color }} size={18} />
              <h2 className="font-syne font-bold text-2xl text-ink-primary">
                {language === 'en' ? 'Career Outcomes' : 'อาชีพที่รองรับ'}
              </h2>
            </div>
            <p className="text-ink-secondary text-sm">
              {language === 'en'
                ? 'Graduates are prepared for the following roles and more'
                : 'บัณฑิตพร้อมสู่บทบาทต่าง ๆ ดังต่อไปนี้'
              }
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {program.careers.map((career, i) => (
              <ScrollReveal key={i} delay={i * 50} direction="up">
                <div
                  className="glass-card rounded-xl p-4 gradient-border flex items-center gap-3"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: program.color }}
                  />
                  <div>
                    <p className="text-ink-primary text-sm font-medium">
                      {language === 'en' ? career.en : career.th}
                    </p>
                    {language === 'en' && (
                      <p className="text-ink-muted text-xs">{career.th}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Curriculum structure */}
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <HiBookOpen style={{ color: program.color }} size={18} />
                <h2 className="font-syne font-bold text-2xl text-ink-primary">
                  {language === 'en' ? 'Curriculum Structure' : 'โครงสร้างหลักสูตร'}
                </h2>
              </div>
              <div className="space-y-3">
                {program.curriculumStructure.map((item, i) => (
                  <div key={i} className="glass-card rounded-xl px-5 py-4 gradient-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-ink-primary text-sm font-medium">
                        {language === 'en' ? item.label : item.labelTH}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ color: program.color, background: `${program.color}15` }}
                      >
                        {item.credits} {language === 'en' ? 'cr.' : 'หน่วยกิต'}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.round((item.credits / program.credits) * 100)}%`,
                          background: program.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="text-ink-muted text-xs text-right mt-2">
                  {language === 'en' ? `Total: ${program.credits} credits` : `รวม ${program.credits} หน่วยกิต`}
                </div>
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal delay={100}>
              <div className="flex items-center gap-3 mb-6">
                <HiSparkles style={{ color: program.color }} size={18} />
                <h2 className="font-syne font-bold text-2xl text-ink-primary">
                  {language === 'en' ? 'Program Highlights' : 'จุดเด่นของหลักสูตร'}
                </h2>
              </div>
              <ul className="space-y-4">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${program.color}20`, color: program.color }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-ink-secondary text-sm leading-relaxed">{feature}</p>
                  </li>
                ))}
              </ul>

              {/* Fees card */}
              <div
                className="mt-8 rounded-2xl p-5 border"
                style={{ background: `${program.color}08`, borderColor: `${program.color}30` }}
              >
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: program.color }}>
                  {language === 'en' ? 'Tuition Fees' : 'ค่าเล่าเรียน'}
                </p>
                <p className="font-syne font-bold text-2xl text-ink-primary">{program.feesPerSemester}</p>
                <p className="text-ink-muted text-xs mt-0.5">
                  {language === 'en' ? `per semester · Total ${program.fees}` : `ต่อเทอม · รวม ${program.fees}`}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-deep/30">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <HiPhotograph style={{ color: program.color }} size={18} />
                <h2 className="font-syne font-bold text-2xl text-ink-primary">
                  {language === 'en' ? 'Learning Atmosphere' : 'บรรยากาศการเรียน'}
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <ScrollReveal key={img.id} delay={i * 40} direction="up">
                  <button
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-video w-full rounded-xl overflow-hidden group focus:outline-none"
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-void/0 group-hover:bg-void/30 transition-colors duration-300" />
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-void/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={e => { e.stopPropagation(); setLightboxIndex(null); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center text-ink-primary hover:text-teal transition-colors"
          >
            <HiX size={20} />
          </button>
          {lightboxIndex > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i !== null ? i - 1 : null); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center text-ink-primary hover:text-teal transition-colors"
            >
              <HiChevronLeft size={22} />
            </button>
          )}
          {lightboxIndex < galleryImages.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i !== null ? i + 1 : null); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center text-ink-primary hover:text-teal transition-colors"
            >
              <HiChevronRight size={22} />
            </button>
          )}
          <div
            className="relative w-full max-w-4xl mx-16 aspect-video rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex].url}
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="absolute bottom-4 text-ink-muted text-xs">
            {lightboxIndex + 1} / {galleryImages.length}
          </p>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-deep/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-bebas text-4xl lg:text-5xl text-ink-primary uppercase mb-3">
              {language === 'en' ? 'Ready to apply?' : 'พร้อมสมัครแล้วหรือยัง?'}
            </h2>
            <p className="text-ink-secondary text-sm mb-8">
              {language === 'en'
                ? 'Visit the official ADT program page for admission requirements and application details.'
                : 'เยี่ยมชมหน้าหลักสูตรอย่างเป็นทางการของ ADT สำหรับเงื่อนไขและรายละเอียดการสมัคร'
              }
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={program.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-void transition-all hover:shadow-lg"
                style={{ background: program.color }}
              >
                {language === 'en' ? 'View Full Curriculum' : 'ดูหลักสูตรฉบับเต็ม'}
                <HiExternalLink size={14} />
              </a>
              <a
                href="https://www.mfu.ac.th/admission/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-surface/50 hover:border-teal/40 hover:bg-teal/5 text-ink-primary font-semibold text-sm transition-all"
              >
                {language === 'en' ? 'Apply via MFU Admissions' : 'สมัครผ่าน MFU'}
                <HiArrowRight size={14} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related programs */}
      {otherPrograms.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal className="mb-8">
              <h2 className="font-syne font-bold text-xl text-ink-primary">
                {language === 'en'
                  ? `Other ${isGrad ? 'Graduate' : 'Undergraduate'} Programs`
                  : `หลักสูตร${isGrad ? 'บัณฑิตศึกษา' : 'ปริญญาตรี'}อื่น ๆ`
                }
              </h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherPrograms.map((p, i) => {
                const PIcon = iconMap[p.id] ?? HiAcademicCap;
                return (
                  <ScrollReveal key={p.id} delay={i * 60}>
                    <Link
                      href={`/programs/${p.id}`}
                      className="glass-card rounded-2xl p-5 gradient-border flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${p.color}18`, color: p.color }}
                      >
                        <PIcon size={20} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: p.color }}
                        >
                          {p.degree}
                        </span>
                        <p className="font-syne font-bold text-sm text-ink-primary group-hover:text-teal transition-colors leading-snug mt-0.5">
                          {language === 'en' ? p.name : p.nameTH}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
