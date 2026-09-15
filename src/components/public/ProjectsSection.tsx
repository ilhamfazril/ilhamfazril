import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { 
  ArrowUpRight, 
  Github, 
  Layers, 
  Radio, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const { projects, trackProjectClick } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['Semua', 'Hardware/NFC', 'Full-Stack', 'AI & Cloud', 'Creative Tech'];

  const filteredProjects = activeCategory === 'Semua'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleCategoryChange = (cat: string) => {
    sound.playClick();
    setActiveCategory(cat);
  };

  const handleOpenModal = (project: Project) => {
    sound.playClick();
    trackProjectClick(project.id);
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    sound.playClick();
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs uppercase tracking-widest font-semibold">
              <Layers size={13} />
              <span>Curated Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-black text-stone-950 dark:text-white">
              Karya & <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black">Arsitektur Proyek</span>
            </h2>
            <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base max-w-xl font-normal">
              Eksplorasi mahakarya rekayasa sistem, implementasi Web NFC, dan aplikasi terdistribusi berkinerja tinggi.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-stone-200/90 dark:bg-stone-900/90 border border-stone-300 dark:border-stone-800 backdrop-blur-md self-start md:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace('/', '-')}`}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-stone-800 dark:text-stone-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-stone-300/40 dark:hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onMouseEnter={() => sound.playHover()}
              className="group relative rounded-3xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-cyan-500/60 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Image & Overlay */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-black/75 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono-tech bg-stone-900/90 border border-stone-700 text-stone-200 backdrop-blur-md font-semibold">
                    {project.year}
                  </span>
                </div>

                {/* Metrics Indicator if exists */}
                {project.metrics && (
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech backdrop-blur-md font-semibold">
                      <Activity size={13} className="text-cyan-400" />
                      <span>{project.metrics}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-black text-stone-950 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono-tech text-cyan-600 dark:text-cyan-300 font-bold">
                    {project.subtitle}
                  </p>
                  <p className="text-sm text-stone-800 dark:text-stone-100 line-clamp-3 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono-tech bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-cyan-200 border border-stone-300 dark:border-stone-700 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="text-xs sm:text-sm font-bold text-stone-950 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-200 flex items-center gap-1.5 cursor-pointer group-hover:underline"
                  >
                    <span>Detail Arsitektur & Spesifikasi</span>
                    <ArrowUpRight size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-cyan-500 text-stone-700 dark:text-stone-200 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                        title="Lihat Repositori GitHub"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-transform hover:scale-105 shadow-sm"
                        title="Buka Demo Live"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          id="project-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stone-900 border border-amber-500/40 p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/40 text-amber-400">
                  {selectedProject.category}
                </span>
                <span className="text-xs font-mono-tech text-stone-400">Tahun Rilis: {selectedProject.year}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
                {selectedProject.title}
              </h3>
              <p className="text-sm font-mono-tech text-amber-400">
                {selectedProject.subtitle}
              </p>
            </div>

            {/* Image Preview */}
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-800">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono-tech text-stone-400 uppercase tracking-wider">
                Ringkasan Sistem & Performa
              </h4>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Architecture Highlights */}
            {selectedProject.architectureHighlights && selectedProject.architectureHighlights.length > 0 && (
              <div className="space-y-3 p-5 rounded-2xl bg-stone-950/80 border border-amber-500/20 font-mono-tech text-xs">
                <h4 className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} />
                  Sorotan Arsitektur Rekayasa
                </h4>
                <ul className="space-y-2 text-stone-300">
                  {selectedProject.architectureHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono-tech text-stone-400 uppercase tracking-wider">
                Teknologi yang Diterapkan
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-mono-tech bg-stone-800 border border-stone-700 text-amber-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-stone-800">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl border border-stone-700 hover:border-amber-500 text-stone-200 text-xs font-mono-tech flex items-center gap-2 transition-colors"
                >
                  <Github size={15} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <ExternalLink size={15} />
                  <span>Buka Live Production</span>
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
