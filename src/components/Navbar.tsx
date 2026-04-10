'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import {
  HiMenuAlt3, HiX, HiSun, HiMoon, HiViewGrid,
  HiMail, HiStatusOnline, HiCalendar,
  HiVideoCamera, HiSpeakerphone, HiBookOpen, HiChevronDown,
} from 'react-icons/hi';
import { RiShieldKeyholeLine } from 'react-icons/ri';

const navLinks = [
  { href: '/',          label: 'Home',     labelTH: 'หน้าแรก'   },
  { href: '/news',      label: 'News',     labelTH: 'ข่าวสาร'   },
  { href: '/staff',     label: 'Faculty',  labelTH: 'บุคลากร'   },
  { href: '/#programs', label: 'Programs', labelTH: 'หลักสูตร'  },
  { href: '/#about',    label: 'About',    labelTH: 'เกี่ยวกับ'  },
  { href: '/contact',   label: 'Contact',  labelTH: 'ติดต่อ'    },
];

const appTiles = [
  {
    href:     '/dean-hotline',
    internal: true,
    icon:     HiMail,
    label:    'Dean Hotline',
    labelTH:  'สายตรงคณบดี',
    accent:   'gold',
  },
  {
    href:     '/internal/check-in',
    internal: true,
    icon:     HiStatusOnline,
    label:    'Office Status',
    labelTH:  'สถานะสำนักงาน',
    accent:   'teal',
  },
  {
    href:     '/internal/booking-room',
    internal: true,
    icon:     HiCalendar,
    label:    'Booking Room',
    labelTH:  'จองห้อง',
    accent:   'teal',
  },
  {
    href:     '/internal/zoom',
    internal: true,
    icon:     HiVideoCamera,
    label:    'Zoom Meeting',
    labelTH:  'Zoom Meeting',
    accent:   'teal',
  },
  {
    href:     '/internal/av-booking',
    internal: true,
    icon:     HiSpeakerphone,
    label:    'AV Booking',
    labelTH:  'จองอุปกรณ์โสต',
    accent:   'teal',
  },
  {
    href:     '/internal/manuals',
    internal: true,
    icon:     HiBookOpen,
    label:    'Manuals',
    labelTH:  'คู่มือระบบ',
    accent:   'teal',
  },
];

