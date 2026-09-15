import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Megaphone, 
  X, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  Info, 
  Flame, 
  AlertCircle 
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const FloatingAnnouncementModal: React.FC = () => {
  const { announcements, dismissedAnnouncementIds, dismissAnnouncement } = usePortfolio();

  // Find the first active announcement that hasn't been dismissed
  const activeAnnouncement = announcements.find(
    ann => ann.active && !dismissedAnnouncementIds.includes(ann.id)
  );

  if (!activeAnnouncement) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    dismissAnnouncement(activeAnnouncement.id);
  };

  const handleActionClick = (url: string) => {
    sound.playClick();
    if (url.startsWith('#')) {
      const elem = document.querySelector(url);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const badgeColorMap: Record<string, string> = {
    release: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    collaboration: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    urgent: 'bg-red-500/20 text-red-300 border-red-500/40',
  };

  return (
    <div
      id="floating-announcement-overlay"
      className="fixed inset-0 z-90 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
      onClick={() => handleClose()}
    >
      <div
        id="floating-announcement-card"
        className="relative w-full max-w-lg rounded-3xl bg-stone-950/95 border-2 border-cyan-500/50 p-5 sm:p-7 text-white shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 animate-in slide-in-from-bottom-6 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Megaphone size={16} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono-tech text-cyan-300 font-bold uppercase tracking-wider block">
                PENGUMUMAN PENGUNJUNG
              </span>
              <span className="text-xs text-stone-400 font-mono-tech">
                Broadcast Resmi Developer Ilham Fazril
              </span>
            </div>
          </div>

          <button
            id="close-floating-announcement-btn"
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Tutup Pengumuman (X)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          {activeAnnouncement.badge && (
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider font-mono-tech ${
              badgeColorMap[activeAnnouncement.type] || badgeColorMap.release
            }`}>
              {activeAnnouncement.badge}
            </span>
          )}

          <h3 className="font-serif-luxury font-black text-lg sm:text-xl text-white leading-snug">
            {activeAnnouncement.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans font-normal">
            {activeAnnouncement.message}
          </p>
        </div>

        {/* Action Button & Dismiss Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {activeAnnouncement.linkUrl ? (
            <button
              onClick={() => {
                handleActionClick(activeAnnouncement.linkUrl!);
                handleClose();
              }}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>{activeAnnouncement.linkText || 'Lihat Detail'}</span>
              <ArrowRight size={14} />
            </button>
          ) : <div />}

          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-white text-xs font-mono-tech underline transition-colors cursor-pointer"
          >
            Tutup Pengumuman
          </button>
        </div>
      </div>
    </div>
  );
};
