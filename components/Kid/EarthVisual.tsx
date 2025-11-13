import React from 'react';
import { EarthState } from '../../types';

interface EarthVisualProps {
  state: EarthState;
}

const EARTH_TEXTURE_URL = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg';

const earthConfig = {
  Healthy: {
    filter: 'grayscale(0) brightness(1) saturate(1.2)',
    animation: 'animate-rotate-earth',
    decorations: <>
        <span className="absolute top-[15%] left-[10%] text-2xl animate-ping opacity-75">✨</span>
        <span className="absolute top-[20%] left-[15%] text-2xl animate-pulse">⭐</span>
        <div className="absolute top-[30%] -right-4 text-3xl text-yellow-300 animate-swoop">🐤</div>
        <div className="absolute top-[40%] -right-4 text-2xl text-blue-400 animate-swoop [animation-delay:-7s]">🐦</div>
    </>,
  },
  Damaged: {
    filter: 'grayscale(0.5) brightness(0.8) saturate(0.8)',
    animation: 'animate-rotate-earth [animation-duration:60s]', // Slower rotation
    decorations: <>
         <div className="absolute top-1/2 left-1/2 w-10 h-px bg-black/50 transform -rotate-45 -translate-x-8 -translate-y-4 z-20"></div>
         <span className="absolute top-[55%] left-[15%] text-2xl z-20">🥀</span>
         <span className="absolute top-[25%] right-[10%] text-4xl text-gray-400 animate-float">☁️</span>
    </>,
  },
  Critical: {
    filter: 'grayscale(0.8) brightness(0.6) sepia(0.2)',
    animation: '', // No rotation
    decorations: <>
        <span className="absolute top-[10%] right-[10%] text-3xl animate-float">☠️</span>
        <span className="absolute bottom-[25%] left-[10%] text-3xl animate-pulse">🏭</span>
        <div className="absolute top-1/2 left-1/2 w-12 h-px bg-black/70 transform -rotate-45 -translate-x-12 translate-y-1 z-20"></div>
        <div className="absolute top-2/3 left-1/3 w-10 h-px bg-black/70 transform rotate-45 z-20"></div>
        <span className="absolute top-[50%] left-[40%] text-5xl text-gray-500/50 animate-float [animation-delay:-1.5s]">☁️</span>
    </>,
  },
};

const EarthVisual: React.FC<EarthVisualProps> = ({ state }) => {
  const config = earthConfig[state];

  return (
    <div className="relative w-full aspect-square flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        {config.decorations}
      </div>
      
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        {/* Main Earth Sphere */}
        <div
          className={`w-full h-full rounded-full bg-black transition-all duration-1000 ${config.animation}`}
          style={{
            backgroundImage: `url(${EARTH_TEXTURE_URL})`,
            backgroundSize: '200% 100%',
            filter: config.filter,
          }}
        >
        </div>
        
        {/* Lighting and Atmosphere Effects */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
          }}
        ></div>
        <div className="absolute inset-0 rounded-full shadow-sphere-glow"></div>
      </div>
    </div>
  );
};

export default EarthVisual;
