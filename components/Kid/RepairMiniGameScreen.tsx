import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import Card from '../UI/Card';

interface RepairMiniGameScreenProps {
  onRepairComplete: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const TRASH_ITEMS = ['🍾', '🥫', '📰', '🥤', '🍎'];
const TOTAL_ITEMS = TRASH_ITEMS.length;

const RepairMiniGameScreen: React.FC<RepairMiniGameScreenProps> = ({ onRepairComplete, setView }) => {
  const [cleanedCount, setCleanedCount] = useState(0);

  const handleCleanItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.disabled = true;
    e.currentTarget.classList.add('opacity-0', 'scale-50');
    setCleanedCount(prev => prev + 1);
  };

  useEffect(() => {
    if (cleanedCount === TOTAL_ITEMS) {
      setTimeout(() => {
        alert("Great job! Earth is feeling better thanks to you!");
        onRepairComplete();
      }, 500);
    }
  }, [cleanedCount, onRepairComplete]);

  const progress = (cleanedCount / TOTAL_ITEMS) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card variant="repair" className="relative">
        <h2 className="text-3xl font-black mb-2">Repair Earth</h2>
        
        <div className="w-full bg-black/20 rounded-full h-6 mb-4 border-2 border-white/50">
          <div 
            className="bg-gradient-to-r from-sun-yellow to-yellow-300 h-full rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
           <span className="absolute top-[68px] left-0 right-0 text-sm font-bold">{cleanedCount} / {TOTAL_ITEMS}</span>
        </div>

        <div className="h-64 relative my-4">
          {TRASH_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={handleCleanItem}
              className="absolute text-4xl transition-all duration-300 ease-out hover:scale-110"
              style={{
                top: `${10 + (index % 3) * 25}%`,
                left: `${15 + (index % 4) * 20 + (index % 2) * 5}%`
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex justify-around items-end h-20">
            <div className="text-6xl">♻️</div>
            <div className="text-6xl">♻️</div>
        </div>
         <button onClick={() => setView('kid-home')} className="mt-4 text-white/80 hover:underline">
            ← Back
        </button>
      </Card>
    </div>
  );
};

export default RepairMiniGameScreen;