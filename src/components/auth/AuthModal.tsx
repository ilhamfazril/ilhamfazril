import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  KeyRound, 
  QrCode, 
  Radio, 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  Camera, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Wifi, 
  Terminal,
  Zap,
  Upload,
  RefreshCw,
  Eye
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { 
  isWebNfcSupported, 
  startWebNfcScan, 
  decodeQrFromImageData,
  decodeQrFromImageFile,
  DEV_SECRET_NFC_PAYLOAD, 
  DEV_SECRET_QR_PAYLOAD 
} from '../../utils/nfcAndQr';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    loginWithCredentials, 
    loginWithQr, 
    loginWithNfc,
    nfcCards
  } = usePortfolio();

  // Manual Credentials State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // QR Scanner State (100% Real Live Frame Decoding)
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDecodingQr, setIsDecodingQr] = useState(false);
  const [detectedQrCode, setDetectedQrCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // NFC Scanner State
  const [nfcListening, setNfcListening] = useState(false);
  const [nfcFeedback, setNfcFeedback] = useState<string | null>(null);
  const [manualUidInput, setManualUidInput] = useState('');
  const nfcAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!showAuthModal) {
      stopCamera();
      stopNfcListening();
      setAuthError(null);
      setAuthSuccessMsg(null);
      setDetectedQrCode(null);
    } else {
      if (authModalTab === 'qr') {
        startCamera();
      } else if (authModalTab === 'nfc') {
        initiateNfcListener();
      }
    }
  }, [showAuthModal, authModalTab]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopNfcListening();
    };
  }, []);

  const handleClose = () => {
    sound.playClick();
    stopCamera();
    stopNfcListening();
    setShowAuthModal(false);
  };

  // 1. Manual Login Handler
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    const result = loginWithCredentials(username, password);
    if (!result.success) {
      setAuthError(result.message);
    } else {
      setAuthSuccessMsg(result.message);
    }
  };

  const handleAutofillCredentials = () => {
    sound.playClick();
    setUsername('Ilham Fazril');
    setPassword('IlhamFazrilDev99');
  };

  // 2. Real-Time QR Camera Frame Processing Loop
  const scanQrVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameIdRef.current = requestAnimationFrame(scanQrVideoFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decodedString = decodeQrFromImageData(imageData);

      if (decodedString) {
        setDetectedQrCode(decodedString);
        sound.playScanBeep();
        const res = loginWithQr(decodedString);
        if (res.success) {
          stopCamera();
          setAuthSuccessMsg(res.message);
          return;
        } else {
          setAuthError(res.message);
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanQrVideoFrame);
  };

  const startCamera = async () => {
    setCameraError(null);
    setDetectedQrCode(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setCameraActive(true);
          animFrameIdRef.current = requestAnimationFrame(scanQrVideoFrame);
        }
      } else {
        setCameraError('Kamera tidak didukung oleh browser Anda.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Izin kamera ditolak';
      setCameraError(`Akses kamera: ${msg}. Anda dapat mengunggah file foto QR atau memakai token simulator.`);
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Upload QR Image from File / Gallery
  const handleFileUploadQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingQr(true);
    setAuthError(null);
    try {
      const decoded = await decodeQrFromImageFile(file);
      setIsDecodingQr(false);
      if (decoded) {
        setDetectedQrCode(decoded);
        sound.playScanBeep();
        const res = loginWithQr(decoded);
        if (res.success) {
          setAuthSuccessMsg(res.message);
        } else {
          setAuthError(res.message);
        }
      } else {
        sound.playError();
        setAuthError('Tidak ditemukan QR code yang valid pada gambar tersebut. Coba gambar lain.');
      }
    } catch {
      setIsDecodingQr(false);
      sound.playError();
      setAuthError('Gagal memproses file gambar QR.');
    }
  };

  const handleSimulateQrScan = () => {
    sound.playScanBeep();
    setAuthError(null);
    setDetectedQrCode(DEV_SECRET_QR_PAYLOAD);
    setTimeout(() => {
      const res = loginWithQr(DEV_SECRET_QR_PAYLOAD);
      if (!res.success) {
        setAuthError(res.message);
      }
    }, 400);
  };

  // 3. Real NFC Listener & Hardware Key Handlers
  const initiateNfcListener = async () => {
    setAuthError(null);
    setNfcFeedback('Mengaktifkan antena Web NFC 13.56 MHz hardware...');

    if (isWebNfcSupported()) {
      try {
        setNfcListening(true);
        nfcAbortController.current = new AbortController();
        setNfcFeedback('Sensor Web NFC AKTIF! Tempelkan kartu / gantungan kunci 13.56 MHz Anda ke belakang ponsel...');
        
        await startWebNfcScan((res) => {
          if (res.success && res.uid) {
            sound.playNfcTap();
            const loginRes = loginWithNfc(res.uid, res.payload);
            if (loginRes.success) {
              setAuthSuccessMsg(loginRes.message);
            } else {
              setAuthError(loginRes.message);
            }
          } else {
            sound.playError();
            setAuthError(res.error || 'Gagal membaca chip NFC.');
          }
        }, nfcAbortController.current.signal);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'NFC Error';
        setNfcFeedback(`Sensor NFC: ${msg}`);
      }
    } else {
      setNfcFeedback('Web NFC API membutuhkan peramban Android Chrome dengan koneksi HTTPS dan chip NFC aktif.');
    }
  };

  const stopNfcListening = () => {
    if (nfcAbortController.current) {
      nfcAbortController.current.abort();
      nfcAbortController.current = null;
    }
    setNfcListening(false);
  };

  const handleVerifyManualUid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUidInput.trim()) {
      setAuthError('Silakan masukkan UID fisik kartu NFC.');
      return;
    }
    sound.playNfcTap();
    setAuthError(null);
    const res = loginWithNfc(manualUidInput.trim(), DEV_SECRET_NFC_PAYLOAD);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setAuthSuccessMsg(res.message);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div 
      id="developer-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Hidden off-screen canvas for real-time video frame decoding */}
      <canvas ref={canvasRef} className="hidden" />

      <div 
        className="relative w-full max-w-xl rounded-3xl bg-stone-900 border border-amber-500/40 p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Gold/Cyan Ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="font-serif-luxury font-black text-lg text-white">
                Developer Command Gateway
              </h3>
              <p className="text-xs font-mono-tech text-cyan-300 font-semibold">
                Otentikasi Kredensial, Kamera QR Real-Time, & Sensor NFC Fisik 13.56 MHz
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-cyan-300 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black border border-stone-800">
          <button
            onClick={() => { sound.playClick(); setAuthModalTab('credentials'); }}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authModalTab === 'credentials'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <KeyRound size={15} />
            <span className="hidden sm:inline">1. Kredensial</span>
            <span className="sm:hidden">Login</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setAuthModalTab('qr'); }}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authModalTab === 'qr'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <QrCode size={15} />
            <span className="hidden sm:inline">2. Real QR Camera</span>
            <span className="sm:hidden">QR</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setAuthModalTab('nfc'); }}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authModalTab === 'nfc'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Radio size={15} />
            <span className="hidden sm:inline">3. Web NFC 13.56M</span>
            <span className="sm:hidden">NFC</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: KREDENSIAL MANUAL */}
        {authModalTab === 'credentials' && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-300">
                <Lock size={16} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white font-serif-luxury tracking-wide">
                  Autentikasi Kunci Developer
                </p>
                <p className="text-stone-300 text-[11px] font-sans">
                  Masukkan nama pengguna dan kata sandi otorisasi pribadi Anda.
                </p>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-300 font-bold flex items-center justify-between">
                  <span>Username Developer</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username developer..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-stone-800 focus:border-cyan-500 focus:outline-none text-white text-sm font-sans transition-colors placeholder:text-stone-600"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-300 font-bold flex items-center justify-between">
                  <span>Password Kunci Akses</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password developer..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-black border border-stone-800 focus:border-cyan-500 focus:outline-none text-white text-sm font-sans transition-colors placeholder:text-stone-600"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer p-1"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <Eye size={16} /> : <Lock size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm font-mono-tech tracking-wide shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Masuk ke Akun Developer</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: QR CODE SCANNER (100% REAL JSQR LIVE ENGINE) */}
        {authModalTab === 'qr' && (
          <div className="space-y-5">
            <div className="text-xs font-mono-tech text-stone-300 text-center">
              Arahkan kamera langsung ke <strong className="text-cyan-300">QR Developer Pass Ilham Fazril</strong> atau unggah file foto QR dari perangkat Anda.
            </div>

            {/* Live Camera Viewfinder with real jsQR processor */}
            <div className="relative h-64 w-full rounded-2xl bg-black border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="text-center p-6 space-y-3">
                  <Camera size={36} className="mx-auto text-cyan-500/60" />
                  <p className="text-xs font-mono-tech text-stone-300">
                    {cameraError || 'Memulai Pemindai Kamera Real-Time...'}
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-500 hover:text-black font-bold transition-all cursor-pointer"
                  >
                    Minta Ulang Izin Kamera
                  </button>
                </div>
              )}

              {/* Holographic Laser Bar */}
              {cameraActive && (
                <div className="absolute inset-6 border border-dashed border-cyan-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce shadow-[0_0_15px_#06b6d4]" />
                  <div className="absolute bottom-2 text-[10px] font-mono-tech text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded">
                    Menganalisis frame video langsung...
                  </div>
                </div>
              )}

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* Upload QR Image File Option */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUploadQr}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isDecodingQr}
                className="w-full py-3 px-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-cyan-500 text-stone-200 text-xs font-mono-tech flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold"
              >
                {isDecodingQr ? (
                  <RefreshCw size={14} className="animate-spin text-cyan-400" />
                ) : (
                  <Upload size={14} className="text-cyan-400" />
                )}
                <span>Unggah Foto / Screenshot QR Code Asli</span>
              </button>
            </div>

            {detectedQrCode && (
              <div className="p-3 rounded-xl bg-black border border-emerald-500/40 text-emerald-400 text-xs font-mono-tech truncate">
                QR Terbaca: <code>{detectedQrCode}</code>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NFC LOGIN & SYNCHRONIZATION (100% REAL HARDWARE) */}
        {authModalTab === 'nfc' && (
          <div className="space-y-4">
            {/* Quick explanation box */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-cyan-300 font-mono-tech">
                <Radio size={15} className="text-cyan-400 animate-pulse" />
                <span>Otentikasi Kartu NFC Fisik 13.56 MHz</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Gunakan pembaca sensor Web NFC native pada ponsel atau verifikasi nomor UID kartu fisik Anda (seperti e-Money, Flazz, KTP, atau kartu NTAG213/215/216).
              </p>
            </div>

            {/* Pulsing NFC Sensor Graphic */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-stone-950 border border-cyan-500/40 flex flex-col items-center justify-center space-y-3 text-center overflow-hidden">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Radio size={26} />
                </div>
                <div className="absolute -inset-2 rounded-full border border-cyan-500/20 animate-ping" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-cyan-400">
                  {nfcListening ? 'SENSOR WEB NFC 13.56 MHz AKTIF' : 'SIAP MEMINDAI CHIP NFC FISIK'}
                </span>
                <p className="text-[11px] font-mono-tech text-stone-300 max-w-sm">
                  {nfcFeedback}
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={initiateNfcListener}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-mono-tech hover:bg-cyan-400 font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Radio size={15} />
                  <span>Aktifkan Sensor Scan NFC (Tempel Kartu Fisik)</span>
                </button>
              </div>
            </div>

            {/* Authenticate with Physical Card UID */}
            <form onSubmit={handleVerifyManualUid} className="space-y-3 pt-2 border-t border-stone-800">
              <div>
                <label className="text-xs font-mono-tech text-stone-300 font-semibold block mb-1">
                  Verifikasi Nomor UID Kartu NFC Fisik:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: 04:A2:8B:C1:29:4F:80"
                    value={manualUidInput}
                    onChange={e => setManualUidInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono-tech focus:border-cyan-500 focus:outline-none text-stone-100 placeholder:text-stone-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    Verifikasi UID
                  </button>
                </div>
              </div>

              {/* Informative Hardware Instructions */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono-tech text-stone-400 space-y-1.5">
                <p className="text-stone-300 font-semibold flex items-center gap-1">
                  <Sparkles size={12} className="text-cyan-400" />
                  <span>Metode Penggunaan Kartu NFC:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-400 pl-1">
                  <li><strong>Tempel Kartu Langsung:</strong> Buka di peramban Chrome pada ponsel dengan fitur NFC aktif, klik <em>Aktifkan Sensor Scan NFC</em> dan dekatkan kartu ke bagian belakang ponsel.</li>
                  <li><strong>Otomatis Zero-Touch:</strong> Tulis URL Auto-Launch dari Admin Dashboard ke chip NFC Anda, tempel ke ponsel untuk login instan.</li>
                  <li><strong>UID Hardware:</strong> Masukkan nomor seri hex UID kartu fisik Anda pada kolom input di atas.</li>
                </ul>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

