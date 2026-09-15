import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BrandLogo } from '../common/BrandLogo';
import { SocialMediaManager } from './SocialMediaManager';
import { NfcCardManager } from './NfcCardManager';
import { GenerateQrAndPrintPass } from './GenerateQrAndPrintPass';
import { ProjectManager } from './ProjectManager';
import { InquiriesManager } from './InquiriesManager';
import { BroadcastManager } from './BroadcastManager';
import { CyberTerminal } from './CyberTerminal';
import { 
  BarChart3, 
  Share2, 
  Radio, 
  QrCode, 
  Layers, 
  Mail, 
  Terminal, 
  LogOut, 
  Eye, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Users, 
  Activity,
  CheckCircle2,
  ExternalLink,
  Lock,
  Megaphone
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

type AdminTab = 'overview' | 'broadcast' | 'socials' | 'nfc' | 'qr-print' | 'projects' | 'inquiries' | 'terminal';

export const AdminDashboard: React.FC = () => {
  const { 
    auth, 
    logout, 
    setViewMode, 
    theme, 
    toggleTheme, 
    analytics, 
    socials, 
    projects, 
    nfcCards, 
    inquiries,
    announcements
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabSelect = (tab: AdminTab) => {
    sound.playClick();
    setActiveTab(tab);
  };

  const handleSwitchToPublic = () => {
    sound.playClick();
    setViewMode('public');
  };

  const navItems = [
    { id: 'overview', label: 'Ringkasan & Analitik', icon: <BarChart3 size={18} /> },
    { id: 'broadcast', label: 'Siaran Pengumuman', icon: <Megaphone size={18} />, badge: `${announcements.filter(a => a.active).length} Live` },
    { id: 'socials', label: 'Kendali Media Sosial', icon: <Share2 size={18} />, badge: `${socials.filter(s => s.active).length} Aktif` },
    { id: 'nfc', label: 'NFC Card 13.56 MHz', icon: <Radio size={18} />, badge: `${nfcCards.length} Kartu` },
    { id: 'qr-print', label: 'Generate QR & Cetak Pass', icon: <QrCode size={18} /> },
    { id: 'projects', label: 'Manajemen Proyek', icon: <Layers size={18} />, badge: `${projects.length}` },
    { id: 'inquiries', label: 'Pesan Masuk (Inbox)', icon: <Mail size={18} />, badge: inquiries.some(i => !i.read) ? 'Baru' : undefined },
    { id: 'terminal', label: 'Cyber Terminal', icon: <Terminal size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Top Executive Navigation Bar */}
      <header className="no-print sticky top-0 z-40 border-b border-cyan-500/20 bg-black/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={handleSwitchToPublic} className="cursor-pointer">
            <BrandLogo size="sm" withSubtitle={false} />
          </div>

          <div className="flex items-center gap-2 font-mono-tech text-xs">
            <span className="font-serif-luxury font-black text-base text-white hidden sm:inline">
              ILHAM FAZRIL
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase text-[10px] tracking-wider">
              COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Status Center */}
        <div className="flex items-center gap-3">
          {/* Auth Method Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 font-mono-tech text-xs text-stone-300">
            <Lock size={13} className="text-emerald-400" />
            <span>Auth:</span>
            <strong className="text-cyan-300 uppercase font-bold">{auth.method || 'SESSION'}</strong>
          </div>

          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 font-mono-tech text-xs text-stone-200">
            <Clock size={13} className="text-cyan-400" />
            <span>{liveTime}</span>
          </div>

          {/* Public Preview Button */}
          <button
            id="view-public-site-btn"
            onClick={handleSwitchToPublic}
            className="px-3.5 py-1.5 rounded-xl border border-stone-700 hover:border-cyan-500/50 text-stone-200 hover:text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            title="Lihat Website Pengunjung"
          >
            <Eye size={15} />
            <span className="hidden sm:inline">Mode Pengunjung</span>
          </button>

          {/* Logout Button */}
          <button
            id="admin-logout-btn"
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
            title="Keluar dari Developer Hub"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="no-print md:w-64 shrink-0 space-y-2">
          <div className="p-4 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`admin-tab-${item.id}`}
                onClick={() => handleTabSelect(item.id as AdminTab)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono-tech font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      activeTab === item.id
                        ? 'bg-black text-cyan-300'
                        : 'bg-stone-800 text-cyan-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick System Diagnostics */}
          <div className="p-4 rounded-3xl bg-stone-900/60 border border-stone-800 font-mono-tech text-[11px] space-y-2 text-stone-300">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-1">
                <Activity size={13} />
                Sensor & API Status
              </span>
              <span className="text-emerald-400 font-bold">NORMAL</span>
            </div>
            <p>Web NFC Engine: <span className="text-white font-semibold">Supported / Emulated</span></p>
            <p>Cryptographic Key: <span className="text-cyan-300 font-semibold">Level 9 Auth</span></p>
            <p>Sync Engine: <span className="text-emerald-400 font-semibold">Reactive Instant</span></p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Welcome Hero */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-cyan-950/30 border border-cyan-500/30 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono-tech uppercase tracking-wider font-bold">
                  <ShieldCheck size={16} />
                  <span>Executive Privilege Activated</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif-luxury font-black text-white">
                  Selamat Datang, <span className="text-cyan-300">Developer Ilham Fazril</span>
                </h1>
                <p className="text-xs sm:text-sm font-mono-tech text-stone-200 max-w-2xl leading-relaxed font-normal">
                  Pusat komando arsitektur web portofolio. Seluruh perubahan pada kanal media sosial, portofolio proyek, kunci kartu NFC, dan tiket QR akan langsung teraplikasikan ke tampilan publik secara real-time.
                </p>
              </div>

              {/* Real-time Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-mono-tech">Total Kunjungan</span>
                    <Users size={16} className="text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                    {analytics.pageViews.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-mono-tech text-emerald-400 block">+14% vs minggu lalu</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-mono-tech">Klik Proyek</span>
                    <Layers size={16} className="text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                    {analytics.projectClicks.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-mono-tech text-amber-400 block">{projects.length} Proyek Terpasang</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-mono-tech">Akses Kontak</span>
                    <Share2 size={16} className="text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                    {analytics.contactClicks.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-mono-tech text-emerald-400 block">{socials.filter(s => s.active).length} Saluran Aktif</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-mono-tech">NFC Hardware Taps</span>
                    <Radio size={16} className="text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                    {analytics.nfcTaps.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-mono-tech text-amber-400 block">{nfcCards.length} Kartu Aktif</span>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleTabSelect('socials')}
                  className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/20 hover:border-amber-500/50 text-left space-y-2 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Share2 size={18} />
                  </div>
                  <h3 className="font-serif-luxury font-bold text-base text-stone-100 group-hover:text-amber-400">
                    Kelola Kontak Media Sosial
                  </h3>
                  <p className="text-xs text-stone-400 font-mono-tech">
                    Ganti nomor WhatsApp, edit link Instagram, atau tambahkan tautan baru.
                  </p>
                </button>

                <button
                  onClick={() => handleTabSelect('nfc')}
                  className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/20 hover:border-amber-500/50 text-left space-y-2 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Radio size={18} />
                  </div>
                  <h3 className="font-serif-luxury font-bold text-base text-stone-100 group-hover:text-amber-400">
                    NFC Card Manager
                  </h3>
                  <p className="text-xs text-stone-400 font-mono-tech">
                    Tautkan kartu fisik baru dengan Web NFC API dan suntikkan token otentikasi.
                  </p>
                </button>

                <button
                  onClick={() => handleTabSelect('qr-print')}
                  className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/20 hover:border-amber-500/50 text-left space-y-2 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <QrCode size={18} />
                  </div>
                  <h3 className="font-serif-luxury font-bold text-base text-stone-100 group-hover:text-amber-400">
                    Generate QR & Cetak Pass
                  </h3>
                  <p className="text-xs text-stone-400 font-mono-tech">
                    Hasilkan QR Token dan cetak kartu dompet fisik resmi developer.
                  </p>
                </button>
              </div>

              {/* Embedded Terminal Preview */}
              <div className="space-y-3">
                <h3 className="font-serif-luxury font-bold text-lg text-stone-100 flex items-center gap-2">
                  <Terminal size={18} className="text-amber-400" />
                  <span>Terminal Sistem Cepat</span>
                </h3>
                <CyberTerminal />
              </div>

            </div>
          )}

          {/* TAB: BROADCAST / PENGUMUMAN PENGUNJUNG */}
          {activeTab === 'broadcast' && <BroadcastManager />}

          {/* TAB 2: SOCIAL MEDIA MANAGER */}
          {activeTab === 'socials' && <SocialMediaManager />}

          {/* TAB 3: NFC CARD MANAGER */}
          {activeTab === 'nfc' && <NfcCardManager />}

          {/* TAB 4: QR CODE GENERATOR & PRINT PASS */}
          {activeTab === 'qr-print' && <GenerateQrAndPrintPass />}

          {/* TAB 5: PROJECT MANAGER */}
          {activeTab === 'projects' && <ProjectManager />}

          {/* TAB 6: INQUIRIES / INBOX */}
          {activeTab === 'inquiries' && <InquiriesManager />}

          {/* TAB 7: CYBER TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-stone-900/80 border border-amber-500/30">
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-100">
                  Cyber Terminal Command Center
                </h2>
                <p className="text-xs font-mono-tech text-stone-400 mt-1">
                  Akses interaktif command line untuk diagnosa state, dump kunci rahasia, dan manajemen parameter sistem.
                </p>
              </div>
              <CyberTerminal />
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
