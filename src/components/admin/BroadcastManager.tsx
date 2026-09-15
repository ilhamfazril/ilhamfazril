import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnnouncementItem } from '../../types';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  ExternalLink,
  Edit2,
  Radio,
  Flame,
  Info
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const BroadcastManager: React.FC = () => {
  const { 
    announcements, 
    addAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement, 
    toggleAnnouncementActive,
    resetDismissedAnnouncements 
  } = usePortfolio();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [badge, setBadge] = useState('PENGUMUMAN RESMI');
  const [type, setType] = useState<'info' | 'release' | 'urgent' | 'collaboration'>('release');
  const [linkUrl, setLinkUrl] = useState('#contact');
  const [linkText, setLinkText] = useState('Mulai Kolaborasi');
  const [dismissible, setDismissible] = useState(true);
  const [active, setActive] = useState(true);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResetForm = () => {
    setTitle('');
    setMessage('');
    setBadge('PENGUMUMAN RESMI');
    setType('release');
    setLinkUrl('#contact');
    setLinkText('Mulai Kolaborasi');
    setDismissible(true);
    setActive(true);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleStartEdit = (ann: AnnouncementItem) => {
    sound.playClick();
    setEditingId(ann.id);
    setTitle(ann.title);
    setMessage(ann.message);
    setBadge(ann.badge || 'INFO');
    setType(ann.type);
    setLinkUrl(ann.linkUrl || '');
    setLinkText(ann.linkText || 'Lihat Detail');
    setDismissible(ann.dismissible);
    setActive(ann.active);
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sound.playSuccess();

    if (editingId) {
      updateAnnouncement(editingId, {
        title,
        message,
        badge,
        type,
        linkUrl,
        linkText,
        dismissible,
        active,
      });
      setSuccessMsg('Pengumuman berhasil diperbarui! Pop-up melayang aktif untuk pengunjung.');
    } else {
      addAnnouncement({
        title,
        message,
        badge,
        type,
        linkUrl,
        linkText,
        dismissible,
        active,
      });
      setSuccessMsg('Pengumuman baru berhasil disiarkan sebagai pop-up melayang di depan layar pengunjung!');
    }

    resetDismissedAnnouncements();
    handleResetForm();
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono-tech text-xs">
            <Megaphone size={14} className="animate-pulse" />
            <span>Real-Time Visitor Broadcast Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Kirim Pengumuman Pop-up ke Pengunjung
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 max-w-2xl">
            Siarkan pesan resmi, peluncuran proyek baru, atau status kolaborasi sebagai <strong className="text-cyan-300">Pop-up Melayang di Layar Utama</strong> yang dapat ditutup (X) oleh pengunjung.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            handleResetForm();
            setIsCreating(true);
          }}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono-tech flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Live Preview of Floating Modal Pop-up */}
      <div className="space-y-3">
        <h3 className="font-serif-luxury font-bold text-base text-stone-300 flex items-center gap-2">
          <Eye size={16} className="text-cyan-400" />
          <span>Pratinjau Pop-up Melayang (Live Pop-up Modal Preview):</span>
        </h3>
        
        <div className="p-5 sm:p-6 rounded-3xl bg-stone-950 border-2 border-cyan-500/50 shadow-2xl max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Megaphone size={14} />
              </span>
              <div>
                <span className="text-[10px] font-mono-tech text-cyan-300 font-bold uppercase tracking-wider block">
                  PENGUMUMAN PENGUNJUNG
                </span>
                <span className="text-[11px] text-stone-400 font-mono-tech">
                  Broadcast Resmi Developer
                </span>
              </div>
            </div>
            <span className="p-1 rounded-lg bg-stone-900 text-stone-500 text-xs font-mono-tech">
              (X)
            </span>
          </div>

          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-mono-tech">
              {badge || 'PENGUMUMAN RESMI'}
            </span>
            <h4 className="font-serif-luxury font-bold text-lg text-white">
              {title || 'Judul Pengumuman Yang Ditampilkan'}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed font-mono-tech">
              {message || 'Isi pesan pengumuman untuk seluruh pengunjung website.'}
            </p>
          </div>

          {linkUrl && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono-tech shadow-md">
                <span>{linkText || 'Lihat Detail'}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Create/Edit Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="font-serif-luxury font-bold text-lg text-amber-300 flex items-center gap-2">
              <Send size={18} />
              <span>{editingId ? 'Edit Pengumuman Siaran' : 'Siarkan Pengumuman Baru ke Website'}</span>
            </h3>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-stone-400 hover:text-stone-100 text-xs font-mono-tech"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono-tech text-stone-400">Judul Pengumuman (Tampil Menonjol)</label>
              <input
                type="text"
                required
                placeholder="Contoh: Tersedia untuk Kolaborasi Proyek Q3/Q4 2026!"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono-tech text-stone-400">Isi Pesan Detail</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Saya sedang membuka slot pengerjaan web application berkinerja tinggi. Hubungi saya via WhatsApp atau formulir kontak."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-stone-400">Label Badge Pengumuman</label>
              <input
                type="text"
                placeholder="Contoh: RILIS RESMI / FREELANCE OPEN"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-stone-400">Kategori Tipe</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'info' | 'release' | 'urgent' | 'collaboration')}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              >
                <option value="release">Rilis Proyek / Fitur Baru (Gold)</option>
                <option value="collaboration">Kolaborasi / Karir (Emerald)</option>
                <option value="info">Informasi Umum (Blue)</option>
                <option value="urgent">Pemberitahuan Penting (Red)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-stone-400">Link URL Tombol (Bisa #contact atau URL luar)</label>
              <input
                type="text"
                placeholder="#contact atau https://..."
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-stone-400">Teks Tombol Aksi</label>
              <input
                type="text"
                placeholder="Contoh: Konsultasi Sekarang"
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-800">
            <label className="flex items-center gap-2 text-xs font-mono-tech text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={e => setActive(e.target.checked)}
                className="rounded border-stone-700 text-amber-500 focus:ring-amber-500"
              />
              <span>Aktifkan & Tampilkan Segera di Website</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-mono-tech hover:bg-stone-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Send size={15} />
                <span>{editingId ? 'Simpan Perubahan' : 'Siarkan Pengumuman'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Broadcast List */}
      <div className="space-y-4">
        <h3 className="font-serif-luxury font-bold text-lg text-stone-100 flex items-center gap-2">
          <span>Daftar Riwayat Pengumuman</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono-tech bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {announcements.length} Tersimpan
          </span>
        </h3>

        <div className="space-y-3">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                ann.active 
                  ? 'bg-stone-900/90 border-amber-500/40 shadow-lg' 
                  : 'bg-stone-900/40 border-stone-800 opacity-60'
              }`}
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-tech border ${
                    ann.active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}>
                    {ann.active ? 'STATUS: LIVE DIPUBLIKASIKAN' : 'STATUS: NON-AKTIF'}
                  </span>

                  {ann.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {ann.badge}
                    </span>
                  )}

                  <span className="text-[11px] font-mono-tech text-stone-500">
                    Dibuat: {ann.createdAt}
                  </span>
                </div>

                <h4 className="text-base font-bold text-stone-100 font-serif-luxury">
                  {ann.title}
                </h4>

                <p className="text-xs text-stone-300 font-light max-w-3xl">
                  {ann.message}
                </p>

                {ann.linkUrl && (
                  <div className="text-[11px] font-mono-tech text-amber-400 flex items-center gap-1">
                    <ExternalLink size={12} />
                    <span>Tautan: {ann.linkUrl} ({ann.linkText})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    toggleAnnouncementActive(ann.id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer ${
                    ann.active
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                      : 'border-stone-700 bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                  title={ann.active ? 'Nonaktifkan Pengumuman' : 'Aktifkan Pengumuman'}
                >
                  {ann.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  <span>{ann.active ? 'Aktif' : 'Mati'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartEdit(ann)}
                  className="p-2.5 rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:border-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Edit Pengumuman"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    deleteAnnouncement(ann.id);
                  }}
                  className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Hapus Pengumuman"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
