import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Radio, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  LayoutDashboard, 
  Eye, 
  X, 
  Sparkles, 
  Zap, 
  Terminal, 
  Lock
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface NfcSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid?: string;
  timestamp?: string;
}

export const NfcSuccessModal: React.FC<NfcSuccessModalProps> = ({
  isOpen,
  onClose,
  uid = '04:A2:8B:C1:29:4F:80',
  timestamp = new Date().toLocaleTimeString('id-ID'),
}) => {
  const { setViewMode } = usePortfolio();
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      sound.playNfcTap();
      const timer = setTimeout(() => {
        sound.playSuccess();
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#00F0FF', '#38BDF8', '#FFFFFF', '#0284C7', '#E0F2FE'],
          });
        } catch {}
      }, 350);

      const interval = setInterval(() => {
        setPulseCount(p => p + 1);
      }, 800);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="nfc-auto-login-success-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
    >
      {/* Outer cybernetic glow */}
      <div className="relative w-full max-w-lg rounded-3xl bg-black border border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white space-y-6 overflow-hidden">
        
        {/* Animated Background Grid & Cyber Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none opacity-40" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer z-20"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Header Icon Animation */}
        <div className="relative flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            {/* Pulsing Radar Ring */}
            <div className="w-20 h-20 rounded-full bg-cyan-950/60 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.6)]">
              <Radio size={36} className="animate-pulse text-cyan-300" />
            </div>
            <div className="absolute -inset-3 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
            <div className="absolute -inset-6 rounded-full border border-cyan-500/20 pointer-events-none" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 text-xs font-mono-tech tracking-widest uppercase font-bold">
              <Zap size={13} className="text-cyan-400" />
              <span>NFC 13.56 MHz HARDWARE DETECTED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-black text-white tracking-tight">
              Otentikasi Berhasil!
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-sm mx-auto">
              Kartu fisik NFC 13.56 MHz Anda telah terdeteksi. Akses Developer resmi dibuka secara instan.
            </p>
          </div>
        </div>

        {/* Hardware & Session Telemetry Card */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
            <span className="text-stone-400 flex items-center gap-1.5">
              <Cpu size={14} className="text-cyan-400" />
              Frekuensi Antena:
            </span>
            <span className="text-cyan-300 font-bold">13.56 MHz (ISO/IEC 14443-A)</span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
            <span className="text-stone-400 flex items-center gap-1.5">
              <Lock size={14} className="text-cyan-400" />
              Developer Otorisasi:
            </span>
            <span className="text-white font-bold">ILHAM FAZRIL</span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
            <span className="text-stone-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Status Enkripsi:
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              HARDWARE KEY VERIFIED
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
            <span>Waktu Akses: {timestamp}</span>
            <span>Mode: Zero-Touch Auto-Launch</span>
          </div>
        </div>

        {/* Terminal log simulation */}
        <div className="p-2.5 rounded-xl bg-black border border-cyan-950 text-[11px] font-mono-tech text-stone-400 space-y-1">
          <p className="text-cyan-400 flex items-center gap-1">
            <span>&gt;</span>
            <span className="text-white">auto_launch_protocol:</span>
            <span className="text-emerald-400">SUCCESS</span>
          </p>
          <p className="text-stone-400 truncate">
            &gt; session_token: <span className="text-cyan-300">AUTHORIZED_DEV_ILHAM</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              sound.playSuccess();
              setViewMode('admin');
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <LayoutDashboard size={15} />
            <span>Buka Dashboard Developer</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-cyan-400 text-white font-bold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Eye size={15} className="text-cyan-400" />
            <span>Lihat Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
