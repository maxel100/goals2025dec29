import React, { useEffect, useState } from 'react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  position?: { x: number; y: number };
}

export function CelebrationAnimation({ isVisible, position }: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    if (!isVisible || !position) {
      setParticles([]);
      return;
    }

    // Create particles
    const newParticles = Array.from({ length: 30 }, (_, i) => {
      const angle = (i * 12) * Math.PI / 180;
      const velocity = 3 + Math.random() * 2;
      const size = 8 + Math.random() * 6;
      
      return {
        id: i,
        style: {
          position: 'fixed',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: i % 2 === 0 ? '#8B5CF6' : '#3B82F6', // Purple and blue
          animation: `
            particle-fade-${i} 1s ease-out forwards,
            particle-move-${i} 1s ease-out forwards
          `,
          left: position.x,
          top: position.y,
        } as React.CSSProperties
      };
    });

    setParticles(newParticles);

    // Create dynamic keyframes for each particle
    newParticles.forEach((particle, i) => {
      const angle = (i * 12) * Math.PI / 180;
      const distance = 40 + Math.random() * 40;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const moveKeyframes = `
        @keyframes particle-move-${i} {
          0% { transform: translate(0, 0); }
          100% { transform: translate(${x}px, ${y}px); }
        }
      `;

      const fadeKeyframes = `
        @keyframes particle-fade-${i} {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;

      const style = document.createElement('style');
      style.innerHTML = moveKeyframes + fadeKeyframes;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    });
  }, [isVisible, position]);

  if (!isVisible || !position) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={particle.style}
        />
      ))}
    </div>
  );
} 