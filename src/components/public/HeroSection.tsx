import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ArrowUpRight, 
  Radio, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase,
  Layers,
  Award,
  Zap,
  Share2
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const HeroSection: React.FC = () => {
  const { setShowAuthModal, setAuthModalTab, profile, trackContactClick } = usePortfolio();
  const [imageLoaded, setImageLoaded] = useState(false);

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
      className="relative min-h-[85vh] pt-6 sm:pt-12 pb-16 sm:pb-20 flex items-center justify-center overflow-hidden w-full max-w-full"
    >
      {/* Background ambient lighting - strictly contained */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[250px] sm:h-[350px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none max-w-full" />
      <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-blue-600/5 blur-[90px] rounded-full pointer-events-none max-w-full" />

      {/* Cyber Tech Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none max-w-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Main Headline, Pitch & Bio (7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-stone-900/90 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-600 dark:text-cyan-300 font-bold">
                {profile.headlineRole || 'Frontend Web Developer & UI/UX Specialist'}
              </span>
            </div>

            {/* Requested Main Headline - Ultra High Contrast */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-serif-luxury font-black tracking-tight leading-[1.15] text-stone-950 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]">
                Selamat Datang Di Portofolio <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black dark:drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                  {profile.name || 'Ilham Fazril'}
                </span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {profile.tagline || 'Membangun website modern yang elegan, cepat diakses di smartphone, dan terhubung dengan inovasi Kartu Pintar NFC 13.56 MHz untuk kemudahan berbagi profil secara nirsentuh.'}
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
                onClick={() => handleScrollTo('contact')}
                className="px-5 sm:px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-800 hover:border-cyan-500/60 bg-stone-100/90 dark:bg-stone-900/80 backdrop-blur-md text-black dark:text-stone-200 font-bold text-sm hover:text-cyan-600 dark:hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>Hubungi Saya</span>
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
                <span>Desain Elegan & Responsif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
                <span>Ringan & Cepat di HP</span>
              </div>
            </div>

          </div>

          {/* Right Column: Luxury Portrait Card & Real Profile Showcase (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-md group">
              
              {/* Luxury Cyan Subtle Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-cyan-500/30 opacity-70 blur-xl group-hover:opacity-100 transition duration-700 pointer-events-none" />
              
              {/* Card Container */}
              <div className="relative rounded-3xl bg-stone-950/95 border border-cyan-500/40 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl text-white space-y-5 overflow-hidden">
                
                {/* Photo & Identity Hero Block */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-black border border-stone-800 shadow-inner">
                  
                  {/* Photo Section */}
                  <div className="relative aspect-[4/4.5] sm:aspect-[4/4.8] w-full overflow-hidden flex items-center justify-center">
                    {profile.photoUrl ? (
                      <>
                        <img
                          src={profile.photoUrl}
                          alt={profile.name || 'Ilham Fazril'}
                          onLoad={() => setImageLoaded(true)}
                          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                            imageLoaded ? 'opacity-100' : 'opacity-80 blur-xs'
                          }`}
                        />
                        {/* Soft Gradient Overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      /* Elegant Monogram Fallback if no photo uploaded yet */
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-radial from-cyan-950/40 via-stone-950 to-black p-6 text-center space-y-4">
                        <div className="w-24 h-24 rounded-3xl bg-cyan-400 p-[2px] shadow-[0_0_30px_rgba(6,182,212,0.35)]">
                          <div className="w-full h-full bg-stone-950 rounded-[22px] flex items-center justify-center font-serif-luxury font-black text-cyan-300 text-4xl">
                            IF
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 font-bold block">
                            Developer Portrait
                          </span>
                          <p className="text-xs text-stone-400 font-mono-tech max-w-xs">
                            Foto asli dapat di-upload kapan saja melalui menu &quot;Foto Profil & Identitas&quot; di Admin Panel.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Floating Status Badge Top-Right */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono-tech font-bold bg-black/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 flex items-center gap-1.5 shadow-lg">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span>ONLINE</span>
                      </span>
                    </div>

                    {/* Floating Location Badge Top-Left */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono-tech font-medium bg-black/80 backdrop-blur-md border border-stone-800 text-stone-300 flex items-center gap-1.5 shadow-lg">
                        <MapPin size={12} className="text-cyan-400" />
                        <span>{profile.location || 'Cimahi, Indonesia'}</span>
                      </span>
                    </div>

                    {/* Bottom Floating Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-stone-950/90 backdrop-blur-md border border-stone-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-luxury font-black text-base sm:text-lg text-white tracking-wide">
                          {profile.name || 'ILHAM FAZRIL'}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          PRO
                        </span>
                      </div>
                      <p className="text-xs font-mono-tech text-cyan-400 font-semibold truncate">
                        {profile.headlineRole || 'Full-Stack Web Developer & NFC'}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Real Highlights Grid (No Gimmick) */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/80 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[10px] text-stone-400 block font-mono-tech">Pengalaman</span>
                    <span className="text-base sm:text-lg font-bold font-serif-luxury text-cyan-300">
                      {profile.yearsOfExp || '3+ Tahun'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/80 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[10px] text-stone-400 block font-mono-tech">Proyek</span>
                    <span className="text-base sm:text-lg font-bold font-serif-luxury text-stone-100">
                      {profile.projectsCompleted || '12+'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/80 hover:border-cyan-500/40 transition-colors">
                    <span className="text-[10px] text-stone-400 block font-mono-tech">Komitmen</span>
                    <span className="text-base sm:text-lg font-bold font-serif-luxury text-emerald-400">
                      {profile.satisfactionRate || '100%'}
                    </span>
                  </div>
                </div>

                {/* NFC Tap Card Prompt Button inside Card */}
                <button
                  id="portrait-nfc-tap-action"
                  onClick={handleNfcQuickTrigger}
                  className="w-full py-3 rounded-xl border border-cyan-500/40 bg-stone-900/80 hover:bg-cyan-500 hover:text-black text-cyan-300 font-mono-tech text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Radio size={16} />
                  <span>Simulasi Tap Kartu NFC 13.56 MHz</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
