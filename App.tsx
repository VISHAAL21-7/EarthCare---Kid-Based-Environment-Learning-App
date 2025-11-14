import React, { useState } from 'react';
import { AppState, EarthState, View, Story } from './types';
import { INITIAL_STATE, TEN_MINUTES_MS, GOOGLE_FORM_URL } from './constants';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { stories } from './data/stories';

import KidHomeScreen from './components/Kid/KidHomeScreen';
import DailyCheckInScreen from './components/Kid/DailyCheckInScreen';
import RepairMiniGameScreen from './components/Kid/RepairMiniGameScreen';
import UploadPhotoScreen from './components/Kid/UploadPhotoScreen';
import DevUnlockScreen from './components/Dev/DevUnlockScreen';
import DevAdminDashboard from './components/Dev/DevAdminDashboard';
import BadgeAwardedScreen from './components/Kid/BadgeAwardedScreen';
import SaveTheSaplingsGame from './components/Kid/SaveTheSaplingsGame';
import EcoStoryScreen from './components/Kid/EcoStoryScreen';

const isNewDay = (lastTimestamp: number | null): boolean => {
    if (!lastTimestamp) {
        return true; // First check-in is always a new day for the streak
    }
    const lastDate = new Date(lastTimestamp).toDateString();
    const currentDate = new Date().toDateString();
    return lastDate !== currentDate;
};

