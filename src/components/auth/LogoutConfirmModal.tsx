import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  LogOut, 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const LogoutConfirmModal: React.FC = () => {
  const { 
    showLogoutConfirmModal, 
    setShowLogoutConfirmModal, 
    confirmLogout 
  } = usePortfolio();

  if (!showLogoutConfirmModal) return null;

  const handleCancel = () => {
    sound.playClick();
    setShowLogoutConfirmModal(false);
  };

  const handleConfirm = () => {
    confirmLogout();
  };

  return (
    <div
      id="logout-confirm-modal-overlay"
      className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        id="logout-confirm-modal-card"
        className="relative w-full max-w-md rounded-3xl bg-stone-950 border-2 border-red-500/40 p-6 sm:p-7 text-white shadow-[0_0_50px_rgba(239,68,68,0.25)] space-y-5 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30">
              <ShieldAlert size={18} />
            </div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider">
              TERMINATE PRIVILEGED SESSION
            </span>
          </div>

          <button
            onClick={handleCancel}
            className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Batal Keluar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Core Question Content */}
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif-luxury font-black text-xl text-white">
            Apakah Anda yakin ingin keluar dari akun developer?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 font-mono-tech leading-relaxed">
            Sesi otorisasi developer <strong className="text-cyan-300">Ilham Fazril</strong> akan ditutup. Seluruh hak akses pengelolaan proyek, siaran pengumuman, dan kontrol NFC akan dialihkan kembali ke mode publik.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            id="cancel-logout-btn"
            type="button"
            onClick={handleCancel}
            className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white font-bold text-xs font-mono-tech transition-all cursor-pointer text-center"
          >
            Batal
          </button>

          <button
            id="confirm-logout-btn"
            type="button"
            onClick={handleConfirm}
            className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono-tech shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={15} />
            <span>Ya, Keluar Akun</span>
          </button>
        </div>

      </div>
    </div>
  );
};
