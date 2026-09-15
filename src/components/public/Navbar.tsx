import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Menu, 
  X, 
  Radio
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    auth, 
    setViewMode, 
    setShowAuthModal, 
    setAuthModalTab 
  } = usePortfolio();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Panduan', href: '#quick-guide' },
    { label: 'Tentang', href: '#about' },
    { label: 'Pendidikan', href: '#education' },
    { label: 'Portofolio', href: '#projects' },
    { label: 'Keahlian', href: '#skills' },
    { label: 'Kontak', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    sound.playHover();
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDevPortalClick = () => {
    sound.playClick();
    if (auth.isAuthenticated) {
      setViewMode('admin');
    } else {
      setAuthModalTab('credentials');
      setShowAuthModal(true);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`w-full transition-all duration-300 ${
        scrolled
          ? 'py-2 bg-white/98 dark:bg-black/98 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-md shadow-black/5 dark:shadow-black/40'
          : 'py-2.5 sm:py-3 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Monogram */}
        <a 
          href="#" 
          className="no-underline shrink-0 flex items-center" 
          onClick={() => sound.playHover()}
          title="Beranda Ilham Fazril"
        >
          <BrandLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 bg-stone-100 dark:bg-stone-900/90 p-1 rounded-full border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-xs">
          {navLinks.map(link => (
            <button
              key={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              onClick={() => handleNavClick(link.href)}
              className="px-3.5 py-1.5 text-xs lg:text-sm font-bold text-stone-900 hover:text-cyan-600 dark:text-stone-100 dark:hover:text-cyan-300 rounded-full transition-all duration-200 hover:bg-cyan-500/15 dark:hover:bg-stone-800 cursor-pointer whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Controls & Developer Gateway */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className="p-1.5 sm:p-2.5 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/50 bg-stone-100 dark:bg-stone-900 transition-all cursor-pointer shadow-xs"
            title={soundEnabled ? 'Suara Aktif (Web Audio)' : 'Suara Dimatikan'}
          >
            {soundEnabled ? <Volume2 size={15} className="text-cyan-500" /> : <VolumeX size={15} />}
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-1.5 sm:p-2.5 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/50 bg-stone-100 dark:bg-stone-900 transition-all cursor-pointer group shadow-xs"
            title={theme === 'dark' ? 'Mode Gelap (Pure Black)' : 'Mode Terang (Pure White)'}
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-cyan-300 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon size={15} className="text-cyan-600 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Developer Mode Entry Button */}
          <button
            id="dev-mode-btn"
            onClick={handleDevPortalClick}
            className={`relative group overflow-hidden px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1 sm:gap-2 border shrink-0 ${
              auth.isAuthenticated
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500 hover:text-black'
                : 'border-cyan-500/60 bg-cyan-500/15 hover:bg-cyan-500 hover:text-black text-cyan-800 dark:text-cyan-300'
            }`}
          >
            {auth.isAuthenticated ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono-tech whitespace-nowrap text-[11px] sm:text-xs">DEV HUB</span>
                <ShieldCheck size={13} className="shrink-0" />
              </>
            ) : (
              <>
                <Radio size={13} className="text-cyan-500 shrink-0" />
                <span className="font-mono-tech whitespace-nowrap text-[10px] sm:text-xs font-bold">KUNCI DEV</span>
              </>
            )}
          </button>

          {/* Mobile & Tablet Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Buka Menu Navigasi"
            className="xl:hidden p-1.5 sm:p-2 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:text-cyan-500 bg-stone-100 dark:bg-stone-900 cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-3 sm:px-6 py-3 space-y-2 animate-in slide-in-from-top-2 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-3.5 py-2.5 text-sm font-bold text-stone-900 hover:text-cyan-600 dark:text-stone-100 dark:hover:text-cyan-300 rounded-xl hover:bg-cyan-500/10 dark:hover:bg-stone-900 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-cyan-500 text-xs font-mono-tech">→</span>
              </button>
            ))}
          </div>
          
          <div className="pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-mono-tech text-stone-700 dark:text-stone-300 font-semibold">
              Gateway Developer 13.56 MHz
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDevPortalClick();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono-tech font-bold cursor-pointer transition-all shadow-sm"
            >
              {auth.isAuthenticated ? 'Buka Dev Hub' : 'Login Developer'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
