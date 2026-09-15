import React, { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  X, 
  LayoutDashboard, 
  Eye, 
  Cpu,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const NfcLoginIntro: React.FC = () => {
  const { 
    showNfcLoginIntro, 
    setShowNfcLoginIntro, 
    nfcIntroDetails, 
    setViewMode, 
    auth 
  } = usePortfolio();

  useEffect(() => {
    if (showNfcLoginIntro) {
      sound.playNfcSuccessIntro();
    }
  }, [showNfcLoginIntro]);

  if (!showNfcLoginIntro) return null;

  const handleGoToAdmin = () => {
    sound.playSuccess();
    setShowNfcLoginIntro(false);
    setViewMode('admin');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleStayOnPublic = () => {
    sound.playClick();
    setShowNfcLoginIntro(false);
    setViewMode('public');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <div
      id="nfc-login-intro-modal"
      className="fixed inset-0 z-100 bg-black/95 text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={handleStayOnPublic}
    >
      {/* Background Radiance & 13.56 MHz Pulsing Radar Rings */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d418_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/20 rounded-full animate-ping pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-400/30 rounded-full animate-pulse pointer-events-none" />

      {/* Main NFC Holographic Card */}
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-stone-950/95 border-2 border-cyan-400/60 p-6 sm:p-10 shadow-[0_0_70px_rgba(6,182,212,0.35)] space-y-6 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glow & Close Button */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
              <Zap size={18} />
            </span>
            <div>
              <span className="text-[11px] font-mono-tech text-cyan-300 uppercase tracking-widest font-bold block">
                NFC ZERO-TOUCH HARDWARE HANDSHAKE
              </span>
              <span className="text-xs text-stone-400 font-mono-tech">
                ISO/IEC 14443 Type A • 13.56 MHz Inductive Coupling
              </span>
            </div>
          </div>

          <button
            onClick={handleStayOnPublic}
            className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Tutup Intro"
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Holographic Chip Animation */}
        <div className="flex flex-col items-center text-center space-y-4">
          
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-cyan-300 p-[3px] shadow-[0_0_40px_rgba(6,182,212,0.5)]">
              <div className="w-full h-full bg-black rounded-[21px] flex flex-col items-center justify-center relative overflow-hidden">
                <Radio size={42} className="text-cyan-300 animate-bounce" />
                <span className="text-[9px] font-mono-tech font-bold text-cyan-400 mt-1">13.56 MHz</span>
              </div>
            </div>

            <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-emerald-500 text-black shadow-lg uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={11} />
              VERIFIED
            </span>
          </div>

          {/* Core User Announcement Text Requirement */}
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm font-mono-tech font-bold uppercase tracking-wider">
              <Zap size={14} className="text-cyan-400" />
              <span>KARTU NFC 13,56 MHz TERDETEKSI!</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-serif-luxury font-black text-white leading-tight">
              Anda Berhasil Login Ke Akun Developer Menggunakan Smart Card, Selamat Datang!
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-mono-tech leading-relaxed">
              Otentikasi kriptografi tingkat tinggi berhasil diselesaikan. Hak akses penuh <strong className="text-cyan-300">Developer Ilham Fazril</strong> telah aktif pada sesi browser ini.
            </p>
          </div>

        </div>

        {/* Hardware Chip & Card Telemetry Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/90 border border-cyan-500/40 space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Cpu size={14} />
              Smart Card Telemetry &amp; Access Log
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTH ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300 text-[11px]">
            <div>
              <span className="text-stone-500">Card UID: </span>
              <strong className="text-cyan-300 font-mono-tech">{nfcIntroDetails.uid || '04:A2:8B:C1:29:4F:80'}</strong>
            </div>
            <div>
              <span className="text-stone-500">Protokol: </span>
              <strong className="text-white">ISO/IEC 14443 Type A (13.56 MHz)</strong>
            </div>
            <div>
              <span className="text-stone-500">Developer: </span>
              <strong className="text-white">Ilham Fazril</strong>
            </div>
            <div>
              <span className="text-stone-500">Waktu Verifikasi: </span>
              <strong className="text-cyan-300">{nfcIntroDetails.timestamp || new Date().toLocaleTimeString('id-ID')}</strong>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            id="nfc-intro-dashboard-btn"
            onClick={handleGoToAdmin}
            className="py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm font-mono-tech tracking-wide shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={16} />
            <span>Buka Control Center Developer</span>
          </button>

          <button
            id="nfc-intro-live-site-btn"
            onClick={handleStayOnPublic}
            className="py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-cyan-500/40 text-stone-200 hover:text-white font-bold text-xs sm:text-sm font-mono-tech tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            <span>Jelajahi Live Site (Privileged)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
