import React from 'react';
import { EarthState } from '../../types';

interface FaceProps {
  mood: 'happy' | 'sad' | 'worried';
}

const Face: React.FC<FaceProps> = ({ mood }) => {
    const faces = {
        happy: { eyes: '•', mouth: '◡', cheeks: true },
        sad: { eyes: '•', mouth: '◠', cheeks: false },
        worried: { eyes: '°', mouth: 'o', cheeks: false },
    };
    const face = faces[mood];

    return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            {face.cheeks && <>
                <div className="absolute w-4 h-4 bg-pink-300/80 rounded-full" style={{left: '25%', top: '55%'}}></div>
                <div className="absolute w-4 h-4 bg-pink-300/80 rounded-full" style={{right: '25%', top: '55%'}}></div>
            </>}
            <div className={`flex items-center justify-center space-x-4 text-3xl sm:text-4xl font-black ${mood === 'sad' ? 'flex-col space-x-0 space-y-1' : ''}`} style={{color: '#2c3e50'}}>
                <span className="transform -translate-y-1">{face.eyes}</span>
                 {mood === 'sad' ? null : <span className="text-2xl sm:text-3xl transform translate-y-2">{face.mouth}</span>}
                <span className="transform -translate-y-1">{face.eyes}</span>
            </div>
             {mood === 'sad' && <span className="absolute text-2xl sm:text-3xl transform translate-y-4">{face.mouth}</span>}
        </div>
    );
};

interface EarthVisualProps {
  state: EarthState;
}

const earthConfig = {
  Healthy: {
    earthGradient: 'from-eco-green to-teal-400',
    mood: 'happy' as const,
    decorations: <>
        <span className="absolute top-[15%] left-[10%] text-2xl animate-ping opacity-75">✨</span>
        <span className="absolute top-[20%] left-[15%] text-2xl animate-pulse">⭐</span>
        <span className="absolute top-[25%] right-[10%] text-3xl animate-float">☁️</span>
        <span className="absolute top-[50%] left-[5%] text-3xl animate-float animation-delay-300">🌳</span>
        <div className="absolute top-[30%] -right-4 text-3xl text-yellow-300 animate-swoop">🐤</div>
        <div className="absolute top-[40%] -right-4 text-2xl text-blue-400 animate-swoop [animation-delay:-7s]">🐦</div>
    </>,
  },
  Damaged: {
    earthGradient: 'from-yellow-700/80 to-stone-500',
    mood: 'sad' as const,
    decorations: <>
         <span className="absolute top-[25%] right-[10%] text-4xl text-gray-400">☁️</span>
         <div className="absolute top-1/2 left-1/2 w-10 h-px bg-black/50 transform -rotate-45 -translate-x-8 -translate-y-4"></div>
         <span className="absolute top-[55%] left-[15%] text-2xl">🥀</span>
    </>,
  },
  Critical: {
    earthGradient: 'from-stone-600 to-earth-brown',
    mood: 'worried' as const,
    decorations: <>
        <span className="absolute top-[10%] right-[10%] text-3xl animate-spin-slow">☠️</span>
        <span className="absolute bottom-[35%] left-[10%] text-3xl animate-pulse">🏭</span>
        <div className="absolute top-1/2 left-1/2 w-10 h-px bg-black/70 transform -rotate-45 -translate-x-12 translate-y-1"></div>
        <div className="absolute top-2/3 left-1/3 w-8 h-px bg-black/70 transform rotate-45"></div>
    </>,
  },
};

const EarthVisual: React.FC<EarthVisualProps> = ({ state }) => {
  const config = earthConfig[state];

  return (
    <div className={`relative w-full aspect-square flex flex-col items-center justify-end overflow-hidden`}>
      <div className="absolute inset-0">
        {config.decorations}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-eco-green rounded-b-3xl">
         <div className="absolute -top-8 w-full">
            <svg viewBox="0 0 100 20" className="w-full" preserveAspectRatio="none">
                <path d="M0,20 Q25,0 50,10 T100,5 L100,20 Z" fill="#34A853" />
            </svg>
        </div>
      </div>
      <div className={`relative w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br ${config.earthGradient} rounded-full shadow-2xl mb-4 border-4 border-white/50`}>
        <Face mood={config.mood} />
      </div>
    </div>
  );
};

export default EarthVisual;