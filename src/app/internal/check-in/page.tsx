'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiExternalLink, HiStatusOnline } from 'react-icons/hi';

const CHECKIN_URL = 'https://web-checkin-183807814453.asia-southeast1.run.app/dashboard';

export default function OfficeStatusPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-void flex flex-col">
      <Navbar />

      {/* Slim header */}
      <section className="relative pt-20 pb-4 shrink-0">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
              <HiStatusOnline className="text-teal" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-syne font-bold text-xl text-ink-primary leading-none">
                  {language === 'en' ? 'Office Status' : 'สถานะประจำสำนักงาน'}
                </h1>
                {/* Live badge */}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 border border-teal/25 text-teal text-[10px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-ink-muted text-xs mt-0.5">
                {language === 'en'
                  ? 'See who is currently in the office and their check-in time'
                  : 'ดูว่าเจ้าหน้าที่คนใดอยู่ในสำนักงานและเวลาที่เช็คอิน'}
              </p>
            </div>
          </div>
          <a
            href={CHECKIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-ink-secondary hover:text-teal hover:border-teal/40 text-xs transition-colors"
          >
            <HiExternalLink size={13} />
            {language === 'en' ? 'Open in new tab' : 'เปิดในแท็บใหม่'}
          </a>
        </div>
      </section>

      {/* Iframe — fills remaining viewport */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-6 pb-6" style={{ minHeight: '75vh' }}>
        <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-surface/30" style={{ minHeight: '75vh' }}>
          <iframe
            src={CHECKIN_URL}
            className="w-full h-full"
            style={{ minHeight: '75vh', border: 'none' }}
            title="Office Status Dashboard"
            allow="camera; microphone"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
