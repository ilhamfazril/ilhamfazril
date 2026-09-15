import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Megaphone, 
  Sparkles, 
  X, 
  ArrowRight, 
  Bell, 
  AlertTriangle, 
  Flame, 
  Radio 
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AnnouncementBanner: React.FC = () => {
  const { announcements } = usePortfolio();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAnnouncements = announcements.filter(
    ann => ann.active && !dismissedIds.includes(ann.id)
  );

  if (activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[0];

  const handleDismiss = (id: string) => {
    sound.playClick();
    setDismissedIds(prev => [...prev, id]);
  };

  const handleActionClick = (url?: string) => {
    sound.playClick();
    if (!url) return;
    if (url.startsWith('#')) {
      const elem = document.querySelector(url);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const badgeColorMap = {
    release: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    urgent: 'bg-red-500/20 text-red-300 border-red-500/40',
    collaboration: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };

  return (
    <div 
      id="public-announcement-banner"
      className="relative z-40 bg-black border-b border-cyan-500/30 text-white py-2 px-3 sm:px-4 shadow-lg shadow-black/40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono-tech">
        
        {/* Left: Badge and Message */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 text-center sm:text-left">
          <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
            <Megaphone size={13} className="animate-bounce" />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {currentAnnouncement.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                {currentAnnouncement.badge}
              </span>
            )}
            
            <span className="font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl">
              {currentAnnouncement.title}
            </span>

            <span className="hidden md:inline text-stone-300 text-[11px] truncate max-w-sm">
              — {currentAnnouncement.message}
            </span>
          </div>
        </div>

        {/* Right: Action & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {currentAnnouncement.linkUrl && (
            <button
              onClick={() => handleActionClick(currentAnnouncement.linkUrl)}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>{currentAnnouncement.linkText || 'Lihat Detail'}</span>
              <ArrowRight size={12} />
            </button>
          )}

          {currentAnnouncement.dismissible && (
            <button
              onClick={() => handleDismiss(currentAnnouncement.id)}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Tutup Pengumuman"
            >
              <X size={14} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
