import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { ArrowDown } from 'lucide-react';

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

interface ScrambleCharProps {
  char: string;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}

const ScrambleChar: React.FC<ScrambleCharProps> = ({ char, index, className = "", style = {} }) => {
  const [displayText, setDisplayText] = useState(char);
  const intervalRef = useRef<any>(null);
  const isMounted = useRef(false);

  const triggerScramble = React.useCallback(() => {
    let iteration = 0;
    // Increased iterations for a longer, more cinematic effect
    const maxIterations = 24;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // Logic: Random character for first few iterations, then settle
      if (iteration < maxIterations) {
        setDisplayText(SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
      } else {
        setDisplayText(char);
        clearInterval(intervalRef.current);
      }
      iteration++;
    }, 75); // Slower interval (75ms) for smoother visual updates
  }, [char]);

  useEffect(() => {
    isMounted.current = true;
    // Initial stagger animation on load
    const timeout = setTimeout(() => {
      if (isMounted.current) triggerScramble();
    }, 500 + (index * 120)); // Slightly increased stagger delay

    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
      clearInterval(intervalRef.current);
    };
  }, [index, triggerScramble]);

  return (
    <motion.span
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={triggerScramble}
      whileHover={{
        scale: 1.1,
        y: -10,
        color: "rgb(var(--accent-primary))",
        textShadow: "0 0 20px rgba(var(--accent-primary),0.6)",
        // Softened spring physics for a "fluid" feel rather than a snappy one
        transition: { type: "spring", stiffness: 200, damping: 15 }
      }}
      // Reset layout for standard flow and apply passed styles
      style={{ display: 'inline-block', width: char === ' ' ? '1rem' : 'auto', ...style }}
    >
      {displayText}
    </motion.span>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-10 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        {/* Semi-transparent backdrop removed as per user request */}

        {/* Content with enhanced visibility */}
        {/* Content with enhanced visibility - ZERO LATENCY CONTRAST ENGINE */}
        {/* Content with enhanced visibility - ZERO LATENCY CONTRAST ENGINE */}
        <div className="relative z-10">
          {/* Fluid Typography */}
          <h1 className="font-heading font-black tracking-tighter text-[rgb(var(--text-primary))] mb-6 md:mb-8 leading-[0.9] select-none flex flex-col items-center justify-center">
            <div className="flex justify-center gap-[0.5vw] md:gap-2 overflow-visible py-1 md:py-2 text-[15vw] md:text-[9rem] lg:text-[10rem] xl:text-9xl" style={{ color: "rgb(var(--text-primary))" }}>
              {"MARUT".split('').map((char, i) => (
                <ScrambleChar key={`m-${i}`} char={char} index={i} className="" style={{ color: "rgb(var(--text-primary))" }} />
              ))}
            </div>
            <div className="flex justify-center gap-[0.5vw] md:gap-2 overflow-visible py-1 md:py-2 text-[13vw] md:text-[8rem] lg:text-[9rem] xl:text-8xl" style={{ color: "rgb(var(--text-secondary))" }}>
              {"TEWARI".split('').map((char, i) => (
                // Offset index for continuous stagger effect
                <ScrambleChar key={`t-${i}`} char={char} index={i + 5} className="" style={{ color: "rgb(var(--text-secondary))" }} />
              ))}
            </div>
          </h1>

          <div className="max-w-3xl mx-auto mb-12 md:mb-16 space-y-3 md:space-y-4 px-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed" style={{ color: "rgb(var(--text-primary))" }}>
              AI Product Builder
            </p>
            <p className="text-base sm:text-lg md:text-xl font-normal" style={{ color: "rgb(var(--text-secondary))" }}>
              I turn manual processes into <span className="font-semibold" style={{ color: "rgb(var(--accent-primary))" }}>intelligent, automated workflows</span>.
            </p>
            <p className="text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed" style={{ color: "rgb(var(--text-secondary))", opacity: 0.8 }}>
              Specializing in leveraging AI to create practical, high-impact tools for <span className="font-medium" style={{ color: "rgb(var(--text-primary))" }}>startups</span>, <span className="font-medium" style={{ color: "rgb(var(--text-primary))" }}>creators</span>, and <span className="font-medium" style={{ color: "rgb(var(--text-primary))" }}>individual entrepreneurs</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full px-8">
            <MagneticButton href="#projects" className="w-full sm:w-auto">
              <div
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 font-bold rounded-xl transition-all text-center"
                style={{
                  backgroundColor: "rgb(var(--text-primary))",
                  color: "rgb(var(--bg-primary))",
                  boxShadow: "0 0 40px rgba(var(--accent-primary), 0.2)"
                }}
              >
                Explore Work
              </div>
            </MagneticButton>

            <MagneticButton href="#contact" className="w-full sm:w-auto">
              <div
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-transparent border text-base md:text-lg font-bold rounded-xl transition-all backdrop-blur-md text-center"
                style={{
                  borderColor: "rgba(var(--text-primary), 0.2)",
                  color: "rgb(var(--text-primary))"
                }}
              >
                Contact Me
              </div>
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 md:bottom-12 text-[rgb(var(--text-primary))] pointer-events-none"
      >
        <ArrowDown className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
      </motion.div>

    </section>
  );
};