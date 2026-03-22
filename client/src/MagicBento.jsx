import React, { useEffect, useRef, useState } from 'react';

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = "132, 0, 255",
  disableAnimations = false
}) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (disableAnimations) return;

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [disableAnimations]);

  useEffect(() => {
    if (!enableStars || disableAnimations) return;

    const createParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2
      }));
    };

    createParticles();

    const animateParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.y -= particle.speed;
        if (particle.y < -10) {
          particle.y = 110;
          particle.x = Math.random() * 100;
        }
      });
      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }, [enableStars, particleCount, disableAnimations]);

  const handleClick = () => {
    if (clickEffect && !disableAnimations) {
      // Add click effect
      const container = containerRef.current;
      if (container) {
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
          container.style.transform = '';
        }, 150);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="magic-bento"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      {/* Spotlight */}
      {enableSpotlight && !disableAnimations && (
        <div
          className="spotlight"
          style={{
            position: 'absolute',
            top: mousePos.y - spotlightRadius / 2,
            left: mousePos.x - spotlightRadius / 2,
            width: spotlightRadius,
            height: spotlightRadius,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.1) 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.3
          }}
        />
      )}

      {/* Border Glow */}
      {enableBorderGlow && !disableAnimations && (
        <div
          className="border-glow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: `2px solid rgba(${glowColor}, 0.3)`,
            borderRadius: '10px',
            boxShadow: `0 0 20px rgba(${glowColor}, 0.2)`,
            animation: isHovered ? 'pulse 2s infinite' : 'none'
          }}
        />
      )}

      {/* Stars/Particles */}
      {enableStars && !disableAnimations && particlesRef.current.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `rgba(${glowColor}, ${particle.opacity})`,
            borderRadius: '50%',
            animation: `twinkle ${2 + Math.random() * 2}s infinite`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(${glowColor}, 0.2); }
          50% { box-shadow: 0 0 40px rgba(${glowColor}, 0.4); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default MagicBento;