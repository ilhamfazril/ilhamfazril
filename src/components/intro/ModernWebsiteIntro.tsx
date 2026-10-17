'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { sound } from '../../utils/soundEffects';

export const ModernWebsiteIntro: React.FC = () => {
  const { showWebsiteIntro, setShowWebsiteIntro, introConfig } = usePortfolio();
  
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

  // Handler to unmute audio and strictly enforce continuous playback (anti-pause)
  const handleUnmuteAndEnsurePlayback = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // 1. Force audio unmuted & maximum volume
    vid.muted = false;
    vid.volume = 1.0;

    // 2. Anti-pause: if browser somehow paused, immediately resume playback
    if (vid.paused) {
      vid.play().catch(() => {});
    }

    // 3. Unlock Web Audio Context pipeline in mobile browser
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch {}
  }, []);

  // Video Autoplay & Anti-Pause Watchdogs
  useEffect(() => {
    if (!showWebsiteIntro || !introConfig.enabled) return;

    safeScrollToTop();
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    vid.volume = 1.0;
    vid.muted = false;

    // 1. Attempt unmuted playback directly on load
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If mobile browser blocks unmuted playback before first touch, start playing muted
        console.warn('Browser autoplay held audio until first interaction:', err);
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }

    // 2. Strict Anti-Pause Listener: If the browser tries to pause, immediately force resume!
    const forceResumeOnPause = () => {
      if (!hasTriggeredExit.current && vid && vid.paused) {
        vid.play().catch(() => {});
      }
    };
    vid.addEventListener('pause', forceResumeOnPause);

    // 3. Global Interaction Listeners: First touch anywhere on screen unlocks audio & ensures play
    const handleGlobalInteraction = (e: Event) => {
      handleUnmuteAndEnsurePlayback();
    };

    window.addEventListener('touchstart', handleGlobalInteraction, { capture: true, passive: true });
    window.addEventListener('pointerdown', handleGlobalInteraction, { capture: true, passive: true });
    window.addEventListener('mousedown', handleGlobalInteraction, { capture: true, passive: true });
    window.addEventListener('keydown', handleGlobalInteraction, { capture: true, passive: true });

    // 4. Fail-safe watchdog: automatically transition after 16 seconds if onEnded doesn't fire
    const watchdog = setTimeout(() => {
      triggerExit();
    }, 16000);

    return () => {
      clearTimeout(watchdog);
      vid.removeEventListener('pause', forceResumeOnPause);
      window.removeEventListener('touchstart', handleGlobalInteraction, true);
      window.removeEventListener('pointerdown', handleGlobalInteraction, true);
      window.removeEventListener('mousedown', handleGlobalInteraction, true);
      window.removeEventListener('keydown', handleGlobalInteraction, true);
    };
  }, [showWebsiteIntro, introConfig.enabled, safeScrollToTop, triggerExit, handleUnmuteAndEnsurePlayback]);

  // If intro disabled from admin or not active, do not render
  if (!showWebsiteIntro || !introConfig.enabled) {
    return null;
  }

  const videoSource = introConfig.videoUrl || '/intro.mp4';

  return (
    <div
      id="modern-website-intro-fullscreen"
      onClick={handleUnmuteAndEnsurePlayback}
      onTouchStart={handleUnmuteAndEnsurePlayback}
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none transition-opacity duration-500 cursor-default touch-none ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      aria-label="Video Intro Sinematik Layar Penuh"
    >
      {/* 
        Video Element with pointer-events-none:
        Completely disables mobile browser default tap-to-pause behavior on the video element!
      */}
      <video
        ref={videoRef}
        src={videoSource}
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        autoPlay
        controls={false}
        preload="auto"
        onPause={() => {
          // Additional inline anti-pause guard
          if (!hasTriggeredExit.current && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onEnded={triggerExit}
        onError={() => {
          console.warn('Intro video error, continuing to website.');
          triggerExit();
        }}
        className="w-full h-full object-contain md:object-cover bg-black pointer-events-none select-none"
      />

      {/* Seamless Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black animate-fade-in pointer-events-none" />
      )}
    </div>
  );
};
