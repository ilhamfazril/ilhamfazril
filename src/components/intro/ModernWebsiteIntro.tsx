'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ModernWebsiteIntro: React.FC = () => {
  const { showWebsiteIntro, setShowWebsiteIntro, introConfig } = usePortfolio();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  
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

    // Smooth cinematic iris/fade transition into the main portfolio
    setTimeout(() => {
      setShowWebsiteIntro(false);
      safeScrollToTop();
    }, 500);
  }, [safeScrollToTop, setShowWebsiteIntro]);

  // Video Autoplay Initialization
  useEffect(() => {
    if (!showWebsiteIntro || !introConfig.enabled) return;

    safeScrollToTop();
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    
    // Attempt unmuted playback first
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setAudioBlocked(false);
        })
        .catch((err) => {
          // If browser strictly blocks unmuted autoplay without prior gesture, start muted
          console.warn('Browser requires user interaction for unmuted audio, playing muted fallback:', err);
          vid.muted = true;
          setIsMuted(true);
          setAudioBlocked(true);
          vid.play().catch(() => {});
        });
    }

    // Fail-safe watchdog: automatically transition after 16 seconds if onEnded doesn't fire
    const watchdog = setTimeout(() => {
      triggerExit();
    }, 16000);

    return () => {
      clearTimeout(watchdog);
    };
  }, [showWebsiteIntro, introConfig.enabled, safeScrollToTop, triggerExit]);

  // Screen click handler: if audio was blocked by browser policy, tap anywhere to unmute
  const handleScreenClick = () => {
    const vid = videoRef.current;
    if (vid && vid.muted) {
      vid.muted = false;
      setIsMuted(false);
      setAudioBlocked(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !vid.muted;
      setIsMuted(vid.muted);
      if (!vid.muted) setAudioBlocked(false);
    }
  };

  // If intro disabled from admin or not active, do not render
  if (!showWebsiteIntro || !introConfig.enabled) {
    return null;
  }

  const videoSource = introConfig.videoUrl || '/intro.mp4';

  return (
    <div
      id="modern-website-intro-fullscreen"
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none transition-opacity duration-500 ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      aria-label="Video Intro Sinematik Layar Penuh"
    >
      {/* Absolute Fullscreen Video Background */}
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
          // If video fails to load, gracefully exit to website
          console.warn('Intro video playback error, skipping to website.');
          triggerExit();
        }}
        className="w-full h-full object-contain md:object-cover bg-black"
      />

      {/* Discreet Audio Status Control (Pure Icon, No Text) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={handleToggleMute}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
          aria-label={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-amber-400" />
          ) : (
            <Volume2 size={18} className="text-cyan-400" />
          )}
        </button>
      </div>

      {/* If Audio was auto-blocked by browser, subtle pulsing icon prompt at bottom (No text) */}
      {audioBlocked && (
        <div 
          onClick={handleToggleMute}
          className="absolute bottom-6 inset-x-0 flex justify-center z-20 pointer-events-auto cursor-pointer"
        >
          <div className="px-3.5 py-2 rounded-full bg-black/70 border border-cyan-400/50 backdrop-blur-md shadow-2xl flex items-center gap-2 text-cyan-300 animate-pulse">
            <VolumeX size={16} className="text-amber-400" />
            <Volume2 size={16} className="text-cyan-400" />
          </div>
        </div>
      )}

      {/* Seamless Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black animate-fade-in pointer-events-none" />
      )}
    </div>
  );
};
