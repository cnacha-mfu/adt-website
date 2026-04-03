'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import { HiMenuAlt3, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { RiShieldKeyholeLine } from 'react-icons/ri';

const navLinks = [
  { href: '/', label: 'Home', labelTH: 'หน้าแรก' },
  { href: '/news', label: 'News', labelTH: 'ข่าวสาร' },
  { href: '/staff', label: 'Faculty', labelTH: 'บุคลากร' },
  { href: '/#programs', label: 'Programs', labelTH: 'หลักสูตร' },
  { href: '/#about', label: 'About', labelTH: 'เกี่ยวกับ' },
  { href: '/contact', label: 'Contact', labelTH: 'ติดต่อ' },
];

export default function Navbar() {
  const { language, setLanguage } = useApp();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isLight, setIsLight]         = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = !html.classList.contains('light');
    html.classList.toggle('light', next);
    localStorage.setItem('theme', next ? 'light' : 'dark');
    setIsLight(next);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isLight
            ? 'bg-white/70 backdrop-blur-xl border-b border-teal/10 shadow-[0_4px_20px_rgba(12,200,212,0.08)]'
            : 'bg-deep/90 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* MFU logo */}
          <div className="w-10 h-10 flex items-center justify-center transition-all group-hover:drop-shadow-[0_0_8px_rgba(12,200,212,0.7)]">
            <Image src="/mfu-logo.png" alt="MFU Logo" width={40} height={40} className="object-contain w-auto h-10" />
          </div>
          <div className="hidden sm:block">
            <p className="text-ink-primary font-syne font-bold text-sm leading-none">
              {language === 'en' ? 'Applied Digital Technology' : 'เทคโนโลยีดิจิทัลประยุกต์'}
            </p>
            <p className="text-ink-muted text-[10px] tracking-widest uppercase mt-0.5">
              Mae Fah Luang University
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                pathname === link.href
                  ? 'text-teal bg-teal/10 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-teal after:rounded-full after:content-[\'\']'
                  : `text-ink-secondary hover:text-ink-primary ${isLight ? 'hover:bg-teal/5' : 'hover:bg-white/5'}`
              }`}
            >
              {language === 'en' ? link.label : link.labelTH}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-border bg-surface/50 hover:border-teal/40 flex items-center justify-center text-ink-secondary hover:text-teal transition-all duration-200"
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? <HiMoon size={15} /> : <HiSun size={15} />}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface/50 hover:border-teal/40 transition-colors duration-200 text-xs font-medium text-ink-secondary hover:text-teal"
          >
            <span className={language === 'en' ? 'text-teal' : 'text-ink-muted'}>EN</span>
            <span className="text-ink-faint">/</span>
            <span className={language === 'th' ? 'text-teal' : 'text-ink-muted'}>TH</span>
          </button>

          {/* Apply CTA */}
          <a
            href="https://admission.mfu.ac.th/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 hover:border-gold/60 transition-all duration-200"
          >
            {language === 'en' ? 'Apply Now' : 'สมัครเรียน'}
          </a>

          {/* Admin — icon only */}
          <Link
            href="/admin"
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-surface/50 border border-border text-ink-muted hover:text-teal hover:border-teal/40 transition-all duration-200"
            title="Admin Panel"
          >
            <RiShieldKeyholeLine size={15} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-ink-secondary hover:text-teal transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-deep/95 backdrop-blur-xl border-b border-border px-6 py-4 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-secondary hover:text-teal hover:bg-teal/5 transition-all"
            >
              {language === 'en' ? link.label : link.labelTH}
            </Link>
          ))}
          <a href="https://admission.mfu.ac.th/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-medium mt-2">
            {language === 'en' ? 'Apply Now' : 'สมัครเรียน'}
          </a>
          <Link href="/admin" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface text-ink-muted text-sm mt-1">
            <RiShieldKeyholeLine size={15} /> Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}
