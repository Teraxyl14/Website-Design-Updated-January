import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const MagneticButton: React.FC<MagneticButtonProps> = React.memo(({ children, className = "", href, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); // The magnetic pull strength
  }, []);

  const reset = React.useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const content = (
    <motion.div
      ref={ref}
      className={`relative z-10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <a href={href} className="inline-block">{content}</a>;
  }

  return <button onClick={onClick} className="inline-block">{content}</button>;
});