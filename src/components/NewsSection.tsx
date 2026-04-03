'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { NewsItem, NewsCategory } from '@/lib/types';
import { format } from 'date-fns';
import { HiArrowRight } from 'react-icons/hi';
import ScrollReveal from './ScrollReveal';

const categoryColors: Record<NewsCategory, string> = {
  news: 'text-teal border-teal/30 bg-teal/10',
  event: 'text-gold border-gold/30 bg-gold/10',
  research: 'text-[#22EBF8] border-[#22EBF8]/30 bg-[#22EBF8]/10',
  achievement: 'text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/10',
  announcement: 'text-[#F87171] border-[#F87171]/30 bg-[#F87171]/10',
};

function FeaturedCard({ item }: { item: NewsItem }) {
  const { language } = useApp();
  const title = language === 'en' ? item.title : item.titleTH;
  const excerpt = language === 'en' ? item.excerpt : item.excerptTH;
  const author = language === 'en' ? item.author : item.authorTH;

  return (
    <article className="glass-card rounded-2xl overflow-hidden gradient-border group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover flex flex-col lg:flex-row">
      <div className="relative lg:w-2/5 min-h-[220px] overflow-hidden">
        <Image src={item.image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-surface/80 to-transparent" />
      </div>
      <div className="p-7 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${categoryColors[item.category]}`}>
              {item.category}
            </span>
            <span className="text-ink-muted text-xs">{format(new Date(item.publishDate), 'MMM d, yyyy')}</span>
          </div>
          <h3 className="font-syne font-bold text-xl text-ink-primary mb-3 leading-snug line-clamp-2 group-hover:text-teal transition-colors">
            {title}
          </h3>
          <p className="text-ink-secondary text-sm leading-relaxed line-clamp-3">{excerpt}</p>
        </div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <span className="text-ink-muted text-xs">{author}</span>
          <Link href={`/news/${item.id}`} className="flex items-center gap-1.5 text-teal text-sm font-medium hover:gap-2.5 transition-all group/link">
            {language === 'en' ? 'Read more' : 'อ่านเพิ่มเติม'}
            <HiArrowRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item, delay = 0 }: { item: NewsItem; delay?: number }) {
  const { language } = useApp();
  const title = language === 'en' ? item.title : item.titleTH;
  const excerpt = language === 'en' ? item.excerpt : item.excerptTH;

  return (
    <ScrollReveal delay={delay} direction="up">
      <article className="glass-card rounded-xl overflow-hidden gradient-border group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover flex flex-col h-full">
        <div className="relative h-44 overflow-hidden">
          <Image src={item.image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent" />
          <span className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${categoryColors[item.category]}`}>
            {item.category}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-ink-muted text-xs mb-2">{format(new Date(item.publishDate), 'MMM d, yyyy')}</p>
          <h3 className="font-syne font-bold text-base text-ink-primary mb-2 leading-snug line-clamp-2 group-hover:text-teal transition-colors flex-1">
            {title}
          </h3>
          <p className="text-ink-secondary text-xs leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
          <Link href={`/news/${item.id}`} className="flex items-center gap-1.5 text-teal text-xs font-medium hover:gap-2 transition-all mt-auto group/link">
            {language === 'en' ? 'Read more' : 'อ่านเพิ่มเติม'}
            <HiArrowRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function NewsSection() {
  const { data, language } = useApp();
  const activeNews = data.news.filter(n => n.active).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  const featured = activeNews.filter(n => n.featured).slice(0, 2);
  const regular = activeNews.filter(n => !n.featured).slice(0, 4);

  if (!activeNews.length) return null;

  return (
    <section id="news" className="scroll-mt-20 py-20 bg-void/80 relative z-[2] overflow-hidden">
      {/* Subtle dot grid */}
      <div className="dot-grid absolute inset-0 opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">
                {language === 'en' ? 'Latest Updates' : 'อัพเดทล่าสุด'}
              </span>
            </div>
            <h2 className="font-syne font-bold text-3xl lg:text-4xl text-ink-primary pb-1">
              {language === 'en' ? 'News & Stories' : 'ข่าวสารและเรื่องราว'}
            </h2>
          </div>
          <Link href="/news" className="hidden md:flex items-center gap-2 text-teal text-sm font-medium hover:gap-3 transition-all group">
            {language === 'en' ? 'All news' : 'ข่าวทั้งหมด'}
            <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </ScrollReveal>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="grid gap-5 mb-5">
            {featured.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 80}>
                <FeaturedCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Regular grid */}
        {regular.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {regular.map((item, i) => (
              <NewsCard key={item.id} item={item} delay={i * 60} />
            ))}
          </div>
        )}

        <ScrollReveal className="flex justify-center mt-10" delay={100}>
          <Link href="/news" className="flex items-center gap-2 border border-border bg-surface/50 hover:border-teal/40 hover:bg-teal/5 text-ink-primary font-semibold px-8 py-3 rounded-xl transition-all duration-300 text-sm group">
            {language === 'en' ? 'View All News' : 'ดูข่าวทั้งหมด'}
            <HiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
