import React, { useState, useEffect } from 'react';
import { AppState, View } from '../../types';
import { BADGE_TITLES, TEN_MINUTES_MS } from '../../constants';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface UploadPhotoScreenProps {
  state: AppState;
  setView: React.Dispatch<React.SetStateAction<View>>;
  onUploadClick: () => void;
}

const UploadPhotoScreen: React.FC<UploadPhotoScreenProps> = ({ state, setView, onUploadClick }) => {
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;

    if (state.lastUploadTimestamp) {
      const now = Date.now();
      const timeSinceLastUpload = now - state.lastUploadTimestamp;
      const remainingCooldown = TEN_MINUTES_MS - timeSinceLastUpload;

      if (remainingCooldown > 0) {
        setCooldownTime(remainingCooldown);
        intervalId = window.setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1000) {
              if (intervalId) clearInterval(intervalId);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      } else {
        setCooldownTime(0);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.lastUploadTimestamp]);

  const isCooldownActive = cooldownTime > 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextBadgeName = BADGE_TITLES[state.badgeCount + 1] || "Max Level";
  const currentBadgeName = BADGE_TITLES[state.badgeCount] || "None";


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="text-text-dark" variant="badge">
        <div className="text-8xl animate-bounce">🏅</div>
        <h2 className="text-4xl font-black my-4">Eco Hero Badge</h2>
        
        <div className="bg-white/50 p-4 rounded-2xl my-4 text-left">
            <p className="font-bold mb-2">Upload a photo of your eco-task to earn progress towards your next badge: <span className="text-sky-blue-dark">{nextBadgeName}</span>!</p>
            <p className="text-sm">Tasks: Sorting recycling, using a reusable bottle, and more!</p>
        </div>
        
        <Button 
          onClick={onUploadClick}
          variant="primary"
          disabled={isCooldownActive}
        >
          {isCooldownActive ? `⏳ Wait ${formatTime(cooldownTime)}` : "Upload Photo"}
        </Button>

        <div className="mt-6 font-semibold bg-white/50 rounded-full px-4 py-2">
          <p className="font-bold mb-2">Progress to {nextBadgeName}:</p>
          <div className="flex justify-center items-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-4xl transition-all duration-300 ${i < state.approvedPhotos ? 'transform scale-110 text-yellow-400 drop-shadow-lg' : 'opacity-50 text-gray-600'}`}>
                ⭐
              </span>
            ))}
          </div>
           <p className="text-sm mt-1">({state.approvedPhotos}/5 photos approved)</p>
        </div>
        
        <p className="mt-2 font-bold">Current Badge: {currentBadgeName} {state.badgeCount > 0 ? '🏆' : ''}</p>

         <button onClick={() => setView('kid-home')} className="mt-6 text-text-dark/70 hover:underline block mx-auto">
            ← Back to Home
        </button>
      </Card>
    </div>
  );
};

export default UploadPhotoScreen;