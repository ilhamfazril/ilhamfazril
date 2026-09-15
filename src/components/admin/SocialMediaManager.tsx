import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SocialPlatform } from '../../types';
import { PlatformIcon } from '../common/PlatformIcon';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles,
  Link,
  Tag,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

const AVAILABLE_ICONS: SocialPlatform['iconKey'][] = [
  'whatsapp',
  'instagram',
  'linkedin',
  'github',
  'twitter',
  'telegram',
  'discord',
  'mail',
  'globe',
  'youtube',
  'tiktok',
];

const PRESET_COLORS = [
  { name: 'WhatsApp Green', color: '#25D366' },
  { name: 'Instagram Crimson', color: '#E4405F' },
  { name: 'LinkedIn Blue', color: '#0A66C2' },
  { name: 'Gold Luxury', color: '#D4AF37' },
  { name: 'Telegram Cyan', color: '#229ED9' },
  { name: 'Discord Indigo', color: '#5865F2' },
  { name: 'Google Red', color: '#EA4335' },
  { name: 'Slate Steel', color: '#64748B' },
];

export const SocialMediaManager: React.FC = () => {
  const { socials, addSocial, updateSocial, deleteSocial, toggleSocialActive, resetSocials } = usePortfolio();

  // Form State for Add / Edit
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    iconKey: SocialPlatform['iconKey'];
    url: string;
    username: string;
    badge: string;
    color: string;
    active: boolean;
    description: string;
  }>({
    name: '',
    iconKey: 'whatsapp',
    url: '',
    username: '',
    badge: '',
    color: '#25D366',
    active: true,
    description: '',
  });

  const handleStartAdd = () => {
    sound.playClick();
    setEditingId(null);
    setFormData({
      name: '',
      iconKey: 'whatsapp',
      url: '',
      username: '',
      badge: 'Direct Link',
      color: '#25D366',
      active: true,
      description: '',
    });
    setIsAdding(true);
  };

  const handleStartEdit = (social: SocialPlatform) => {
    sound.playClick();
    setIsAdding(false);
    setEditingId(social.id);
    setFormData({
      name: social.name,
      iconKey: social.iconKey,
      url: social.url,
      username: social.username,
      badge: social.badge || '',
      color: social.color,
      active: social.active,
      description: social.description || '',
    });
  };

  const handleCancel = () => {
    sound.playClick();
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    if (isAdding) {
      addSocial({
        name: formData.name,
        iconKey: formData.iconKey,
        url: formData.url,
        username: formData.username || formData.name,
        badge: formData.badge || undefined,
        color: formData.color,
        active: formData.active,
        description: formData.description || undefined,
      });
      setIsAdding(false);
    } else if (editingId) {
      updateSocial(editingId, {
        name: formData.name,
        iconKey: formData.iconKey,
        url: formData.url,
        username: formData.username || formData.name,
        badge: formData.badge || undefined,
        color: formData.color,
        active: formData.active,
        description: formData.description || undefined,
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <span>Kontrol & Pengelola Kontak Media Sosial</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Live Synchronized
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 mt-1">
            Tambah platform baru, perbarui nomor WhatsApp/username, ubah warna, atau sembunyikan kontak dari Halaman Publik secara instan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetSocials}
            className="px-3.5 py-2 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke kontak default Ilham Fazril"
          >
            <RefreshCw size={14} />
            <span>Reset Default</span>
          </button>

          <button
            id="add-social-btn"
            onClick={handleStartAdd}
            className="px-5 py-2 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Platform Baru</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form Drawer */}
      {(isAdding || editingId) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="font-serif-luxury font-bold text-lg text-amber-300 flex items-center gap-2">
              <Sparkles size={18} />
              <span>{isAdding ? 'Tambah Platform Kontak Baru' : 'Edit Detail Platform Kontak'}</span>
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Platform Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Nama Platform *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: WhatsApp, Instagram, Telegram"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Username / Handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Username / Nomor Telepon *</label>
                <input
                  type="text"
                  required
                  placeholder="+62 812-3456-7890 atau @ilhamfazril"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Target URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Target URL / Link Tujuan *</label>
                <input
                  type="url"
                  required
                  placeholder="https://wa.me/6281234567890 atau https://instagram.com/..."
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Label Badge (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Fast Response, Official, Verified"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono-tech text-stone-400">Deskripsi Singkat</label>
                <input
                  type="text"
                  placeholder="Konsultasi cepat, kolaborasi proyek, atau pesan privat"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono-tech text-stone-400 block">Pilih Ikon Platform</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ICONS.map(iconKey => (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconKey })}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono-tech transition-all cursor-pointer ${
                      formData.iconKey === iconKey
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <PlatformIcon iconKey={iconKey} size={18} />
                    <span className="capitalize">{iconKey}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono-tech text-stone-400 block">Pilih Aksen Warna</label>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_COLORS.map(p => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: p.color })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer ${
                      formData.color === p.color ? 'border-amber-400 bg-stone-800' : 'border-stone-800 bg-stone-950'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-stone-300">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-mono-tech hover:bg-stone-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Check size={16} />
                <span>{isAdding ? 'Simpan & Publikasikan' : 'Perbarui Kontak'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Social Cards List Table & Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {socials.map(social => (
          <div
            key={social.id}
            className={`p-5 rounded-3xl bg-stone-900/80 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
              social.active ? 'border-amber-500/30' : 'border-stone-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${social.color}25`, color: social.color }}
                >
                  <PlatformIcon iconKey={social.iconKey} size={20} />
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Toggle Active Switch */}
                  <button
                    type="button"
                    onClick={() => toggleSocialActive(social.id)}
                    className={`p-1.5 rounded-lg text-xs font-mono-tech transition-colors ${
                      social.active
                        ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'text-stone-500 bg-stone-800 hover:bg-stone-700'
                    }`}
                    title={social.active ? 'Tampil di Halaman Pengunjung' : 'Disembunyikan'}
                  >
                    {social.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(social)}
                    className="p-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                    title="Edit Data Kontak"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSocial(social.id)}
                    className="p-1.5 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    title="Hapus Platform"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif-luxury font-bold text-base text-stone-100">
                    {social.name}
                  </h4>
                  {social.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-stone-800 text-amber-300 border border-stone-700">
                      {social.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono-tech text-stone-400 truncate">
                  {social.username}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 font-mono-tech text-[11px] text-amber-400/90 truncate flex items-center justify-between">
                <span className="truncate">{social.url}</span>
                <a href={social.url} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-300 ml-2">
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-stone-500 pt-2 border-t border-stone-800/80">
              <span>Status: {social.active ? 'Aktif (Live)' : 'Disembunyikan'}</span>
              <span style={{ color: social.color }}>● Warna Kustom</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
