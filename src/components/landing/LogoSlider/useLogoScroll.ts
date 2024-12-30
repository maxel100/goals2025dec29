import { useRef, useEffect } from 'react';

export function useLogoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPos = 0;
    const scrollSpeed = 0.5; // Pixels per frame
    
    const scroll = () => {
      scrollPos += scrollSpeed;
      
      // Reset position smoothly when reaching the end
      const firstSetWidth = container.scrollWidth / 2;
      if (scrollPos >= firstSetWidth) {
        scrollPos = 0;
      }
      
      container.style.transform = `translateX(-${scrollPos}px)`;
      animationFrameId = requestAnimationFrame(scroll);
    };

    scroll();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return { containerRef };
}