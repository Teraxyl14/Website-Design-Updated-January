import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Bot, Cpu, Clapperboard, Database, Terminal, X, ArrowUpRight, Code2 } from 'lucide-react';
import { SKILLS, PROJECTS } from '../constants';
import { useSettings } from '../context/SettingsContext';

const IconMap: Record<string, React.ComponentType<any>> = {
  Cloud, Bot, Cpu, Clapperboard, Database, Terminal
};

export const SkillsGrid = React.memo(() => {
  const { isPlainText } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<typeof SKILLS[0] | null>(null);

  // Helper to find related projects based on tech stack matching
  const getRelatedProjects = (category: typeof SKILLS[0]) => {
    const keywords = new Set([
      category.title.toLowerCase(),
      ...category.items.flatMap(item => item.value.toLowerCase().split(/[, ]+/))
    ]);

    return PROJECTS.filter(project =>
      project.tech.some(tech =>
        [...keywords].some(keyword => tech.toLowerCase().includes(keyword))
      )
    );
  };

  const relatedProjects = useMemo(() =>
    selectedCategory ? getRelatedProjects(selectedCategory) : [],
    [selectedCategory]);

  // Handle Escape key to close overlay
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCategory(null);
      }
    };

    if (selectedCategory) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedCategory]);

  // If plain text, simple list
  if (isPlainText) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        {SKILLS.map((category, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold text-white mb-2 uppercase border-b border-white/10 pb-1">{category.title}</h3>
            <ul className="space-y-1">
              {category.items.map((item, i) => (
                <li key={i} className="text-white/70">
                  <span className="text-white/90">{item.label}:</span> {item.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {SKILLS.map((category, index) => {
          const Icon = IconMap[category.icon] || Terminal;
          const isSelected = selectedCategory?.title === category.title;

          return (
            <motion.div
              key={index}
              layoutId={`card-${category.title}`}
              onClick={() => setSelectedCategory(category)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
              className={`
                group relative rounded-[2rem] border border-border/40 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-3xl 
                p-6 md:p-8 cursor-pointer overflow-hidden
                hover:border-accent-primary/30 hover:shadow-[0_20px_50px_-20px_rgba(var(--accent-primary),0.2)] hover:-translate-y-1 
                transition-all duration-500 ease-out
                ${isSelected ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]" />

              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 text-accent-primary ring-1 ring-inset ring-border/50 group-hover:ring-accent-primary/30 transition-all duration-500">
                    <Icon size={24} className="md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary font-heading tracking-tight">{category.title}</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {category.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-text-secondary border border-white/5">
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Elements (Absolute Positioned relative to Card) */}
              <div className="absolute bottom-6 left-8 text-[10px] px-2 py-1 text-accent-primary opacity-60 font-medium z-20">
                +More
              </div>

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-secondary font-mono flex items-center gap-1 z-20">
                <Code2 size={12} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* HOLOGRAPHIC FOCUS MODE OVERLAY - Moved to Portal to avoid transform contexts */}
      {createPortal(
        <AnimatePresence mode="sync">
          {selectedCategory && (
            <React.Fragment key={selectedCategory.title}>
              {/* Layer 1: Backdrop (Handles Click Outside) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                onClick={() => setSelectedCategory(null)}
                className="fixed inset-0 z-[99] bg-bg-primary/80 backdrop-blur-sm"
              />

              {/* Layer 2: Wrapper (Handles Layout, passes clicks through) */}
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">

                {/* Layer 3: Card (Content, captures clicks) */}
                <motion.div
                  layoutId={`card-${selectedCategory.title}`}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-full max-w-4xl max-h-[85vh] overflow-y-auto pointer-events-auto bg-card border border-accent-primary/20 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(var(--accent-primary),0.3)] relative flex flex-col md:flex-row overflow-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); }}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 text-text-secondary hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  {/* Sidebar / Header Section */}
                  <div className="p-8 md:p-10 bg-gradient-to-br from-accent-primary/10 to-transparent md:w-1/3 flex flex-col relative overflow-hidden shrink-0">
                    {/* Decorative element */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-primary/20 blur-[100px] rounded-full" />

                    <div className="relative z-10">
                      {(() => {
                        const Icon = IconMap[selectedCategory.icon] || Terminal;
                        return (
                          <div className="w-16 h-16 rounded-2xl bg-accent-primary text-bg flex items-center justify-center mb-6 shadow-lg shadow-accent-primary/20">
                            <Icon size={32} />
                          </div>
                        );
                      })()}

                      <h2 className="text-3xl md:text-4xl font-bold font-heading text-text-primary mb-4 leading-tight">
                        {selectedCategory.title}
                      </h2>

                      <div className="w-12 h-1 bg-accent-primary rounded-full mb-6" />

                      <p className="text-text-secondary leading-relaxed font-light mb-8 text-sm/relaxed">
                        "{selectedCategory.description}"
                      </p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-10 md:w-2/3 bg-card/50 backdrop-blur-3xl flex flex-col gap-8 override-scroll">
                    {/* Skill Grid */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
                        <Terminal size={12} /> Tech Stack Configuration
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCategory.items.map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-primary/30 transition-colors">
                            <div className="text-[10px] uppercase tracking-wider text-accent-primary/80 font-bold mb-1">{item.label}</div>
                            <div className="text-text-primary font-medium">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Related Projects (Field Deployments) */}
                    {relatedProjects.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
                          <RocketIcon /> Field Deployments
                        </h4>
                        <div className="space-y-3">
                          {relatedProjects.slice(0, 3).map(project => (
                            <a
                              key={project.id}
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-accent-primary/50 hover:from-accent-primary/10 transition-all group/project cursor-pointer relative z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="w-10 h-10 rounded-lg bg-black/50 overflow-hidden shrink-0">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover/project:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-text-primary truncate">{project.title}</div>
                                <div className="text-xs text-text-secondary truncate">{project.description}</div>
                              </div>
                              <ArrowUpRight size={16} className="text-text-secondary group-hover/project:text-accent-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </React.Fragment>
          )}
        </AnimatePresence >,
        document.getElementById('overlay-root') || document.body
      )}
    </>
  );
});

// Simple icon for the section
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
