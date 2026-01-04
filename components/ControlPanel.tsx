import React, { useState } from 'react';
import { Settings, Play, Pause, Terminal, Monitor, X, Zap, Coffee, Flower2, Droplets, Crown } from 'lucide-react';
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

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${isOpen ? 'bg-card text-text-primary border-border' : 'bg-card/80 border-border text-text-secondary hover:text-text-primary hover:bg-card'}`}
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[60] w-72 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="space-y-6">

              {/* Animation Control */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-text-secondary tracking-widest">System Core</span>
                <button
                  onClick={togglePause}
                  className={`p-2 rounded-lg border transition-all ${isPaused ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'}`}
                >
                  {isPaused ? <Pause size={14} /> : <Play size={14} />}
                </button>
              </div>

              {/* Mode Control */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-text-secondary tracking-widest">Render Mode</span>
                <button
                  onClick={togglePlainText}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${isPlainText ? 'bg-text-primary text-bg border-text-primary' : 'bg-text-primary/5 text-text-primary border-border hover:bg-text-primary/10'}`}
                >
                  <Terminal size={12} />
                  {isPlainText ? 'PLAIN' : 'LIQUID'}
                </button>
              </div>

              {/* Theme Presets */}
              <div>
                <span className="text-xs font-mono uppercase text-text-secondary tracking-widest block mb-3">Reality Distortion</span>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.values(THEMES)).map((theme) => {
                    const Icon = ThemeIcon[theme.id];
                    const isActive = currentTheme.id === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setThemeMode(theme.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left group ${isActive ? 'bg-accent-primary/20 border-accent-primary text-text-primary' : 'bg-text-primary/5 border-transparent text-text-secondary hover:bg-text-primary/10 hover:text-text-primary'}`}
                      >
                        <div className={`p-1.5 rounded-md ${isActive ? 'bg-accent-primary text-bg' : 'bg-text-primary/10 text-text-secondary group-hover:text-text-primary'}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{theme.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-[10px] text-text-secondary text-center font-mono opacity-50">
                  Warning: Changing reality filter<br />may cause visual euphoria.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
