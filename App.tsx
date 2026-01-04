import React, { useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { LiquidBackground } from './components/LiquidBackground';
import { HeroSection } from './components/HeroSection';
import { ProjectCard } from './components/ProjectCard';
import { SkillsGrid } from './components/SkillsGrid';
import { Navigation } from './components/Navigation';
import { ControlPanel } from './components/ControlPanel';
import { ReportArchive } from './components/ReportArchive';
import { CustomCursor } from './components/CustomCursor';
import { PROJECTS, SOCIALS } from './constants';
import { Linkedin, Github, Youtube, Mail } from 'lucide-react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ThemeSelector } from './components/ThemeSelector';
import { TransitionOverlay } from './components/TransitionOverlay';
import { cursorState } from './components/CustomCursor'; // Import for Parallax

const useSmoothRgb = (rgbString: string) => {
  const r = useSpring(0, { stiffness: 50, damping: 20 });
  const g = useSpring(0, { stiffness: 50, damping: 20 });
  const b = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const [tr, tg, tb] = rgbString.split(' ').map(Number);
    r.set(tr);
    g.set(tg);
    b.set(tb);
  }, [rgbString, r, g, b]);

  return useTransform([r, g, b], ([latestR, latestG, latestB]: any[]) =>
    `${Math.round(latestR)} ${Math.round(latestG)} ${Math.round(latestB)}`
  );
};

