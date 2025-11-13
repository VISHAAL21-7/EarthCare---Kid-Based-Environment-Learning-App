import React, { useState } from 'react';
import { AppState, EarthState, View } from './types';
import { INITIAL_STATE } from './constants';
import { useLocalStorageState } from './hooks/useLocalStorageState';

import KidHomeScreen from './components/Kid/KidHomeScreen';
import DailyCheckInScreen from './components/Kid/DailyCheckInScreen';
import RepairMiniGameScreen from './components/Kid/RepairMiniGameScreen';
import UploadPhotoScreen from './components/Kid/UploadPhotoScreen';
import DevUnlockScreen from './components/Dev/DevUnlockScreen';
import DevAdminDashboard from './components/Dev/DevAdminDashboard';

function App() {
  const [appState, setAppState] = useLocalStorageState<AppState>('earthcareState', INITIAL_STATE);
  const [view, setView] = useState<View>(appState.mode === 'dev' ? 'dev-dashboard' : 'kid-home');

  const handleCheckIn = (result: 'yes' | 'shield' | 'no') => {
    if (result === 'yes') {
      alert("Great job! Earth is happy!");
      setAppState(prev => ({ ...prev, consecutiveMisses: 0 }));
    } else if (result === 'shield') {
      if (appState.shieldsRemaining > 0) {
        alert("Shield used! Earth is protected from harm.");
        setAppState(prev => ({
          ...prev,
          shieldsRemaining: prev.shieldsRemaining - 1,
          consecutiveMisses: 0,
        }));
      }
    } else if (result === 'no') {
      const newMisses = appState.consecutiveMisses + 1;
      let newEarthState: EarthState = appState.earthState;
      if (newMisses === 1) newEarthState = 'Damaged';
      if (newMisses >= 2) newEarthState = 'Critical';
      setAppState(prev => ({ ...prev, consecutiveMisses: newMisses, earthState: newEarthState }));
    }
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
            alert("🏆 Badge awarded! You're an Eco Hero!");
            return {
                ...prev,
                approvedPhotos: 0,
                badgeCount: prev.badgeCount + 1,
            };
        }
        return { ...prev, approvedPhotos: newPhotoCount };
    });
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
    switch(view) {
      case 'kid-home':
        return <KidHomeScreen state={appState} setView={setView} />;
      case 'kid-check-in':
        return <DailyCheckInScreen state={appState} onCheckIn={handleCheckIn} setView={setView} />;
      case 'kid-repair':
        return <RepairMiniGameScreen onRepairComplete={handleRepairComplete} setView={setView} />;
      case 'kid-upload':
        return <UploadPhotoScreen state={appState} setView={setView} />;
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