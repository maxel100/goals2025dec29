import React, { useEffect, useRef, useState } from 'react';
import { Rocket } from 'lucide-react';
import { CelebrationElements } from '../ui/CelebrationElements';

export function SuccessGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [showCelebration, setShowCelebration] = useState(false);
  const hasAnimatedRef = useRef(false);
  
  useEffect(() => {
    // Only run animation once
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const canvas = canvasRef.current;
    const rocket = rocketRef.current;
    const marker = markerRef.current;
    if (!canvas || !rocket || !marker) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let progress = 0;
    let points: [number, number][] = [];
    let lastPoint: [number, number] | null = null;
    const startY = canvas.height / 2 - 50;

    // Configure line style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawPoint = (x: number, y: number, progress: number) => {
      if (!ctx || !rocket || !marker) return;

      const canvasWidth = canvas.width / 2;
      const canvasHeight = canvas.height / 2;

      // Calculate smoother curve with less variance
      const normalizedProgress = progress / canvasWidth;
      const baseY = startY - (normalizedProgress * canvasHeight * 0.4);
      const variance = Math.sin(normalizedProgress * Math.PI * 3) * 15;
      const finalY = baseY + variance;

      points.push([x, finalY]);

      // Update marker position
      marker.style.transform = `translate(${x}px, ${finalY}px)`;
      
      // Calculate rocket angle based on next point
      const nextX = x + 20;
      const nextY = lastPoint ? finalY - (lastPoint[1] - finalY) : finalY - 10;
      const angle = Math.atan2(nextY - finalY, nextX - x) * (180 / Math.PI);
      
      // Position rocket ahead of the line
      rocket.style.transform = `translate(${nextX}px, ${finalY - 20}px) rotate(${angle}deg)`;
      
      // Check if rocket is off screen and trigger celebration
      if (nextX >= canvasWidth && !showCelebration) {
        setShowCelebration(true);
        rocket.style.opacity = '0';
        rocket.style.transition = 'opacity 0.5s ease-out';
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
      
      // Clear and redraw
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw subtle grid
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < canvasWidth; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvasHeight; i += 25) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;

      // Draw success line
      if (points.length > 1) {
        ctx.beginPath();
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
        gradient.addColorStop(0, '#7c3aed'); // landing-purple
        gradient.addColorStop(1, '#3b82f6'); // landing-blue
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i][0] + points[i + 1][0]) / 2;
          const yc = (points[i][1] + points[i + 1][1]) / 2;
          ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc);
        }
        
        if (points.length > 2) {
          const last = points[points.length - 1];
          const secondLast = points[points.length - 2];
          ctx.quadraticCurveTo(secondLast[0], secondLast[1], last[0], last[1]);
        }
        
        ctx.stroke();

        // Add glow effect
        ctx.save();
        ctx.filter = 'blur(8px)';
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)'; // landing-purple with opacity
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();

        // Draw arrowhead at the end
        if (points.length > 1) {
          const last = points[points.length - 1];
          const secondLast = points[points.length - 2];
          const angle = Math.atan2(last[1] - secondLast[1], last[0] - secondLast[0]);
          
          ctx.save();
          ctx.fillStyle = '#3b82f6'; // landing-blue
          ctx.translate(last[0], last[1]);
          ctx.rotate(angle);
          
          // Draw arrowhead
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-15, -8);
          ctx.lineTo(-15, 8);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }
      }

      lastPoint = [x, finalY];
    };

    const animate = () => {
      if (progress <= canvas.width / 2) {
        drawPoint(progress, 0, progress);
        progress += 4; // Faster animation
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 500);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showCelebration]);

  return (
    <div className="absolute inset-0 opacity-20">
      {showCelebration && <CelebrationElements />}
      
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ filter: 'url(#glow)' }}
      />
      <div 
        ref={markerRef}
        className="absolute top-0 left-0 w-4 h-4 -ml-2 -mt-2"
      >
        <div className="w-full h-full bg-landing-purple rounded-full opacity-50 animate-pulse" />
      </div>
      <div 
        ref={rocketRef}
        className="absolute top-0 left-0 text-landing-purple transition-transform duration-75"
      >
        <Rocket className="w-8 h-8" />
      </div>
      
      <svg width="0" height="0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}