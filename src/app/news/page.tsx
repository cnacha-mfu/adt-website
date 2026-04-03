'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { NewsItem, NewsCategory } from '@/lib/types';
import { format } from 'date-fns';
import { HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';

const categories: { value: 'all' | NewsCategory; label: string; labelTH: string }[] = [
  { value: 'all', label: 'All', labelTH: 'ทั้งหมด' },
  { value: 'news', label: 'News', labelTH: 'ข่าว' },
  { value: 'event', label: 'Events', labelTH: 'กิจกรรม' },
  { value: 'research', label: 'Research', labelTH: 'วิจัย' },
  { value: 'achievement', label: 'Achievement', labelTH: 'ความสำเร็จ' },
  { value: 'announcement', label: 'Announcement', labelTH: 'ประกาศ' },
];

const catColors: Record<NewsCategory, string> = {
  news: 'text-teal bg-teal/10 border-teal/30',
  event: 'text-gold bg-gold/10 border-gold/30',
  research: 'text-[#22EBF8] bg-[#22EBF8]/10 border-[#22EBF8]/30',
  achievement: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
  announcement: 'text-[#F87171] bg-[#F87171]/10 border-[#F87171]/30',
};

export default function NewsPage() {
  const { data, language } = useApp();
  const [filter, setFilter] = useState<'all' | NewsCategory>('all');

  const items = data.news
    .filter(n => n.active && (filter === 'all' || n.category === filter))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">ADT</span>
          </div>
          <h1 className="font-bebas text-5xl lg:text-7xl text-ink-primary mb-3">
            News & Stories
          </h1>
          <p className="text-ink-secondary max-w-lg">
            {language === 'en'
              ? 'Stay up to date with the latest from the School of Applied Digital Technology.'
              : 'ติดตามข่าวสารล่าสุดจากสำนักวิชาเทคโนโลยีดิจิทัลประยุกต์'}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  filter === cat.value
                    ? 'bg-teal text-void border-teal'
                    : 'bg-surface border-border text-ink-secondary hover:border-teal/40 hover:text-teal'
                }`}
              >
                {language === 'en' ? cat.label : cat.labelTH}
              </button>
            ))}
          </div>
        </div>

        {/* News grid */}
        <div className="max-w-7xl mx-auto px-6">
          {items.length === 0 ? (
            <div className="text-center py-24 text-ink-muted">No news found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => {
                const title = language === 'en' ? item.title : item.titleTH;
                const excerpt = language === 'en' ? item.excerpt : item.excerptTH;
                const author = language === 'en' ? item.author : item.authorTH;
                return (
                  <article key={item.id} className="glass-card rounded-2xl overflow-hidden gradient-border group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover flex flex-col">
                    <div className="relative h-52 overflow-hidden">
                      <Image src={item.image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                      {item.featured && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold text-void uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      <span className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${catColors[item.category]}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-ink-muted text-xs mb-3">
                        {format(new Date(item.publishDate), 'MMMM d, yyyy')} · {author}
                      </p>
                      <h2 className="font-syne font-bold text-lg text-ink-primary mb-2 leading-snug line-clamp-2 group-hover:text-teal transition-colors flex-1">
                        {title}
                      </h2>
                      <p className="text-ink-secondary text-sm leading-relaxed line-clamp-3 mb-5">{excerpt}</p>
                      <Link href={`/news/${item.id}`} className="flex items-center gap-1.5 text-teal text-sm font-medium hover:gap-2.5 transition-all mt-auto">
                        {language === 'en' ? 'Read more' : 'อ่านเพิ่มเติม'} <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
