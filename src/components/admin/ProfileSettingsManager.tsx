import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  User, 
  Upload, 
  Trash2, 
  Sparkles, 
  Check, 
  Image as ImageIcon, 
  MapPin, 
  Briefcase, 
  Award, 
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { processAndCompressImage, getImageSizeKb } from '../../utils/imageUtils';

export const ProfileSettingsManager: React.FC = () => {
  const { profile, updateProfile, resetProfile, setViewMode } = usePortfolio();

  const [formData, setFormData] = useState({
    name: profile.name || 'Ilham Fazril',
    headlineRole: profile.headlineRole || 'Full-Stack Developer & NFC Hardware Specialist',
    tagline: profile.tagline || 'Membangun ekosistem web ultra-modern, performa tinggi, dan terintegrasi kartu pintar nirsentuh.',
    location: profile.location || 'Cimahi, Indonesia',
    statusBadge: profile.statusBadge || 'Tersedia untuk Proyek & Kolaborasi',
    yearsOfExp: profile.yearsOfExp || '3+ Tahun',
    projectsCompleted: profile.projectsCompleted || '12+',
    satisfactionRate: profile.satisfactionRate || '100% On-Time',
    photoUrl: profile.photoUrl || '',
    email: profile.email || 'ilhamfazril042@gmail.com',
    phone: profile.phone || '+62 812-3456-7890',
    whatsapp: profile.whatsapp || 'https://wa.me/6281234567890?text=Halo%20Ilham%20Fazril%2C%20saya%20tertarik%20untuk%20berkolaborasi%20proyek.',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize form if remote Firestore profile updates
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: profile.name || prev.name,
      headlineRole: profile.headlineRole || prev.headlineRole,
      tagline: profile.tagline || prev.tagline,
      location: profile.location || prev.location,
      statusBadge: profile.statusBadge || prev.statusBadge,
      yearsOfExp: profile.yearsOfExp || prev.yearsOfExp,
      projectsCompleted: profile.projectsCompleted || prev.projectsCompleted,
      satisfactionRate: profile.satisfactionRate || prev.satisfactionRate,
      photoUrl: profile.photoUrl !== undefined ? profile.photoUrl : prev.photoUrl,
      email: profile.email || prev.email,
      phone: profile.phone || prev.phone,
      whatsapp: profile.whatsapp || prev.whatsapp,
    }));
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Harap pilih file gambar valid (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsProcessing(true);
      // Auto compress to max 1000px, 0.82 JPEG for instant Firestore syncing without 1MB limit issues
      const compressedDataUrl = await processAndCompressImage(file, {
        maxWidth: 1000,
        maxHeight: 1200,
        quality: 0.82,
        format: 'image/jpeg',
      });
      setFormData(prev => ({ ...prev, photoUrl: compressedDataUrl }));
      setIsSaved(false);
      sound.playSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      setPhotoError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = () => {
    sound.playClick();
    setFormData(prev => ({ ...prev, photoUrl: '' }));
    setIsSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan setelan profil ke nilai default awal?')) {
      resetProfile();
      setFormData({
        name: 'Ilham Fazril',
        headlineRole: 'Full-Stack Developer & NFC Hardware Specialist',
        tagline: 'Membangun ekosistem web ultra-modern, performa tinggi, dan terintegrasi kartu pintar nirsentuh.',
        location: 'Cimahi, Indonesia',
        statusBadge: 'Tersedia untuk Proyek & Kolaborasi',
        yearsOfExp: '3+ Tahun',
        projectsCompleted: '12+',
        satisfactionRate: '100% On-Time',
        photoUrl: '',
        email: 'ilhamfazril042@gmail.com',
        phone: '+62 812-3456-7890',
        whatsapp: 'https://wa.me/6281234567890?text=Halo%20Ilham%20Fazril%2C%20saya%20tertarik%20untuk%20berkolaborasi%20proyek.',
      });
      setIsSaved(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider font-bold">
            <Sparkles size={16} />
            <span>Profile & Photo Command Center</span>
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-white mt-1">
            Pengaturan Foto Profil & Identitas Hero
          </h2>
          <p className="text-xs font-mono-tech text-stone-300 mt-1">
            Upload foto asli Anda di sini. Foto akan otomatis muncul pada kartu sorotan Hero di laptop maupun di ponsel.
          </p>
        </div>

        <button
          onClick={() => setViewMode('public')}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono-tech text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <span>Lihat di Tampilan Publik</span>
          <ExternalLink size={14} />
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Photo Uploader & Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-5">
            <h3 className="font-serif-luxury font-bold text-base text-stone-100 flex items-center gap-2">
              <ImageIcon size={18} className="text-cyan-400" />
              <span>Foto Profil Developer</span>
            </h3>

            {/* Photo Card Preview Container */}
            <div className="flex flex-col items-center">
              <div className="relative group w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden bg-black border-2 border-dashed border-cyan-500/40 flex items-center justify-center shadow-xl">
                {formData.photoUrl ? (
                  <>
                    <img
                      src={formData.photoUrl}
                      alt="Preview Profil"
                      className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Upload size={13} />
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Trash2 size={13} />
                        Hapus Foto
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center font-serif-luxury font-black text-2xl text-cyan-300">
                      IF
                    </div>
                    <p className="text-xs font-mono-tech text-stone-400">
                      Belum ada foto yang di-upload
                    </p>
                    <span className="text-[10px] font-mono-tech text-cyan-400 block">
                      (Tampilan publik saat ini: Monogram Mewah &quot;IF&quot;)
                    </span>
                  </div>
                )}
              </div>

              {formData.photoUrl && (
                <div className="mt-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-tech text-[11px] flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 size={13} />
                  <span>Gambar Terkompresi: ~{getImageSizeKb(formData.photoUrl)} KB (Super Ringan)</span>
                </div>
              )}

              {photoError && (
                <p className="text-xs text-red-400 font-mono-tech mt-2 text-center">
                  ⚠️ {photoError}
                </p>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-photo-file-input"
              />
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Upload size={16} />
                <span>{isProcessing ? 'Mengompres & Memproses Foto...' : 'Pilih Foto dari Laptop / Galeri HP'}</span>
              </button>

              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Hapus Foto & Gunakan Monogram IF</span>
                </button>
              )}

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] font-mono-tech text-stone-300 space-y-1">
                <span className="text-cyan-400 font-bold block flex items-center gap-1">
                  ⚡ Kompresi Otomatis Aktif
                </span>
                <p className="text-stone-400 leading-relaxed">
                  Setiap foto yang Anda upload otomatis dikompresi ke format JPEG optimal (kualitas tajam, ukuran ringan ~50-80 KB) agar website dapat dimuat seketika di ponsel dan laptop tanpa beban kuota.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identity & Bio Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
            <h3 className="font-serif-luxury font-bold text-base text-stone-100 flex items-center gap-2">
              <User size={18} className="text-cyan-400" />
              <span>Detail Informasi & Badge Hero</span>
            </h3>

            <div className="space-y-4 font-mono-tech text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                  placeholder="Misal: Ilham Fazril"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Role / Spesialisasi Utama
                </label>
                <input
                  type="text"
                  name="headlineRole"
                  value={formData.headlineRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                  placeholder="Misal: Full-Stack Developer & NFC Hardware Specialist"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-cyan-400" />
                    Lokasi Domisili
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="Misal: Cimahi, Indonesia"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-emerald-400" />
                    Status Ketersediaan
                  </label>
                  <input
                    type="text"
                    name="statusBadge"
                    value={formData.statusBadge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="Misal: Tersedia untuk Proyek & Kolaborasi"
                  />
                </div>
              </div>

              {/* Metrics Pill row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">
                    Pengalaman
                  </label>
                  <input
                    type="text"
                    name="yearsOfExp"
                    value={formData.yearsOfExp}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="3+ Tahun"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">
                    Proyek Selesai
                  </label>
                  <input
                    type="text"
                    name="projectsCompleted"
                    value={formData.projectsCompleted}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="12+ Proyek"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">
                    Tingkat Sukses
                  </label>
                  <input
                    type="text"
                    name="satisfactionRate"
                    value={formData.satisfactionRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="100% On-Time"
                  />
                </div>
              </div>

              {/* Direct Contact Channels */}
              <div className="pt-2 border-t border-stone-800/80 space-y-3">
                <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block flex items-center gap-1.5">
                  <Mail size={13} />
                  Kanal Kontak & Komunikasi Utama
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1.5 flex items-center gap-1.5">
                      <Mail size={12} className="text-red-400" />
                      Email Resmi Developer
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                      placeholder="ilhamfazril042@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold mb-1.5 flex items-center gap-1.5">
                      <Phone size={12} className="text-emerald-400" />
                      Nomor Telepon / Display Kontak
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <MessageCircle size={12} className="text-emerald-400" />
                    Tautan / Link Langsung WhatsApp (wa.me)
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors"
                    placeholder="https://wa.me/6281234567890?text=..."
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Tautan ini langsung terhubung dengan tombol &quot;Chat WhatsApp&quot; dan panduan kontak di semua halaman pengunjung.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Tagline / Deskripsi Singkat
                </label>
                <textarea
                  name="tagline"
                  rows={3}
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100 outline-none transition-colors resize-none leading-relaxed"
                  placeholder="Deskripsi singkat yang tampil di Hero..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2.5 rounded-xl border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 font-mono-tech text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset Default</span>
              </button>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <span className="text-emerald-400 font-mono-tech text-xs flex items-center gap-1 font-bold animate-in fade-in">
                    <CheckCircle2 size={15} />
                    <span>Tersimpan ke Firebase &amp; Realtime!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Check size={16} />
                  <span>Simpan Profil & Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
