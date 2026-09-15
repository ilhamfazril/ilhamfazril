import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const parsedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (isAdding) {
      addProject({
        title: formData.title,
        subtitle: formData.subtitle || 'Executive Software Architecture',
        description: formData.description,
        category: formData.category,
        tags: parsedTags.length > 0 ? parsedTags : ['Architecture', 'React 19'],
        image: formData.image || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        featured: formData.featured,
        metrics: formData.metrics || undefined,
        year: formData.year || '2026',
        architectureHighlights: [
          'High throughput distributed state architecture',
          'Zero-trust hardware security handshake',
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
        image: formData.image,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        featured: formData.featured,
        metrics: formData.metrics || undefined,
        year: formData.year,
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <span>Manajemen Portofolio Proyek</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {projects.length} Proyek
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 mt-1">
            Kelola karya unggulan, metrik performa, tautan live production, dan repositori GitHub.
          </p>
        </div>

        <button
          id="add-project-btn"
          onClick={handleStartAdd}
          className="px-5 py-2 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="font-serif-luxury font-bold text-lg text-amber-300 flex items-center gap-2">
              <Layers size={18} />
              <span>{isAdding ? 'Tambah Entri Proyek Baru' : 'Edit Detail Proyek'}</span>
            </h3>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="text-stone-400 hover:text-stone-100 text-xs font-mono-tech"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
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

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono-tech text-stone-400">URL Gambar Banner</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
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

              <div className="space-y-1.5 sm:col-span-3">
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
                className="px-6 py-2.5 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech shadow-lg shadow-amber-500/20 flex items-center gap-2"
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
            className="p-6 rounded-3xl bg-stone-900/80 border border-amber-500/30 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {project.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-2 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-serif-luxury font-bold text-xl text-stone-100">
                  {project.title}
                </h4>
                <p className="text-xs font-mono-tech text-amber-400 mt-0.5">
                  {project.subtitle}
                </p>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {project.metrics && (
                <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-[11px] font-mono-tech text-amber-300 flex items-center gap-1.5">
                  <Activity size={13} />
                  <span>{project.metrics}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono-tech text-stone-500 pt-3 border-t border-stone-800">
              <span>Tahun: {project.year}</span>
              <div className="flex gap-2">
                {project.githubUrl && <Github size={15} className="text-stone-400" />}
                {project.liveUrl && <ExternalLink size={15} className="text-amber-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
