import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HighlightsStrip from '@/components/HighlightsStrip';
import NewsSection from '@/components/NewsSection';
import ProgramsSection from '@/components/ProgramsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import ThreeBackground from '@/components/ThreeBackground';

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      <ThreeBackground />
      <Navbar />
      <Hero />
      <HighlightsStrip />
      <NewsSection />
      <ProgramsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
