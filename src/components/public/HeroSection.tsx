import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ArrowUpRight, 
  Terminal, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  Share2,
  Zap,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const HeroSection: React.FC = () => {
  const { setShowAuthModal, setAuthModalTab } = usePortfolio();

  const handleScrollTo = (id: string) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNfcQuickTrigger = () => {
    sound.playNfcTap();
    setAuthModalTab('nfc');
    setShowAuthModal(true);
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[85vh] pt-8 sm:pt-14 pb-16 sm:pb-20 flex items-center justify-center overflow-hidden w-full max-w-full"
    >
      {/* Background ambient lighting - strictly contained */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[250px] sm:h-[350px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none max-w-full" />
      <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-blue-600/5 blur-[90px] rounded-full pointer-events-none max-w-full" />

      {/* Cyber Tech Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none max-w-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Typography & Pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-stone-900/90 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-600 dark:text-cyan-300 font-bold">
                Frontend Web Developer & UI/UX Specialist
              </span>
            </div>

            {/* Requested Main Headline - Ultra High Contrast */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-serif-luxury font-black tracking-tight leading-[1.15] text-stone-950 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]">
                Selamat Datang Di Portofolio <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black dark:drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                  Ilham Fazril
                </span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Membangun website modern yang elegan, cepat diakses di smartphone, dan terhubung dengan inovasi <strong className="font-bold text-cyan-600 dark:text-cyan-300">Kartu Pintar NFC 13.56 MHz</strong> untuk kemudahan berbagi profil secara nirsentuh.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-explore-projects-btn"
                onClick={() => handleScrollTo('projects')}
                className="px-6 sm:px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Lihat Karya & Proyek</span>
                <ArrowUpRight size={18} />
              </button>

              <button
                id="hero-quick-guide-btn"
                onClick={() => handleScrollTo('quick-guide')}
                className="px-5 sm:px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-800 hover:border-cyan-500/60 bg-stone-100/90 dark:bg-stone-900/80 backdrop-blur-md text-black dark:text-stone-200 font-bold text-sm hover:text-cyan-600 dark:hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>💡 Panduan Cara Kerja</span>
              </button>

              {/* NFC Quick Sensor Trigger */}
              <button
                id="hero-nfc-trigger-btn"
                onClick={handleNfcQuickTrigger}
                className="px-4 py-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-sm font-mono-tech font-bold transition-all cursor-pointer flex items-center gap-2"
                title="Tap kartu fisik NFC 13.56 MHz ke ponsel Anda"
              >
                <Radio size={16} className="animate-pulse text-cyan-400" />
                <span className="inline">Tes Kartu NFC</span>
              </button>
            </div>

            {/* Micro Badges / Social Proof */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-800 dark:text-stone-200 font-mono-tech font-bold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
                <span>Kartu NFC Pintar 13.56 MHz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
                <span>Desain Elegan Hitam & Putih</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
                <span>Ringan & Cepat di HP</span>
              </div>
            </div>

          </div>

          {/* Luxury Visual Holographic Card / Interactive Showcase */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-md">
              
              {/* Cyber Cyan Glow Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-cyan-500/30 opacity-60 blur-lg group-hover:opacity-90 transition duration-500 pointer-events-none" />
              
              <div className="relative rounded-3xl bg-black border border-cyan-500/40 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl text-white space-y-5">
                
                {/* Header of the Card */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-serif-luxury font-black text-cyan-300 text-xl">
                        IF
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif-luxury font-black text-lg sm:text-xl text-white tracking-wider">
                        ILHAM FAZRIL
                      </h3>
                      <p className="text-xs font-mono-tech text-cyan-400 font-semibold">
                        ID: DEV-ARCHITECT-999
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-tech uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 font-bold">
                    ONLINE
                  </span>
                </div>

                {/* Specs / Quick Metrics */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[11px] text-stone-300 block">Karier Developer</span>
                    <span className="text-lg sm:text-xl font-bold font-serif-luxury text-cyan-300">3+ Tahun</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[11px] text-stone-300 block">Tingkat Keberhasilan</span>
                    <span className="text-lg sm:text-xl font-bold font-serif-luxury text-emerald-400">100% On-Time</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[11px] text-stone-300 block">Spesialisasi</span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-100 truncate">Web NFC 13.56 MHz</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[11px] text-stone-300 block">Security Stack</span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-100 truncate">Zero-Trust Protocol</span>
                  </div>
                </div>

                {/* Simulated Terminal Status Line */}
                <div className="p-3 rounded-xl bg-black border border-cyan-950 font-mono-tech text-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400 text-[11px]">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Terminal size={13} />
                      sys_telemetry.bin
                    </span>
                    <span className="text-[10px] text-stone-500">STANDBY</span>
                  </div>
                  <p className="text-stone-300 truncate">
                    <span className="text-cyan-400">$</span> nfc_daemon: <span className="text-cyan-300">LISTENING [13.56 MHz]</span>
                  </p>
                  <p className="text-stone-400 truncate text-[11px]">
                    <span className="text-cyan-400">$</span> auto_login_url: <span className="text-stone-300">ENABLED</span>
                  </p>
                </div>

                {/* NFC Tap Card Prompt Button inside Card */}
                <button
                  id="hologram-nfc-tap-action"
                  onClick={handleNfcQuickTrigger}
                  className="w-full py-3 rounded-xl border border-cyan-500/40 bg-stone-950 hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono-tech text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Radio size={16} />
                  <span>Autentikasi Kartu NFC 13.56 MHz</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
