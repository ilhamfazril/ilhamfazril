import React, { useState } from 'react';
import { 
  Sparkles, 
  Radio, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  Smartphone, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { usePortfolio } from '../../context/PortfolioContext';

export const QuickGuideSection: React.FC = () => {
  const { setShowAuthModal, setAuthModalTab } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'overview' | 'nfc' | 'projects' | 'contact'>('overview');

  const handleTabChange = (tab: 'overview' | 'nfc' | 'projects' | 'contact') => {
    sound.playClick();
    setActiveTab(tab);
  };

  const handleScrollTo = (id: string) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenNfcModal = () => {
    sound.playNfcTap();
    setAuthModalTab('nfc');
    setShowAuthModal(true);
  };

  return (
    <section id="quick-guide" className="py-12 sm:py-16 relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Box Container */}
        <div className="rounded-3xl bg-gradient-to-b from-stone-100/90 to-stone-200/90 dark:from-stone-900/90 dark:to-black/90 border border-cyan-500/30 p-6 sm:p-10 backdrop-blur-xl shadow-xl space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-mono-tech font-bold uppercase tracking-wider">
                <HelpCircle size={14} />
                <span>Panduan Interaktif</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-black text-stone-950 dark:text-white">
                Cara Mudah Memahami <span className="text-cyan-600 dark:text-cyan-400">Website & Teknologi Ini</span>
              </h2>
              <p className="text-sm text-stone-700 dark:text-stone-300 max-w-2xl font-normal">
                Pilih topik di bawah ini untuk memahami dengan cepat siapa Ilham Fazril, bagaimana kartu pintar NFC bekerja, serta cara menjelajahi portofolio ini.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenNfcModal}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Radio size={15} />
                <span>Tes Simulasi NFC</span>
              </button>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleTabChange('overview')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/80 dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sparkles size={20} className={activeTab === 'overview' ? 'text-black' : 'text-cyan-500'} />
                <span className="text-[10px] font-mono-tech uppercase font-bold opacity-80">Bagian 1</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">Siapa Ilham Fazril?</span>
                <span className="text-[11px] opacity-80 line-clamp-1">Peran & Keahlian Utama</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('nfc')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                activeTab === 'nfc'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/80 dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Radio size={20} className={activeTab === 'nfc' ? 'text-black' : 'text-cyan-500'} />
                <span className="text-[10px] font-mono-tech uppercase font-bold opacity-80">Bagian 2</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">Kartu Pintar NFC</span>
                <span className="text-[11px] opacity-80 line-clamp-1">Cara Kerja Kartu Fisik</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('projects')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                activeTab === 'projects'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/80 dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Briefcase size={20} className={activeTab === 'projects' ? 'text-black' : 'text-cyan-500'} />
                <span className="text-[10px] font-mono-tech uppercase font-bold opacity-80">Bagian 3</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">Karya & Riwayat</span>
                <span className="text-[11px] opacity-80 line-clamp-1">Proyek & Pendidikan</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('contact')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                activeTab === 'contact'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-white/80 dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <MessageSquare size={20} className={activeTab === 'contact' ? 'text-black' : 'text-cyan-500'} />
                <span className="text-[10px] font-mono-tech uppercase font-bold opacity-80">Bagian 4</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">Cara Menghubungi</span>
                <span className="text-[11px] opacity-80 line-clamp-1">WhatsApp & Sosial Media</span>
              </div>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="rounded-2xl bg-white/90 dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
            
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-stone-950 dark:text-white">
                      Siapa itu Ilham Fazril?
                    </h3>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      <strong>Ilham Fazril</strong> adalah seorang <strong>Frontend Web Developer & UI/UX Specialist</strong> dengan pengalaman lebih dari 3 tahun. Fokus utamanya adalah membuat website yang tampil modern, cepat diakses di smartphone, memiliki keamanan tinggi, dan bisa terhubung dengan kartu pintar NFC fisik.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 block">✨ Desain Mewah & Bersih</span>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Tampilan elegan hitam-putih yang nyaman dibaca dan tidak membingungkan.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 block">⚡ Sangat Cepat & Ringan</span>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Dapat dibuka lancar di semua perangkat (Android, iPhone, Laptop, PC).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 block">💳 Inovasi Kartu NFC Pintar</span>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Pengganti kartu nama kertas biasa dengan teknologi tap nirsentuh.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleScrollTo('about')}
                    className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Baca Profil Lengkap & Jejak Karir</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'nfc' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shrink-0">
                    <Smartphone size={24} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-stone-950 dark:text-white">
                      Bagaimana Cara Kerja Kartu Nama Pintar NFC?
                    </h3>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      Kartu NFC putih yang Anda miliki bukan sekadar kartu plastik biasa, melainkan <strong>Kartu Nama Digital Interaktif</strong> yang memiliki chip frekuensi 13.56 MHz di dalamnya.
                    </p>
                  </div>
                </div>

                {/* 3 Steps Illustrated */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 text-black font-bold text-xs flex items-center justify-center">1</div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Nyalakan NFC di HP</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Pastikan pengaturan NFC di smartphone Anda atau teman Anda sudah aktif (ON).</p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 text-black font-bold text-xs flex items-center justify-center">2</div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Tempelkan Kartu</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Dekatkan kartu putih ke bagian belakang HP dekat kamera hingga HP bergetar.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 text-black font-bold text-xs flex items-center justify-center">3</div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Website Otomatis Terbuka</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Website portofolio, info kontak, dan akun developer langsung terbuka otomatis!</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-500 shrink-0" />
                  <span><strong>Kelebihan:</strong> Praktis, ramah lingkungan tanpa buang-buang kertas kartu nama, dan data portofolio bisa selalu diperbarui kapan saja.</span>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-stone-950 dark:text-white">
                      Apa Saja yang Bisa Anda Lihat di Bagian Proyek & Pendidikan?
                    </h3>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      Portofolio ini memuat rangkuman lengkap karya nyata yang pernah dibuat dan riwayat pembelajaran resmi Ilham Fazril:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-bold text-xs">
                      <Briefcase size={15} />
                      <span>Koleksi Proyek Unggulan</span>
                    </div>
                    <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                      <li>• <strong>AuraPay NFC</strong>: Sistem kartu pintar nirsentuh super cepat.</li>
                      <li>• <strong>Nexus AI Hub</strong>: Asisten AI cerdas untuk efisiensi data.</li>
                      <li>• <strong>Obsidian Dashboard</strong>: Pemantau keuangan & grafik interaktif.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-bold text-xs">
                      <GraduationCap size={15} />
                      <span>Riwayat Pendidikan Rinci</span>
                    </div>
                    <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                      <li>• PAUD Nusa Indah 19 & TK RA Nurul Huda</li>
                      <li>• SDN Cigugur Tengah Mandiri 1 & SMPN 16 Cimahi</li>
                      <li>• <strong>SMK Pusdikhubad Cimahi</strong> & <strong>PKL Dayasos Dinsos Jabar</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 justify-end">
                  <button
                    onClick={() => handleScrollTo('projects')}
                    className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Jelajahi Semua Proyek</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => handleScrollTo('education')}
                    className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Riwayat Pendidikan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-stone-950 dark:text-white">
                      Ingin Mengajak Kerjasama atau Merekrut?
                    </h3>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      Anda dapat langsung menghubungi Ilham Fazril dengan satu klik melalui saluran resmi yang paling nyaman bagi Anda:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Ilham%20Fazril%2C%20saya%20tertarik%20untuk%20berkolaborasi%20proyek."
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-bold">💬 WhatsApp Langsung</span>
                    <span className="text-[11px] opacity-80">Respon cepat untuk tanya jawab & tawaran proyek.</span>
                  </a>

                  <a
                    href="mailto:ilhamfazril042@gmail.com?subject=Project%20Inquiry%20-%20Ilham%20Fazril"
                    className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300 transition-all flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-bold">✉️ Email Resmi</span>
                    <span className="text-[11px] opacity-80">ilhamfazril042@gmail.com untuk surat resmi / NDA.</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/ilhamfazril"
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 transition-all flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-bold">💼 LinkedIn</span>
                    <span className="text-[11px] opacity-80">Koneksi jaringan profesional & riwayat karir.</span>
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
