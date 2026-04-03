'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HiArrowRight, HiChevronDown } from 'react-icons/hi';

export default function Hero() {
  const { language } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void/80">
      {/* Colour washes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal/[0.04] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-2/3 left-1/2 w-96 h-96 bg-teal/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-void to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24 w-full">
        <div className="max-w-2xl">
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
            <a href="https://admission.mfu.ac.th/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold text-sm font-medium hover:gap-3 transition-all group/apply">
              {language === 'en' ? 'Apply for 2026 intake' : 'สมัครเรียนปีการศึกษา 2569'}
              <HiArrowRight size={13} className="transition-transform group-hover/apply:translate-x-0.5" />
            </a>
          </div>
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
    </section>
  );
}
