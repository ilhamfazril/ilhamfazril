import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Terminal, 
  Radio, 
  Cpu, 
  Layers, 
  Volume2,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ModernWebsiteIntro: React.FC = () => {
  const { showWebsiteIntro, setShowWebsiteIntro } = usePortfolio();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Memulai inisialisasi modul UI...');

  useEffect(() => {
    if (!showWebsiteIntro) return;

    // Ensure page is pinned to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    sound.playFuturisticIntro();

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Smooth progressive increments
        let step = 3;
        if (prev < 20) step = 4;
        else if (prev < 50) step = 3;
        else if (prev < 80) step = 2;
        else if (prev < 95) step = 1;
        else step = 2;

        const next = Math.min(100, prev + step);

        // Update system loading logs based on percentage
        if (next < 25) {
          setStatusMessage('Memuat arsitektur UI & aset visual beresolusi tinggi...');
        } else if (next < 55) {
          setStatusMessage('Inisialisasi subsistem Web NFC 13.56 MHz & protokol ISO-14443A...');
        } else if (next < 85) {
          setStatusMessage('Mengoptimalkan responsivitas layout 60 FPS & audio synth...');
        } else if (next < 100) {
          setStatusMessage('Sinkronisasi identitas developer Ilham Fazril...');
        } else {
          setStatusMessage('Pemuatan selesai! Memasuki halaman utama...');
        }

        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [showWebsiteIntro]);

  // Automatic seamless transition to main website once progress hits 100%
  useEffect(() => {
    if (progress === 100 && showWebsiteIntro) {
      const timer = setTimeout(() => {
        sound.playSuccess();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        try {
          sessionStorage.setItem('ilham_seen_website_intro', 'true');
        } catch {}
        setShowWebsiteIntro(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [progress, showWebsiteIntro, setShowWebsiteIntro]);

  const handleSkipIntro = () => {
    sound.playClick();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    try {
      sessionStorage.setItem('ilham_seen_website_intro', 'true');
    } catch {}
    setShowWebsiteIntro(false);
  };

  if (!showWebsiteIntro) return null;

  return (
    <div
      id="modern-website-intro-overlay"
      className="fixed inset-0 z-100 bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-300 select-none"
    >
      {/* Background Cyber Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40f_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-stone-950/95 border border-cyan-500/40 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.22)] flex flex-col items-center text-center space-y-6">
        
        {/* Holographic Monogram Hexagon Badge */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-500 p-[2px] shadow-lg shadow-cyan-500/40 animate-pulse">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/10" />
              <span className="font-serif-luxury font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 tracking-wider">
                IF
              </span>
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-cyan-500 text-black shadow-md uppercase tracking-wider">
            PORTFOLIO
          </span>
        </div>

        {/* Title & Role */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech font-bold uppercase tracking-widest">
            <Cpu size={13} className="animate-spin" />
            <span>Digital Architect & Hardware Engineer</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-black text-white tracking-tight">
            ILHAM FAZRIL
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 font-mono-tech max-w-sm mx-auto leading-relaxed">
            Memuat Antarmuka Portofolio &amp; Arsitektur Web NFC 13.56 MHz
          </p>
        </div>

        {/* Real-Time System Telemetry & Loading Progress Bar */}
        <div className="w-full space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold truncate max-w-[280px] sm:max-w-xs text-left">
              {progress < 100 ? (
                <Loader2 size={13} className="animate-spin text-cyan-400 shrink-0" />
              ) : (
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              )}
              <span className="truncate">{statusMessage}</span>
            </span>
            <span className="font-bold text-white font-mono-tech text-sm shrink-0 pl-2">
              {progress}%
            </span>
          </div>

          {/* Progress Bar with Glow */}
          <div className="w-full h-3 rounded-full bg-stone-900 overflow-hidden p-[2px] border border-cyan-500/40">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-150 ease-out shadow-[0_0_12px_#06b6d4]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Chips */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono-tech text-stone-400">
            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-center gap-1">
              <Radio size={11} className="text-cyan-400 shrink-0" />
              <span className="truncate">NFC 13.56M</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-center gap-1">
              <Layers size={11} className="text-cyan-400 shrink-0" />
              <span className="truncate">React 18 + TS</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-center gap-1">
              <Volume2 size={11} className="text-cyan-400 shrink-0" />
              <span className="truncate">Audio Synth</span>
            </div>
          </div>
        </div>

        {/* Loading Footer Info & Skip Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-1">
          <span className="text-[11px] font-mono-tech text-stone-500 text-center sm:text-left">
            Otomatis masuk saat 100%
          </span>
          <button
            onClick={handleSkipIntro}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-cyan-500/40 text-[11px] font-mono-tech text-stone-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            Lewati Intro →
          </button>
        </div>

      </div>
    </div>
  );
};
