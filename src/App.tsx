import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { DeveloperActiveToolbar } from './components/public/DeveloperActiveToolbar';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { QuickGuideSection } from './components/public/QuickGuideSection';
import { AboutSection } from './components/public/AboutSection';
import { EducationSection } from './components/public/EducationSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { SkillsMatrixSection } from './components/public/SkillsMatrixSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ModernWebsiteIntro } from './components/intro/ModernWebsiteIntro';
import { NfcLoginIntro } from './components/intro/NfcLoginIntro';
import { AuthSuccessModal } from './components/auth/AuthSuccessModal';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';

const PortfolioApp: React.FC = () => {
  const { viewMode, theme, showWebsiteIntro, showNfcLoginIntro } = usePortfolio();

  // Disable browser automatic scroll restoration on load/refresh
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Guarantee that when intro animation completes, the website strictly starts from the very top
  React.useEffect(() => {
    if (!showWebsiteIntro && !showNfcLoginIntro) {
      const pinToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      };

      pinToTop();
      requestAnimationFrame(pinToTop);
      const t1 = setTimeout(pinToTop, 50);
      const t2 = setTimeout(pinToTop, 150);
      const t3 = setTimeout(pinToTop, 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [showWebsiteIntro, showNfcLoginIntro]);

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'obsidian-bg-dark text-white' : 'marble-bg-light text-black'
    }`}>
      {viewMode === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
          <header id="site-master-header" className="sticky top-0 z-50 w-full flex flex-col shadow-xs">
            <DeveloperActiveToolbar />
            <Navbar />
          </header>
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <HeroSection />
            <QuickGuideSection />
            <AboutSection />
            <EducationSection />
            <ProjectsSection />
            <SkillsMatrixSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}

      {/* 1. Modern Website Entrance Intro Animation */}
      <ModernWebsiteIntro />

      {/* 2. Specialized 13.56 MHz NFC Smart Card Login Intro Animation */}
      <NfcLoginIntro />

      {/* 3. Global Developer Auth Gateway Modal */}
      <AuthModal />

      {/* 4. Modern Success Pop-up when logging in via Credentials or QR */}
      <AuthSuccessModal />

      {/* 5. Modern Logout Confirmation Pop-up */}
      <LogoutConfirmModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
