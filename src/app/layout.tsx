import type { Metadata } from 'next';
import { Bebas_Neue, Syne, DM_Sans, Prompt } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm',
  display: 'swap',
});

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'School of Applied Digital Technology | Mae Fah Luang University',
  description: 'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์ มหาวิทยาลัยแม่ฟ้าหลวง — Shaping the future through digital innovation.',
  keywords: ['ADT', 'MFU', 'Digital Technology', 'Mae Fah Luang University', 'Computer Science'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${syne.variable} ${dmSans.variable} ${prompt.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Restore saved theme before first paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              if(localStorage.getItem('theme')==='light')
                document.documentElement.classList.add('light');
            } catch(e){}
          })()
        `}} />
      </head>
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
