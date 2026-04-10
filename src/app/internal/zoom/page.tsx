'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiVideoCamera, HiPhone, HiInformationCircle } from 'react-icons/hi';

const ZOOM_CAL_1 = 'https://calendar.google.com/calendar/embed?height=500&wkst=1&bgcolor=%23039BE5&ctz=Asia%2FBangkok&src=bWZ1LmFjLnRoX2Q5NXVpZWxyODBqNzZ1NTUyc2N1dGdlZnNzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%234285F4&showPrint=1';
const ZOOM_CAL_2 = 'https://calendar.google.com/calendar/embed?height=500&wkst=1&bgcolor=%23039BE5&ctz=Asia%2FBangkok&src=c_8o8u19ekpb8n2t2nle052vj20g%40group.calendar.google.com&ctz=Asia%2FBangkok';

export default function ZoomPage() {
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
            <HiVideoCamera className="text-teal" size={32} />
            {language === 'en' ? 'Zoom Meeting' : 'Zoom Meeting สำนักวิชา'}
          </h1>
          <p className="text-ink-secondary mt-2 text-sm max-w-xl">
            {language === 'en'
              ? 'Book the school\'s Zoom accounts for online meetings and classes. Check availability below and contact staff to reserve.'
              : 'จองบัญชี Zoom ของสำนักวิชาสำหรับการประชุมและการเรียนออนไลน์ ตรวจสอบความว่างด้านล่างและติดต่อเจ้าหน้าที่เพื่อจอง'}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* Notice card */}
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-gold/5 border border-gold/25">
            <HiInformationCircle className="text-gold shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-gold font-semibold mb-0.5">
                {language === 'en' ? 'Booking Notice' : 'ข้อควรทราบ'}
              </p>
              <p className="text-ink-secondary text-xs leading-relaxed">
                {language === 'en'
                  ? 'Please notify at least 1 working day in advance. Contact Piyawat at ext. 7198.'
                  : 'โปรดแจ้งความประสงค์ล่วงหน้าก่อนใช้งานอย่างน้อย 1 วันทำการ ติดต่อ ปิยวัฒน์ โทร. 7198'}
              </p>
              <a href="tel:075391000" className="inline-flex items-center gap-1.5 mt-2 text-gold text-xs font-medium hover:underline">
                <HiPhone size={12} /> {language === 'en' ? 'Ext. 7198' : 'ต่อ 7198'}
              </a>
            </div>
          </div>

          {/* Calendar 1 */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-syne font-semibold text-ink-primary text-sm">
                {language === 'en' ? 'Zoom Account 1 — Availability' : 'ตารางการใช้งาน Zoom Account 1'}
              </h2>
            </div>
            <div className="p-2">
              <iframe
                src={ZOOM_CAL_1}
                className="w-full rounded-xl"
                style={{ height: '500px', border: 'none' }}
                title="Zoom Account 1 Calendar"
              />
            </div>
          </div>

          {/* Calendar 2 */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-syne font-semibold text-ink-primary text-sm">
                {language === 'en' ? 'Zoom Account 2 — Availability' : 'ตารางการใช้งาน Zoom Account 2'}
              </h2>
            </div>
            <div className="p-2">
              <iframe
                src={ZOOM_CAL_2}
                className="w-full rounded-xl"
                style={{ height: '500px', border: 'none' }}
                title="Zoom Account 2 Calendar"
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
