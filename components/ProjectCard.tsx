import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, index }) => {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 50,
        damping: 20
      }}
      className="group relative block h-full perspective-1000"
    >
      <div className="
        relative h-full
        rounded-[2rem] border border-border/40 
        bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-3xl
        overflow-hidden
        transition-all duration-500
        group-hover:border-[rgb(var(--accent-primary))]/50
        group-hover:translate-y-[-4px]
        group-hover:shadow-[0_20px_50px_-20px_rgba(var(--accent-primary),0.3)]
        flex flex-col
      ">

        {/* Image Container with liquid zoom */}
        <div className="h-56 md:h-72 overflow-hidden relative shrink-0">
          {project.image.startsWith('#') ? (
            <div className="w-full h-full" style={{ backgroundColor: project.image }} />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          {/* Detailed Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-90" />

          {/* Floating Action Button style for link */}
          <div className="absolute top-6 right-6 bg-[rgb(var(--text-primary))] text-[rgb(var(--bg-primary))] p-3 rounded-full opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1 relative">
          {/* Glow effect behind text */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <h3 className="relative z-10 text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--text-primary))] via-[rgb(var(--text-primary))] to-[rgb(var(--text-secondary))] mb-4 group-hover:to-[rgb(var(--accent-primary))] transition-all duration-300">
            {project.title}
          </h3>

          <p className="relative z-10 text-base text-[rgb(var(--text-secondary))]/80 leading-relaxed mb-8 flex-1">
            {project.description}
          </p>

          <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
            {project.tech.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-[rgb(var(--accent-primary))]/5 text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-color))]/50 transition-colors duration-300 group-hover:bg-[rgb(var(--accent-primary))]/10 group-hover:text-[rgb(var(--accent-primary))] group-hover:border-[rgb(var(--accent-primary))]/30"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
});