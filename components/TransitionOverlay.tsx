import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TransitionPhase = 'idle' | 'closing' | 'opening';

interface TransitionOverlayProps {
    phase: TransitionPhase;
    onCloseComplete?: () => void;
    onOpenComplete?: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
    phase,
    onCloseComplete,
    onOpenComplete
}) => {
    // We use window dimensions to ensure the circle covers the screen.
    // "150%" radius is usually safe, but let's be explicit with SVG coords.

    return (
        <AnimatePresence>
            {phase !== 'idle' && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                >
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <mask id="iris-mask" maskUnits="userSpaceOnUse">
                                {/* White rect fills everything -> Visible (Black overlay) */}
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />

                                {/* Black circle cuts a hole -> Transparent (Content visible) */}
                                {/* We animate the radius 'r' */}
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    fill="black"
                                    initial={{ r: "100%" }} // Start fully open (hole is huge)
                                    animate={{
                                        r: phase === 'closing' ? "0%" : "150%"
                                    }}
                                    transition={{
                                        duration: 2.0,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    onAnimationComplete={() => {
                                        if (phase === 'closing' && onCloseComplete) onCloseComplete();
                                        if (phase === 'opening' && onOpenComplete) onOpenComplete();
                                    }}
                                />
                            </mask>
                        </defs>

                        {/* The Black Overlay itself, masked by the above */}
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="black"
                            mask="url(#iris-mask)"
                        />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TransitionOverlay;
