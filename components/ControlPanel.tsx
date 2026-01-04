import React, { useState } from 'react';
import { Settings, Play, Pause, Terminal, Monitor, X, Zap, Coffee, Flower2, Droplets, Crown, Cpu, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, THEMES, ThemeMode } from '../context/SettingsContext';

const ThemeIcon: Record<ThemeMode, React.ComponentType<any>> = {
  default: Droplets,
  cyberpunk: Zap,
  sakura: Flower2,
  lofi: Coffee,
  royal: Crown
};

export const ControlPanel = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setThemeMode, isPaused, togglePause, isPlainText, togglePlainText } = useSettings();

  const handleThemeChange = (mode: ThemeMode) => {
    if (isPlainText) togglePlainText();
    setThemeMode(mode);
  };

  const handleTerminalMode = () => {
    if (!isPlainText) togglePlainText();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-2xl group ${isOpen ? 'bg-accent-primary text-bg border-accent-primary rotate-90' : 'bg-card/80 border-border text-text-secondary hover:text-text-primary hover:bg-card hover:border-accent-primary/50'}`}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <Settings size={24} className="group-hover:rotate-180 transition-transform duration-700" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click-outside */}
            <div
              className="fixed inset-0 z-[59] cursor-default"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed bottom-24 right-6 z-[60] w-80 bg-card/95 backdrop-blur-3xl border border-border rounded-2xl p-0 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-primary">
                  <Cpu size={16} className="text-accent-primary" />
                  <span className="text-sm font-bold font-heading tracking-wide">SYSTEM CONTROL</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>

              <div className="p-4 space-y-6">

                {/* Grid Layout */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-secondary/70 tracking-widest block mb-3 pl-1">Reality Filter</span>
                  <div className="grid grid-cols-2 gap-3">
                    {/* EXISTING 5 THEMES */}
                    {(Object.values(THEMES)).map((theme) => {
                      const Icon = ThemeIcon[theme.id];
                      // Active if: Theme Matches AND NOT PlainText
                      const isActive = currentTheme.id === theme.id && !isPlainText;

                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`
                          relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left overflow-hidden group
                          ${isActive
                              ? 'bg-accent-primary/10 border-accent-primary text-text-primary shadow-[0_0_20px_rgba(var(--accent-primary),0.15)]'
                              : 'bg-card border-white/5 text-text-secondary hover:border-white/20 hover:bg-white/5 hover:text-text-primary'
                            }
                        `}
                        >
                          {isActive && <div className="absolute inset-0 bg-accent-primary/5 animate-pulse" />}

                          <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-accent-primary text-bg shadow-sm' : 'bg-white/5 text-text-secondary group-hover:bg-white/10 group-hover:text-text-primary'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex flex-col z-10">
                            <span className="text-xs font-bold leading-tight">{theme.name}</span>
                          </div>
                        </button>
                      )
                    })}

                    {/* 6TH OPTION: TERMINAL MODE */}
                    <button
                      onClick={handleTerminalMode}
                      className={`
                      relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left overflow-hidden group
                      ${isPlainText
                          ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                          : 'bg-card border-white/5 text-text-secondary hover:border-green-500/30 hover:bg-green-500/5 hover:text-green-400'
                        }
                    `}
                    >
                      {isPlainText && <div className="absolute inset-0 bg-green-500/5 animate-pulse" />}

                      <div className={`p-1.5 rounded-lg transition-colors ${isPlainText ? 'bg-green-500 text-bg shadow-sm' : 'bg-white/5 text-text-secondary group-hover:bg-green-500/20 group-hover:text-green-400'}`}>
                        <Terminal size={16} />
                      </div>
                      <div className="flex flex-col z-10">
                        <span className="text-xs font-bold leading-tight">Terminal Mode</span>
                      </div>
                    </button>

                  </div>
                </div>

                {/* ENGINE STATUS FOOTER */}
                <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${isPaused ? 'bg-yellow-500/20 text-yellow-500' : 'bg-accent-primary/20 text-accent-primary'}`}>
                      <Activity size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase text-text-secondary">Physics Engine</span>
                      <span className={`text-xs font-bold ${isPaused ? 'text-yellow-500' : 'text-accent-primary'}`}>
                        {isPaused ? 'PAUSED' : 'RUNNING'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={togglePause}
                    className={`
                    w-10 h-10 flex items-center justify-center rounded-lg border transition-all
                    ${isPaused
                        ? 'bg-accent-primary hover:bg-accent-secondary border-transparent text-bg shadow-lg shadow-accent-primary/20'
                        : 'bg-white/5 border-white/10 text-text-secondary hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10'
                      }
                  `}
                    title={isPaused ? "Resume Simulation" : "Pause Simulation"}
                  >
                    {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
