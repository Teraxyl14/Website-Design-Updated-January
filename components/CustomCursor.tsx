import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// GLOBAL PHYSICS STATE (Exported for LiquidBackground)
export const cursorState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
};

// Global tracker initialization
if (typeof window !== 'undefined') {
  let lastX = 0;
  let lastY = 0;
  window.addEventListener('pointermove', (e) => {
    cursorState.vx = e.clientX - lastX;
    cursorState.vy = e.clientY - lastY;
    cursorState.x = e.clientX;
    cursorState.y = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
  });
}

export const CustomCursor = React.memo(() => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const moveCursor = React.useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX - 16);
    cursorY.set(e.clientY - 16);
  }, [cursorX, cursorY]);

  const handleMouseOver = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if the target or any of its parents is an anchor or button
    const isInteractive = target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') !== null ||
      target.closest('button') !== null;

    setIsHovering(isInteractive);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [moveCursor, handleMouseOver]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-blue pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(88, 166, 255, 0.2)' : 'rgba(88, 166, 255, 0)',
      }}
    />
  );
});