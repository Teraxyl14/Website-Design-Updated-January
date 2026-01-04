import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, THEMES, ThemeMode } from '../context/SettingsContext';
import { Zap, Flower2, Coffee, Droplets, Crown, ChevronRight } from 'lucide-react';

const ThemeIcon: Record<ThemeMode, React.ComponentType<any>> = {
    default: Droplets,
    cyberpunk: Zap,
    sakura: Flower2,
    lofi: Coffee,
    royal: Crown
};

export const ThemeSelector = () => {
    const { completeOnboarding } = useSettings();
    const [selected, setSelected] = useState<ThemeMode | null>(null);
    const [exiting, setExiting] = useState(false);

    const handleComplete = (themeId: ThemeMode) => {
        setSelected(themeId);
        // Trigger onboarding sequence immediately - context handles the transition timing
        completeOnboarding(themeId);
    };

    return (
        <AnimatePresence>
            {!exiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl md:text-5xl font-mono text-white mb-4 tracking-tight">INITIALIZE INTERFACE</h1>
                        <p className="text-white/50 text-sm md:text-base font-mono">Select your preferred reality filter.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-5xl">
                        {(Object.values(THEMES)).map((theme, idx) => {
                            const Icon = ThemeIcon[theme.id];
                            return (
                                <motion.button
                                    key={theme.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1), duration: 0.5 }}
                                    onClick={() => handleComplete(theme.id)}
                                    className="group relative flex flex-col items-center p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="mb-4 p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors text-white/70 group-hover:text-white">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-white font-mono text-sm font-bold mb-2 group-hover:text-white transition-colors">{theme.name}</h3>
                                    <div
                                        className="w-full h-1 rounded-full mt-2 opacity-50 group-hover:opacity-100 transition-all"
                                        style={{ background: `linear-gradient(90deg, rgb(${theme.colors.accentPrimary}), rgb(${theme.colors.accentSecondary}))` }}
                                    />

                                    {/* Subtle Glow on Hover */}
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                                        boxShadow: `inset 0 0 20px rgba(${theme.colors.accentPrimary.split(" ").join(",")}, 0.1)`
                                    }} />
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 text-xs font-mono text-white text-center"
                    >
                        Choice can be modified later in system settings.
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
