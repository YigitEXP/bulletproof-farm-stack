import React, { useState, useEffect, useRef } from 'react';

const MouseGlow = ({ onMouseMove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef(null);
  const secondaryGlowRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (glowRef.current && secondaryGlowRef.current) {
        const { x, y } = positionRef.current;
        glowRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
        secondaryGlowRef.current.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (onMouseMove) {
        onMouseMove(e.clientX, e.clientY);
      }
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, onMouseMove]);

  return (
    <>
      <div 
        ref={glowRef}
        className="mouse-glow"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: 'transform'
        }}
      />
      <div 
        ref={secondaryGlowRef}
        className="mouse-glow-secondary"
        style={{
          opacity: isVisible ? 0.6 : 0,
          willChange: 'transform'
        }}
      />
    </>
  );
};

export default MouseGlow;
