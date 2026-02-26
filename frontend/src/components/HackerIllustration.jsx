import React, { useState, useEffect, useRef } from 'react';

const HackerIllustration = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // --- BURAYI DÜZENLE (GÖRÜNTÜYÜ TAŞIMAK İÇİN) ---
  const OFFSET_X = 500; // Sağa (+) veya Sola (-) taşı
  const OFFSET_Y = 220; // Aşağı (+) veya Yukarı (-) taşı
  const SCALE = 1;    // Boyutu genel olarak büyüt/küçült (Örn: 0.8 veya 1.2)
  // ----------------------------------------------

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center p-4"
      style={{ minWidth: '350px', height: '500px' }}
    >
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; filter: blur(8px); } 50% { opacity: 0.6; filter: blur(12px); } }
        .cyber-float { animation: float 4s ease-in-out infinite; }
        .hologram-ring { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <svg 
        viewBox="0 0 400 550" 
        className="w-full h-full drop-shadow-2xl"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>

        {/* --- MASTER GROUP: HER ŞEYİ AYNI ANDA OYNATAN GRUP --- */}
        <g transform={`translate(${OFFSET_X}, ${OFFSET_Y}) scale(${SCALE})`}>
          
          {/* Hologram Base */}
          <g transform="translate(200, 500)">
            <ellipse rx="120" ry="20" fill="none" stroke="#00ff88" strokeWidth="2" opacity="0.3" className="hologram-ring" />
            <ellipse rx="80" ry="10" fill="#00ff88" opacity="0.1" />
            {[...Array(5)].map((_, i) => (
              <rect key={i} x={-100 + i * 40} y="-150" width="1" height="150" fill="url(#cyberGradient)" opacity="0.2">
                <animate attributeName="height" values="0;150;0" dur={`${1 + i}s`} repeatCount="indefinite" />
              </rect>
            ))}
          </g>

          {/* Floating Character Group */}
          <g className="cyber-float" style={{ 
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
            transition: 'transform 0.2s ease-out'
          }}>
            {/* Body */}
            <path d="M120,450 Q200,430 280,450 L320,500 L80,500 Z" fill="#0a0a1a" stroke="#00ff88" strokeWidth="2" filter="url(#neonBlur)" />
            <path d="M160,445 L200,470 L240,445" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.5" />

            {/* Interactive Head */}
            <g style={{ 
              transform: `rotate(${mousePos.x * 25}deg) translate(${mousePos.x * 10}px, ${mousePos.y * 5}px)`,
              transformOrigin: '200px 350px',
              transition: 'transform 0.1s ease-out'
            }}>
              <path d="M160,280 Q200,260 240,280 L250,380 Q200,410 150,380 Z" fill="#0f172a" stroke="#00ff88" strokeWidth="2" filter="url(#neonBlur)" />
              <rect x="175" y="320" width="15" height="4" rx="1" fill="#00ff88"><animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite" /></rect>
              <rect x="210" y="320" width="15" height="4" rx="1" fill="#00ff88"><animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite" /></rect>
              <path d="M140,290 L150,230 Q200,210 250,230 L260,290" fill="#1e293b" stroke="#00ff88" strokeWidth="1.5" />
              <rect x="155" y="260" width="90" height="10" fill="#00ff88" opacity="0.1" />
            </g>

            {/* Floating Data Screens */}
            <g transform={`translate(${mousePos.x * -20}, ${mousePos.y * -20})`}>
              <rect x="280" y="250" width="60" height="40" rx="4" fill="#00d4ff" opacity="0.1" stroke="#00d4ff" strokeWidth="1" />
              <path d="M285,260 H330 M285,270 H310 M285,280 H320" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="300" r="20" fill="none" stroke="#00ff88" strokeWidth="1" strokeDasharray="5,3" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" from="0 100 300" to="360 100 300" dur="10s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default HackerIllustration;