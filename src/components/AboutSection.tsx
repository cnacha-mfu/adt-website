'use client';

import { useApp } from '@/context/AppContext';
import ScrollReveal from './ScrollReveal';
import { MdOutlineVisibility, MdOutlineFlag } from 'react-icons/md';

const missions = [
  {
    en: 'Produce graduates with digital skills, ethics, and international competitiveness.',
    th: 'ผลิตบัณฑิตที่มีทักษะดิจิทัล คุณธรรม และความสามารถในการแข่งขันระดับสากล',
  },
  {
    en: 'Create digital research and innovation addressing regional and national needs.',
    th: 'สร้างงานวิจัยและนวัตกรรมดิจิทัลที่ตอบโจทย์ภูมิภาคและประเทศ',
  },
  {
    en: 'Build infrastructure and resources to support technological growth.',
    th: 'เสริมสร้างโครงสร้างพื้นฐานและทรัพยากรเพื่อรองรับการเติบโตด้านเทคโนโลยี',
  },
  {
    en: 'Develop partnerships with government, private sector, and communities to build a Digital Valley ecosystem.',
    th: 'พัฒนาความร่วมมือกับภาครัฐ เอกชน และชุมชน เพื่อสร้างระบบนิเวศ Digital Valley',
  },
  {
    en: 'Promote internationalization through academic cooperation and global exchange.',
    th: 'ส่งเสริมความเป็นนานาชาติผ่านความร่วมมือทางวิชาการและการแลกเปลี่ยนระดับโลก',
  },
];

const values = [
  { letter: 'T', name: 'Trust',         nameTH: 'ความเชื่อมั่นและไว้วางใจ', color: '#0CC8D4' },
  { letter: 'E', name: 'Excellence',    nameTH: 'ความเป็นเลิศ',              color: '#F5A623' },
  { letter: 'A', name: 'Agility',       nameTH: 'ความคล่องตัว',              color: '#22EBF8' },
  { letter: 'M', name: 'Mutual Respect',nameTH: 'การเคารพซึ่งกันและกัน',    color: '#A78BFA' },
];

export default function AboutSection() {
  const { language } = useApp();

  return (
    <section id="about" className="py-24 bg-deep/80 relative z-[2] overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal/3 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl pointer-events-none" />
      <div className="dot-grid absolute inset-0 opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Section header */}
        <ScrollReveal className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'About Us' : 'เกี่ยวกับเรา'}
            </span>
          </div>
          <h2 className="font-syne font-bold text-3xl lg:text-4xl text-ink-primary pb-1">
            {language === 'en' ? 'Pioneering Digital Education Since 1998' : 'บุกเบิกการศึกษาดิจิทัลตั้งแต่ พ.ศ. 2541'}
          </h2>
          <p className="text-ink-secondary mt-3 max-w-2xl text-sm leading-relaxed">
            {language === 'en'
              ? 'One of MFU\'s two founding schools, ADT has grown from a single Information Technology program to 8 cutting-edge programs — producing 25+ graduating classes of digital innovators.'
              : 'หนึ่งในสองสำนักวิชาที่ก่อตั้งมาพร้อมกับมหาวิทยาลัยแม่ฟ้าหลวง เติบโตจากหลักสูตรเทคโนโลยีสารสนเทศสู่ 8 หลักสูตร ผลิตบัณฑิตกว่า 25 รุ่น'
            }
          </p>
        </ScrollReveal>

        {/* Vision + Mission */}
        <div className="grid lg:grid-cols-2 gap-6 mb-14">
          <ScrollReveal direction="left">
            <div className="glass-card rounded-2xl p-8 gradient-border h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal shrink-0">
                  <MdOutlineVisibility size={20} />
                </div>
                <h3 className="font-syne font-bold text-lg text-ink-primary">
                  {language === 'en' ? 'Vision' : 'วิสัยทัศน์'}
                </h3>
              </div>
              <p className="text-ink-secondary leading-relaxed text-sm">
                {language === 'en'
                  ? 'To become the leading institution in digital education, research, and innovation — driving the Digital Valley of Northern Thailand.'
                  : 'ก้าวสู่การเป็นผู้นำด้านการศึกษา วิจัย และนวัตกรรมดิจิทัล เพื่อขับเคลื่อน Digital Valley แห่งภาคเหนือของประเทศไทย'
                }
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="glass-card rounded-2xl p-8 gradient-border h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <MdOutlineFlag size={20} />
                </div>
                <h3 className="font-syne font-bold text-lg text-ink-primary">
                  {language === 'en' ? 'Mission' : 'พันธกิจ'}
                </h3>
              </div>
              <ol className="space-y-3">
                {missions.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-secondary">
                    <span className="text-teal font-bold tabular-nums shrink-0">{i + 1}.</span>
                    <span className="leading-relaxed">{language === 'en' ? m.en : m.th}</span>
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>

        {/* TEAM Values */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Our Values — TEAM' : 'ค่านิยม — TEAM'}
            </span>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <ScrollReveal key={i} delay={i * 80} direction="up">
              <div className="glass-card rounded-2xl p-6 gradient-border text-center group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${v.color}15`, color: v.color }}
                >
                  {v.letter}
                </div>
                <h4 className="font-syne font-bold text-sm text-ink-primary mb-1">{v.name}</h4>
                <p className="text-ink-muted text-xs leading-snug">{v.nameTH}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
