import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { EducationItem } from '../../types';
import { 
  GraduationCap, 
  School, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { processAndCompressImage } from '../../utils/imageUtils';

export const EducationManager: React.FC = () => {
  const { education, addEducation, updateEducation, deleteEducation, resetEducation } = usePortfolio();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    institution: string;
    level: string;
    location: string;
    period: string;
    description: string;
    skillsFocus: string;
    iconType: EducationItem['iconType'];
    badge: string;
    image: string;
  }>({
    institution: '',
    level: '',
    location: 'Cimahi, Jawa Barat',
    period: '',
    description: '',
    skillsFocus: '',
    iconType: 'vocational',
    badge: '',
    image: '',
  });

  const handleStartAdd = () => {
    sound.playClick();
    setEditingId(null);
    setUploadError('');
    setFormData({
      institution: '',
      level: '',
      location: 'Cimahi, Jawa Barat',
      period: '2024 - Sekarang',
      description: '',
      skillsFocus: 'Sistem Komputer, Rekayasa Perangkat Lunak',
      iconType: 'vocational',
      badge: 'Prestasi / Fokus Studi',
      image: '',
    });
    setIsAdding(true);
  };

  const handleStartEdit = (item: EducationItem) => {
    sound.playClick();
    setIsAdding(false);
    setUploadError('');
    setEditingId(item.id);
    setFormData({
      institution: item.institution,
      level: item.level,
      location: item.location,
      period: item.period,
      description: item.description,
      skillsFocus: item.skillsFocus.join(', '),
      iconType: item.iconType,
      badge: item.badge || '',
      image: item.image || '',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Pilih file gambar valid (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessingImage(true);
      const compressedDataUrl = await processAndCompressImage(file, {
        maxWidth: 1280,
        maxHeight: 800,
        quality: 0.82,
        format: 'image/jpeg',
      });
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
      sound.playSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      setUploadError(msg);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    sound.playClick();
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.level) return;

    const parsedSkills = formData.skillsFocus
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (isAdding) {
      addEducation({
        institution: formData.institution,
        level: formData.level,
        location: formData.location,
        period: formData.period,
        description: formData.description,
        skillsFocus: parsedSkills.length > 0 ? parsedSkills : ['Akademik & Disiplin'],
        iconType: formData.iconType,
        badge: formData.badge || undefined,
        image: formData.image || undefined,
      });
      setIsAdding(false);
    } else if (editingId) {
      updateEducation(editingId, {
        institution: formData.institution,
        level: formData.level,
        location: formData.location,
        period: formData.period,
        description: formData.description,
        skillsFocus: parsedSkills,
        iconType: formData.iconType,
        badge: formData.badge || undefined,
        image: formData.image || undefined,
      });
      setEditingId(null);
    }
  };

  const getInstitutionIcon = (type: EducationItem['iconType']) => {
    switch (type) {
      case 'internship':
        return <Briefcase size={18} className="text-cyan-400" />;
      case 'vocational':
        return <Cpu size={18} className="text-cyan-400" />;
      case 'junior':
        return <School size={18} className="text-cyan-400" />;
      case 'elementary':
        return <BookOpen size={18} className="text-cyan-400" />;
      case 'kindergarten':
        return <Sparkles size={18} className="text-cyan-400" />;
      case 'preschool':
      default:
        return <GraduationCap size={18} className="text-cyan-400" />;
    }
  };

  const isUploadedBase64 = formData.image?.startsWith('data:image/');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-900/80 border border-cyan-500/30 backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <span>Manajemen Riwayat Pendidikan</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              {education.length} Tingkat
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 mt-1">
            Upload foto gedung sekolah, foto PKL dinas, ijazah, atau sertifikat kegiatan untuk tiap jenjang pendidikan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan riwayat pendidikan ke daftar lengkap bawaan (PAUD s/d PKL)?')) {
                resetEducation();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-700 hover:border-cyan-500/40 text-stone-400 hover:text-stone-200 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke daftar pendidikan awal"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset Default</span>
          </button>

          <button
            id="add-education-btn"
            onClick={handleStartAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs font-mono-tech flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Riwayat Baru</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-cyan-500/50 shadow-2xl space-y-6 animate-in slide-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="font-serif-luxury font-bold text-lg text-cyan-300 flex items-center gap-2">
              <GraduationCap size={18} />
              <span>{isAdding ? 'Tambah Data Jenjang Pendidikan Baru' : 'Edit Detail & Upload Foto Pendidikan'}</span>
            </h3>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="text-stone-400 hover:text-stone-100 text-xs font-mono-tech px-3 py-1 rounded-lg border border-stone-800 hover:bg-stone-800 transition-colors"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* PHOTO UPLOAD ZONE */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-2">
                  <Upload size={14} />
                  <span>Foto Sekolah / Kampus / Dokumentasi PKL / Sertifikat</span>
                </label>
                {isUploadedBase64 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Foto Kustom Terpasang
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Photo Preview Box */}
                <div className="md:col-span-5 relative aspect-video rounded-xl overflow-hidden bg-stone-900 border-2 border-stone-800 group shadow-lg">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Preview Foto Pendidikan"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-black/80 border border-cyan-500 text-cyan-300 text-xs font-mono-tech flex items-center gap-1 hover:bg-cyan-500 hover:text-black transition-colors"
                        >
                          <Upload size={12} /> Ganti
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono-tech flex items-center gap-1 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                      <ImageIcon size={32} className="mb-2 text-stone-600" />
                      <span className="text-xs font-mono-tech">Belum ada foto</span>
                      <span className="text-[10px] text-stone-600 mt-1">(Gedung, Seragam, Kegiatan, atau Ijazah)</span>
                    </div>
                  )}
                </div>

                {/* Upload Action & Instruction */}
                <div className="md:col-span-7 space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      disabled={isProcessingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-stone-950 text-xs font-mono-tech font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Upload size={15} />
                      <span>{isProcessingImage ? 'Memproses...' : 'Upload dari HP / Laptop'}</span>
                    </button>

                    {formData.image && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3.5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Hapus Foto</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] font-mono-tech text-stone-400 leading-relaxed">
                    💡 Pilih foto gedung sekolah, momen kegiatan PKL, laboratorium, atau sertifikat kelulusan. Foto akan otomatis ditampilkan di linimasa riwayat pendidikan publik.
                  </p>

                  {uploadError && (
                    <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* External URL alternative */}
                  <div className="pt-2">
                    <details className="text-xs font-mono-tech text-stone-500">
                      <summary className="cursor-pointer hover:text-cyan-400">Atau masukkan URL gambar langsung</summary>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full mt-2 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs font-sans focus:border-cyan-500 focus:outline-none"
                      />
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Nama Instansi / Sekolah *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMK Pusdikhubad Cimahi"
                  value={formData.institution}
                  onChange={e => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Jenjang / Tingkat *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sekolah Menengah Kejuruan (SMK)"
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Ikon Kategori</label>
                <select
                  value={formData.iconType}
                  onChange={e => setFormData({ ...formData, iconType: e.target.value as EducationItem['iconType'] })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                >
                  <option value="vocational">Kejuruan / SMK (Komputer/Teknik)</option>
                  <option value="internship">Magang / PKL Industri</option>
                  <option value="junior">SMP / Menengah Pertama</option>
                  <option value="elementary">SD / Sekolah Dasar</option>
                  <option value="kindergarten">TK / Raudhatul Athfal</option>
                  <option value="preschool">PAUD / Pra-Sekolah</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Periode / Waktu</label>
                <input
                  type="text"
                  placeholder="Contoh: 3 Tahun Pendidikan"
                  value={formData.period}
                  onChange={e => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Lokasi / Kota</label>
                <input
                  type="text"
                  placeholder="Contoh: Cimahi, Jawa Barat"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Badge / Label Sorotan</label>
                <input
                  type="text"
                  placeholder="Contoh: Fondasi Rekayasa Komputer"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-mono-tech text-stone-400">Fokus Keterampilan / Minat (Pisahkan Koma)</label>
                <input
                  type="text"
                  placeholder="Teknik Komputer, Jaringan, Disiplin, Pemrograman"
                  value={formData.skillsFocus}
                  onChange={e => setFormData({ ...formData, skillsFocus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-mono-tech text-stone-400">Deskripsi Pengalaman Belajar & Karakter *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-mono-tech hover:bg-stone-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs font-mono-tech shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Check size={16} />
                <span>{isAdding ? 'Simpan Riwayat Pendidikan' : 'Perbarui Riwayat'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education Items List */}
      <div className="space-y-4">
        {education.map((item, index) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl bg-stone-900/80 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row gap-5 items-start justify-between group shadow-lg"
          >
            {/* Left Content with Image Preview */}
            <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 w-full">
              {/* Optional Photo or Icon */}
              {item.image ? (
                <div className="relative w-full sm:w-36 h-28 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-cyan-500/30 bg-stone-950 group-hover:scale-102 transition-transform shadow-md">
                  <img
                    src={item.image}
                    alt={item.institution}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-black/80 backdrop-blur-md">
                    {getInstitutionIcon(item.iconType)}
                  </div>
                </div>
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  {getInstitutionIcon(item.iconType)}
                </div>
              )}

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
                    {item.period}
                  </span>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech bg-stone-800 text-stone-200 border border-stone-700 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {item.image && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <ImageIcon size={11} /> Ada Foto
                    </span>
                  )}
                </div>

                <h4 className="font-serif-luxury font-bold text-lg sm:text-xl text-stone-100 group-hover:text-cyan-300 transition-colors">
                  {item.institution}
                </h4>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech text-stone-400">
                  <span className="flex items-center gap-1 text-stone-300">
                    <Award size={13} className="text-cyan-400" />
                    {item.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-cyan-400" />
                    {item.location}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 pt-1">
                  {item.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.skillsFocus.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono-tech bg-stone-950 text-cyan-400/90 border border-stone-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleStartEdit(item)}
                className="px-3 py-1.5 rounded-xl text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit data dan upload foto"
              >
                <Edit3 size={13} />
                <span>{item.image ? 'Ubah Foto/Data' : 'Upload Foto'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Hapus entri pendidikan "${item.institution}"?`)) {
                    deleteEducation(item.id);
                  }
                }}
                className="p-1.5 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                title="Hapus Entri"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
