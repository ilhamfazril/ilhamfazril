'use client';

import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Play, 
  Upload, 
  CheckCircle2, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Tv, 
  Clock, 
  Sliders, 
  Eye, 
  Film,
  Zap,
  Check
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const IntroManager: React.FC = () => {
  const { introConfig, updateIntroConfig, setShowWebsiteIntro, setViewMode } = usePortfolio();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoTimestamp, setVideoTimestamp] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleEnabled = async () => {
    sound.playClick();
    await updateIntroConfig({ enabled: !introConfig.enabled });
  };

  const handleFrequencyChange = async (freq: 'every_refresh' | 'once_per_session') => {
    sound.playClick();
    await updateIntroConfig({ frequency: freq });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('mp4') && !file.name.endsWith('.mp4')) {
      setUploadError('Hanya format file MP4 yang didukung untuk kompatibilitas lintas perangkat.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadMessage('Sedang mengunggah dan mengompresi video dengan FFmpeg (Web Stream Optimization)...');

      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/upload-intro', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah video');
      }

      setVideoTimestamp(Date.now());
      setUploadMessage(`Video intro asli berhasil diperbarui dan dikompresi optimal (${(data.size / (1024 * 1024)).toFixed(2)} MB)!`);
      sound.playSuccess();

      await updateIntroConfig({
        videoUrl: `/intro.mp4?v=${Date.now()}`,
      });

      setTimeout(() => {
        setUploadMessage(null);
      }, 5000);
    } catch (err: any) {
      setUploadError(err.message || 'Terjadi kesalahan saat mengunggah video.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePreviewAsPublic = () => {
    sound.playClick();
    setShowWebsiteIntro(true);
    setViewMode('public');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
            <Film size={16} />
            <span>Manajemen Video Pembuka Website</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              Realtime Firestore
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-black text-white">
            Konfigurasi Video Intro Sinematik
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-xl">
            Atur status pemutaran video pembuka layar penuh untuk pengunjung publik secara realtime. Setiap perubahan langsung tersinkron ke semua perangkat pengunjung.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreviewAsPublic}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
        >
          <Eye size={15} />
          <span>Tes Putar di Tampilan Publik</span>
        </button>
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Settings & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Sakelar Utama (On/Off) */}
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  Status Intro Publik
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Aktifkan Video Intro Pembuka</span>
                  {introConfig.enabled ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Zap size={11} /> Aktif (Live)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400 border border-stone-700">
                      Nonaktif
                    </span>
                  )}
                </h3>
              </div>

              {/* Modern Switch */}
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  introConfig.enabled ? 'bg-cyan-500' : 'bg-stone-700'
                }`}
                aria-label="Toggle Intro Active"
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    introConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Jika diaktifkan, pengunjung baru yang mengakses website akan langsung disuguhkan video intro layar penuh tanpa teks apapun. Jika dimatikan, pengunjung akan langsung masuk ke halaman portofolio utama.
            </p>
          </div>

          {/* Card 2: Frekuensi Pemutaran */}
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <Clock size={15} />
              <span>Frekuensi Pemutaran Video</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Every Refresh */}
              <div
                onClick={() => handleFrequencyChange('every_refresh')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  introConfig.frequency === 'every_refresh'
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-stone-950/50 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <RefreshCw size={14} className={introConfig.frequency === 'every_refresh' ? 'text-cyan-400 animate-spin' : 'text-stone-500'} />
                    <span>Setiap Refresh</span>
                  </span>
                  {introConfig.frequency === 'every_refresh' && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400">
                  Video akan selalu diputar setiap kali halaman dimuat ulang oleh siapa pun.
                </p>
              </div>

              {/* Option B: Once per Session */}
              <div
                onClick={() => handleFrequencyChange('once_per_session')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  introConfig.frequency === 'once_per_session'
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-stone-950/50 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Tv size={14} className={introConfig.frequency === 'once_per_session' ? 'text-cyan-400' : 'text-stone-500'} />
                    <span>Sekali per Kunjungan</span>
                  </span>
                  {introConfig.frequency === 'once_per_session' && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400">
                  Hanya diputar saat pertama kali pengunjung datang, refresh berikutnya langsung ke portofolio.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Ganti / Upload Video Baru */}
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Upload size={15} />
                <span>Unggah / Ganti Video Baru (.mp4)</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500">
                Otomatis Dikompresi Web 60 FPS
              </span>
            </div>

            <div className="p-5 rounded-2xl border-2 border-dashed border-stone-800 hover:border-cyan-500/50 bg-stone-950/60 flex flex-col items-center justify-center text-center space-y-3 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleFileUpload}
                className="hidden"
                id="admin-video-upload"
              />

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {isUploading ? <RefreshCw size={22} className="animate-spin" /> : <Film size={22} />}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
                >
                  {isUploading ? 'Sedang Mengompresi & Menyimpan...' : 'Pilih File Video MP4 Baru'}
                </button>
                <p className="text-xs text-stone-400 mt-2">
                  Format video vertikal (9:16) atau horizontal didukung. Video otomatis dikompresi FFmpeg untuk pemutaran instan.
                </p>
              </div>
            </div>

            {uploadMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 font-mono">
                <ShieldCheck size={16} className="text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Video Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 flex flex-col items-center text-center space-y-4">
            
            <div className="w-full flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tv size={14} />
                <span>Pratinjau Video Saat Ini</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] font-mono text-stone-300">
                15.21s • 720x1280
              </span>
            </div>

            {/* Responsive Phone Mockup Frame for Video Preview */}
            <div className="w-full max-w-[260px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-black shadow-2xl shadow-cyan-500/20 relative group">
              <video
                key={videoTimestamp}
                src={`/intro.mp4?v=${videoTimestamp}`}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover bg-black"
              />
            </div>

            <div className="w-full pt-2 text-left space-y-2 border-t border-stone-800/80 text-xs font-mono text-stone-400">
              <div className="flex items-center justify-between">
                <span>Status Kompresi:</span>
                <span className="text-emerald-400 font-bold">Optimal (~2.6 MB, FastStart)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rasio Layar:</span>
                <span className="text-cyan-300 font-bold">9:16 Vertikal Penuh</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Audio Sinematik:</span>
                <span className="text-cyan-300 font-bold">AAC Stereo 44.1 kHz</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
