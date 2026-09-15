import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  KeyRound, 
  Check, 
  Copy,
  Lock,
  FileBadge
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { generateQrDataUrl, DEV_SECRET_QR_PAYLOAD } from '../../utils/nfcAndQr';

export const GenerateQrAndPrintPass: React.FC = () => {
  const { auth } = usePortfolio();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [passIssueDate] = useState(() => new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }));

  useEffect(() => {
    generateQrDataUrl(DEV_SECRET_QR_PAYLOAD, true).then(url => {
      setQrDataUrl(url);
    });
  }, []);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleCopyToken = () => {
    sound.playClick();
    navigator.clipboard.writeText(DEV_SECRET_QR_PAYLOAD);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Print Trigger Banner */}
      <div className="no-print p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono-tech text-xs">
            <ShieldCheck size={14} />
            <span>Executive Cryptographic Security Badge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Generate Developer QR & Printable Card
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 max-w-2xl">
            Cetak kartu akses fisik resmi berstandar dompet (Wallet Size ID Card). Kartu ini berisi QR Code token developer Ilham Fazril untuk otentikasi cepat di berbagai terminal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="print-qr-pass-btn"
            onClick={handlePrint}
            className="px-6 py-3 rounded-2xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <Printer size={16} />
            <span>Cetak Kartu QR (Print Pass)</span>
          </button>
        </div>
      </div>

      {/* Secret Token Info Box (no-print) */}
      <div className="no-print p-5 rounded-2xl bg-stone-950/80 border border-stone-800 font-mono-tech text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-stone-300">
          <Lock size={15} className="text-amber-400 shrink-0" />
          <span>Embedded Secret Auth Token:</span>
          <code className="text-amber-300 font-bold">{DEV_SECRET_QR_PAYLOAD}</code>
        </div>

        <button
          onClick={handleCopyToken}
          className="px-3 py-1.5 rounded-lg border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-300 text-[11px] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          {copiedToken ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copiedToken ? 'Disalin!' : 'Salin Token'}</span>
        </button>
      </div>

      {/* LUXURY PHYSICAL WALLET-SIZE BADGE CARD PREVIEW (Ready for Print & Display) */}
      <div className="flex justify-center py-4">
        
        <div 
          id="printable-executive-pass"
          className="relative w-full max-w-[500px] rounded-3xl bg-stone-950 text-stone-100 border-2 border-amber-500/60 shadow-2xl p-7 space-y-6 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(180, 83, 9, 0.08) 0%, transparent 60%)'
          }}
        >
          {/* Top Gold Geometric Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-400 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-400 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-400 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-400 rounded-br-3xl pointer-events-none" />

          {/* Badge Card Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl luxury-gold-gradient p-[1.5px] shadow-md">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center font-serif-luxury font-bold text-amber-400 text-lg">
                  IF
                </div>
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-base tracking-wider text-stone-100">
                  ILHAM FAZRIL
                </h3>
                <p className="text-[10px] font-mono-tech uppercase tracking-widest text-amber-400">
                  Principal System Architect
                </p>
              </div>
            </div>

            <div className="text-right font-mono-tech">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider block">
                MASTER KEY
              </span>
              <span className="text-[9px] text-stone-500 block mt-1">ID: #DEV-999-SEC</span>
            </div>
          </div>

          {/* Main Card Content Grid */}
          <div className="grid grid-cols-12 gap-5 items-center">
            
            {/* QR Code Container */}
            <div className="col-span-6 sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-amber-400 shadow-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Developer Auth QR Code"
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-stone-400 text-xs">
                  Generating QR...
                </div>
              )}
              <span className="text-[9px] font-mono-tech text-stone-900 font-bold uppercase tracking-widest mt-1">
                SCAN TO AUTHENTICATE
              </span>
            </div>

            {/* Credentials & Details */}
            <div className="col-span-6 sm:col-span-7 space-y-3 font-mono-tech text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Pemegang Lisensi:</span>
                <strong className="text-sm font-bold text-stone-100 font-serif-luxury block">
                  Ilham Fazril
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Tanggal Terbit:</span>
                <span className="text-stone-300 text-xs">{passIssueDate}</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Metode Autentikasi:</span>
                <span className="text-amber-300 text-xs">QR Scanner / Web NFC API</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Tingkat Keamanan:</span>
                <span className="text-emerald-400 text-xs font-bold">LEVEL 9 — UNRESTRICTED</span>
              </div>
            </div>

          </div>

          {/* Bottom Security Hologram Strip & Barcode Simulator */}
          <div className="pt-4 border-t border-amber-500/30 flex items-center justify-between font-mono-tech text-[10px] text-stone-400">
            <div className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck size={14} />
              <span>CRYPTOGRAPHICALLY SIGNED PASS</span>
            </div>
            <span>DOMPET WALLET FORMAT</span>
          </div>

        </div>

      </div>

    </div>
  );
};
