import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, FileText, Cpu, Mail, ChevronRight } from 'lucide-react';
import { SOCIALS } from '../constants';
import { useSettings } from '../context/SettingsContext';

const NAV_MENU_ITEMS = [
  { label: 'Home', href: '#', icon: Home },
  { label: 'About', href: '#about', icon: User },
  { label: 'Work', href: '#projects', icon: Briefcase },
  { label: 'Intelligence', href: '#reports', icon: FileText },
  { label: 'Skills', href: '#skills', icon: Cpu },
  { label: 'Contact', href: '#contact', icon: Mail },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-card/80 backdrop-blur-xl border-b border-border py-4 shadow-2xl'
          : 'bg-transparent py-6 md:py-8'
          }`}
      >
        <div className="w-full px-6 flex items-center justify-between" ref={menuRef}>
          {/* Interactive Logo / Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex items-center justify-center px-6 py-3 rounded-full border border-border bg-card/50 backdrop-blur-md hover:bg-accent-primary/10 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
            >
              <span className="text-xl font-black text-[rgb(var(--text-primary))] tracking-tighter leading-none group-hover:text-[rgb(var(--accent-primary))] transition-colors">
                MARUT TEWARI
              </span>
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-w-5 ml-2 opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-5 group-hover:ml-2 group-hover:opacity-100'}`}
              >
                <ChevronRight size={16} className={`text-[rgb(var(--accent-primary))] transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-4 w-64 bg-card/90 backdrop-blur-2xl border border-border rounded-xl shadow-2xl overflow-hidden p-2"
                >
                  <div className="flex flex-col gap-1">
                    {NAV_MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[rgb(var(--text-primary))]/5 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-all group/item"
                        >
                          <Icon size={18} className="group-hover/item:text-[rgb(var(--accent-primary))] transition-colors" />
                          <span className="font-heading font-medium text-sm flex-1">{item.label}</span>
                          <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[rgb(var(--accent-primary))]" />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Utils */}
          <div className="flex items-center gap-3 md:gap-6">
            <ISTClock />
            <a
              href={`mailto:${SOCIALS.email}`}
              className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-bold bg-[rgb(var(--text-primary))] text-[rgb(var(--bg-primary))] rounded-full hover:bg-[rgb(var(--accent-primary))] transition-colors shadow-[0_0_20px_rgba(var(--accent-primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--accent-primary),0.4)] whitespace-nowrap"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

const ISTClock = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Time Options
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };

      // Date Options
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: '2-digit',
      };

      setTime(new Intl.DateTimeFormat('en-US', timeOptions).format(now) + ' IST');
      setDate(new Intl.DateTimeFormat('en-US', dateOptions).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex flex-col items-end text-right mr-2 md:mr-4 border-r border-border pr-3 md:pr-6">
      <div className="text-[rgb(var(--text-primary))] font-mono text-[10px] md:text-sm font-bold tracking-widest whitespace-nowrap">
        {time}
      </div>
      <div className="text-[rgb(var(--text-secondary))] text-[8px] md:text-[10px] font-bold tracking-wider uppercase hidden md:block">
        {date}
      </div>
    </div>
  );
};