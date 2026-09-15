import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { EducationItem } from '../../types';
import { 
  GraduationCap, 
  School, 
  Briefcase, 
  Sparkles, 
  MapPin, 
  Award, 
  CheckCircle2, 
  BookOpen,
  Cpu
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();
  const [selectedEdu, setSelectedEdu] = useState<EducationItem | null>(null);

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'internship':
        return <Briefcase size={22} className="text-cyan-400" />;
      case 'vocational':
        return <Cpu size={22} className="text-cyan-400" />;
      case 'junior':
        return <School size={22} className="text-cyan-400" />;
      case 'elementary':
        return <BookOpen size={22} className="text-cyan-400" />;
      case 'kindergarten':
        return <Sparkles size={22} className="text-cyan-400" />;
      case 'preschool':
      default:
        return <GraduationCap size={22} className="text-cyan-400" />;
    }
  };

  return (
    <section id="education" className="py-20 sm:py-24 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs uppercase tracking-widest font-semibold shadow-sm">
            <GraduationCap size={15} />
            <span>Jejak Akademik & Pendidikan</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-black text-stone-950 dark:text-white tracking-tight">
            Riwayat Pendidikan <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black">Ilham Fazril</span>
          </h2>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base font-normal leading-relaxed">
            Fondasi pembelajaran disiplin dari jenjang PAUD, TK, SD, SMP, SMK hingga praktik industri PKL secara runtut dan mendalam.
          </p>
        </div>

        {/* Education Timeline Grid */}
        <div className="space-y-5 sm:space-y-6">
          {education.map((item) => (
            <div
              key={item.id}
              id={`edu-item-${item.id}`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                setSelectedEdu(selectedEdu?.id === item.id ? null : item);
              }}
              className={`group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1 ${
                item.iconType === 'internship' || item.iconType === 'vocational'
                  ? 'bg-stone-100/95 dark:bg-stone-900/80 border-cyan-500/40 dark:border-cyan-500/30 hover:border-cyan-500'
                  : 'bg-stone-100/80 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Icon & Core Details */}
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Badge Icon */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-md">
                    {getInstitutionIcon(item.iconType)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
                        {item.period}
                      </span>
                      
                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-2xl font-serif-luxury font-black text-stone-950 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {item.institution}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-stone-700 dark:text-stone-200">
                      <span className="flex items-center gap-1 font-bold text-stone-900 dark:text-stone-100">
                        <Award size={13} className="text-cyan-500" />
                        {item.level}
                      </span>
                      <span className="flex items-center gap-1 text-stone-700 dark:text-stone-300 font-medium">
                        <MapPin size={13} className="text-cyan-500" />
                        {item.location}
                      </span>
                    </div>

                    <p className="text-sm text-stone-800 dark:text-stone-100 font-normal leading-relaxed pt-1">
                      {item.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.skillsFocus.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono-tech bg-stone-200 dark:bg-stone-950 text-stone-900 dark:text-cyan-300 border border-stone-300 dark:border-stone-800 font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 size={11} className="text-cyan-500" />
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
