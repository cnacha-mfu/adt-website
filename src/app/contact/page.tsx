'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiMail, HiPhone, HiLocationMarker, HiPrinter } from 'react-icons/hi';
import { FaFacebook, FaYoutube } from 'react-icons/fa';

const contactItems = [
  {
    icon: HiLocationMarker,
    color: 'teal',
    labelEN: 'Address',
    labelTH: 'ที่อยู่',
    valueEN: '333 Moo 1, Tha Sut Subdistrict, Mueang District, Chiang Rai 57100, Thailand',
    valueTH: '333 หมู่ 1 ตำบลท่าสุด อำเภอเมือง จังหวัดเชียงราย 57100',
    href: null,
  },
  {
    icon: HiPhone,
    color: 'teal',
    labelEN: 'Phone',
    labelTH: 'โทรศัพท์',
    valueEN: '0-5391-6741 / 0-5391-6742',
    valueTH: '0-5391-6741 / 0-5391-6742',
    href: 'tel:053916741',
  },
  {
    icon: HiPrinter,
    color: 'gold',
    labelEN: 'Fax',
    labelTH: 'โทรสาร',
    valueEN: '0-5391-6743',
    valueTH: '0-5391-6743',
    href: null,
  },
  {
    icon: HiMail,
    color: 'teal',
    labelEN: 'Email',
    labelTH: 'อีเมล',
    valueEN: 'adtschool@mfu.ac.th',
    valueTH: 'adtschool@mfu.ac.th',
    href: 'mailto:adtschool@mfu.ac.th',
  },
];

export default function ContactPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-void">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Get In Touch' : 'ติดต่อเรา'}
            </span>
          </div>
          <h1 className="font-syne font-bold text-4xl lg:text-5xl text-ink-primary pb-1">
            {language === 'en' ? 'Contact Us' : 'ติดต่อสำนักวิชา'}
          </h1>
          <p className="text-ink-secondary mt-3 max-w-xl text-sm leading-relaxed">
            {language === 'en'
              ? 'We\'d love to hear from you. Reach out for admissions, research collaboration, or general inquiries.'
              : 'ยินดีรับฟังทุกคำถาม ไม่ว่าจะเป็นการสมัครเรียน ความร่วมมือวิจัย หรือสอบถามทั่วไป'}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Left — Contact info + social */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <h2 className="font-syne font-bold text-lg text-ink-primary pb-1">
                  {language === 'en' ? 'School of Applied Digital Technology' : 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์'}
                </h2>
                <p className="text-ink-muted text-xs">
                  {language === 'en' ? 'Mae Fah Luang University' : 'มหาวิทยาลัยแม่ฟ้าหลวง'}
                </p>

                <div className="space-y-5 pt-2">
                  {contactItems.map((item, i) => {
                    const Icon = item.icon;
                    const value = language === 'en' ? item.valueEN : item.valueTH;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          item.color === 'teal' ? 'bg-teal/10 text-teal' : 'bg-gold/10 text-gold'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-ink-muted text-xs mb-0.5">
                            {language === 'en' ? item.labelEN : item.labelTH}
                          </p>
                          {item.href ? (
                            <a href={item.href} className="text-ink-secondary text-sm hover:text-teal transition-colors">
                              {value}
                            </a>
                          ) : (
                            <p className="text-ink-secondary text-sm">{value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social */}
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-syne font-semibold text-sm text-ink-primary mb-5 uppercase tracking-wider">
                  {language === 'en' ? 'Follow Us' : 'ติดตามเรา'}
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/adtschoolmfu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border hover:border-teal/40 hover:text-teal text-ink-secondary transition-all duration-200 text-sm"
                  >
                    <FaFacebook size={16} />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCbvvlT0UyZHCYdPTXL7vHXQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border hover:border-teal/40 hover:text-teal text-ink-secondary transition-all duration-200 text-sm"
                  >
                    <FaYoutube size={16} />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

              {/* Apply CTA */}
              <div className="glass-card rounded-2xl p-8 gradient-border">
                <h3 className="font-syne font-bold text-base text-ink-primary mb-2">
                  {language === 'en' ? 'Interested in applying?' : 'สนใจสมัครเรียน?'}
                </h3>
                <p className="text-ink-secondary text-sm mb-5">
                  {language === 'en'
                    ? 'Visit the MFU Admissions portal to apply for our undergraduate and graduate programs.'
                    : 'เยี่ยมชมระบบรับสมัครของ มฟล. เพื่อสมัครเรียนในหลักสูตรปริญญาตรีและบัณฑิตศึกษา'}
                </p>
                <a
                  href="https://admission.mfu.ac.th/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 hover:border-gold/60 transition-all duration-200"
                >
                  {language === 'en' ? 'Apply Now' : 'สมัครเรียนเลย'}
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Right — Map */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-syne font-semibold text-sm text-ink-primary">
                    {language === 'en' ? 'Campus Location' : 'ที่ตั้งมหาวิทยาลัย'}
                  </h3>
                  <p className="text-ink-muted text-xs mt-1">Mae Fah Luang University, Chiang Rai</p>
                </div>
                <div className="relative w-full" style={{ height: '420px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.0661!2d99.8963!3d20.0569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d7019399fc7bc3%3A0xe8e89cd9a5cfe2db!2sMae%20Fah%20Luang%20University!5e0!3m2!1sen!2sth!4v1711929600000"
                    width="100%"
                    height="100%"
                    className="map-embed"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mae Fah Luang University Map"
                  />
                </div>
              </div>

              {/* Office hours */}
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-syne font-semibold text-sm text-ink-primary mb-5 uppercase tracking-wider">
                  {language === 'en' ? 'Office Hours' : 'เวลาทำการ'}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      day: language === 'en' ? 'Monday – Friday' : 'จันทร์ – ศุกร์',
                      time: '08:30 – 16:30',
                      active: true,
                    },
                    {
                      day: language === 'en' ? 'Saturday – Sunday' : 'เสาร์ – อาทิตย์',
                      time: language === 'en' ? 'Closed' : 'ปิดทำการ',
                      active: false,
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                      <span className="text-ink-secondary text-sm">{row.day}</span>
                      <span className={`text-sm font-medium ${row.active ? 'text-teal' : 'text-ink-muted'}`}>
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
