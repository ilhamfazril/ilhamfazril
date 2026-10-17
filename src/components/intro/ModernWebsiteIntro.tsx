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

  // Video Autoplay & Unmuted Audio Handling
  useEffect(() => {
    if (!showWebsiteIntro || !introConfig.enabled) return;

    safeScrollToTop();
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    vid.volume = 1.0;
    vid.muted = false;

    // 1. Attempt unmuted playback directly
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If browser blocks unmuted autoplay without prior gesture, start muted temporarily
        console.warn('Browser autoplay policy held audio until first interaction:', err);
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }

    // 2. Immediate unmute on the first user touch or click anywhere on screen
    const handleFirstInteraction = () => {
      if (vid) {
        vid.muted = false;
        vid.volume = 1.0;
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction, true);
      window.removeEventListener('touchstart', handleFirstInteraction, true);
      window.removeEventListener('click', handleFirstInteraction, true);
      window.removeEventListener('keydown', handleFirstInteraction, true);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, true);
    window.addEventListener('touchstart', handleFirstInteraction, true);
    window.addEventListener('click', handleFirstInteraction, true);
    window.addEventListener('keydown', handleFirstInteraction, true);

    // 3. Fail-safe watchdog: automatically transition after 16 seconds if onEnded doesn't fire
    const watchdog = setTimeout(() => {
      triggerExit();
    }, 16000);

    return () => {
      clearTimeout(watchdog);
      removeListeners();
    };
  }, [showWebsiteIntro, introConfig.enabled, safeScrollToTop, triggerExit]);

  // If intro disabled from admin or not active, do not render
  if (!showWebsiteIntro || !introConfig.enabled) {
    return null;
  }

  const videoSource = introConfig.videoUrl || '/intro.mp4';

  return (
    <div
      id="modern-website-intro-fullscreen"
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none transition-opacity duration-500 cursor-default ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      aria-label="Video Intro Sinematik Layar Penuh"
    >
      {/* 100% Pure Fullscreen Video, No Buttons, No Icons, No Text */}
      <video
        ref={videoRef}
        src={videoSource}
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        autoPlay
        controls={false}
        preload="auto"
        onEnded={triggerExit}
        onError={() => {
          console.warn('Intro video error, continuing to website.');
          triggerExit();
        }}
        className="w-full h-full object-contain md:object-cover bg-black"
      />

      {/* Seamless Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black animate-fade-in pointer-events-none" />
      )}
    </div>
  );
};
