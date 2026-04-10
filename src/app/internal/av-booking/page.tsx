'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiSpeakerphone, HiInformationCircle, HiExternalLink, HiCheckCircle } from 'react-icons/hi';

const AV_CALENDAR = 'https://calendar.google.com/calendar/embed?height=500&wkst=1&bgcolor=%234285F4&ctz=Asia%2FBangkok&src=c_3695217742cfaf2ae9868ef3c0c6c361dc141a4547310cfd1bdb1c0e05e40221%40group.calendar.google.com&ctz=Asia%2FBangkok';
const BOOKING_FORM = 'https://forms.gle/CiUV4VBNBTZaQjoy7';

const EQUIPMENT = [
  { en: 'Laptop (portable)',      th: 'คอมพิวเตอร์พกพา' },
  { en: 'Accessories',            th: 'อุปกรณ์เสริม' },
];

export default function AvBookingPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-void">
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
            <HiSpeakerphone className="text-teal" size={32} />
            {language === 'en' ? 'AV Equipment Booking' : 'ระบบจองอุปกรณ์โสต'}
          </h1>
          <p className="text-ink-secondary mt-2 text-sm max-w-xl">
            {language === 'en'
              ? 'Check equipment availability on the calendar, then submit a booking request via the form.'
              : 'ตรวจสอบความพร้อมของอุปกรณ์จากปฏิทิน จากนั้นส่งคำขอจองผ่านแบบฟอร์ม'}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* Info + Book row */}
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Notice */}
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gold/5 border border-gold/25">
              <HiInformationCircle className="text-gold shrink-0 mt-0.5" size={18} />
              <div className="text-sm">
                <p className="text-gold font-semibold mb-1">
                  {language === 'en' ? 'Booking Rules' : 'กฎการจอง'}
                </p>
                <p className="text-ink-secondary text-xs leading-relaxed">
                  {language === 'en'
                    ? 'Book at least 3 working days in advance.'
                    : 'โปรดจองล่วงหน้าอย่างน้อย 3 วันทำการ'}
                </p>
              </div>
            </div>

            {/* Available equipment */}
            <div className="glass-card rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-3">
                {language === 'en' ? 'Available Equipment' : 'อุปกรณ์ที่จองได้'}
              </p>
              <ul className="space-y-2">
                {EQUIPMENT.map(e => (
                  <li key={e.en} className="flex items-center gap-2 text-sm text-ink-secondary">
                    <HiCheckCircle className="text-teal shrink-0" size={14} />
                    {language === 'en' ? e.en : e.th}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking form CTA */}
          <div className="glass-card rounded-2xl p-6 gradient-border flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-syne font-semibold text-ink-primary text-sm mb-1">
                {language === 'en' ? 'Ready to book?' : 'พร้อมจองแล้ว?'}
              </h3>
              <p className="text-ink-secondary text-xs">
                {language === 'en'
                  ? 'Check the calendar below for availability, then fill in the booking form.'
                  : 'ตรวจสอบปฏิทินด้านล่างก่อน จากนั้นกรอกแบบฟอร์มจอง'}
              </p>
            </div>
            <a
              href={BOOKING_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-void font-semibold text-sm hover:bg-teal-bright transition-colors shadow-teal-glow"
            >
              <HiExternalLink size={15} />
              {language === 'en' ? 'Open Booking Form' : 'เปิดแบบฟอร์มจอง'}
            </a>
          </div>

          {/* Calendar */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-syne font-semibold text-ink-primary text-sm">
                {language === 'en' ? 'Equipment Availability Calendar' : 'ปฏิทินการใช้งานอุปกรณ์'}
              </h2>
            </div>
            <div className="p-2">
              <iframe
                src={AV_CALENDAR}
                className="w-full rounded-xl"
                style={{ height: '500px', border: 'none' }}
                title="AV Equipment Calendar"
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
