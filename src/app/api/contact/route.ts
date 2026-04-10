import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazy-initialize so the module doesn't break at build time when env var is absent
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const CATEGORIES: Record<string, string> = {
  general:    'General Inquiry / สอบถามทั่วไป',
  academic:   'Academic / วิชาการ',
  facilities: 'Facilities / สิ่งอำนวยความสะดวก',
  complaint:  'Complaint / ร้องเรียน',
  suggestion: 'Suggestion / ข้อเสนอแนะ',
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { name, email, studentId, category, subject, message } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 });
  }

  const categoryLabel = CATEGORIES[category] ?? category ?? 'General';

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#f0f4f8; margin:0; padding:24px; }
  .card { background:#fff; border-radius:12px; max-width:600px; margin:0 auto; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#070F20 0%,#0a1628 100%); padding:28px 32px; }
  .header h2 { color:#0CC8D4; font-size:20px; margin:0 0 4px; }
  .header p { color:#94A3B8; font-size:13px; margin:0; }
  .badge { display:inline-block; background:#0CC8D4/15; color:#0CC8D4; border:1px solid rgba(12,200,212,.3); border-radius:6px; font-size:12px; padding:2px 10px; margin-top:10px; }
  .body { padding:28px 32px; }
  .row { margin-bottom:16px; }
  .label { font-size:11px; font-weight:600; color:#94A3B8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:4px; }
  .value { font-size:15px; color:#1e293b; }
  .message-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; font-size:14px; color:#334155; line-height:1.7; white-space:pre-wrap; }
  .footer { background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 32px; font-size:12px; color:#94A3B8; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h2>สายตรงคณบดี · Dean Hotline</h2>
    <p>School of Applied Digital Technology, Mae Fah Luang University</p>
    <span class="badge">${categoryLabel}</span>
  </div>
  <div class="body">
    <div class="row"><div class="label">From</div><div class="value">${name}</div></div>
    <div class="row"><div class="label">Email</div><div class="value"><a href="mailto:${email}" style="color:#0CC8D4">${email}</a></div></div>
    ${studentId ? `<div class="row"><div class="label">Student / Staff ID</div><div class="value">${studentId}</div></div>` : ''}
    <div class="row"><div class="label">Subject</div><div class="value">${subject}</div></div>
    <div class="row"><div class="label">Message</div><div class="message-box">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></div>
  </div>
  <div class="footer">Sent via ADT Website Dean Hotline &nbsp;·&nbsp; ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}</div>
</div>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from:    process.env.RESEND_FROM ?? 'ADT Hotline <onboarding@resend.dev>',
      to:      process.env.RESEND_TO ?? 'adt-school@mfu.ac.th',
      replyTo: email,
      subject: `[Dean Hotline] ${subject}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
