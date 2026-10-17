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

    setTimeout(() => {
      setShowWebsiteIntro(false);
      safeScrollToTop();
    }, 450);
  }, [safeScrollToTop, setShowWebsiteIntro]);

  // Guaranteed video start handler
  const handleStart = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    try {
      sound.playClick();
    } catch {}

    const vid = videoRef.current;
    if (!vid) return;

    // Reset and try unmuted playback with full volume
    vid.currentTime = 0;
    vid.volume = 1.0;
    vid.muted = false;

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Browser held unmuted audio, falling back to muted play immediately:', err);
        // CRITICAL FALLBACK: If browser rejects unmuted audio, MUST set muted=true and play!
        // This guarantees the video ALWAYS plays and NEVER stays on a black screen!
        vid.muted = true;
        vid.play().catch(() => {
          // If video still cannot play, smoothly enter site
          triggerExit();
        });
      });
    }

    // Safety watchdog: after 350ms, if still paused for any reason, force play muted
    setTimeout(() => {
      if (vid && vid.paused && !hasTriggeredExit.current) {
        vid.muted = true;
        vid.play().catch(() => {});
      }
    }, 350);
  }, [hasStarted, triggerExit]);

  // If video is playing and user taps, ensure audio is unmuted without pausing
  const handleScreenTap = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.muted) {
      vid.muted = false;
      vid.volume = 1.0;
    }
    if (vid.paused && !hasTriggeredExit.current) {
      vid.play().catch(() => {});
    }
  }, []);

  // Anti-pause guard & timeout failsafe
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

    // Watchdog to guarantee website access after 16 seconds
    const watchdog = setTimeout(() => {
      triggerExit();
    }, 16000);

    return () => {
      clearTimeout(watchdog);
      vid.removeEventListener('pause', forceResumeOnPause);
    };
  }, [hasStarted, triggerExit]);

  // Keyboard shortcut (Space / Enter)
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
  }, [showWebsiteIntro, hasStarted, handleStart]);

  if (!showWebsiteIntro || !introConfig.enabled) {
    return null;
  }

  const videoSource = introConfig.videoUrl || '/intro.mp4';

  return (
    <div
      id="modern-website-intro-fullscreen"
      onContextMenu={(e) => e.preventDefault()}
      onClick={hasStarted ? handleScreenTap : handleStart}
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
        Video Element:
        pointer-events-none prevents native tap-to-pause from intercepting clicks.
        Always mounted with preload so it starts instantaneously.
      */}
      <video
        ref={videoRef}
        src={videoSource}
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        controls={false}
        preload="auto"
        onEnded={triggerExit}
        onError={() => {
          console.warn('Video load error, exiting to site.');
          triggerExit();
        }}
        className="w-full h-full object-contain md:object-cover bg-black pointer-events-none select-none"
      />

      {/* PHASE 1: ELEGAN ENTRANCE BUTTON (Before User Starts) */}
      {!hasStarted && (
        <div 
          onClick={handleStart}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 p-4 text-center select-none cursor-pointer"
        >
          {/* Subtle Ambient Radial Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#082f49_0%,#030712_70%,#000000_100%)] opacity-90 pointer-events-none" />

          {/* Centered Glowing Play Badge */}
          <div className="relative group cursor-pointer flex flex-col items-center animate-in fade-in zoom-in-95 duration-400 z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[2px] shadow-[0_0_50px_rgba(6,182,212,0.5)] flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play size={36} className="fill-cyan-400 text-cyan-400 ml-1.5 drop-shadow-[0_0_12px_#22d3ee]" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h1 className="font-serif-luxury font-black text-2xl sm:text-3xl text-white tracking-widest drop-shadow-md">
                ILHAM FAZRIL
              </h1>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30">
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
