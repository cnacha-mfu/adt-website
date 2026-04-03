'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiDashboardLine, RiUserLine, RiMegaphoneLine,
  RiNewspaperLine, RiShieldKeyholeLine, RiHomeLine,
  RiMenuLine, RiCloseLine, RiLogoutBoxLine,
  RiBook2Line, RiImageLine,
} from 'react-icons/ri';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: RiDashboardLine, exact: true },
  { href: '/admin/staff', label: 'Staff', icon: RiUserLine },
  { href: '/admin/highlights', label: 'Highlights', icon: RiMegaphoneLine },
  { href: '/admin/news', label: 'News', icon: RiNewspaperLine },
  { href: '/admin/programs', label: 'Programs', icon: RiBook2Line },
  { href: '/admin/media', label: 'Media', icon: RiImageLine },
];

function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('adt-admin') === 'true') setAuthed(true);
  }, []);

  if (authed) return <>{children}</>;

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === 'admin123') {
      sessionStorage.setItem('adt-admin', 'true');
      setAuthed(true);
    } else {
      setErr('Incorrect password. (Hint: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-teal-muted flex items-center justify-center font-bebas text-void text-2xl shadow-teal-glow mx-auto mb-4">
            ADT
          </div>
          <h1 className="font-syne font-bold text-2xl text-ink-primary mb-1">Admin Portal</h1>
          <p className="text-ink-secondary text-sm">Sign in to manage the ADT website</p>
        </div>
        <form onSubmit={login} className="glass-card rounded-2xl p-7 gradient-border space-y-4">
          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(''); }}
              placeholder="Enter admin password"
              className="admin-input"
              autoFocus
            />
            {err && <p className="text-red-400 text-xs mt-1.5">{err}</p>}
          </div>
          <button type="submit" className="admin-btn-primary w-full flex items-center justify-center gap-2">
            <RiShieldKeyholeLine size={16} /> Sign In
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 text-ink-muted hover:text-teal text-sm transition-colors">
            <RiHomeLine size={14} /> Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    sessionStorage.removeItem('adt-admin');
    window.location.reload();
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-void flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-deep border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-border shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-teal-muted flex items-center justify-center font-bebas text-void text-sm shadow-teal-glow">
              ADT
            </div>
            <div>
              <p className="font-syne font-bold text-xs text-ink-primary">Admin Panel</p>
              <p className="text-ink-muted text-[10px]">ADT Website</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-teal/10 text-teal border border-teal/20'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-border space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:text-teal transition-colors">
              <RiHomeLine size={18} /> View Website
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:text-red-400 transition-colors">
              <RiLogoutBoxLine size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main area */}
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="h-16 bg-deep/80 backdrop-blur border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
            <button className="lg:hidden text-ink-secondary hover:text-teal" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center text-teal text-xs font-bold">A</div>
              <span className="text-ink-secondary text-sm hidden sm:block">Administrator</span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuth>
  );
}
