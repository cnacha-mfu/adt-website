'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { NewsItem, NewsCategory } from '@/lib/types';
import { format } from 'date-fns';
import { HiX } from 'react-icons/hi';

const categoryColors: Record<NewsCategory, string> = {
  news:         'text-teal border-teal/40 bg-teal/10',
  event:        'text-gold border-gold/40 bg-gold/10',
  research:     'text-[#22EBF8] border-[#22EBF8]/40 bg-[#22EBF8]/10',
  achievement:  'text-[#A78BFA] border-[#A78BFA]/40 bg-[#A78BFA]/10',
  announcement: 'text-[#F87171] border-[#F87171]/40 bg-[#F87171]/10',
};

interface Props {
  item: NewsItem | null;
  onClose: () => void;
}

export default function NewsModal({ item, onClose }: Props) {
  const { language } = useApp();

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const title   = language === 'en' ? item.title   : item.titleTH;
  const content = language === 'en' ? item.content  : item.contentTH;
  const author  = language === 'en' ? item.author   : item.authorTH;
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Panel */}
      <div
        className="relative z-10 glass-card rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative w-full shrink-0" style={{ aspectRatio: '16/9' }}>
          <Image
            src={item.image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Category badge */}
          <span className={`absolute top-4 left-4 text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider backdrop-blur-sm ${categoryColors[item.category]}`}>
            {item.category}
          </span>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
            aria-label="Close"
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Body — flex-1 min-h-0 lets overflow:auto work inside a flex column */}
        <div className="p-7 overflow-y-auto flex-1 min-h-0">
          <p className="text-ink-muted text-xs mb-3">
            {format(new Date(item.publishDate), 'MMMM d, yyyy')}
            {author && <span> · {author}</span>}
          </p>
          <h2 className="font-syne font-bold text-xl sm:text-2xl text-ink-primary leading-snug mb-5">
            {title}
          </h2>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-ink-secondary text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
