import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Bot, Cpu, Clapperboard, Database, Terminal } from 'lucide-react';
import { SKILLS } from '../constants';
import { useSettings } from '../context/SettingsContext';

const IconMap: Record<string, React.ComponentType<any>> = {
  Cloud, Bot, Cpu, Clapperboard, Database, Terminal
};

export const SkillsGrid = React.memo(() => {
  const { isPlainText } = useSettings();

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

  // Normal Graphical Render
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {SKILLS.map((category, index) => {
        const Icon = IconMap[category.icon] || Terminal;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative rounded-[2rem] border border-border/40 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-3xl p-6 md:p-8 hover:border-accent-primary/30 hover:shadow-[0_20px_50px_-20px_rgba(var(--accent-primary),0.2)] hover:-translate-y-1 transition-all duration-500 ease-out"
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

              <ul className="space-y-6">
                {category.items.map((item, i) => (
                  <li key={i} className="relative pl-4 border-l-2 border-border/30 hover:border-accent-primary/50 transition-colors duration-300 group/item">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-primary/60 mb-1.5 block group-hover/item:text-accent-primary transition-colors">{item.label}</span>
                    <span className="text-base md:text-lg text-text-secondary/90 leading-relaxed font-light block group-hover/item:text-text-primary transition-colors">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
