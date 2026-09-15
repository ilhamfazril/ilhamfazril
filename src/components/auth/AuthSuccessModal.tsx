import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ShieldCheck, 
  KeyRound, 
  QrCode, 
  X, 
  LayoutDashboard, 
  Eye, 
  Sparkles, 
  CheckCircle2,
  Lock,
  Zap
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AuthSuccessModal: React.FC = () => {
  const { 
    showAuthSuccessModal, 
    setShowAuthSuccessModal, 
    authSuccessDetails, 
    setViewMode, 
    auth 
  } = usePortfolio();

  if (!showAuthSuccessModal) return null;

  const handleGoToAdmin = () => {
    sound.playSuccess();
    setShowAuthSuccessModal(false);
    setViewMode('admin');
  };

  const handleStayOnPublic = () => {
    sound.playClick();
    setShowAuthSuccessModal(false);
    setViewMode('public');
  };

  return (
    <div
      id="auth-success-modal-overlay"
      className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
      onClick={handleStayOnPublic}
    >
      <div
        id="auth-success-modal-card"
        className="relative w-full max-w-lg rounded-3xl bg-stone-950 border-2 border-cyan-500/50 p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-6 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {authSuccessDetails.method === 'qr' ? <QrCode size={18} /> : <KeyRound size={18} />}
            </span>
            <div>
              <span className="text-[10px] font-mono-tech text-cyan-300 font-bold uppercase tracking-widest block">
                {authSuccessDetails.method === 'qr' ? 'QR PASS 2FA VALIDATED' : 'CREDENTIAL SECURITY PASS'}
              </span>
              <span className="text-xs text-stone-400 font-mono-tech">
                Otentikasi Developer Command Gateway
              </span>
            </div>
          </div>

          <button
            onClick={handleStayOnPublic}
            className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Tutup Pop-up"
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Icon & Congratulatory Message */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <ShieldCheck size={36} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
              <CheckCircle2 size={12} className="text-black" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech font-bold">
              <span>AKSES PRIVILEGED AKTIF</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif-luxury font-black text-white">
              {authSuccessDetails.title || 'Login Developer Berhasil!'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-mono-tech leading-relaxed max-w-sm mx-auto">
              {authSuccessDetails.message || 'Selamat datang, Developer Ilham Fazril. Akses penuh ke Control Center dan live real-time editing telah dibuka.'}
            </p>
          </div>
        </div>

        {/* Security & Session Info Box */}
        <div className="p-4 rounded-2xl bg-black border border-stone-800 font-mono-tech text-xs space-y-2 text-stone-300">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5 text-[11px]">
            <span className="text-stone-500">Metode Masuk:</span>
            <strong className="text-cyan-300 uppercase font-bold">
              {authSuccessDetails.method === 'qr' ? 'Pemindaian Kamera QR' : 'Kredensial Password'}
            </strong>
          </div>
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5 text-[11px]">
            <span className="text-stone-500">Nama Developer:</span>
            <strong className="text-white font-bold">{auth.developerName || 'Ilham Fazril'}</strong>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Waktu Masuk:</span>
            <strong className="text-stone-300">{new Date().toLocaleTimeString('id-ID')} WIB</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            id="auth-success-go-admin-btn"
            onClick={handleGoToAdmin}
            className="py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech tracking-wide shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={15} />
            <span>Buka Dashboard</span>
          </button>

          <button
            id="auth-success-stay-public-btn"
            onClick={handleStayOnPublic}
            className="py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white font-bold text-xs font-mono-tech tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Eye size={15} />
            <span>Jelajahi Live Site</span>
          </button>
        </div>

      </div>
    </div>
  );
};
