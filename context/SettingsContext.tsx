import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { TransitionPhase } from '../components/TransitionOverlay';

export type ThemeMode = 'default' | 'cyberpunk' | 'sakura' | 'lofi' | 'royal';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  colors: {
    bgPrimary: string;    // CSS RGB format "r g b"
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    border: string;
    hexAccent: string;    // For Three.js
    hexSecondary: string; // For Three.js secondary elements
    hexBg: string;        // For Three.js background
  };
  structure: {
    radius: string;
    borderWidth: string;
    glassOpacity: string;
    glassBlur: string;
    shadow: string;
  };
  fonts: {
    heading: string;
    primary: string;
  };
  physics: {
    speed: number;
    turbulence: number;
  };
  overlay: 'none' | 'scanlines' | 'grain' | 'vignette' | 'mandala';
}

interface SettingsContextType {
  currentTheme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
  isPaused: boolean;
  togglePause: () => void;
  isPlainText: boolean;
  togglePlainText: () => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: (themeId: ThemeMode) => void;
  transitionPhase: TransitionPhase; // Exposed for the overlay
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Liquid Void',
    colors: {
      bgPrimary: '2 4 8',           // #020408 (Deepest Navy)
      bgCard: '13 17 23',           // #0d1117 (GitHub Dark Dimmed)
      textPrimary: '240 246 252',   // #f0f6fc
      textSecondary: '139 148 158', // #8b949e
      accentPrimary: '56 189 248',  // #38bdf8 (Sky Blue)
      accentSecondary: '129 140 248', // #818cf8 (Indigo)
      border: '48 54 61',
      hexAccent: '#38bdf8',
      hexSecondary: '#818cf8',
      hexBg: '#020408',
    },
    structure: {
      radius: '1rem',
      borderWidth: '1px',
      glassOpacity: '0.6',
      glassBlur: '16px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    },
    fonts: {
      heading: 'Sora',
      primary: 'Inter',
    },
    physics: { speed: 0.2, turbulence: 1.5 }, // Increased speed/turbulence for visibility
    overlay: 'none'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon City',
    colors: {
      bgPrimary: '5 5 5',           // #050505 (True Black)
      bgCard: '15 15 15',           // #0F0F0F
      textPrimary: '255 255 255',
      textSecondary: '160 160 160',
      accentPrimary: '255 0 110',   // #ff006e (Vibrant Pink)
      accentSecondary: '0 245 212', // #00f5d4 (Bright Cyan)
      border: '40 40 40',
      hexAccent: '#00f5d4',
      hexSecondary: '#ff006e',
      hexBg: '#050505',
    },
    structure: {
      radius: '2px',
      borderWidth: '1px',
      glassOpacity: '0.85',
      glassBlur: '8px',
      shadow: '4px 4px 0px rgba(0, 245, 212, 0.15)'
    },
    fonts: {
      heading: 'JetBrains Mono',
      primary: 'Inter',
    },
    physics: { speed: 0.5, turbulence: 0.0 },
    overlay: 'scanlines'
  },
  sakura: {
    id: 'sakura',
    name: 'Kyoto Bloom',
    colors: {
      bgPrimary: '255 241 242',     // #fff1f2 (Pale Pink)
      bgCard: '255 255 255',
      textPrimary: '80 15 30',      // #500f1e (Deep Burgundy)
      textSecondary: '157 23 77',   // #9d174d (Strong Pink Text)
      accentPrimary: '225 29 72',   // #e11d48 (Rose)
      accentSecondary: '190 24 93', // #be185d (Deep Magenta)
      border: '251 207 232',        // #fbcfe8 (Light Pink Border)
      hexAccent: '#e11d48',
      hexSecondary: '#be185d',
      hexBg: '#fff1f2',
    },
    structure: {
      radius: '24px',
      borderWidth: '1px',
      glassOpacity: '0.65',
      glassBlur: '20px',
      shadow: '0 20px 60px -15px rgba(225, 29, 72, 0.15)'
    },
    fonts: {
      heading: 'Cinzel',
      primary: 'Quicksand',
    },
    physics: { speed: 0.1, turbulence: 0.3 },
    overlay: 'vignette'
  },
  lofi: {
    id: 'lofi',
    name: 'Chill Study',
    colors: {
      bgPrimary: '30 28 45',        // #1e1c2d (Deep Grape)
      bgCard: '40 37 60',           // #28253c
      textPrimary: '226 225 235',
      textSecondary: '150 145 175',
      accentPrimary: '245 194 231', // #f5c2e7 (Pale Pink)
      accentSecondary: '137 220 235', // #89dceb (Sky)
      border: '69 65 99',
      hexAccent: '#f5c2e7',
      hexSecondary: '#89dceb',
      hexBg: '#1e1c2d',
    },
    structure: {
      radius: '16px',
      borderWidth: '1.5px',
      glassOpacity: '0.92',
      glassBlur: '0px',
      shadow: '6px 6px 0px rgba(0, 0, 0, 0.15)'
    },
    fonts: {
      heading: 'Quicksand',
      primary: 'Inter',
    },
    physics: { speed: 0.05, turbulence: 0.1 },
    overlay: 'grain'
  },
  royal: {
    id: 'royal',
    name: 'Indian Heritage',
    colors: {
      bgPrimary: '28 4 4',           // #1c0404 (Deep Royal Maroon)
      bgCard: '43 10 10',            // #2b0a0a (Darker Red)
      textPrimary: '255 240 200',    // #fff0c8 (Antique Cream)
      textSecondary: '230 180 80',   // #e6b450 (Muted Gold)
      accentPrimary: '255 153 51',   // #ff9933 (Saffron)
      accentSecondary: '255 215 0',  // #ffd700 (Bright Gold)
      border: '100 40 20',           // #642814 (Terracotta border)
      hexAccent: '#ff9933',
      hexSecondary: '#ffd700',
      hexBg: '#1c0404',
    },
    structure: {
      radius: '4px',
      borderWidth: '2px',
      glassOpacity: '0.9',
      glassBlur: '8px',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    },
    fonts: {
      heading: 'Cinzel',
      primary: 'Inter',
    },
    physics: { speed: 0.1, turbulence: 0.2 },
    overlay: 'mandala'
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setInternalThemeMode] = useState<ThemeMode>('default');
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');

