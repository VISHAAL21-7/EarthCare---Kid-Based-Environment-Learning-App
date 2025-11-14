import React, { useState, useEffect } from 'react';
import { AppState, View } from '../../types';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { TEN_MINUTES_MS } from '../../constants';

interface DailyCheckInScreenProps {
  state: AppState;
  onCheckIn: (result: 'yes' | 'shield' | 'no') => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const DailyCheckInScreen: React.FC<DailyCheckInScreenProps> = ({ state, onCheckIn, setView }) => {
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;

    if (state.lastCheckInTimestamp) {
      const now = Date.now();
      const timeSinceLastCheckIn = now - state.lastCheckInTimestamp;
      const remainingCooldown = TEN_MINUTES_MS - timeSinceLastCheckIn;

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
  }, [state.lastCheckInTimestamp]);
  
  const isCooldownActive = cooldownTime > 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card variant="check-in">
        <div className="text-8xl mb-4 animate-float">🌍</div>
        <h2 className="text-3xl font-bold mb-2">Hi, {state.kidName}!</h2>
        <p className="text-white/90 mb-6 text-lg">
          {state.streak > 0 
            ? `You're on a ${state.streak}-day streak! How did your eco-habit go today?`
            : "How did your eco-habit go today?"}
        </p>
        <div className="space-y-4">
          <Button
            layout="icon-left"
            icon={isCooldownActive ? "⏳" : "☀️"}
            variant="warning"
            onClick={() => onCheckIn('yes')}
            disabled={isCooldownActive}
          >
            {isCooldownActive ? `Wait ${formatTime(cooldownTime)}` : "YES"}
          </Button>
          <Button 
            layout="icon-left"
            icon="🍃"
            variant="secondary"
            onClick={() => onCheckIn('shield')} 
            disabled={state.shieldsRemaining <= 0 || isCooldownActive}
          >
            Use Shield ({state.shieldsRemaining})
          </Button>
          <Button
            layout="icon-left"
            icon="😟"
            variant="danger"
            onClick={() => onCheckIn('no')}
            disabled={isCooldownActive}
          >
            Skip Day
          </Button>
        </div>
        <button onClick={() => setView('kid-home')} className="mt-6 text-white/70 hover:underline">
            ← Go Back
        </button>
      </Card>
    </div>
  );
};

export default DailyCheckInScreen;