import React, { useState, useRef, useEffect } from 'react';
import { EarthState } from '../../types';
import playSound from '../../utils/audio';

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

interface SplashParticle {
  id: number;
  top: string;
  left: string;
  rotation: number;
}

interface FloatingCloud {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
  opacity: string;
}

const initialButterflies: Butterfly[] = [
  { id: 1, top: '15%', left: '10%', animationDelay: '0s', fluttering: false },
  { id: 2, top: '25%', left: '80%', animationDelay: '1s', fluttering: false },
  { id: 3, top: '60%', left: '5%', animationDelay: '2s', fluttering: false },
];

const initialFloatingClouds: FloatingCloud[] = [
  { id: 1, top: '5%', left: '-10%', duration: '25s', delay: '0s', size: 'text-5xl', opacity: 'opacity-40' },
  { id: 2, top: '15%', left: '-15%', duration: '35s', delay: '5s', size: 'text-6xl', opacity: 'opacity-30' },
  { id: 3, top: '80%', left: '-10%', duration: '30s', delay: '10s', size: 'text-4xl', opacity: 'opacity-50' },
];

const EarthVisual: React.FC<{ state: EarthState }> = ({ state }) => {
  const [butterflies, setButterflies] = useState<Butterfly[]>(initialButterflies);
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const [isWhaleJumping, setIsWhaleJumping] = useState(false);
  const [splashParticles, setSplashParticles] = useState<SplashParticle[]>([]);
  const [wobblingAnimal, setWobblingAnimal] = useState<'lion' | 'tiger' | null>(null);
  const [jumpPosition, setJumpPosition] = useState<{top: string, left: string} | null>(null);
  const whaleContainerRef = useRef<HTMLDivElement>(null);
  
  const [transitionEffect, setTransitionEffect] = useState<'healing' | 'damaging' | 'critical' | null>(null);
  const prevStateRef = useRef<EarthState>(state);

  useEffect(() => {
    const prevState = prevStateRef.current;

    if (prevState !== state) {
        // Transitioning TO Healthy
        if (state === 'Healthy' && (prevState === 'Damaged' || prevState === 'Critical')) {
            playSound('powerup', 0.6);
            setTransitionEffect('healing');
        }
        // Transitioning TO Damaged from Healthy
        else if (state === 'Damaged' && prevState === 'Healthy') {
            playSound('error', 0.4);
            setTransitionEffect('damaging');
        }
        // Transitioning TO Critical from Damaged
        else if (state === 'Critical' && prevState === 'Damaged') {
            playSound('error');
            setTransitionEffect('critical');
        }

        // Reset the effect after the animation
        setTimeout(() => {
            setTransitionEffect(null);
        }, 800); // Duration of the animation
    }

    // Update the ref to the current state for the next render
    prevStateRef.current = state;
  }, [state]);

  const handleButterflyClick = (id: number) => {
    playSound('flutter', 0.3);
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

  const handleWhaleClick = () => {
    if (isWhaleJumping || !whaleContainerRef.current) return;
    playSound('splash');
    const whaleRect = whaleContainerRef.current.getBoundingClientRect();
    const parentRect = whaleContainerRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const currentTop = whaleRect.top - parentRect.top;
    const currentLeft = whaleRect.left - parentRect.left;

    setJumpPosition({ top: `${currentTop}px`, left: `${currentLeft}px` });
    setIsWhaleJumping(true);
    
    const particles: SplashParticle[] = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      top: `${((currentTop + whaleRect.height * 0.5) / parentRect.height) * 100}%`,
      left: `${((currentLeft + whaleRect.width * 0.5) / parentRect.width) * 100}%`,
      rotation: Math.random() * 360,
    }));
    setSplashParticles(particles);
    
    setTimeout(() => {
        setIsWhaleJumping(false);
        setJumpPosition(null);
    }, 800);

    setTimeout(() => {
        setSplashParticles([]);
    }, 500);
  };

  const handleAnimalClick = (animal: 'lion' | 'tiger') => {
    if (wobblingAnimal) return; // Prevent re-triggering while animating
    playSound('wobble');
    setWobblingAnimal(animal);
    setTimeout(() => {
      setWobblingAnimal(null);
    }, 800); // Corresponds to the 'wobble' animation duration
  };

  const earthStateClasses = {
    Healthy: "from-sky-blue to-eco-green/80 shadow-sphere-glow",
    Damaged: "from-sky-blue/70 to-yellow-800/60",
    Critical: "from-gray-600 to-red-900/70"
  };

  const earthTextureClasses = {
    Healthy: 'animate-rotate-earth',
    Damaged: 'animate-rotate-earth filter grayscale brightness-75',
    Critical: 'animate-rotate-earth filter grayscale brightness-50 contrast-125'
  };

  return (
    <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${earthStateClasses[state]} overflow-hidden`} style={{ zIndex: 0 }}>
        <div 
          className={`w-full h-full rounded-full bg-cover bg-center ${earthTextureClasses[state]}`}
          style={{ backgroundImage: `url(${EARTH_TEXTURE_URL})`, backgroundSize: '200% 100%' }}
        ></div>
        <div 
          className="absolute inset-0 w-full h-full rounded-full bg-contain bg-center opacity-30 animate-rotate-clouds"
          style={{ backgroundImage: `url(${CLOUD_TEXTURE_URL})`, backgroundSize: '200% 100%' }}
        ></div>
      </div>
      
      {/* Transition Overlay */}
      {transitionEffect && (
          <div
              key={transitionEffect} // Re-triggers animation on change
              className={`absolute inset-0 rounded-full z-20 pointer-events-none ${
                  transitionEffect === 'healing' ? 'bg-eco-green/80 animate-healing-flash' : ''
              } ${
                  transitionEffect === 'damaging' ? 'bg-yellow-800/80 animate-damaging-flash' : ''
              } ${
                  transitionEffect === 'critical' ? 'bg-skip-red/80 animate-damaging-flash' : ''
              }`}
          />
      )}

      <div className="absolute inset-0">
        {state === 'Healthy' && (
          <>
            {butterflies.map(b => (
              <span key={b.id} className={`absolute text-2xl transition-transform duration-300 animate-gentle-float cursor-pointer ${b.fluttering ? 'animate-flutter' : ''}`} style={{ top: b.top, left: b.left, animationDelay: b.animationDelay }} onClick={() => handleButterflyClick(b.id)}>
                🦋
              </span>
            ))}
            <div className={`absolute text-5xl animate-walk-around [animation-delay:-7.5s] cursor-pointer ${wobblingAnimal === 'lion' ? 'animate-wobble' : ''}`} onClick={() => handleAnimalClick('lion')}>🦁</div>
            <div className={`absolute text-5xl animate-walk-around cursor-pointer ${wobblingAnimal === 'tiger' ? 'animate-wobble' : ''}`} onClick={() => handleAnimalClick('tiger')}>🐅</div>
            
            <div 
              ref={whaleContainerRef}
              className={`absolute text-6xl cursor-pointer ${!isWhaleJumping ? 'animate-swim-around-position' : ''}`}
              style={jumpPosition ? { ...jumpPosition, zIndex: 20 } : {}}
              onClick={handleWhaleClick}
            >
              <div className={!isWhaleJumping ? 'animate-swim-around-transform' : 'animate-whale-jump'}>
                🐋
              </div>
            </div>
            
            {splashParticles.map(p => (
              <div key={p.id} className="absolute text-xl text-sky-blue animate-splash-burst" style={{ top: p.top, left: p.left, transform: `rotate(${p.rotation}deg)` }}>
                💧
              </div>
            ))}

            <div className="absolute bottom-[10%] left-[15%] text-3xl animate-subtle-sway">🌿</div>
            <div className="absolute bottom-[5%] right-[20%] text-2xl animate-subtle-sway [animation-delay:'-2s']">🌱</div>
            <div className="absolute top-[20%] right-[15%] text-xl animate-sparkle-pulse">✨</div>
            <div className="absolute bottom-[15%] left-[40%] text-lg animate-sparkle-pulse [animation-delay:'-1s']">✨</div>
          </>
        )}

        {state === 'Damaged' && (
          <>
            <span className="absolute top-[10%] left-[10%] text-5xl opacity-80 cursor-pointer animate-float" onClick={handleCloudClick}>☁️</span>
            <span className="absolute top-[60%] right-[5%] text-6xl opacity-80 cursor-pointer animate-float [animation-delay:-2s]" onClick={handleCloudClick}>☁️</span>
          </>
        )}

        {state === 'Critical' && (
          <>
            <span className="absolute top-[15%] left-[5%] text-6xl opacity-90 cursor-pointer animate-float [animation-delay:-1s]" onClick={handleCloudClick}>⛈️</span>
            <span className="absolute top-[55%] right-[10%] text-5xl opacity-90 cursor-pointer animate-float [animation-delay:-3s]" onClick={handleCloudClick}>⛈️</span>
          </>
        )}
        
        {raindrops.map(drop => (
          <div key={drop.id} className="absolute text-lg text-sky-blue animate-rain-fall" style={{ top: drop.top, left: drop.left }}>
            💧
          </div>
        ))}
        {initialFloatingClouds.map(c => (
             <div key={c.id} className={`absolute animate-drift ${c.size} ${c.opacity}`} style={{ top: c.top, left: c.left, animationDuration: c.duration, animationDelay: c.delay }}>☁️</div>
        ))}
      </div>
    </div>
  );
};

export default EarthVisual;