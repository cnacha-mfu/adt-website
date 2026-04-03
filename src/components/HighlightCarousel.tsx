'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Highlight, HighlightType } from '@/lib/types';
import { HiChevronLeft, HiChevronRight, HiExternalLink } from 'react-icons/hi';
import { BsMegaphoneFill, BsTrophyFill, BsCalendarEventFill, BsStarFill } from 'react-icons/bs';
import { format } from 'date-fns';
import ScrollReveal from './ScrollReveal';

const typeConfig: Record<HighlightType, { label: string; labelTH: string; color: string; Icon: React.ElementType }> = {
  event:        { label: 'Event',        labelTH: 'กิจกรรม',   color: '#0CC8D4', Icon: BsCalendarEventFill },
  celebration:  { label: 'Celebration',  labelTH: 'เฉลิมฉลอง', color: '#F5A623', Icon: BsStarFill },
  achievement:  { label: 'Achievement',  labelTH: 'ความสำเร็จ', color: '#22EBF8', Icon: BsTrophyFill },
  announcement: { label: 'Announcement', labelTH: 'ประกาศ',    color: '#A78BFA', Icon: BsMegaphoneFill },
};

export default function HighlightCarousel() {
  const { data, language } = useApp();
  const active = data.highlights.filter(h => h.active).sort((a, b) => a.order - b.order);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(((idx % active.length) + active.length) % active.length);
      setTransitioning(false);
    }, 300);
  }, [active.length, transitioning]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(id);
  }, [current, active.length, go]);

  if (!active.length) return null;

  const item = active[current];
  const cfg = typeConfig[item.type];

  return (
    <section className="py-20 bg-deep relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <ScrollReveal className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Highlights' : 'ไฮไลต์'}
            </span>
          </div>
          <h2 className="font-syne font-bold text-3xl lg:text-4xl text-ink-primary pb-1">
            {language === 'en' ? "What's Happening" : 'ข่าวสารและกิจกรรม'}
          </h2>
        </ScrollReveal>

        {/* Carousel */}
        <ScrollReveal delay={100}>
          <div className="relative rounded-3xl overflow-hidden glass-card gradient-border min-h-[420px] flex flex-col lg:flex-row">
            {/* Image panel */}
            <div className="relative lg:w-1/2 min-h-[240px] lg:min-h-full overflow-hidden">
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ opacity: transitioning ? 0 : 1 }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover opacity-70 scale-105 hover:scale-100 transition-transform duration-700"
                  unoptimized
                />
                {/* Colour tint matching type */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}40, transparent)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep/70 hidden lg:block" />
              </div>
            </div>

            {/* Text panel */}
            <div
              className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center transition-all duration-300"
              style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateX(12px)' : 'translateX(0)' }}
            >
              {/* Type badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 self-start"
                style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}35` }}
              >
                <cfg.Icon size={11} />
                {language === 'en' ? cfg.label : cfg.labelTH}
              </div>

              <h3 className="font-syne font-bold text-2xl lg:text-3xl text-ink-primary mb-3 leading-tight">
                {language === 'en' ? item.title : item.titleTH}
              </h3>

              <p className="text-ink-secondary leading-relaxed mb-6 text-sm lg:text-base">
                {language === 'en' ? item.description : item.descriptionTH}
              </p>

              <p className="text-ink-muted text-xs mb-6">
                {item.startDate && format(new Date(item.startDate), 'MMMM d, yyyy')}
                {item.endDate && ` — ${format(new Date(item.endDate), 'MMMM d, yyyy')}`}
              </p>

              {item.ctaUrl && (
                <a
                  href={item.ctaUrl}
                  className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200 hover:gap-3 self-start"
                  style={{ color: cfg.color }}
                >
                  {language === 'en' ? (item.ctaText || 'Learn More') : (item.ctaTextTH || 'อ่านเพิ่มเติม')}
                  <HiExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Prev / Next */}
            {active.length > 1 && (
              <>
                <button
                  onClick={() => go(current - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all hover:scale-105"
                >
                  <HiChevronLeft size={20} />
                </button>
                <button
                  onClick={() => go(current + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all hover:scale-105"
                >
                  <HiChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Progress dots */}
        {active.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {active.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === current ? 'w-8 h-2 bg-teal shadow-[0_0_8px_rgba(12,200,212,0.7)]' : 'w-2 h-2 bg-border hover:bg-ink-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
