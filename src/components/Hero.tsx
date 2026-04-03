'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedGrid from './AnimatedGrid';
import { useApp } from '@/context/AppContext';
import { Highlight, HighlightType } from '@/lib/types';
import { HiArrowRight, HiChevronDown, HiChevronLeft, HiChevronRight, HiExternalLink, HiX } from 'react-icons/hi';
import { BsMegaphoneFill, BsTrophyFill, BsCalendarEventFill, BsStarFill } from 'react-icons/bs';
import { format } from 'date-fns';

const typeConfig: Record<HighlightType, { label: string; labelTH: string; color: string; Icon: React.ElementType }> = {
  event:        { label: 'Event',        labelTH: 'กิจกรรม',    color: '#0CC8D4', Icon: BsCalendarEventFill },
  celebration:  { label: 'Celebration',  labelTH: 'เฉลิมฉลอง', color: '#F5A623', Icon: BsStarFill },
  achievement:  { label: 'Achievement',  labelTH: 'ความสำเร็จ', color: '#22EBF8', Icon: BsTrophyFill },
  announcement: { label: 'Announcement', labelTH: 'ประกาศ',     color: '#A78BFA', Icon: BsMegaphoneFill },
};

export default function Hero() {
  const { data, language } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const active = data.highlights.filter(h => h.active).sort((a, b) => a.order - b.order);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedHighlight ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedHighlight]);

  const go = useCallback((idx: number) => {
    if (transitioning || active.length <= 1) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(((idx % active.length) + active.length) % active.length);
      setTransitioning(false);
    }, 250);
  }, [active.length, transitioning]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(id);
  }, [current, active.length, go]);

  /* Parallax */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (gridRef.current) gridRef.current.style.transform = `translateY(${y * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Staggered entrance */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-animate]');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(28px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 180 + i * 130);
    });
  }, []);

  const item = active[current];
  const cfg = item ? typeConfig[item.type] : null;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      {/* Parallax background */}
      <div ref={gridRef} className="absolute inset-0 will-change-transform">
        <AnimatedGrid />
      </div>

      {/* Colour washes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-void to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <div>
            <div data-animate className="mb-2">
              <Image
                src={isLight ? '/logo-blue.png' : '/logo-light.png'}
                alt="ADT Logo"
                width={120}
                height={120}
                className="object-contain w-auto h-20 sm:h-24"
              />
            </div>

            <h1 data-animate className="font-bebas text-5xl sm:text-6xl lg:text-7xl leading-[0.92] uppercase mb-4">
              <span className="block text-ink-primary">School of</span>
              <span className="block shimmer-text teal-glow">Applied Digital</span>
              <span className="block text-ink-primary">Technology</span>
            </h1>

            <p data-animate className="font-syne text-gold text-base font-semibold mb-3 tracking-wide">
              สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์
            </p>

            <p data-animate className="text-ink-secondary text-base leading-relaxed max-w-lg mb-8">
              {language === 'en'
                ? "Shaping tomorrow's digital innovators through cutting-edge research, industry partnerships, and transformative education."
                : 'สร้างนวัตกรรมดิจิทัลแห่งอนาคตผ่านการวิจัยล้ำสมัย ความร่วมมือกับอุตสาหกรรม และการศึกษาที่เปลี่ยนแปลงชีวิต'
              }
            </p>

            <div data-animate className="flex flex-wrap gap-4 mb-5">
              <Link
                href="/#programs"
                className="group flex items-center gap-2 bg-teal text-void font-semibold px-7 py-3.5 rounded-xl hover:bg-teal-bright transition-all duration-300 shadow-teal-glow hover:shadow-[0_0_50px_rgba(12,200,212,0.55)] text-sm"
              >
                {language === 'en' ? 'Explore Programs' : 'สำรวจหลักสูตร'}
                <HiArrowRight className="transition-transform group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-2 border border-border bg-surface/50 hover:border-teal/40 hover:bg-teal/5 text-ink-primary font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 text-sm"
              >
                {language === 'en' ? 'Latest News' : 'ข่าวล่าสุด'}
              </Link>
            </div>
            <div data-animate>
              <a href="#" className="inline-flex items-center gap-1.5 text-gold text-sm font-medium hover:gap-3 transition-all group/apply">
                {language === 'en' ? 'Apply for 2025 intake' : 'สมัครเรียนปีการศึกษา 2568'}
                <HiArrowRight size={13} className="transition-transform group-hover/apply:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* ── Right: Highlight Carousel ── */}
          {item && cfg && (
            <div data-animate className="relative px-5">
              {/* Card */}
              <div
                className="glass-card rounded-3xl overflow-hidden gradient-border cursor-pointer group/card"
                style={{ transition: 'opacity 0.25s ease', opacity: transitioning ? 0 : 1 }}
                onClick={() => setSelectedHighlight(item)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={language === 'en' ? item.title : item.titleTH}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  {/* Type badge */}
                  <div
                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                    style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                  >
                    <cfg.Icon size={10} />
                    {language === 'en' ? cfg.label : cfg.labelTH}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="font-syne font-bold text-lg text-ink-primary mb-2 leading-snug line-clamp-2">
                    {language === 'en' ? item.title : item.titleTH}
                  </h3>
                  <p className="text-ink-secondary text-sm leading-relaxed line-clamp-2 mb-4">
                    {language === 'en' ? item.description : item.descriptionTH}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted text-xs">
                      {item.startDate && format(new Date(item.startDate), 'MMM d, yyyy')}
                      {item.endDate && ` — ${format(new Date(item.endDate), 'MMM d, yyyy')}`}
                    </span>
                    {item.ctaUrl && (
                      <a
                        href={item.ctaUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                        style={{ color: cfg.color }}
                      >
                        {language === 'en' ? (item.ctaText || 'Details') : (item.ctaTextTH || 'รายละเอียด')}
                        <HiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Prev / Next */}
              {active.length > 1 && (
                <>
                  <button
                    onClick={() => go(current - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-ink-muted hover:text-teal hover:border-teal/40 transition-all shadow-lg"
                    aria-label="Previous"
                  >
                    <HiChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => go(current + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-ink-muted hover:text-teal hover:border-teal/40 transition-all shadow-lg"
                    aria-label="Next"
                  >
                    <HiChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Dots */}
              {active.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                  {active.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Go to highlight ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-6 h-2 bg-teal shadow-[0_0_6px_rgba(12,200,212,0.6)]'
                          : 'w-2 h-2 bg-border hover:bg-ink-muted'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-ink-muted hover:text-teal transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <HiChevronDown size={20} className="animate-bounce group-hover:text-teal" />
      </button>

      {/* Highlight Modal */}
      {selectedHighlight && (() => {
        const modalCfg = typeConfig[selectedHighlight.type];
        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setSelectedHighlight(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-void/80 backdrop-blur-md" />

            {/* Panel */}
            <div
              className="relative z-10 glass-card rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Big image */}
              <div className="relative h-64 sm:h-80 shrink-0">
                <Image
                  src={selectedHighlight.image}
                  alt={language === 'en' ? selectedHighlight.title : selectedHighlight.titleTH}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/10 to-transparent" />

                {/* Type badge */}
                <div
                  className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                  style={{ background: `${modalCfg.color}25`, color: modalCfg.color, border: `1px solid ${modalCfg.color}50` }}
                >
                  <modalCfg.Icon size={10} />
                  {language === 'en' ? modalCfg.label : modalCfg.labelTH}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedHighlight(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-void/60 backdrop-blur-sm border border-border flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-void/80 transition-all"
                  aria-label="Close"
                >
                  <HiX size={16} />
                </button>
              </div>

              {/* Details */}
              <div className="p-7 overflow-y-auto">
                <p className="text-ink-muted text-xs mb-3">
                  {selectedHighlight.startDate && format(new Date(selectedHighlight.startDate), 'MMMM d, yyyy')}
                  {selectedHighlight.endDate && ` — ${format(new Date(selectedHighlight.endDate), 'MMMM d, yyyy')}`}
                </p>

                <h2 className="font-syne font-bold text-xl sm:text-2xl text-ink-primary leading-snug mb-4 pb-1">
                  {language === 'en' ? selectedHighlight.title : selectedHighlight.titleTH}
                </h2>

                <p className="text-ink-secondary text-sm leading-relaxed mb-6">
                  {language === 'en' ? selectedHighlight.description : selectedHighlight.descriptionTH}
                </p>

                {selectedHighlight.ctaUrl && selectedHighlight.ctaUrl !== '#' && (
                  <a
                    href={selectedHighlight.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:gap-3"
                    style={{
                      background: `${modalCfg.color}15`,
                      color: modalCfg.color,
                      border: `1px solid ${modalCfg.color}40`,
                    }}
                  >
                    {language === 'en' ? (selectedHighlight.ctaText || 'Learn More') : (selectedHighlight.ctaTextTH || 'รายละเอียด')}
                    <HiExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
