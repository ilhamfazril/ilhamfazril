'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Play } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ModernWebsiteIntro: React.FC = () => {
  const { showWebsiteIntro, setShowWebsiteIntro, introConfig } = usePortfolio();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredExit = useRef(false);

  const safeScrollToTop = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    } catch {}
  }, []);

  const triggerExit = useCallback(() => {
    if (hasTriggeredExit.current) return;
    hasTriggeredExit.current = true;

    // Mark as viewed for session if frequency is once_per_session
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ilham_intro_viewed', 'true');
      }
    } catch {}

    setIsTransitioning(true);
    safeScrollToTop();

    try {
      sound.playSuccess();
    } catch {}

    // Smooth cinematic fade transition into the main portfolio
    setTimeout(() => {
      setShowWebsiteIntro(false);
      safeScrollToTop();
    }, 500);
  }, [safeScrollToTop, setShowWebsiteIntro]);

  // Handle first touch anywhere on screen: unlocks audio and starts unmuted video playback
  const handleStart = (e?: React.SyntheticEvent | Event) => {
    if (hasStarted) return;
    if (e && 'preventDefault' in e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    try {
      sound.playClick();
    } catch {}

    // Unlock Web Audio Context pipeline in browser
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch {}

    setHasStarted(true);

    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.volume = 1.0;
      vid.muted = false;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Initial play retry:', err);
          vid.play().catch(() => {});
        });
      }
    }
  };

  // Anti-Pause Watchdog: If anything tries to pause while playing, force resume immediately
  useEffect(() => {
    if (!hasStarted) return;

    const vid = videoRef.current;
    if (!vid) return;

    const forceResumeOnPause = () => {
      if (!hasTriggeredExit.current && vid && vid.paused) {
        vid.play().catch(() => {});
      }
    };

    vid.addEventListener('pause', forceResumeOnPause);

    // Fail-safe watchdog: automatically transition after 16 seconds if onEnded doesn't fire
    const watchdog = setTimeout(() => {
      triggerExit();
    }, 16000);

    return () => {
      clearTimeout(watchdog);
      vid.removeEventListener('pause', forceResumeOnPause);
    };
  }, [hasStarted, triggerExit]);

  // Support Space or Enter key to start experience
  useEffect(() => {
    if (!showWebsiteIntro || hasStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWebsiteIntro, hasStarted]);

  // If intro disabled from admin or not active, do not render
  if (!showWebsiteIntro || !introConfig.enabled) {
    return null;
  }

  const videoSource = introConfig.videoUrl || '/intro.mp4';

  return (
    <div
      id="modern-website-intro-fullscreen"
      onContextMenu={(e) => e.preventDefault()}
      onClick={!hasStarted ? handleStart : undefined}
      onTouchStart={!hasStarted ? handleStart : undefined}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none transition-opacity duration-500 cursor-pointer ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      aria-label="Video Intro Sinematik Layar Penuh"
    >
      {/* 
        Full Video Element (Always mounted to be ready instantly)
        pointer-events-none: Prevents Android Chrome tap-to-pause default behavior
      */}
      <video
        ref={videoRef}
        src={videoSource}
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        controls={false}
        preload="auto"
        onPause={() => {
          if (!hasTriggeredExit.current && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onEnded={triggerExit}
        onError={() => {
          console.warn('Intro video error, continuing to website.');
          triggerExit();
        }}
        className={`w-full h-full object-contain md:object-cover bg-black pointer-events-none select-none transition-opacity duration-300 ${
          hasStarted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* PHASE 1: ELEGAN 1-TOUCH ENTRANCE SCREEN (Before User Touches) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 p-4 text-center select-none">
          {/* Subtle Ambient Radial Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#082f49_0%,#030712_70%,#000000_100%)] opacity-90 pointer-events-none" />

          {/* Centered Glowing Play Badge */}
          <div className="relative group cursor-pointer flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[2px] shadow-[0_0_50px_rgba(6,182,212,0.45)] flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play size={36} className="fill-cyan-400 text-cyan-400 ml-1.5 drop-shadow-[0_0_12px_#22d3ee]" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h1 className="font-serif-luxury font-black text-2xl sm:text-3xl text-white tracking-widest drop-shadow-md">
                ILHAM FAZRIL
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono font-bold tracking-wider animate-pulse">
                <span>Ketuk Layar untuk Memulai</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-stone-500 mt-4 tracking-wide">
              Audio Sinematik Full HD • 60 FPS
            </p>
          </div>
        </div>
      )}

      {/* Seamless Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black animate-fade-in pointer-events-none z-30" />
      )}
    </div>
  );
};
