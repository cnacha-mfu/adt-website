'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaYoutube, FaLine } from 'react-icons/fa';

export default function Footer() {
  const { language } = useApp();

  return (
    <footer className="force-dark bg-[#070F20]/80 border-t-2 border-teal/20 relative z-[2] overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-teal/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/logo-light.png" alt="ADT Logo" width={44} height={44} className="object-contain w-auto h-11" />
              <div>
                <p className="font-syne font-bold text-sm text-ink-primary leading-none">ADT</p>
                <p className="text-ink-muted text-[10px]">Mae Fah Luang University</p>
              </div>
            </div>
            <p className="text-ink-secondary text-sm leading-relaxed mb-6">
              {language === 'en'
                ? 'School of Applied Digital Technology — innovating education for the digital age.'
                : 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ — สร้างนวัตกรรมการศึกษาสู่ยุคดิจิทัล'
              }
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FaFacebook, href: 'https://www.facebook.com/adtschoolmfu' },
                { Icon: FaYoutube,  href: 'https://www.youtube.com/channel/UCbvvlT0UyZHCYdPTXL7vHXQ/featured' },
                { Icon: FaLine,     href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-ink-muted opacity-70 hover:opacity-100 hover:text-teal hover:border-teal/40 transition-all duration-200">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-ink-primary mb-5 uppercase tracking-wider">
              {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/news', en: 'News & Events', th: 'ข่าวสารและกิจกรรม' },
                { href: '/staff', en: 'Faculty & Staff', th: 'คณาจารย์และบุคลากร' },
                { href: '/#programs', en: 'Programs', th: 'หลักสูตร' },
                { href: '/#about', en: 'About Us', th: 'เกี่ยวกับเรา' },
                { href: '/contact', en: 'Contact', th: 'ติดต่อเรา' },
                { href: '/admin', en: 'Admin Portal', th: 'ระบบผู้ดูแล' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-secondary hover:text-teal text-sm transition-colors duration-200">
                    {language === 'en' ? link.en : link.th}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-ink-primary mb-5 uppercase tracking-wider">
              {language === 'en' ? 'Programs' : 'หลักสูตร'}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/programs/digital-engineering',      en: 'Digital Engineering',             th: 'วิศวกรรมดิจิทัล' },
                { href: '/programs/computer-engineering-beng',en: 'Computer Engineering (B.Eng.)',    th: 'วิศวกรรมคอมพิวเตอร์' },
                { href: '/programs/software-engineering',     en: 'Software Engineering',            th: 'วิศวกรรมซอฟต์แวร์' },
                { href: '/programs/digital-business',         en: 'Digital Business Innovation',     th: 'นวัตกรรมธุรกิจดิจิทัล' },
                { href: '/programs/multimedia',               en: 'Multimedia Technology',           th: 'มัลติมีเดียเทคโนโลยี' },
                { href: '/programs/digital-transformation-msc', en: 'Digital Transformation (M.Sc.)', th: 'การเปลี่ยนแปลงดิจิทัล (ป.โท)' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-secondary hover:text-teal text-sm transition-colors duration-200">
                    {language === 'en' ? link.en : link.th}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-ink-primary mb-5 uppercase tracking-wider">
              {language === 'en' ? 'Contact' : 'ติดต่อ'}
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <HiLocationMarker className="text-teal mt-0.5 shrink-0" size={16} />
                <span className="text-ink-secondary text-sm">
                  333 Moo 1, Thasud, Mueang, Chiang Rai 57100
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <HiPhone className="text-teal shrink-0" size={16} />
                <span className="text-ink-secondary text-sm">
                  <a href="tel:053916741" className="hover:text-teal transition-colors">0-5391-6741</a>
                  {' / '}
                  <a href="tel:053916742" className="hover:text-teal transition-colors">0-5391-6742</a>
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <HiMail className="text-teal shrink-0" size={16} />
                <a href="mailto:adtschool@mfu.ac.th" className="text-ink-secondary text-sm hover:text-teal transition-colors">
                  adtschool@mfu.ac.th
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ink-muted text-xs">
            © {new Date().getFullYear()} School of Applied Digital Technology, Mae Fah Luang University. All rights reserved.
          </p>
          <p className="text-ink-muted text-xs">
            สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ มหาวิทยาลัยแม่ฟ้าหลวง
          </p>
        </div>
      </div>
    </footer>
  );
}
