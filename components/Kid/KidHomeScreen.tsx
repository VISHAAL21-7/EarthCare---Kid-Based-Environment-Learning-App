import React, { useState, useEffect } from 'react';
import { AppState, View } from '../../types';
import EarthVisual from './EarthVisual';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { BADGE_TITLES, TEN_MINUTES_MS } from '../../constants';

interface KidHomeScreenProps {
  state: AppState;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const isNewDay = (lastTimestamp: number | null): boolean => {
    if (!lastTimestamp) {
        return true;
    }
    const lastDate = new Date(lastTimestamp).toDateString();
    const currentDate = new Date().toDateString();
    return lastDate !== currentDate;
};


const KidHomeScreen: React.FC<KidHomeScreenProps> = ({ state, setView }) => {
  const isRepairEnabled = state.earthState === 'Damaged' || state.earthState === 'Critical';
  const earthStatusText = {
    Healthy: "Earth is healthy and happy!",
    Damaged: "Earth is a little damaged.",
    Critical: "Earth is in critical condition!"
  };

  const [storyCooldownRemaining, setStoryCooldownRemaining] = useState(0);

  const hasCheckedInToday = state.lastCheckInTimestamp ? !isNewDay(state.lastCheckInTimestamp) : false;

  useEffect(() => {
    let intervalId: number | undefined;
    if (hasCheckedInToday && state.lastStoryCompletionTimestamp) {
      const timeSinceCompletion = Date.now() - state.lastStoryCompletionTimestamp;
      const remaining = TEN_MINUTES_MS - timeSinceCompletion;
      
      if (remaining > 0) {
        setStoryCooldownRemaining(remaining);
        intervalId = window.setInterval(() => {
          setStoryCooldownRemaining(prev => {
            if (prev <= 1000) {
              if (intervalId) clearInterval(intervalId);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      } else {
        setStoryCooldownRemaining(0);
      }
    } else {
        setStoryCooldownRemaining(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.lastStoryCompletionTimestamp, hasCheckedInToday]);

  const isStoryOnCooldown = storyCooldownRemaining > 0;
  const isStoryFeatureUnlocked = hasCheckedInToday && !state.lastCheckInWasSkip;
  const storyButtonDisabled = !isStoryFeatureUnlocked || isStoryOnCooldown;

  const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  let storyButtonText = "Complete Check-In for Stories";
  if (isStoryFeatureUnlocked) {
    if (isStoryOnCooldown) {
      storyButtonText = `Next Story in (${formatTime(storyCooldownRemaining)})`;
    } else {
      storyButtonText = "Read Next Story!";
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card variant="home" className="flex flex-col h-[90vh] max-h-[750px]">
        <header className="flex justify-between items-start w-full mb-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <div className="bg-white/30 rounded-full px-4 py-1 flex items-center space-x-2">
                  <span className="text-xl">🍃</span>
                  <span className="font-bold text-2xl">{state.shieldsRemaining}</span>
              </div>
              <div className="bg-white/30 rounded-full px-4 py-1 flex items-center space-x-2">
                  <span className="text-xl">🔥</span>
                  <span className="font-bold text-2xl">{state.streak}</span>
              </div>
              {state.badgeCount > 0 && (
                <div className="bg-white/30 rounded-full px-4 py-1 flex items-center space-x-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-md">{BADGE_TITLES[state.badgeCount]}</span>
                </div>
              )}
            </div>
            <button onClick={() => setView('dev-unlock')} className="text-xs text-white/70 hover:text-white font-bold flex-shrink-0">
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
         <div className="mt-4">
            <Button
                layout="icon-left"
                icon="📖"
                variant={isStoryFeatureUnlocked && !isStoryOnCooldown ? 'secondary' : 'primary'}
                onClick={() => setView('kid-story')}
                disabled={storyButtonDisabled}
                className="!rounded-2xl"
            >
                {storyButtonText}
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default KidHomeScreen;