function App() {
  const [appState, setAppState] = useLocalStorageState<AppState>('earthcareState', INITIAL_STATE);
  const [view, setView] = useState<View>(appState.mode === 'dev' ? 'dev-dashboard' : 'kid-home');

  const handleSaplingGameComplete = () => {
    const now = Date.now();
    const newDay = isNewDay(appState.lastCheckInTimestamp);

    setAppState(prev => {
      const newStreak = newDay ? prev.streak + 1 : prev.streak;
      let newShields = prev.shieldsRemaining;
      let streakAlert = "";

      if (newDay && newStreak > 0 && newStreak % 3 === 0) {
        if (newShields < 2) {
          newShields++;
          streakAlert = `\n\nAmazing! Your ${newStreak}-day streak earned you a bonus shield!`;
        }
      }

      const successMessage = "Great job! You saved the saplings and helped the Earth!";
      alert(successMessage + streakAlert);

      return {
        ...prev,
        lastCheckInTimestamp: now,
        consecutiveMisses: 0,
        streak: newStreak,
        shieldsRemaining: newShields,
        lastCheckInWasSkip: false,
      };
    });
    setView('kid-home');
  };

  const handleCheckIn = (result: 'yes' | 'shield' | 'no') => {
    const now = Date.now();

    if (appState.lastCheckInTimestamp && now - appState.lastCheckInTimestamp < TEN_MINUTES_MS) {
      alert("You've already checked in recently. Please wait about 10 minutes before trying again.");
      return;
    }
    
    // Set timestamp immediately for 'yes' to unlock story button
    if (result === 'yes') {
      setAppState(prev => ({...prev, lastCheckInTimestamp: now, lastCheckInWasSkip: false}));
      setView('kid-sapling-game');
      return;
    }

    if (result === 'shield') {
      if (appState.shieldsRemaining <= 0) return;

      const newDay = isNewDay(appState.lastCheckInTimestamp);

      setAppState(prev => {
        const newStreak = newDay ? prev.streak + 1 : prev.streak;
        let newShields = prev.shieldsRemaining - 1;
        let streakAlert = "";

        if (newDay && newStreak > 0 && newStreak % 3 === 0) {
          if (newShields < 2) {
            newShields++;
            streakAlert = `\n\nAmazing! Your ${newStreak}-day streak earned you a bonus shield!`;
          }
        }

        const successMessage = "Shield used! Your streak is safe.";
        alert(successMessage + streakAlert);

        return {
          ...prev,
          lastCheckInTimestamp: now,
          consecutiveMisses: 0,
          streak: newStreak,
          shieldsRemaining: newShields,
          lastCheckInWasSkip: false,
        };
      });
       setView('kid-home');
    } else if (result === 'no') {
      setAppState(prev => {
        const newMisses = prev.consecutiveMisses + 1;
        let newEarthState: EarthState = prev.earthState;
        let alertMessage = "Your streak has been reset.";

        if (newMisses === 1) {
          alertMessage += "\nYou've skipped one day. Be careful! If you skip again, the Earth will get damaged.";
        } else if (newMisses === 2) {
          newEarthState = 'Damaged';
          alertMessage += "\n\nOh no! After skipping two days, the Earth is now damaged.";
        } else {
          newEarthState = 'Critical';
          if (prev.earthState !== 'Critical') {
            alertMessage += "\n\nOh no! The Earth is now in critical condition! Please repair it soon.";
          } else {
            alertMessage += "\n\nYou skipped again! The Earth is still in critical condition. It needs your help!";
          }
        }
        
        alert(alertMessage);
        return { 
          ...prev, 
          consecutiveMisses: newMisses, 
          earthState: newEarthState,
          streak: 0, // Reset streak on a miss
          lastCheckInTimestamp: now,
          lastCheckInWasSkip: true,
        };
      });
       setView('kid-home');
    }
  };
  
  const handleStoryComplete = () => {
    setAppState(prev => {
        const nextStoryIndex = prev.storyIndex + 1;
        return {
            ...prev,
            // Loop back to the beginning if all stories are read
            storyIndex: nextStoryIndex >= stories.length ? 0 : nextStoryIndex,
            lastStoryCompletionTimestamp: Date.now(),
        };
    });
    setView('kid-home');
  };

  const handleRepairComplete = () => {
    let newEarthState: EarthState = appState.earthState;
    if (appState.earthState === 'Critical') newEarthState = 'Damaged';
    else if (appState.earthState === 'Damaged') newEarthState = 'Healthy';
    
    setAppState(prev => ({
      ...prev,
      earthState: newEarthState,
      consecutiveMisses: 0,
    }));
    
    setTimeout(() => {
        setView('kid-home');
    }, 1000);
  };
  
  const handleApprovePhoto = () => {
    setAppState(prev => {
        const newPhotoCount = prev.approvedPhotos + 1;
        if (newPhotoCount >= 5) {
            setView('kid-badge-awarded');
            return {
                ...prev,
                approvedPhotos: 0,
                badgeCount: prev.badgeCount + 1,
            };
        }
        return { ...prev, approvedPhotos: newPhotoCount };
    });
  };

  const handlePhotoUploadClick = () => {
    setAppState(prev => ({ ...prev, lastUploadTimestamp: Date.now() }));
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  const handleSetEarthState = (state: EarthState) => {
    setAppState(prev => ({
      ...prev,
      earthState: state,
      consecutiveMisses: state === 'Healthy' ? 0 : prev.consecutiveMisses,
    }));
  };
  
  const handleResetShields = () => setAppState(prev => ({ ...prev, shieldsRemaining: 2 }));
  const handleResetPhotos = () => setAppState(prev => ({ ...prev, approvedPhotos: 0 }));
  const handleAwardBadge = () => setAppState(prev => ({ ...prev, badgeCount: prev.badgeCount + 1 }));

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data and reset to defaults?")) {
      localStorage.removeItem('earthcareState');
      setAppState(INITIAL_STATE);
      setView('kid-home');
    }
  };

  const handleUnlockDev = () => {
    setAppState(prev => ({...prev, mode: 'dev'}));
    setView('dev-dashboard');
  };
  
  const renderView = () => {
    const currentStory: Story = stories[appState.storyIndex] || stories[0];
    switch(view) {
      case 'kid-home':
        return <KidHomeScreen state={appState} setView={setView} />;
      case 'kid-check-in':
        return <DailyCheckInScreen state={appState} onCheckIn={handleCheckIn} setView={setView} />;
      case 'kid-sapling-game':
        return <SaveTheSaplingsGame onGameComplete={handleSaplingGameComplete} />;
      case 'kid-repair':
        return <RepairMiniGameScreen onRepairComplete={handleRepairComplete} setView={setView} />;
      case 'kid-upload':
        return <UploadPhotoScreen state={appState} setView={setView} onUploadClick={handlePhotoUploadClick} />;
      case 'kid-badge-awarded':
        return <BadgeAwardedScreen badgeCount={appState.badgeCount} setView={setView} />;
      case 'kid-story':
        return <EcoStoryScreen story={currentStory} onStoryComplete={handleStoryComplete} setView={setView} />;
      case 'dev-unlock':
        return <DevUnlockScreen onUnlock={handleUnlockDev} setView={setView} />;
      case 'dev-dashboard':
        return <DevAdminDashboard 
          state={appState}
          onApprovePhoto={handleApprovePhoto}
          onSetEarthState={handleSetEarthState}
          onResetShields={handleResetShields}
          onResetPhotos={handleResetPhotos}
          onAwardBadge={handleAwardBadge}
          onClearData={handleClearData}
          setView={setView}
        />;
      default:
        return <KidHomeScreen state={appState} setView={setView} />;
    }
  };

  return (
    <main className="transition-all duration-700 min-h-screen">
      <div className="w-full">
        {renderView()}
      </div>
    </main>
  );
}

export default App;