import React from 'react';
import { logos } from './logos';
import { useLogoScroll } from './useLogoScroll';

export function LogoSlider() {
  const { containerRef } = useLogoScroll();

  return (
    <div className="w-full py-12 overflow-hidden bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600 mb-8">
          Trusted by individuals at
        </p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Gradient masks for fading effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10" />
          
          {/* Scrolling container with overflow hidden */}
          <div className="overflow-hidden">
            <div 
              ref={containerRef}
              className="flex items-center space-x-16 whitespace-nowrap transition-transform duration-1000"
              style={{ willChange: 'transform' }}
            >
              {/* Double the logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-8 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}