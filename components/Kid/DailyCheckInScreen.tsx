import React from 'react';
import { AppState, View } from '../../types';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface DailyCheckInScreenProps {
  state: AppState;
  onCheckIn: (result: 'yes' | 'shield' | 'no') => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const DailyCheckInScreen: React.FC<DailyCheckInScreenProps> = ({ state, onCheckIn, setView }) => {
  const handleNoClick = () => {
    if (window.confirm("Are you sure? Earth will be sad if you skip a day!")) {
      onCheckIn('no');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card variant="check-in">
        <h2 className="text-3xl font-bold mb-6">Did you maintain your eco habit today?</h2>
        <div className="space-y-4">
          <Button layout="icon-left" icon="☀️" variant="warning" onClick={() => onCheckIn('yes')}>YES</Button>
          <Button 
            layout="icon-left"
            icon="🍃"
            variant="secondary"
            onClick={() => onCheckIn('shield')} 
            disabled={state.shieldsRemaining <= 0}
          >
            Use Shield ({state.shieldsRemaining})
          </Button>
          <Button layout="icon-left" icon="😟" variant="danger" onClick={handleNoClick}>Skip Day</Button>
        </div>
        <button onClick={() => setView('kid-home')} className="mt-6 text-white/70 hover:underline">
            ← Go Back
        </button>
      </Card>
    </div>
  );
};

export default DailyCheckInScreen;