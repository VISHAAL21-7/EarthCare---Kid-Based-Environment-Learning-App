import React, { useState } from 'react';
import { EarthState } from '../../types';

const EARTH_TEXTURE_URL = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg';
const CLOUD_TEXTURE_URL = 'https://static.vecteezy.com/system/resources/previews/022/227/534/original/fluffy-white-clouds-drifting-across-a-blue-sky-with-transparent-background-png.png';

interface Butterfly {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
  fluttering: boolean;
}

interface Raindrop {
  id: number;
  top: string;
  left: string;
}

const initialButterflies: Butterfly[] = [
  { id: 1, top: '15%', left: '10%', animationDelay: '0s', fluttering: false },
  { id: 2, top: '25%', left: '80%', animationDelay: '1s', fluttering: false },
  { id: 3, top: '60%', left: '5%', animationDelay: '2s', fluttering: false },
];

const EarthVisual: React.FC<{ state: EarthState }> = ({ state }) => {
  const [butterflies, setButterflies] = useState<Butterfly[]>(initialButterflies);
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  const handleButterflyClick = (id: number) => {
    setButterflies(prev => prev.map(b => 
      b.id === id ? { ...b, fluttering: true } : b
    ));
    setTimeout(() => {
      setButterflies(prev => prev.map(b => 
        b.id === id ? { ...b, fluttering: false } : b
      ));
    }, 400);
  };
  
  const handleCloudClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (state === 'Healthy') return;
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const newDrops: Raindrop[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      top: `${((e.clientY - parentRect.top) / parentRect.height) * 100 + 5}%`,
      left: `${((e.clientX - parentRect.left) / parentRect.width) * 100 + (Math.random() - 0.5) * 5}%`
    }));
    
    setRaindrops(prev => [...prev, ...newDrops]);
    
    setTimeout(() => {
        setRaindrops(prev => prev.filter(d => !newDrops.some(nd => nd.id === d.id)));
    }, 1000);
  };

  const earthConfig = {
    Healthy: {
      filter: 'grayscale(0) brightness(1) saturate(1.2)',
      animation: 'animate-rotate-earth',
      decorations: <>
        <div className="absolute top-1/2 w-20 text-5xl z-20 animate-walk-across [animation-duration:25s] pointer-events-none">🐼</div>
        <div className="absolute top-[60%] w-24 text-6xl z-20 animate-walk-across [animation-delay:-12s] pointer-events-none">🐅</div>
        {butterflies.map(b => (
          <div 
            key={b.id} 
            className={`absolute text-2xl cursor-pointer pointer-events-auto ${b.fluttering ? 'animate-flutter' : 'animate-gentle-float'}`} 
            style={{ top: b.top, left: b.left, animationDelay: b.animationDelay }}
            onClick={() => handleButterflyClick(b.id)}
            aria-label="Butterfly"
          >
            🦋
          </div>
        ))}
      </>,
    },
    Damaged: {
      filter: 'grayscale(0.5) brightness(0.8) saturate(0.8)',
      animation: 'animate-rotate-earth [animation-duration:60s]',
      decorations: <>
         <div className="absolute top-1/2 left-1/2 w-10 h-px bg-black/50 transform -rotate-45 -translate-x-8 -translate-y-4 z-20 pointer-events-none"></div>
         <span className="absolute top-[55%] left-[15%] text-2xl z-20 pointer-events-none">🥀</span>
         <span onClick={handleCloudClick} className="absolute top-[25%] right-[10%] text-4xl text-gray-400 animate-float cursor-pointer pointer-events-auto">☁️</span>
      </>,
    },
    Critical: {
      filter: 'grayscale(0.8) brightness(0.6) sepia(0.2)',
      animation: '',
      decorations: <>
        <span className="absolute top-[10%] right-[10%] text-3xl animate-float pointer-events-none">☠️</span>
        <span className="absolute bottom-[25%] left-[10%] text-3xl animate-pulse pointer-events-none">🏭</span>
        <div className="absolute top-1/2 left-1/2 w-12 h-px bg-black/70 transform -rotate-45 -translate-x-12 translate-y-1 z-20 pointer-events-none"></div>
        <div className="absolute top-2/3 left-1/3 w-10 h-px bg-black/70 transform rotate-45 z-20 pointer-events-none"></div>
        <span onClick={handleCloudClick} className="absolute top-[50%] left-[40%] text-5xl text-gray-500/50 animate-float [animation-delay:-1.5s] cursor-pointer pointer-events-auto">☁️</span>
      </>,
    },
  };

  const config = earthConfig[state];

  return (
    <div className="relative w-full aspect-square flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        {config.decorations}
        {raindrops.map(drop => (
          <div key={drop.id} className="absolute text-sky-blue animate-rain-fall text-lg pointer-events-none" style={{ top: drop.top, left: drop.left }}>
            💧
          </div>
        ))}
      </div>
      
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 z-20">
        <div
          className={`w-full h-full rounded-full bg-black transition-all duration-1000 ${config.animation}`}
          style={{
            backgroundImage: `url(${EARTH_TEXTURE_URL})`,
            backgroundSize: '200% 100%',
            filter: config.filter,
          }}
        >
        </div>
        <div
          className="absolute inset-[-10px] rounded-full animate-rotate-clouds opacity-50"
          style={{
            backgroundImage: `url(${CLOUD_TEXTURE_URL})`,
            backgroundSize: '200% 100%',
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
          }}
        ></div>
        <div className="absolute inset-0 rounded-full shadow-sphere-glow"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/4 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/50 to-sky-blue/0"></div>
        {state === 'Healthy' && (
          <div className="absolute bottom-4 w-full h-20">
            <div className="absolute text-5xl opacity-90 animate-swim-jump w-20">🐋</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthVisual;