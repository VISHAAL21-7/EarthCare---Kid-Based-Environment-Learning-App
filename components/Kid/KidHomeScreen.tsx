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
            <h2 className="text-4xl font-black drop-shadow-lg">Your Planet Today</h2>
        </div>

        <div className="flex-grow flex items-center justify-center">
             <EarthVisual state={state.earthState} />
        </div>
       
        <div className="grid grid-cols-3 gap-3 pt-2">
            <Button layout="icon-top" variant="home-yellow" icon="✅" onClick={() => setView('kid-check-in')}>
                Daily Check-In
            </Button>
            <Button layout="icon-top" variant="home-green" icon="🔧" onClick={() => setView('kid-repair')} disabled={!isRepairEnabled}>
                Repair Earth
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