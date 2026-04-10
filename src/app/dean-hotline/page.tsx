'use client';

import { useState, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HiMail, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const CATEGORIES = [
  { value: 'general',    labelEN: 'General Inquiry',  labelTH: 'สอบถามทั่วไป' },
  { value: 'academic',   labelEN: 'Academic',          labelTH: 'วิชาการ' },
  { value: 'facilities', labelEN: 'Facilities',        labelTH: 'สิ่งอำนวยความสะดวก' },
  { value: 'complaint',  labelEN: 'Complaint',         labelTH: 'ร้องเรียน' },
  { value: 'suggestion', labelEN: 'Suggestion',        labelTH: 'ข้อเสนอแนะ' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function DeanHotlinePage() {
  const { language } = useApp();

  const [form, setForm] = useState({
    name: '', email: '', studentId: '',
    category: 'general', subject: '', message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const reset = () => {
    setForm({ name: '', email: '', studentId: '', category: 'general', subject: '', message: '' });
    setStatus('idle');
  };

  const inputCls = 'w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-teal/60 focus:ring-1 focus:ring-teal/30 transition-colors duration-200';
  const labelCls = 'block text-xs font-medium text-ink-secondary uppercase tracking-widest mb-2';

  return (
    <main className="min-h-screen bg-void">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-teal" />
            <span className="text-teal text-xs font-medium tracking-widest uppercase">
              {language === 'en' ? 'Direct to Dean' : 'สายตรงถึงคณบดี'}
            </span>
          </div>
          <h1 className="font-syne font-bold text-4xl lg:text-5xl text-ink-primary pb-1">
            {language === 'en' ? 'Dean Hotline' : 'สายตรงคณบดี'}
          </h1>
          <p className="text-ink-secondary mt-3 max-w-xl text-sm leading-relaxed">
            {language === 'en'
              ? 'Submit your inquiry, complaint, or suggestion directly to the Dean. All messages are sent confidentially to adt-school@mfu.ac.th.'
              : 'ส่งคำถาม ข้อร้องเรียน หรือข้อเสนอแนะของคุณตรงถึงคณบดี ทุกข้อความจะถูกส่งอย่างเป็นความลับไปยัง adt-school@mfu.ac.th'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left — info cards */}
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-7">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <HiMail className="text-teal" size={20} />
                </div>
                <h3 className="font-syne font-semibold text-ink-primary text-sm mb-2">
                  {language === 'en' ? 'How it works' : 'วิธีการทำงาน'}
                </h3>
                <p className="text-ink-secondary text-xs leading-relaxed">
                  {language === 'en'
                    ? 'Fill out the form and your message will be sent directly to the Dean\'s office at adt-school@mfu.ac.th. Expect a reply within 3–5 business days.'
                    : 'กรอกแบบฟอร์มและข้อความของคุณจะถูกส่งตรงไปยังสำนักงานคณบดีที่ adt-school@mfu.ac.th คาดว่าจะได้รับการตอบกลับภายใน 3-5 วันทำการ'}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-7">
                <h3 className="font-syne font-semibold text-ink-primary text-sm mb-3">
                  {language === 'en' ? 'Topics you can raise' : 'หัวข้อที่คุณสามารถส่งได้'}
                </h3>
                <ul className="space-y-2">
                  {CATEGORIES.map(c => (
                    <li key={c.value} className="flex items-center gap-2 text-xs text-ink-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal/60 shrink-0" />
                      {language === 'en' ? c.labelEN : c.labelTH}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-7 gradient-border">
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {language === 'en'
                    ? 'For urgent matters please call the school office directly at 0-5391-6741.'
                    : 'สำหรับเรื่องเร่งด่วนโปรดโทรติดต่อสำนักงานโดยตรงที่ 0-5391-6741'}
                </p>
                <a href="tel:053916741" className="inline-flex items-center gap-1.5 mt-3 text-teal text-xs font-medium hover:underline">
                  0-5391-6741 →
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-5">
                    <HiCheckCircle className="text-teal" size={36} />
                  </div>
                  <h2 className="font-syne font-bold text-xl text-ink-primary mb-2">
                    {language === 'en' ? 'Message Sent!' : 'ส่งข้อความแล้ว!'}
                  </h2>
                  <p className="text-ink-secondary text-sm max-w-sm mb-7">
                    {language === 'en'
                      ? 'Your message has been delivered to the Dean\'s office. We will reply to your email within 3–5 business days.'
                      : 'ข้อความของคุณถูกส่งไปยังสำนักงานคณบดีแล้ว เราจะตอบกลับอีเมลของคุณภายใน 3-5 วันทำการ'}
                  </p>
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 rounded-xl bg-teal/10 border border-teal/30 text-teal text-sm font-medium hover:bg-teal/20 transition-colors"
                  >
                    {language === 'en' ? 'Send another message' : 'ส่งข้อความอีกครั้ง'}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="glass-card rounded-2xl p-8 space-y-6">
                  {status === 'error' && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      <HiExclamationCircle size={18} className="shrink-0" />
                      {errorMsg || (language === 'en' ? 'Failed to send. Please try again.' : 'ส่งไม่สำเร็จ โปรดลองอีกครั้ง')}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>
                        {language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" required value={form.name} onChange={set('name')}
                        placeholder={language === 'en' ? 'Your full name' : 'ชื่อ-นามสกุลของคุณ'}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {language === 'en' ? 'Email Address' : 'อีเมล'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email" required value={form.email} onChange={set('email')}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>
                        {language === 'en' ? 'Student / Staff ID' : 'รหัสนักศึกษา / บุคลากร'}
                        <span className="text-ink-muted ml-1 normal-case tracking-normal">({language === 'en' ? 'optional' : 'ไม่บังคับ'})</span>
                      </label>
                      <input
                        type="text" value={form.studentId} onChange={set('studentId')}
                        placeholder="e.g. 6530123456"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {language === 'en' ? 'Category' : 'หมวดหมู่'} <span className="text-red-400">*</span>
                      </label>
                      <select value={form.category} onChange={set('category')} className={inputCls}>
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>
                            {language === 'en' ? c.labelEN : c.labelTH}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {language === 'en' ? 'Subject' : 'หัวข้อ'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" required value={form.subject} onChange={set('subject')}
                      placeholder={language === 'en' ? 'Brief subject of your message' : 'หัวข้อสั้นๆ ของข้อความ'}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      {language === 'en' ? 'Message' : 'ข้อความ'} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required minLength={10} rows={6} value={form.message} onChange={set('message')}
                      placeholder={language === 'en' ? 'Write your message here...' : 'เขียนข้อความของคุณที่นี่...'}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal text-void font-semibold text-sm hover:bg-teal-bright disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-teal-glow hover:shadow-[0_0_30px_rgba(12,200,212,0.4)]"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        {language === 'en' ? 'Sending...' : 'กำลังส่ง...'}
                      </>
                    ) : (
                      <>
                        <HiMail size={16} />
                        {language === 'en' ? 'Send to Dean\'s Office' : 'ส่งถึงสำนักงานคณบดี'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