const PortfolioContent = () => {
  const { isPlainText, currentTheme } = useSettings();

  // Smoothly interpolate color variables
  const bgPrimary = useSmoothRgb(isPlainText ? '0 0 0' : currentTheme.colors.bgPrimary);
  const bgCard = useSmoothRgb(isPlainText ? '0 0 0' : currentTheme.colors.bgCard);
  const textPrimary = useSmoothRgb(isPlainText ? '255 255 255' : currentTheme.colors.textPrimary);
  const textSecondary = useSmoothRgb(isPlainText ? '100 255 100' : currentTheme.colors.textSecondary);
  const accentPrimary = useSmoothRgb(isPlainText ? '0 255 65' : currentTheme.colors.accentPrimary);
  const accentSecondary = useSmoothRgb(isPlainText ? '0 200 0' : currentTheme.colors.accentSecondary);
  const borderColor = useSmoothRgb(isPlainText ? '50 50 50' : currentTheme.colors.border);

  // Memoize theme styles (including MotionValues)
  const themeStyles = useMemo(() => ({
    // Colors (MotionValues update these variables every frame)
    '--bg-primary': bgPrimary,
    '--bg-card': bgCard,
    '--text-primary': textPrimary,
    '--text-secondary': textSecondary,
    '--accent-primary': accentPrimary,
    '--accent-secondary': accentSecondary,
    '--border-color': borderColor,

    // Fonts (Instant)
    '--font-heading': isPlainText ? 'monospace' : currentTheme.fonts.heading,
    '--font-primary': isPlainText ? 'monospace' : currentTheme.fonts.primary,

    // Layout and Typography
    '--letter-spacing': currentTheme.layout.letterSpacing,
    '--font-weight': currentTheme.layout.fontWeight,
    '--line-height': currentTheme.layout.lineHeight,

    // Structure (Instant - transitions handled by CSS if needed)
    '--radius': currentTheme.structure.radius,
    '--border-width': currentTheme.structure.borderWidth,
    '--glass-opacity': currentTheme.structure.glassOpacity,
    '--glass-blur': currentTheme.structure.glassBlur,
    '--shadow': currentTheme.structure.shadow,
  } as any), [bgPrimary, bgCard, textPrimary, textSecondary, accentPrimary, accentSecondary, borderColor, isPlainText, currentTheme]);

  // Parallax Ref
  const parallaxRef = React.useRef<HTMLDivElement>(null);

  // Sync body background and apply Gradient + Parallax
  useEffect(() => {
    let animationFrame: number;

    const update = () => {
      // Update Background Color
      const r = bgPrimary.get();
      document.body.style.backgroundColor = `rgb(${r})`;

      // Apply Gradient
      const gradient = currentTheme.gradient;
      const color1 = `rgba(${currentTheme.colors.bgPrimary.split(' ').join(',')}, 1)`;
      const color2 = `rgba(${currentTheme.colors.bgCard.split(' ').join(',')}, 1)`;

      // Construct css gradient string
      const gradientString = gradient.type === 'radial'
        ? `radial-gradient(${gradient.direction}, ${color1}, ${color2})`
        : `${gradient.type}-gradient(${gradient.direction}, ${color1}, ${color2})`;

      document.body.style.backgroundImage = gradientString;

      // Apply Parallax to Content (Mid Layer -> 0.02 factor for subtle depth)
      // We use direct DOM manipulation for performance (no React render)
      if (parallaxRef.current) {
        const x = (cursorState.x / window.innerWidth - 0.5) * 20; // +/- 10px
        const y = (cursorState.y / window.innerHeight - 0.5) * 20;
        parallaxRef.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
      }

      animationFrame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animationFrame);
  }, [currentTheme, bgPrimary]);

  return (
    <motion.div
      id="theme-container"
      style={themeStyles}
      className={`relative min-h-screen transition-colors duration-700 ${isPlainText ? 'bg-black font-mono' : 'bg-transparent font-sans'} text-text-primary selection:bg-accent-primary selection:text-bg overflow-x-hidden`}
    >
      <div
        className={!isPlainText ? "" : ""}
        style={{
          fontFamily: 'var(--font-primary)',
          letterSpacing: 'var(--letter-spacing)',
          lineHeight: 'var(--line-height)',
          fontWeight: 'var(--font-weight)'
        } as any}
      >
        <style>{`
        .overlay-mandala {
           background-image: radial-gradient(circle at center, transparent 0%, rgba(28, 4, 4, 0.8) 100%), repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.03) 0px, rgba(255, 215, 0, 0.03) 1px, transparent 1px, transparent 10px);
           pointer-events: none;
        }
      `}</style>

        {/* --- UI ELEMENTS --- */}
        {!isPlainText && <CustomCursor />}

        {currentTheme.overlay === 'grain' && <div className="overlay-grain" />}

        {
          currentTheme.overlay === 'scanlines' && (
            <div className="fixed inset-0 pointer-events-none z-[5] overlay-scanlines opacity-20" />
          )
        }
        {
          currentTheme.overlay === 'vignette' && (
            <div className="fixed inset-0 pointer-events-none z-[5] overlay-vignette" />
          )
        }

        {
          currentTheme.overlay === 'mandala' && (
            <div className="fixed inset-0 pointer-events-none z-[5] overlay-mandala" />
          )
        }

        <ControlPanel />
        {!isPlainText && <LiquidBackground />}
        {!isPlainText && <Navigation />}

        {/* Portal Target for Overlays (Inherits Theme Variables) */}
        <div id="overlay-root" className="fixed inset-0 z-[100] pointer-events-none" />

        <main ref={parallaxRef} className={`relative z-10 ${isPlainText ? 'pb-12 px-4 max-w-4xl mx-auto pt-20' : 'pb-32 md:pb-40'}`}>

          {isPlainText ? (
            <div className="mb-20 border-b border-white/20 pb-12">
              <h1 className="text-4xl font-bold text-white mb-4">&gt; MARUT_TEWARI</h1>
              <p className="text-green-500 mb-8 max-w-2xl text-sm leading-relaxed">
               // AI Product Builder & Automation Specialist.<br />
               // Focusing on turning manual processes into intelligent workflows.<br />
               // System Status: ONLINE
              </p>
              <div className="flex gap-4 text-sm">
                <a href="#projects" className="text-white hover:underline">[ View Projects ]</a>
                <a href="#reports" className="text-white hover:underline">[ Intelligence Archive ]</a>
                <a href="#contact" className="text-white hover:underline">[ Contact ]</a>
              </div>
            </div>
          ) : (
            <HeroSection />
          )}

          <section id="about" className={isPlainText ? "mb-20" : "py-20 md:py-32 px-4 md:px-6 relative"}>
            {isPlainText ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">01_ABOUT</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Technology should be seamless. My strength is orchestrating AI models to flow around real-world problems. With a background in Cybersecurity, I build solutions that are secure and practical.
                </p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-24 overflow-hidden relative group hover:border-border/80 transition-colors duration-500">

                {/* Subtle background glow for the whole card */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="shrink-0 relative group/image">
                  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[2rem] overflow-hidden border border-border shadow-2xl relative z-10 transition-transform duration-700 group-hover/image:scale-[1.02]">
                    <img
                      src="https://i.postimg.cc/pmDRttx6/WhatsApp-Image-2025-07-18-at-16-06-38-927fa458.jpg"
                      alt="Marut Tewari"
                      className="w-full h-full object-cover grayscale group-hover/image:grayscale-0 transition-all duration-700 scale-110 group-hover/image:scale-100"
                    />
                  </div>
                  {/* Refined Liquid Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-accent-primary/30 to-accent-secondary/30 rounded-full blur-[80px] -z-10 opacity-60 animate-pulse-slow" />
                </div>

                <div className="relative z-10 text-center md:text-left">
                  <h2 className="mb-10">
                    <span className="block text-2xl md:text-3xl font-light text-text-secondary mb-3 tracking-wide">
                      I Architect
                    </span>
                    <span className="block text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-cyan-400 to-accent-secondary drop-shadow-lg tracking-tight pb-4">
                      Liquid<br className="hidden md:block" /> Intelligence
                    </span>
                  </h2>

                  <div className="space-y-8 max-w-2xl">
                    <p className="text-xl md:text-2xl text-text-primary font-medium leading-relaxed">
                      Technology should be <span className="text-accent-primary">seamless</span>, like a fluid.
                      <span className="block mt-4 text-text-secondary">
                        I turn manual processes into intelligent, <span className="text-text-primary">automated workflows</span>.
                      </span>
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Background</h3>
                        <p className="text-base text-text-secondary leading-relaxed">
                          With roots in <span className="text-text-primary">Cybersecurity</span>, I build solutions that are secure by design. I don't just build abstract tech; I engineer practical tools that adapt and scale.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Creator</h3>
                        <p className="text-base text-text-secondary leading-relaxed">
                          Growing a YouTube channel to thousands of subscribers taught me the challenges creators face. I build with <span className="text-text-primary">deep empathy</span> for founders.
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border/20">
                      <p className="text-lg md:text-xl text-text-primary italic font-light">
                        "My mission is to be the technical partner that turns your ambitious ideas into reality."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section id="projects" className={isPlainText ? "mb-20" : "py-20 md:py-32 px-4 md:px-6"}>
            <div className={isPlainText ? "" : "max-w-7xl mx-auto"}>
              <div className={`mb-12 ${isPlainText ? 'border-b border-white/20 pb-4' : 'flex flex-col md:flex-row justify-between items-end md:mb-20 gap-6 border-b border-white/10 pb-8'}`}>
                {isPlainText ? (
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">02_SELECTED_WORK</h2>
                ) : (
                  <>
                    <div className="text-center md:text-left w-full">
                      <h2 className="text-4xl md:text-7xl font-heading font-bold text-text-primary mb-4 text-glow">
                        Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-text-secondary">Work</span>
                      </h2>
                    </div>
                    <p className="hidden md:block text-text-secondary text-right max-w-xs text-lg">
                      High-impact tools built for the real world. <br /><span className="text-accent-primary">Hover to interact.</span>
                    </p>
                  </>
                )}
              </div>

              {isPlainText ? (
                <div className="space-y-8">
                  {PROJECTS.map((project, idx) => (
                    <div key={idx} className="block group">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-white font-bold text-lg group-hover:text-green-400">
                          &gt; {project.title}
                        </h3>
                        <a href={project.link} target="_blank" className="text-xs text-white/50 hover:text-white">[SOURCE_CODE]</a>
                      </div>
                      <p className="text-white/70 text-sm mb-3">{project.description}</p>
                      <p className="text-xs text-white/40 font-mono">[{project.tech.join(', ')}]</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {PROJECTS.map((project, idx) => (
                    <ProjectCard key={project.id} project={project} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section id="reports" className={isPlainText ? "mb-20" : "py-20 md:py-32 px-4 md:px-6 bg-black/20"}>
            <div className={isPlainText ? "" : "max-w-6xl mx-auto"}>
              {isPlainText ? (
                // Handled inside ReportArchive component for plain text mode
                <ReportArchive />
              ) : (
                <>
                  <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6 text-glow">
                      Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Archive</span>
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                      A collection of technical deep-dives, architectural blueprints, and systems analysis.
                      These artifacts represent the knowledge engine behind the projects.
                    </p>
                  </div>
                  <ReportArchive />
                </>
              )}
            </div>
          </section>

          <section id="skills" className={isPlainText ? "mb-20" : "py-20 md:py-32 px-4 md:px-6 relative"}>
            <div className={isPlainText ? "" : "max-w-6xl mx-auto relative z-10"}>
              {isPlainText ? (
                <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest border-b border-white/20 pb-4">03_TECHNICAL_TOOLBOX</h2>
              ) : (
                <h2 className="text-3xl md:text-6xl font-heading font-bold text-text-primary text-center mb-12 md:mb-24 text-glow">
                  Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-primary">Toolbox</span>
                </h2>
              )}

              {isPlainText ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                  <SkillsGrid />
                </div>
              ) : (
                <SkillsGrid />
              )}
            </div>
          </section>

          <section id="contact" className={isPlainText ? "mb-20" : "py-20 md:py-40 px-4 md:px-6"}>
            {isPlainText ? (
              <div className="border-t border-white/20 pt-8">
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">04_INITIATE_CONTACT</h2>
                <a href={`mailto:${SOCIALS.email}`} className="text-green-500 hover:underline block mb-4 text-lg">
                  {SOCIALS.email}
                </a>
                <div className="flex gap-4 text-sm text-white/60 font-mono">
                  <a href={SOCIALS.linkedin} className="hover:text-white">LINKEDIN</a> /
                  <a href={SOCIALS.github} className="hover:text-white">GITHUB</a> /
                  <a href={SOCIALS.youtube} className="hover:text-white">YOUTUBE</a>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto text-center glass-panel p-8 md:p-16 border-[length:var(--border-width)] border-border">
                <h2 className="text-4xl md:text-7xl font-heading font-bold text-text-primary mb-6 md:mb-8 text-glow">Ready to Build Your Vision?</h2>

                <p className="text-base md:text-xl text-text-secondary max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
                  Have an idea for an AI-powered tool or need to automate a core part of your startup? Let's talk. I help founders build their vision.
                </p>

                <div className="mb-12 md:mb-20 px-2">
                  <a
                    href={`mailto:${SOCIALS.email}`}
                    className="group relative inline-block text-2xl sm:text-3xl md:text-6xl font-bold text-text-primary transition-colors break-all md:break-normal"
                  >
                    <span className="relative z-10 drop-shadow-lg">Marut Tewari</span>
                    <div className="absolute bottom-0 left-0 w-full h-1 md:h-2 bg-accent-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </a>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  <SocialLink href={SOCIALS.linkedin} icon={Linkedin} />
                  <SocialLink href={SOCIALS.github} icon={Github} />
                  <SocialLink href={SOCIALS.youtube} icon={Youtube} />
                  <SocialLink href={`mailto:${SOCIALS.email}`} icon={Mail} />
                </div>
              </div>
            )}
          </section>

        </main>

        <footer className={`py-8 md:py-12 text-center text-text-secondary text-xs md:text-sm relative z-10 px-4 ${isPlainText ? 'border-t border-white/20 pt-8 mt-12' : 'border-t-[length:var(--border-width)] border-border bg-card/60 backdrop-blur-lg'}`}>
          <p className="font-mono opacity-50">&copy; {new Date().getFullYear()} Marut Tewari. {isPlainText ? "End of Line." : "Engineered in the Void."}</p>
        </footer>

      </div>
    </motion.div >
  );
};

// Move SocialLink outside to prevent redefinition on every render
const SocialLink = ({ href, icon: Icon }: { href: string, icon: React.ComponentType<any> }) => (
  <a
    href={href}
    target="_blank"
    className="p-4 md:p-5 rounded-full border-[length:var(--border-width)] border-border bg-card/30 hover:bg-card hover:text-text-primary transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(var(--accent-primary),0.4)] text-text-secondary"
  >
    <Icon size={24} className="md:w-7 md:h-7" />
  </a>
);

const AppContent = () => {
  const { hasSeenOnboarding } = useSettings();

  return (
    <>
      <div className={`transition-opacity duration-1000 ${!hasSeenOnboarding ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
        <PortfolioContent />
      </div>
      {!hasSeenOnboarding && <ThemeSelector />}
      <TransitionOverlay phase={useSettings().transitionPhase} />
    </>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
