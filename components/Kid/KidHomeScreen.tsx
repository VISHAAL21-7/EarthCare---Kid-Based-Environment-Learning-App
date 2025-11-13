import React from 'react';
import { AppState, View } from '../../types';
import EarthVisual from './EarthVisual';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface KidHomeScreenProps {
  state: AppState;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const KidHomeScreen: React.FC<KidHomeScreenProps> = ({ state, setView }) => {
  const isRepairEnabled = state.earthState === 'Damaged' || state.earthState === 'Critical';
  const earthStatusText = {
    Healthy: "Earth is healthy and happy!",
    Damaged: "Earth is a little damaged.",
    Critical: "Earth is in critical condition!"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card variant="home" className="flex flex-col h-[90vh] max-h-[700px]">
        <header className="flex justify-between items-center w-full mb-2">
            <div className="bg-white/30 rounded-full px-4 py-1 flex items-center space-x-2">
                <span className="text-xl">🍃</span>
                <span className="font-bold text-2xl">{state.shieldsRemaining}</span>
            </div>
            <button onClick={() => setView('dev-unlock')} className="text-xs text-white/70 hover:text-white font-bold">
                Dev
            </button>
        </header>

        <div className="text-center">
            <h1 className="text-2xl font-bold">EarthCare</h1>
            <h2 className="text-4xl font-black drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-200">
                    Your Planet Today
                </span>
            </h2>
        </div>

        <div className="flex-grow flex items-center justify-center relative">
          <EarthVisual state={state.earthState} />
          {isRepairEnabled && (
              <button 
                  onClick={() => setView('kid-repair')}
                  className="absolute inset-0 w-full h-full cursor-pointer group rounded-full"
                  aria-label="Repair Earth"
              >
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-6xl transform transition-transform duration-300 group-hover:scale-110">🔧</span>
                      <span className="text-white font-black text-2xl drop-shadow-lg mt-2">Click to Repair!</span>
                  </div>
                  {/* Pulsing indicator when not hovering */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-pulse group-hover:opacity-0">
                      🔧
                  </div>
              </button>
          )}
        </div>
       
         <div className="text-center mb-4">
            <p className="font-bold text-lg">{earthStatusText[state.earthState]}</p>
            {!isRepairEnabled && <p className="text-sm text-white/80">Keep up the great work!</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
            <Button layout="icon-top" variant="home-yellow" icon="✅" onClick={() => setView('kid-check-in')}>
                Daily Check-In
            </Button>
            <Button layout="icon-top" variant="home-blue" icon="📸" onClick={() => setView('kid-upload')}>
                Eco Photo
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default KidHomeScreen;