  const [isPaused, setIsPaused] = useState(false);
  const [isPlainText, setIsPlainText] = useState(false);

  // Initialize from localStorage, default to false
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasSeenOnboarding') === 'true';
    }
    return false;
  });

  const togglePause = () => setIsPaused(prev => !prev);
  const togglePlainText = () => setIsPlainText(prev => !prev);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    if (mode === themeMode) return;

    // 1. Start Closing Iris
    setTransitionPhase('closing');

    // 2. Trigger Theme Switch EARLY (0.5s into closing)
    setTimeout(() => {
      setInternalThemeMode(mode);
      localStorage.setItem('theme', mode);
    }, 500);

    // 3. Manage Visual Phases independently
    // Wait for Close (2.0s) + Hold (1.0s) = 3.0s total before Opening
    setTimeout(() => {
      setTransitionPhase('opening');

      // Reset to Idle after opening (2.0s)
      setTimeout(() => {
        setTransitionPhase('idle');
      }, 2000);
    }, 3000);
  }, [themeMode]);

  const completeOnboarding = (themeId: ThemeMode) => {
    // 1. Start Closing Iris
    setTransitionPhase('closing');

    // 2. Wait for cover, then switch state
    setTimeout(() => {
      setInternalThemeMode(themeId);
      setHasSeenOnboarding(true);

      localStorage.setItem('theme', themeId);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }, 1500); // 1.5s allows Iris to be mostly closed

    // 3. Open Logic
    setTimeout(() => {
      setTransitionPhase('opening');
      setTimeout(() => {
        setTransitionPhase('idle');
      }, 2000);
    }, 3000);
  };

  // Hydrate theme from localStorage on mount if it exists
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && THEMES[savedTheme]) {
      setInternalThemeMode(savedTheme);
    }
  }, []);

  const currentTheme = THEMES[themeMode];

  // Memoize context value to prevent object recreation on every re-render
  const contextValue = useMemo(() => ({
    currentTheme,
    setThemeMode,
    isPaused,
    togglePause,
    isPlainText,
    togglePlainText,
    hasSeenOnboarding,
    completeOnboarding,
    transitionPhase
  }), [currentTheme, isPaused, isPlainText, hasSeenOnboarding, transitionPhase]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};