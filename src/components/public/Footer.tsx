import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  ArrowUp, 
  Sparkles, 
  Radio, 
  Code2
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Footer: React.FC = () => {
  const { auth, setViewMode, setShowAuthModal, setAuthModalTab } = usePortfolio();

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDevLogin = () => {
    sound.playClick();
    if (auth.isAuthenticated) {
      setViewMode('admin');
    } else {
      setAuthModalTab('credentials');
      setShowAuthModal(true);
    }
  };

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-black py-12 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-stone-200 dark:border-stone-800">
          <div className="flex flex-col items-center md:items-start gap-2">
            <BrandLogo size="lg" />
            <p className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 mt-2 text-center md:text-left max-w-sm">
              Membangun arsitektur antarmuka digital berkelas, integrasi hardware Web NFC 13.56 MHz, dan performa tinggi.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {/* Developer Mode Quick Trigger */}
            <button
              id="footer-dev-portal-btn"
              onClick={handleDevLogin}
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer shadow-md font-bold"
            >
              <Radio size={14} className="text-cyan-400" />
              <span>{auth.isAuthenticated ? 'Dashboard Developer (Aktif)' : 'Developer Gateway (NFC 13.56 MHz)'}</span>
            </button>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/50 bg-stone-100 dark:bg-stone-900 transition-all cursor-pointer"
              title="Kembali ke Atas"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-stone-700 dark:text-stone-300">
          <div>
            © {new Date().getFullYear()} <strong className="text-black dark:text-white font-bold">ILHAM FAZRIL</strong>. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Pure Monochrome with Cyber Cyan</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-black dark:text-white font-bold">Web NFC 13.56 MHz</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
