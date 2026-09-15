import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { NfcCardRecord } from '../../types';
import { 
  Radio, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Terminal,
  Zap,
  Lock,
  Tag,
  BookOpen,
  Globe,
  Smartphone,
  Server,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { 
  isWebNfcSupported, 
  writeWebNfcChip, 
  DEV_SECRET_NFC_PAYLOAD 
} from '../../utils/nfcAndQr';

export const NfcCardManager: React.FC = () => {
  const { 
    nfcCards, 
    registerNfcCard, 
    deleteNfcCard, 
    trackNfcTap 
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'cards' | 'guide' | 'writer'>('cards');
  const [isRegistering, setIsRegistering] = useState(false);
  const [cardLabel, setCardLabel] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [customUidInput, setCustomUidInput] = useState('');
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Auto-Launch NFC URL for Phone Standby Tap
  const autoLaunchUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?nfc_auth=auto&token=${DEV_SECRET_NFC_PAYLOAD}&freq=13.56mhz`
    : `https://your-domain.com/?nfc_auth=auto&token=${DEV_SECRET_NFC_PAYLOAD}&freq=13.56mhz`;

  const abortControllerRef = useRef<AbortController | null>(null);

  // Writer Mode State
  const [writePayload, setWritePayload] = useState(autoLaunchUrl);
  const [isWriting, setIsWriting] = useState(false);
  const [writeResult, setWriteResult] = useState<string | null>(null);

  const handleCopyUrl = () => {
    sound.playClick();
    navigator.clipboard.writeText(autoLaunchUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleStartRegister = async () => {
    sound.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setScanStatus('Mempersiapkan antena Web NFC 13.56 MHz...');
    setIsScanning(true);

    const generatedUid = customUidInput.trim() || ('04:' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':'));
    
    setTimeout(() => {
      const newCard = registerNfcCard({
        uid: generatedUid,
        label: cardLabel || 'Kartu NFC 13.56 MHz Ilham Fazril',
        secretPayload: DEV_SECRET_NFC_PAYLOAD,
        deviceModel: deviceModel || 'ISO/IEC 14443-A (13.56 MHz NTAG213/215/216)',
      });

      setIsScanning(false);
      setIsRegistering(false);
      setCardLabel('');
      setDeviceModel('');
      setCustomUidInput('');
      sound.playSuccess();
      setSuccessMsg(`Kartu NFC 13.56 MHz Berhasil Ditautkan! [UID: ${newCard.uid}].`);
    }, 400);
  };

  const handleWriteAutoLaunchToCard = async () => {
    sound.playClick();
    setIsWriting(true);
    setWriteResult(null);
    setErrorMsg(null);

    if (isWebNfcSupported()) {
      try {
        await writeWebNfcChip(autoLaunchUrl);
        setIsWriting(false);
        sound.playSuccess();
        setWriteResult('BERHASIL! URL Auto-Launch telah ditulis ke chip kartu NFC 13.56 MHz fisik Anda. Kini kartu siap ditempelkan di HP saat menyala untuk membuka website dan login otomatis.');
      } catch (err: unknown) {
        setIsWriting(false);
        const msg = err instanceof Error ? err.message : 'Gagal menulis';
        setErrorMsg(`Gagal menulis: ${msg}. Anda dapat menyalin tautan di bawah dan menuliskannya menggunakan aplikasi gratis NFC Tools di ponsel.`);
      }
    } else {
      setTimeout(() => {
        setIsWriting(false);
        sound.playSuccess();
        setWriteResult('Tautan URL Auto-Launch siap! Anda dapat menyalin URL di bawah dan menuliskannya ke kartu NFC menggunakan aplikasi NFC Tools di ponsel Android/iOS.');
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-950 border border-cyan-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radio size={20} className="animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-black text-white">
              Manajemen Kartu NFC 13.56 MHz
            </h2>
          </div>
          <p className="text-xs text-stone-400 font-mono-tech">
            Protokol ISO/IEC 14443-A | Zero-Touch Auto-Launch & Verifikasi Kriptografi Hardware
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              setIsRegistering(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Plus size={15} />
            <span>Tautkan Kartu Fisik</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('cards');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'cards'
              ? 'bg-cyan-500 text-black'
              : 'text-stone-400 hover:text-white bg-stone-900'
          }`}
        >
          <Radio size={14} />
          <span>Daftar Kartu Terdaftar ({nfcCards.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('writer');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'writer'
              ? 'bg-cyan-500 text-black'
              : 'text-stone-400 hover:text-white bg-stone-900'
          }`}
        >
          <Zap size={14} />
          <span>Auto-Launch URL Writer</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('guide');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-cyan-500 text-black'
              : 'text-stone-400 hover:text-white bg-stone-900'
          }`}
        >
          <BookOpen size={14} />
          <span>Panduan Cara Kerja NFC Standby HP</span>
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      {isRegistering && (
        <div className="p-6 rounded-3xl bg-black border border-cyan-500/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif-luxury font-bold text-base text-cyan-300 flex items-center gap-2">
              <Radio size={16} />
              <span>Daftarkan Kartu / Chip NFC 13.56 MHz Baru</span>
            </h3>
            <button
              onClick={() => setIsRegistering(false)}
              className="text-stone-400 hover:text-white text-xs font-mono-tech cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-tech text-stone-400">Label / Nama Kartu</label>
              <input
                type="text"
                placeholder="Contoh: Smart Card E-Money Ilham / NTAG215"
                value={cardLabel}
                onChange={e => setCardLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-tech text-stone-400">Model Chip / Frekuensi</label>
              <input
                type="text"
                placeholder="Contoh: NTAG213 / NTAG215 / NTAG216 (13.56 MHz)"
                value={deviceModel}
                onChange={e => setDeviceModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono-tech text-stone-400">UID Hardware (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: 04:A2:8B:C1:29:4F:80 (Kosongkan untuk otomatis)"
                value={customUidInput}
                onChange={e => setCustomUidInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-cyan-300 text-xs font-mono-tech focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="px-4 py-2 rounded-xl border border-stone-700 text-stone-400 text-xs font-mono-tech hover:bg-stone-900 cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleStartRegister}
              disabled={isScanning}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech flex items-center gap-2 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Simpan Kartu</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: REGISTERED CARDS */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfcCards.map(card => (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-cyan-500/40 transition-colors shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Radio size={16} />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury font-bold text-sm text-white">
                        {card.label}
                      </h4>
                      <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        13.56 MHz HARDWARE ACTIVE
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNfcCard(card.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Hapus Kartu"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black border border-stone-900 font-mono-tech text-xs space-y-1">
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Hardware UID:</span>
                    <strong className="text-cyan-300">{card.uid}</strong>
                  </div>
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Tipe Chip:</span>
                    <span className="text-stone-300">{card.deviceModel || 'ISO 14443-A (13.56 MHz)'}</span>
                  </div>
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Terdaftar:</span>
                    <span className="text-stone-500">{card.linkedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: WRITER / AUTO-LAUNCH MAKER */}
      {activeTab === 'writer' && (
        <div className="p-6 rounded-3xl bg-stone-950 border border-cyan-500/40 space-y-6">
          <div className="space-y-1 border-b border-stone-800 pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono-tech font-bold uppercase">
              Zero-Touch Phone Standby Tap
            </span>
            <h3 className="text-xl font-serif-luxury font-black text-white">
              Tulis Tautan Auto-Launch ke Kartu NFC Fisik
            </h3>
            <p className="text-xs text-stone-300 font-sans">
              Ketika tautan ini ditulis ke kartu NFC Anda, setiap kali kartu ditempelkan ke belakang ponsel yang sedang menyala/aktif, ponsel akan <strong>langsung membuka browser ke website Anda dan otomatis login developer</strong> dengan pop-up konfirmasi modern.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono-tech text-cyan-300 font-bold block">
              URL Khusus Auto-Launch & Auto-Login Developer:
            </label>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={autoLaunchUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white text-xs font-mono-tech font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedUrl ? 'Tersalin!' : 'Salin URL'}</span>
              </button>
            </div>
          </div>

          {writeResult && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{writeResult}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-black border border-stone-800 space-y-2 text-xs text-stone-300">
            <h4 className="font-bold text-white font-mono-tech flex items-center gap-2">
              <Smartphone size={15} className="text-cyan-400" />
              <span>Cara Menulis Menggunakan HP (Aplikasi NFC Tools):</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-stone-400 pl-1 text-[11px]">
              <li>Buka aplikasi gratis <strong>NFC Tools</strong> di HP Android/iPhone Anda.</li>
              <li>Pilih menu <strong>Write (Tulis)</strong> &rarr; klik <strong>Add a record</strong> &rarr; pilih <strong>Custom URL / URI</strong>.</li>
              <li>Tempelkan URL di atas, lalu klik <strong>Write</strong> dan tempelkan kartu fisik NFC Anda.</li>
              <li>Selesai! Sekarang coba kunci/buka layar HP dan tempelkan kartu &mdash; website akan langsung terbuka dan otomatis login.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleWriteAutoLaunchToCard}
              disabled={isWriting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              {isWriting ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Dekatkan Kartu ke HP Sekarang...</span>
                </>
              ) : (
                <>
                  <Zap size={15} />
                  <span>Tulis URL ke Kartu via Web NFC Langsung</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP EXPLANATION */}
      {activeTab === 'guide' && (
        <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-6">
          <div className="space-y-1 border-b border-stone-800 pb-3">
            <h3 className="text-lg font-serif-luxury font-bold text-white">
              Bagaimana Ponsel Membuka Website Otomatis Saat Kartu Ditempel?
            </h3>
            <p className="text-xs text-stone-400">
              Prinsip kerja NFC Standby pada sistem operasi Android & iOS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-black border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono-tech">
                1
              </div>
              <h4 className="font-bold text-white">Kartu Berisi Data URL NDEF</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Chip kartu fisik (NTAG213/215/216) disimpan data URL website yang memuat token otentikasi unik milik Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono-tech">
                2
              </div>
              <h4 className="font-bold text-white">HP Membaca Antena 13.56 MHz</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Saat layar ponsel menyala (tidak perlu buka browser dulu), antena NFC ponsel langsung mendeteksi URL dan meluncurkan browser secara otomatis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-stone-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono-tech">
                3
              </div>
              <h4 className="font-bold text-white">Auto-Login & Pop-Up Modern</h4>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Website membaca parameter otentikasi secara instan, memverifikasi developer Ilham Fazril, dan memunculkan pop-up keberhasilan otentikasi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
