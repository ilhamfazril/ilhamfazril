import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Award, 
  Compass,
  Zap,
  Radio
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AboutSection: React.FC = () => {
  const milestones = [
    {
      year: '2025 — Sekarang',
      role: 'Principal Frontend Architect & IoT/NFC Specialist',
      org: 'Autonomous & Private Enterprise Systems',
      desc: 'Memimpin arsitektur antarmuka digital skala besar, merancang sistem Web NFC kustom, dan membangun UI micro-interactions dengan performa 60 FPS murni.',
    },
    {
      year: '2024 — 2025',
      role: 'Lead UI/UX Designer & Fullstack Engineer',
      org: 'Fintech & Cloud Solutions',
      desc: 'Membangun dashboard analitik perbankan privat, platform visualisasi graph data tinggi, serta design systems bernilai tinggi.',
    },
    {
      year: '2023 — 2024',
      role: 'Frontend Engineer & Interface Developer',
      org: 'Digital Product Labs',
      desc: 'Spesialisasi dalam React, TypeScript, state pipeline reaktif, integrasi WebSockets real-time, dan optimasi performa core web vitals sub-detik.',
    },
  ];

  const pillars = [
    {
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      title: 'Desain Pure Hitam & Putih',
      desc: 'Standar visual tanpa kompromi. Menggabungkan tipografi editorial, kontras hitam putih murni, dan aksen biru teknologi yang futuristik.',
    },
    {
      icon: <Radio className="w-6 h-6 text-cyan-400" />,
      title: 'Integrasi Hardware & Web NFC 13.56 MHz',
      desc: 'Menjembatani dunia fisik dan digital. Eksekusi chip NDEF, autentikasi kartu nirsentuh, dan arsitektur hardware web terdepan.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: 'Keamanan Zero-Trust & Presisi',
      desc: 'Validasi kriptografi ketat (AES-256 / SHA-256), perlindungan sesi aman, dan kode modular yang tahan uji beban tinggi.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs uppercase tracking-widest font-semibold">
            <Compass size={13} />
            <span>Filosofi & Profil</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-black text-black dark:text-white tracking-tight">
            Tentang <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black">Ilham Fazril</span>
          </h2>
          <p className="text-stone-800 dark:text-stone-200 text-base sm:text-lg font-normal leading-relaxed">
            Seorang Principal Frontend Engineer dan Senior UI/UX Designer berpengalaman <strong>3+ Tahun</strong> yang berfokus pada kreasi produk digital kelas atas, menggabungkan kejernihan visual hitam-putih dengan rekayasa sistem hardware NFC yang tangguh.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              onMouseEnter={() => sound.playHover()}
              className="p-6 sm:p-8 rounded-2xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-cyan-500/50 backdrop-blur-xl shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                {pillar.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-stone-950 dark:text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-stone-800 dark:text-stone-100 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Experience Timeline */}
        <div className="p-6 sm:p-10 rounded-3xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 backdrop-blur-xl space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif-luxury font-black text-stone-950 dark:text-white">
                Jejak Karier & Arsitektur
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 font-mono-tech">
                Rekam jejak 3+ tahun kepemimpinan teknis dan rekayasa antarmuka
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs font-bold">
              <Award size={15} />
              <span>Verified 3+ Years Track Record</span>
            </div>
          </div>

          <div className="space-y-7 relative before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-cyan-500/30 before:to-transparent">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Timeline Node */}
                <div className="absolute left-1 sm:left-3 top-1.5 w-4 h-4 rounded-full bg-black border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/30" />
                
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
                      {item.year}
                    </span>
                    <span className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 font-semibold">
                      {item.org}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-serif-luxury font-bold text-stone-950 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {item.role}
                  </h4>
                  <p className="text-sm text-stone-800 dark:text-stone-100 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
