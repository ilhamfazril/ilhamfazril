import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Terminal, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { DEV_SECRET_NFC_PAYLOAD, DEV_SECRET_QR_PAYLOAD } from '../../utils/nfcAndQr';

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'gold';
  text: string;
}

export const CyberTerminal: React.FC = () => {
  const { auth, socials, nfcCards, projects, toggleTheme, theme } = usePortfolio();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<LogEntry[]>([
    { type: 'gold', text: '═══ ILHAM FAZRIL CYBERNETIC OS CORE v4.9.0 ═══' },
    { type: 'output', text: `Kernel: Darwin/Linux Zero-Trust Engine (x86_64/arm64)` },
    { type: 'output', text: `Authenticated Developer: ${auth.developerName} [SESSION: ${auth.token || 'ACTIVE'}]` },
    { type: 'output', text: `Hardware NFC Status: ONLINE (${nfcCards.length} Registered Cards)` },
    { type: 'output', text: `Ketik 'help' untuk melihat daftar perintah.` },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    sound.playClick();
    const newLogs: LogEntry[] = [...history, { type: 'input', text: `$ ${cmd}` }];
    const lowerCmd = cmd.toLowerCase();

    switch (lowerCmd) {
      case 'help':
        newLogs.push(
          { type: 'gold', text: 'Perintah yang Tersedia:' },
          { type: 'output', text: '  status       : Tampilkan status sistem & telemetry' },
          { type: 'output', text: '  socials      : Daftar kontak media sosial dinamis' },
          { type: 'output', text: '  nfc-status   : Status chip NFC & kartu fisik terhubung' },
          { type: 'output', text: '  projects     : Ringkasan daftar proyek arsitektur' },
          { type: 'output', text: '  qr-dump      : Lihat secret token payload untuk QR Pass' },
          { type: 'output', text: '  whoami       : Tampilkan profil pengembang aktif' },
          { type: 'output', text: '  theme        : Beralih mode Obsidian / Marble Gold' },
          { type: 'output', text: '  clear        : Bersihkan riwayat layar terminal' }
        );
        break;

      case 'status':
        newLogs.push(
          { type: 'success', text: '[OK] CPU State: 60 FPS Accelerated GPU Pipeline' },
          { type: 'output', text: `[OK] Theme Active: ${theme.toUpperCase()} LUXURY` },
          { type: 'output', text: `[OK] Web NFC Engine: READY (Secret Token Injected)` },
          { type: 'output', text: `[OK] Auth Method: ${auth.method?.toUpperCase() || 'SESSION'}` }
        );
        break;

      case 'socials':
        socials.forEach(s => {
          newLogs.push({
            type: s.active ? 'success' : 'output',
            text: `  • ${s.name} [${s.username}] -> ${s.url} (Active: ${s.active})`,
          });
        });
        break;

      case 'nfc-status':
        newLogs.push({ type: 'gold', text: `Registered NFC Cards (${nfcCards.length}):` });
        nfcCards.forEach(c => {
          newLogs.push({
            type: 'output',
            text: `  [UID: ${c.uid}] - ${c.label} (${c.status})`,
          });
        });
        newLogs.push({ type: 'output', text: `  Token Payload: ${DEV_SECRET_NFC_PAYLOAD}` });
        break;

      case 'projects':
        newLogs.push({ type: 'gold', text: `Projects in Registry (${projects.length}):` });
        projects.forEach(p => {
          newLogs.push({
            type: 'output',
            text: `  [${p.category}] ${p.title} (${p.year}) - ${p.tags.join(', ')}`,
          });
        });
        break;

      case 'qr-dump':
        newLogs.push(
          { type: 'gold', text: '═══ DEVELOPER QR SECRET TOKEN PAYLOAD ═══' },
          { type: 'success', text: DEV_SECRET_QR_PAYLOAD },
          { type: 'output', text: 'Status: Cryptographically valid for Wallet ID Pass.' }
        );
        break;

      case 'whoami':
        newLogs.push(
          { type: 'gold', text: 'ILHAM FAZRIL' },
          { type: 'output', text: 'Role: Senior UI/UX Designer & Principal Frontend Engineer' },
          { type: 'output', text: 'Security Level: 9 (Executive Master Access)' }
        );
        break;

      case 'theme':
        toggleTheme();
        newLogs.push({ type: 'success', text: 'Theme toggled successfully!' });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newLogs.push({
          type: 'error',
          text: `Command not found: '${cmd}'. Ketik 'help' untuk bantuan.`,
        });
        break;
    }

    setHistory(newLogs);
    setInputVal('');
  };

  return (
    <div className="rounded-3xl bg-black border-2 border-amber-500/40 p-6 font-mono-tech text-xs text-stone-300 shadow-2xl space-y-4 overflow-hidden">
      
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-amber-400 font-bold ml-2">ilham-fazril@core-terminal:~</span>
        </div>
        <span className="text-[10px] text-stone-500">BASH / TS-EXEC</span>
      </div>

      {/* Output Screen */}
      <div className="h-80 overflow-y-auto space-y-1.5 pr-2">
        {history.map((log, i) => (
          <div key={i} className="leading-relaxed">
            {log.type === 'input' && <span className="text-stone-400 font-bold">{log.text}</span>}
            {log.type === 'output' && <span className="text-stone-300">{log.text}</span>}
            {log.type === 'error' && <span className="text-red-400">{log.text}</span>}
            {log.type === 'success' && <span className="text-emerald-400">{log.text}</span>}
            {log.type === 'gold' && <span className="text-amber-400 font-bold">{log.text}</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleCommand} className="pt-2 border-t border-stone-800 flex items-center gap-2">
        <span className="text-amber-400 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Ketik perintah (contoh: help, status, socials, nfc-status, qr-dump)..."
          className="flex-1 bg-transparent border-none outline-none text-stone-100 placeholder:text-stone-600 text-xs"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
        >
          <Send size={13} />
        </button>
      </form>

    </div>
  );
};
