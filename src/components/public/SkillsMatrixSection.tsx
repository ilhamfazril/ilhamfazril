import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Zap } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const SkillsMatrixSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Frontend & Architecture',
    'Backend & Cloud Systems',
    'Mobile & Hardware NFC',
    'AI & Creative Tech',
  ];

  const filteredSkills = activeTab === 'Semua'
    ? skills
    : skills.filter(s => s.category === activeTab);

  const handleTabChange = (cat: string) => {
    sound.playClick();
    setActiveTab(cat);
  };

  return (
    <section id="skills" className="py-20 sm:py-24 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs uppercase tracking-widest font-semibold">
            <Zap size={13} />
            <span>Matriks Kompetensi</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-black text-stone-950 dark:text-white">
            Keahlian & <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black">Spesialisasi Teknik</span>
          </h2>
          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base font-normal leading-relaxed">
            Kedalaman teknis dari rekayasa antarmuka berkecepatan 60 FPS hingga protokol komunikasi hardware Web NFC 13.56 MHz dengan pengalaman 3+ tahun.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleTabChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-stone-200 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-800 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              onMouseEnter={() => sound.playHover()}
              className="p-6 rounded-2xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-cyan-500/50 backdrop-blur-xl shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono-tech uppercase tracking-wider text-cyan-600 dark:text-cyan-300 font-bold">
                  {skill.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 font-bold">
                  {skill.yearsExp}
                </span>
              </div>

              <h3 className="text-lg font-serif-luxury font-black text-stone-950 dark:text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {skill.name}
              </h3>

              <p className="text-xs text-stone-800 dark:text-stone-100 mb-5 leading-relaxed font-normal">
                {skill.highlight}
              </p>

              {/* Progress Bar with Cyan Glow */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono-tech">
                  <span className="text-stone-700 dark:text-stone-300 font-semibold">Mastery Level</span>
                  <span className="text-cyan-600 dark:text-cyan-300 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 shadow-sm"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
