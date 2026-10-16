import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  Github, 
  Layers, 
  Sparkles,
  Activity,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { processAndCompressImage, getImageSizeKb } from '../../utils/imageUtils';

export const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, resetProjects } = usePortfolio();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    category: Project['category'];
    tags: string;
    image: string;
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    metrics: string;
    year: string;
  }>({
    title: '',
    subtitle: '',
    description: '',
    category: 'Full-Stack',
    tags: 'React, TypeScript, Tailwind',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    metrics: '99.99% SLA • Sub-50ms Response',
    year: new Date().getFullYear().toString(),
  });

  const handleStartAdd = () => {
    sound.playClick();
    setEditingId(null);
    setUploadError('');
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'Hardware/NFC',
      tags: 'Web NFC API, React 19, TypeScript, Tailwind',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      liveUrl: '',
      githubUrl: '',
      featured: true,
      metrics: 'Sub-50ms Response • 60 FPS',
      year: new Date().getFullYear().toString(),
    });
    setIsAdding(true);
  };

  const handleStartEdit = (proj: Project) => {
    sound.playClick();
    setIsAdding(false);
    setUploadError('');
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      subtitle: proj.subtitle,
      description: proj.description,
      category: proj.category,
      tags: proj.tags.join(', '),
      image: proj.image,
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: proj.featured,
      metrics: proj.metrics || '',
      year: proj.year,
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
      // Auto compress to max 1000px, 0.80 quality JPEG for super fast storage
      const compressedDataUrl = await processAndCompressImage(file, {
        maxWidth: 1000,
        maxHeight: 750,
        quality: 0.80,
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
    if (!formData.title || !formData.description) return;

    const parsedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const finalImage = formData.image || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80';

    if (isAdding) {
      addProject({
        title: formData.title,
        subtitle: formData.subtitle || 'Executive Software Architecture',
        description: formData.description,
        category: formData.category,
        tags: parsedTags.length > 0 ? parsedTags : ['Architecture', 'React 19'],
        image: finalImage,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        featured: formData.featured,
        metrics: formData.metrics || undefined,
        year: formData.year || new Date().getFullYear().toString(),
        architectureHighlights: [
          'High throughput distributed state architecture',
          'Modern reactive UI & zero-trust security',
        ],
      });
      setIsAdding(false);
    } else if (editingId) {
      updateProject(editingId, {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        category: formData.category,
        tags: parsedTags,
        image: finalImage,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        featured: formData.featured,
        metrics: formData.metrics || undefined,
        year: formData.year,
      });
      setEditingId(null);
    }
  };

  const isUploadedBase64 = formData.image?.startsWith('data:image/');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <span>Manajemen Portofolio Proyek</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              {projects.length} Proyek
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 mt-1">
            Upload foto/tangkapan layar karya, perbarui tautan live demo, dan repositori GitHub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan daftar proyek ke default bawaan?')) {
                resetProjects();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-700 hover:border-amber-500/40 text-stone-400 hover:text-stone-200 text-xs font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke daftar proyek awal"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset Default</span>
          </button>

          <button
            id="add-project-btn"
            onClick={handleStartAdd}
            className="px-5 py-2 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="font-serif-luxury font-bold text-lg text-amber-300 flex items-center gap-2">
              <Layers size={18} />
              <span>{isAdding ? 'Tambah Entri Proyek Baru' : 'Edit Detail & Foto Proyek'}</span>
            </h3>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="text-stone-400 hover:text-stone-100 text-xs font-mono-tech px-3 py-1 rounded-lg border border-stone-800 hover:bg-stone-800 transition-colors"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* PHOTO UPLOAD SECTION */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-tech uppercase tracking-wider font-bold text-amber-300 flex items-center gap-2">
                  <Upload size={14} />
                  <span>Foto / Screenshot Banner Proyek</span>
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
                        alt="Preview Proyek"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-black/80 border border-amber-500 text-amber-300 text-xs font-mono-tech flex items-center gap-1 hover:bg-amber-500 hover:text-black transition-colors"
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
                    </div>
                  )}
                </div>

                {/* Upload Control & Guidance */}
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
                      className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-mono-tech font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
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

                  {formData.image && formData.image.startsWith('data:image/') && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-tech text-[11px] font-bold">
                      <CheckCircle2 size={13} />
                      <span>Gambar Proyek Terkompresi Otomatis: ~{getImageSizeKb(formData.image)} KB (Super Ringan)</span>
                    </div>
                  )}

                  <p className="text-[11px] font-mono-tech text-stone-400 leading-relaxed">
                    ⚡ Kompresi Otomatis Aktif: Setiap gambar proyek otomatis dikompresi ke format JPEG optimal (1000px, 0.80) sehingga portofolio tampil cepat dan hemat data di semua perangkat.
                  </p>

                  {uploadError && (
                    <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Fallback URL Input */}
                  <div className="pt-2">
                    <details className="text-xs font-mono-tech text-stone-500">
                      <summary className="cursor-pointer hover:text-amber-400">Atau gunakan URL gambar web eksternal</summary>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full mt-2 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs font-sans focus:border-amber-500 focus:outline-none"
                      />
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* General Project Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AuraPay NFC Core"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Sub-judul / Tagline</label>
                <input
                  type="text"
                  placeholder="Contoh: High-Frequency Contactless Hardware Ledger"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                >
                  <option value="Hardware/NFC">Hardware/NFC</option>
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="AI & Cloud">AI & Cloud</option>
                  <option value="Creative Tech">Creative Tech</option>
                  <option value="Mobile & IoT">Mobile & IoT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Teknologi / Stack (Pisahkan Koma)</label>
                <input
                  type="text"
                  placeholder="React 19, Web NFC, Rust, Tailwind"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Metrik Highlight</label>
                <input
                  type="text"
                  placeholder="Sub-50ms Tap • 99.99% Reliability"
                  value={formData.metrics}
                  onChange={e => setFormData({ ...formData, metrics: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">Tahun Rilis</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">URL Demo / Live</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.liveUrl}
                  onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-stone-400">URL GitHub Repo</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-mono-tech text-stone-400">Deskripsi Arsitektur & Performa *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm font-sans focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-mono-tech hover:bg-stone-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} />
                <span>{isAdding ? 'Simpan Proyek' : 'Perbarui Proyek'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="rounded-3xl bg-stone-900/80 border border-amber-500/30 overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            {/* Project Image Banner */}
            <div className="relative aspect-video w-full bg-stone-950 overflow-hidden border-b border-stone-800">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono-tech text-xs">
                  Tidak ada gambar
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider bg-black/80 text-amber-400 border border-amber-500/40 backdrop-blur-md">
                  {project.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-1.5 rounded-lg text-amber-300 bg-black/80 border border-amber-500/40 hover:bg-amber-500 hover:text-stone-950 transition-colors backdrop-blur-md cursor-pointer"
                    title="Edit & Ganti Foto"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus proyek "${project.title}"?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-red-400 bg-black/80 border border-red-500/40 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md cursor-pointer"
                    title="Hapus Proyek"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 text-stone-400 text-[11px] font-mono-tech">
                Rilis: {project.year}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="font-serif-luxury font-bold text-xl text-stone-100 group-hover:text-amber-300 transition-colors">
                  {project.title}
                </h4>
                <p className="text-xs font-mono-tech text-amber-400">
                  {project.subtitle}
                </p>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.metrics && (
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono-tech text-amber-300 flex items-center gap-1.5">
                  <Activity size={13} className="text-amber-400" />
                  <span>{project.metrics}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-mono-tech text-stone-500 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => handleStartEdit(project)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  <Upload size={12} /> Kelola Foto & Detail
                </button>

                <div className="flex gap-2.5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-400 hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
