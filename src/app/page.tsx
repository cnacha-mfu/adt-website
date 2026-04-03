import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import ProgramsSection from '@/components/ProgramsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <Hero />
      <NewsSection />
      <ProgramsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
