import React from 'react';

export function CelebrationElements() {
  const createGridPositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * 360,
        delay: Math.random() * 2,
      });
    }
    return positions;
  };

  const createCannonPositions = () => {
    const positions = [];
    // Create more confetti pieces
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI / 3) + (Math.random() * Math.PI / 3); // 60-120 degrees
      const velocity = 20 + Math.random() * 30; // Increased velocity
      positions.push({
        angle,
        velocity,
        delay: Math.random() * 0.5, // Reduced delay for more immediate effect
        size: 0.8 + Math.random() * 2, // Larger pieces
        color: [
          '#16a34a', '#22c55e', '#4ade80', '#86efac', // Greens
          '#fbbf24', '#f59e0b', '#d97706', // Yellows
          '#ef4444', '#dc2626', '#b91c1c', // Reds
          '#3b82f6', '#2563eb', '#1d4ed8', // Blues
        ][Math.floor(Math.random() * 13)],
      });
    }
    return positions;
  };

  const sparkPositions = createGridPositions(60); // More sparks
  const confettiPieces = createCannonPositions();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Multiple Confetti Cannons */}
      <div className="absolute inset-x-0 bottom-0 flex justify-around">
        {[0, 1, 2].map(cannon => (
          <div key={cannon} className="relative">
            {confettiPieces.map((piece, i) => (
              <div
                key={`confetti-${cannon}-${i}`}
                className="absolute bottom-0"
                style={{
                  left: `${cannon * 33.33}%`,
                  animation: `confetti-shoot 2.5s ease-out ${piece.delay}s forwards`,
                  transform: `rotate(${piece.angle}rad)`,
                }}
              >
                <div
                  className="rounded-sm opacity-90"
                  style={{
                    width: `${piece.size * 8}px`,
                    height: `${piece.size * 8}px`,
                    background: piece.color,
                    animation: `confetti-flutter 3s ease-in-out infinite`,
                    animationDelay: `${piece.delay}s`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Enhanced Background Sparks */}
      {sparkPositions.map((pos, i) => (
        <div
          key={`spark-${i}`}
          className="absolute animate-celebration-spark"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${pos.delay}s`,
          }}
        >
          <div className="w-3 h-3 bg-yellow-400/40 rounded-full blur-[2px]" />
        </div>
      ))}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-50/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/20 to-transparent" />
    </div>
  );
}