export default function Navbar() {
  const { language, setLanguage } = useApp();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mobileInternal, setMobileInternal] = useState(false);
  const [isLight, setIsLight]         = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const launcherRef                   = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
  }, []);

  // Close launcher on outside click or Escape
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node))
        setLauncherOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLauncherOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
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
            ? 'bg-white/85 backdrop-blur-xl border-b border-teal/15 shadow-[0_4px_20px_rgba(10,192,205,0.12)]'
            : 'bg-deep/90 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center transition-all group-hover:drop-shadow-[0_0_8px_rgba(12,200,212,0.7)]">
            <Image src="/mfu-logo.png" alt="MFU Logo" width={40} height={40} className="object-contain w-auto h-10" />
          </div>
          <div className="hidden sm:block">
            <p className="text-ink-primary font-syne font-bold text-sm leading-none">
              {language === 'en' ? 'Applied Digital Technology' : 'เทคโนโลยีดิจิทัลประยุกต์'}
            </p>
            <p className="text-ink-muted text-[10px] tracking-widest uppercase mt-0.5">Mae Fah Luang University</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                pathname === link.href
                  ? 'text-teal bg-teal/10 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-teal after:rounded-full after:content-[\'\']'
                  : `text-ink-secondary hover:text-ink-primary ${isLight ? 'hover:bg-teal/8' : 'hover:bg-white/5'}`
              }`}
            >
              {language === 'en' ? link.label : link.labelTH}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">

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

          {/* Apps grid launcher */}
          <div ref={launcherRef} className="relative hidden md:block">
            <button
              onClick={() => setLauncherOpen(o => !o)}
              title={language === 'en' ? 'Internal Systems' : 'ระบบสารสนเทศภายใน'}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                launcherOpen
                  ? 'bg-teal/15 border-teal/50 text-teal shadow-[0_0_12px_rgba(12,200,212,0.25)]'
                  : 'border-border bg-surface/50 text-ink-secondary hover:text-teal hover:border-teal/40'
              }`}
            >
              <HiViewGrid size={17} />
            </button>

            {/* Floating panel */}
            {launcherOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl border border-border bg-deep/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-ink-primary">
                      {language === 'en' ? 'Internal Systems' : 'ระบบสารสนเทศภายใน'}
                    </p>
                    <p className="text-[10px] text-ink-muted mt-0.5">ADT · Mae Fah Luang University</p>
                  </div>
                  <button
                    onClick={() => setLauncherOpen(false)}
                    className="text-ink-muted hover:text-ink-primary transition-colors"
                  >
                    <HiX size={14} />
                  </button>
                </div>

                {/* Tiles grid */}
                <div className="p-3 grid grid-cols-3 gap-2">
                  {appTiles.map(tile => {
                    const Icon = tile.icon;
                    const isGold = tile.accent === 'gold';
                    const content = (
                      <div
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                          isGold
                            ? 'border-gold/25 bg-gold/5 hover:bg-gold/10 hover:border-gold/50'
                            : 'border-border bg-surface/40 hover:bg-teal/5 hover:border-teal/30'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isGold
                            ? 'bg-gold/15 text-gold group-hover:bg-gold/25'
                            : 'bg-teal/10 text-teal group-hover:bg-teal/20'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-[10px] font-medium text-center leading-tight ${
                          isGold ? 'text-gold' : 'text-ink-secondary group-hover:text-ink-primary'
                        }`}>
                          {language === 'en' ? tile.label : tile.labelTH}
                        </span>
                      </div>
                    );

                    return tile.internal ? (
                      <Link key={tile.href} href={tile.href} onClick={() => setLauncherOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      <a key={tile.href} href={tile.href} target="_blank" rel="noopener noreferrer" onClick={() => setLauncherOpen(false)}>
                        {content}
                      </a>
                    );
                  })}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2.5 border-t border-border">
                  <p className="text-[10px] text-ink-muted text-center">
                    {language === 'en' ? 'Press Esc to close' : 'กด Esc เพื่อปิด'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Apply CTA */}
          <a
            href="https://admission.mfu.ac.th/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 hover:border-gold/60 transition-all duration-200"
          >
            {language === 'en' ? 'Apply Now' : 'สมัครเรียน'}
          </a>

          {/* Admin icon */}
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

          {/* Internal systems — collapsible on mobile */}
          <button
            onClick={() => setMobileInternal(o => !o)}
            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-ink-secondary hover:text-teal hover:bg-teal/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <HiViewGrid size={15} />
              {language === 'en' ? 'Internal Systems' : 'ระบบสารสนเทศภายใน'}
            </span>
            <HiChevronDown size={13} className={`transition-transform ${mobileInternal ? 'rotate-180' : ''}`} />
          </button>
          {mobileInternal && (
            <div className="ml-4 grid grid-cols-2 gap-2 border-l border-border pl-4 pb-2">
              {appTiles.map(tile => {
                const Icon = tile.icon;
                const isGold = tile.accent === 'gold';
                const content = (
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-colors ${
                    isGold
                      ? 'border-gold/25 bg-gold/5 text-gold'
                      : 'border-border text-ink-secondary hover:text-teal hover:border-teal/30'
                  }`}>
                    <Icon size={14} className="shrink-0" />
                    <span className="leading-tight">{language === 'en' ? tile.label : tile.labelTH}</span>
                  </div>
                );
                return tile.internal ? (
                  <Link key={tile.href} href={tile.href} onClick={() => setMobileOpen(false)}>{content}</Link>
                ) : (
                  <a key={tile.href} href={tile.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>{content}</a>
                );
              })}
            </div>
          )}

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
