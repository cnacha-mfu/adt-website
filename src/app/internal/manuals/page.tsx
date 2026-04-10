'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiBookOpen, HiExternalLink, HiDocumentText } from 'react-icons/hi';

const MANUALS = [
  {
    titleEN: 'Document Submission Procedure',
    titleTH: 'ขั้นตอนการนำส่งเอกสารคำร้อง',
    descEN: 'Step-by-step guide for submitting official request documents to the school office.',
    descTH: 'คู่มือขั้นตอนการยื่นเอกสารคำร้องอย่างเป็นทางการต่อสำนักงานสำนักวิชา',
    href: 'https://adt.mfu.ac.th/it-internalinformationsystem/5231.html',
  },
  {
    titleEN: 'Work Procedure Manual',
    titleTH: 'คู่มือการปฏิบัติงาน',
    descEN: 'Standard operating procedures and work guidelines for school staff.',
    descTH: 'ขั้นตอนการปฏิบัติงานมาตรฐานและแนวทางสำหรับบุคลากรสำนักวิชา',
    href: 'https://adt.mfu.ac.th/it-about/it-5685/it-5415.html',
  },
  {
    titleEN: 'Service Request Manual',
    titleTH: 'คู่มือการขอรับบริการ',
    descEN: 'How to request services from the school — room booking, equipment, IT support, and more.',
    descTH: 'วิธีการขอรับบริการจากสำนักวิชา — จองห้อง อุปกรณ์ ไอทีซัพพอร์ต และอื่นๆ',
    href: 'https://adt.mfu.ac.th/it-about/it-5685/it-5416.html',
  },
];

export default function ManualsPage() {
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
            <HiBookOpen className="text-teal" size={32} />
            {language === 'en' ? 'System Manuals' : 'คู่มือการใช้งานระบบ'}
          </h1>
          <p className="text-ink-secondary mt-2 text-sm max-w-xl">
            {language === 'en'
              ? 'Guides, procedures, and reference documents for school services and systems.'
              : 'คู่มือ ขั้นตอน และเอกสารอ้างอิงสำหรับบริการและระบบต่างๆ ของสำนักวิชา'}
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          {MANUALS.map((m, i) => (
            <a
              key={i}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card rounded-2xl p-6 flex items-start gap-5 hover:border-teal/30 transition-all duration-200 block"
            >
              <div className="w-11 h-11 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                <HiDocumentText className="text-teal" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-syne font-semibold text-ink-primary text-base group-hover:text-teal transition-colors">
                  {language === 'en' ? m.titleEN : m.titleTH}
                </h3>
                <p className="text-ink-secondary text-sm mt-1 leading-relaxed">
                  {language === 'en' ? m.descEN : m.descTH}
                </p>
              </div>
              <HiExternalLink className="text-ink-muted group-hover:text-teal shrink-0 mt-0.5 transition-colors" size={16} />
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
