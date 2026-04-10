'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiCalendar, HiExternalLink, HiInformationCircle, HiOfficeBuilding } from 'react-icons/hi';

const BOOKING_URL = 'http://itschool1.mfu.ac.th/bookingroom';

export default function BookingRoomPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-void flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Internal Systems' : 'ระบบสารสนเทศภายใน'}
            </span>
          </div>
          <h1 className="font-syne font-bold text-4xl text-ink-primary flex items-center gap-3">
            <HiCalendar className="text-teal" size={32} />
            {language === 'en' ? 'Room Booking' : 'จองห้องเรียน'}
          </h1>
          <p className="text-ink-secondary mt-2 text-sm max-w-xl">
            {language === 'en'
              ? 'Reserve lecture rooms, labs, and meeting spaces through the ITSchool booking portal.'
              : 'จองห้องบรรยาย ห้องปฏิบัติการ และห้องประชุมผ่านระบบจองของสำนักวิชา'}
          </p>
        </div>
      </section>

      <section className="flex-1 pb-16">
        <div className="max-w-3xl mx-auto px-6 space-y-6">

          {/* Notice */}
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gold/5 border border-gold/25">
            <HiInformationCircle className="text-gold shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-ink-secondary leading-relaxed">
              {language === 'en'
                ? 'The room booking system runs on the school\'s internal server. You may need to be on the MFU campus network or VPN to access it.'
                : 'ระบบจองห้องทำงานบนเซิร์ฟเวอร์ภายในของสำนักวิชา อาจต้องเชื่อมต่อเครือข่าย MFU หรือ VPN เพื่อเข้าถึง'}
            </p>
          </div>

          {/* CTA card */}
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center text-center gradient-border">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-5">
              <HiOfficeBuilding className="text-teal" size={30} />
            </div>
            <h2 className="font-syne font-bold text-xl text-ink-primary mb-2">
              {language === 'en' ? 'ITSchool Booking Room' : 'ระบบจองห้อง ITSchool'}
            </h2>
            <p className="text-ink-secondary text-sm mb-7 max-w-sm">
              {language === 'en'
                ? 'Click the button below to open the room booking portal in a new tab.'
                : 'คลิกปุ่มด้านล่างเพื่อเปิดระบบจองห้องในแท็บใหม่'}
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal text-void font-bold text-sm hover:bg-teal-bright transition-colors shadow-teal-glow hover:shadow-[0_0_30px_rgba(12,200,212,0.4)]"
            >
              <HiExternalLink size={16} />
              {language === 'en' ? 'Open Booking System' : 'เปิดระบบจองห้อง'}
            </a>
            <p className="text-ink-muted text-[10px] mt-4">{BOOKING_URL}</p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
