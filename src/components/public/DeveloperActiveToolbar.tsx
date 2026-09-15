import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ShieldCheck, LayoutDashboard, LogOut, Radio, QrCode, Key, Eye } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const DeveloperActiveToolbar: React.FC = () => {
  const { auth, setViewMode, logout } = usePortfolio();

  if (!auth.isAuthenticated) return null;

  const getMethodBadge = () => {
    switch (auth.method) {
      case 'nfc':
        return (
          <span className="flex items-center gap-1 text-emerald-400 font-mono-tech text-[11px]">
            <Radio size={12} className="animate-pulse" />
            <span>NFC 13.56 MHz Verified</span>
          </span>
        );
      case 'qr':
        return (
          <span className="flex items-center gap-1 text-amber-400 font-mono-tech text-[11px]">
            <QrCode size={12} />
            <span>QR Camera Scan</span>
          </span>
        );
      case 'credentials':
      default:
        return (
          <span className="flex items-center gap-1 text-blue-400 font-mono-tech text-[11px]">
            <Key size={12} />
            <span>Master Key Auth</span>
          </span>
        );
    }
  };

  return (
    <div
      id="dev-active-status-bar"
      className="bg-black text-white border-b border-cyan-500/40 py-2 px-3 sm:px-4 shadow-xl z-50 text-xs transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Status Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-300 font-serif-luxury tracking-wide">
              DEVELOPER LOGGED IN:
            </span>
            <span className="font-bold text-white">
              {auth.developerName || 'Ilham Fazril'}
            </span>
          </div>

          <div className="hidden sm:inline-block pl-2 border-l border-stone-800">
            {getMethodBadge()}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 font-mono-tech text-[11px]">
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
            <Eye size={12} />
            <span>Live Site Mode</span>
          </span>

          <button
            id="dev-toolbar-open-dashboard"
            onClick={() => {
              sound.playSuccess();
              setViewMode('admin');
            }}
            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Buka Control Center Developer"
          >
            <LayoutDashboard size={13} />
            <span>Buka Dashboard Developer</span>
          </button>

          <button
            id="dev-toolbar-logout"
            onClick={logout}
            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-stone-800 hover:border-red-500/40 transition-colors flex items-center gap-1 cursor-pointer"
            title="Keluar dari Akun Developer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
