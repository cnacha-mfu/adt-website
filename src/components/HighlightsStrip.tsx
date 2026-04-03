'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Highlight, HighlightType } from '@/lib/types';
import { HiExternalLink, HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { BsMegaphoneFill, BsTrophyFill, BsCalendarEventFill, BsStarFill } from 'react-icons/bs';
import { format } from 'date-fns';

const typeConfig: Record<HighlightType, { label: string; labelTH: string; color: string; Icon: React.ElementType }> = {
  event:        { label: 'Event',        labelTH: 'กิจกรรม',    color: '#0CC8D4', Icon: BsCalendarEventFill },
  celebration:  { label: 'Celebration',  labelTH: 'เฉลิมฉลอง', color: '#F5A623', Icon: BsStarFill },
  achievement:  { label: 'Achievement',  labelTH: 'ความสำเร็จ', color: '#22EBF8', Icon: BsTrophyFill },
  announcement: { label: 'Announcement', labelTH: 'ประกาศ',     color: '#0CC8D4', Icon: BsMegaphoneFill },
};

export default function HighlightsStrip() {
  const { data, language } = useApp();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [selected, setSelected] = useState<Highlight | null>(null);

  const active = data.highlights.filter(h => h.active).sort((a, b) => a.order - b.order);

  const go = useCallback((idx: number) => {
    if (transitioning || active.length <= 1) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(((idx % active.length) + active.length) % active.length);
      setTransitioning(false);
    }, 300);
  }, [transitioning, active.length]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(id);
  }, [current, active.length, go]);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  if (active.length === 0) return null;

  const item = active[current];
  const cfg = typeConfig[item.type];
  const modalCfg = selected ? typeConfig[selected.type] : null;

  return (
    <>
      <section className="bg-deep/80 border-t-2 border-teal/20 relative z-[2] overflow-hidden">
        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent pointer-events-none" />

        {/* Section label */}
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Latest Highlights' : 'ไฮไลท์ล่าสุด'}
            </span>
          </div>
        </div>

        {/* Banner carousel */}
        <div className="relative max-w-7xl mx-auto px-6 pb-10">
          {/* Main banner */}
          <div
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
            style={{ aspectRatio: '21/9' }}
            onClick={() => setSelected(item)}
          >
            {/* Images — stack all, fade active */}
            {active.map((hi, i) => (
              <div
                key={hi.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === current && !transitioning ? 1 : 0 }}
              >
                <Image
                  src={hi.image}
                  alt={language === 'en' ? hi.title : hi.titleTH}
                  fill
                  className="object-contain"
                  unoptimized
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Badge */}
            <div
              className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm z-10"
              style={{ background: `${cfg.color}25`, color: cfg.color, border: `1px solid ${cfg.color}50` }}
            >
              <cfg.Icon size={10} />
              {language === 'en' ? cfg.label : cfg.labelTH}
            </div>

            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <h2
                className="font-syne font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-snug mb-2 transition-all duration-300"
                style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'translateY(0)' }}
              >
                {language === 'en' ? item.title : item.titleTH}
              </h2>
              <div className="flex items-center gap-4 flex-wrap">
                {item.startDate && (
                  <span className="text-white/60 text-sm">
                    {format(new Date(item.startDate), 'MMM d, yyyy')}
                    {item.endDate && ` — ${format(new Date(item.endDate), 'MMM d, yyyy')}`}
                  </span>
                )}
                <span className="text-sm font-medium" style={{ color: cfg.color }}>
                  {language === 'en' ? 'Click for details →' : 'คลิกดูรายละเอียด →'}
                </span>
              </div>
            </div>

            {/* Prev / Next */}
            {active.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); go(current - 1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-void/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-void/80 transition-all"
                  aria-label="Previous"
                >
                  <HiChevronLeft size={20} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); go(current + 1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-void/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-void/80 transition-all"
                  aria-label="Next"
                >
                  <HiChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip + dots */}
          {active.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
              {active.map((hi, i) => {
                const tc = typeConfig[hi.type];
                return (
                  <button
                    key={hi.id}
                    onClick={() => go(i)}
                    className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                      i === current
                        ? 'border-teal shadow-[0_0_12px_rgba(12,200,212,0.5)] scale-105'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                    style={{ width: 120, height: 68 }}
                    aria-label={`Go to highlight ${i + 1}`}
                  >
                    <Image
                      src={hi.image}
                      alt={language === 'en' ? hi.title : hi.titleTH}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-void/70">
                      <p className="text-[9px] text-white truncate leading-tight">
                        {language === 'en' ? hi.title : hi.titleTH}
                      </p>
                    </div>
                    {i === current && (
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: tc.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selected && modalCfg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-void/80 backdrop-blur-md" />
          <div
            className="relative z-10 glass-card rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Full image */}
            <div className="relative w-full shrink-0" style={{ aspectRatio: '16/9' }}>
              <Image
                src={selected.image}
                alt={language === 'en' ? selected.title : selected.titleTH}
                fill
                className="object-contain bg-void"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                style={{ background: `${modalCfg.color}25`, color: modalCfg.color, border: `1px solid ${modalCfg.color}50` }}
              >
                <modalCfg.Icon size={10} />
                {language === 'en' ? modalCfg.label : modalCfg.labelTH}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-void/60 backdrop-blur-sm border border-border flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-void/80 transition-all"
                aria-label="Close"
              >
                <HiX size={16} />
              </button>
            </div>

            {/* Details */}
            <div className="p-7 overflow-y-auto">
              <p className="text-ink-muted text-xs mb-3">
                {selected.startDate && format(new Date(selected.startDate), 'MMMM d, yyyy')}
                {selected.endDate && ` — ${format(new Date(selected.endDate), 'MMMM d, yyyy')}`}
              </p>
              <h2 className="font-syne font-bold text-xl sm:text-2xl text-ink-primary leading-snug mb-4">
                {language === 'en' ? selected.title : selected.titleTH}
              </h2>
              <p className="text-ink-secondary text-sm leading-relaxed mb-6">
                {language === 'en' ? selected.description : selected.descriptionTH}
              </p>
              {selected.ctaUrl && selected.ctaUrl !== '#' && (
                <a
                  href={selected.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:gap-3"
                  style={{ background: `${modalCfg.color}15`, color: modalCfg.color, border: `1px solid ${modalCfg.color}40` }}
                >
                  {language === 'en' ? (selected.ctaText || 'Learn More') : (selected.ctaTextTH || 'รายละเอียด')}
                  <HiExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
