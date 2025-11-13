import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../../types';

const EarthMascot = ({ progress }: { progress: number }) => {
  let emoji = '😢';
  let text = "Earth is very polluted!";
  let bgColor = 'bg-gray-700/80';

  if (progress > 30) {
    emoji = '😟';
    text = "It's getting cleaner!";
    bgColor = 'bg-sky-700/80';
  }
  if (progress > 70) {
    emoji = '😊';
    text = "Almost there! Earth is happy!";
    bgColor = 'bg-sky-500/80';
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 pointer-events-none">
      <div className={`w-48 h-48 rounded-full flex items-center justify-center ${bgColor} border-8 border-white/50 shadow-lg`}>
        <span className="text-8xl animate-float">{emoji}</span>
      </div>
      <p className="mt-4 text-white font-bold text-xl bg-black/30 rounded-full px-4 py-1 text-center">{text}</p>
    </div>
  );
};

type TrashType = 'recyclable' | 'biodegradable';

interface TrashItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  rotation: number;
  type: TrashType;
}

const TRASH_CONFIG = [
  { emoji: '🍾', type: 'recyclable' as TrashType },
  { emoji: '🥫', type: 'recyclable' as TrashType },
  { emoji: '📰', type: 'recyclable' as TrashType },
  { emoji: '🥤', type: 'recyclable' as TrashType },
  { emoji: '🛍️', type: 'recyclable' as TrashType },
  { emoji: '📦', type: 'recyclable' as TrashType },
  { emoji: '🍎', type: 'biodegradable' as TrashType },
];

const TOTAL_ITEMS_TO_CLEAN = 10;
const GAME_AREA_PADDING = 30;

const RepairMiniGameScreen: React.FC<{
  onRepairComplete: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}> = ({ onRepairComplete, setView }) => {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [draggedItem, setDraggedItem] = useState<TrashItem | null>(null);
  const [lastSuccessBin, setLastSuccessBin] = useState<'recycle' | 'compost' | null>(null);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const recycleBinRef = useRef<HTMLDivElement>(null);
  const compostBinRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    const gameLoop = () => {
      setItems(prevItems => {
        if (!gameAreaRef.current) return prevItems;
        const gameAreaHeight = gameAreaRef.current.offsetHeight;
        const gameAreaWidth = gameAreaRef.current.offsetWidth;
        return prevItems.map(item => ({
          ...item,
          y: item.y + 1,
          x: item.x + item.vx,
          rotation: item.rotation + item.vx,
        })).filter(item => item.y < gameAreaHeight && item.x > -50 && item.x < gameAreaWidth + 50);
      });
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const spawnItem = () => {
      if (!gameAreaRef.current) return;
      const gameAreaWidth = gameAreaRef.current.offsetWidth;
      const config = TRASH_CONFIG[Math.floor(Math.random() * TRASH_CONFIG.length)];
      const newItem: TrashItem = {
        id: nextId.current++,
        emoji: config.emoji,
        type: config.type,
        x: Math.random() * (gameAreaWidth - GAME_AREA_PADDING * 2) + GAME_AREA_PADDING,
        y: -50,
        vx: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
      };
      setItems(prev => [...prev, newItem]);
    };
    if (items.length < 7 && cleanedCount < TOTAL_ITEMS_TO_CLEAN) {
      const intervalId = setInterval(spawnItem, 1500);
      return () => clearInterval(intervalId);
    }
  }, [items.length, cleanedCount]);

  useEffect(() => {
    if (cleanedCount >= TOTAL_ITEMS_TO_CLEAN) {
      setTimeout(() => {
        alert("Great job! Earth is feeling better thanks to you!");
        onRepairComplete();
      }, 500);
    }
  }, [cleanedCount, onRepairComplete]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, itemToDrag: TrashItem) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setItems(prev => prev.filter(item => item.id !== itemToDrag.id));
    setDraggedItem(itemToDrag);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedItem || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setDraggedItem({
      ...draggedItem,
      x: e.clientX - rect.left - 35, // Approx half item width
      y: e.clientY - rect.top - 35, // Approx half item height
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedItem) return;

    const isOverlapping = (elementRef: React.RefObject<HTMLDivElement>): boolean => {
      if (!elementRef.current) return false;
      const rect = elementRef.current.getBoundingClientRect();
      return (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );
    };

    let droppedCorrectly = false;
    if (isOverlapping(recycleBinRef)) {
      if (draggedItem.type === 'recyclable') {
        droppedCorrectly = true;
        setLastSuccessBin('recycle');
      }
    } else if (isOverlapping(compostBinRef)) {
      if (draggedItem.type === 'biodegradable') {
        droppedCorrectly = true;
        setLastSuccessBin('compost');
      }
    }

    if (droppedCorrectly) {
      setCleanedCount(c => c + 1);
      setTimeout(() => setLastSuccessBin(null), 400);
    } else {
      setItems(prev => [...prev, draggedItem]);
    }
    setDraggedItem(null);
  };

  const progress = (cleanedCount / TOTAL_ITEMS_TO_CLEAN) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-sky-blue to-eco-green/80">
      <div 
        className="w-full max-w-sm h-[90vh] max-h-[700px] bg-sky-300 rounded-3xl shadow-cute-lg overflow-hidden relative flex flex-col select-none touch-none" 
        ref={gameAreaRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200">
          <div className="absolute top-[10%] left-[10%] text-4xl opacity-50 animate-float">☁️</div>
          <div className="absolute top-[20%] right-[15%] text-5xl opacity-50 animate-float [animation-delay:-2s]">☁️</div>
        </div>
        <header className="p-4 z-10">
          <h2 className="text-3xl text-white font-black text-center drop-shadow-md">Clean Up The Planet!</h2>
          <div className="w-full bg-black/20 rounded-full h-6 mt-2 border-2 border-white/50">
            <div
              className="bg-gradient-to-r from-sun-yellow to-yellow-300 h-full rounded-full transition-all duration-300 text-center text-xs font-bold text-text-dark flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              {cleanedCount} / {TOTAL_ITEMS_TO_CLEAN}
            </div>
          </div>
        </header>
        <main className="flex-grow relative">
          <EarthMascot progress={progress} />
          {items.map(item => (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              className="absolute text-5xl cursor-grab active:cursor-grabbing"
              style={{ left: `${item.x}px`, top: `${item.y}px`, transform: `rotate(${item.rotation}deg)` }}
            >
              {item.emoji}
            </div>
          ))}
          {draggedItem && (
            <div
              className="absolute text-5xl cursor-grabbing transition-transform duration-100"
              style={{
                left: `${draggedItem.x}px`,
                top: `${draggedItem.y}px`,
                transform: 'scale(1.2) rotate(5deg)',
                zIndex: 100,
                filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.3))'
              }}
            >
              {draggedItem.emoji}
            </div>
          )}
        </main>
        <footer className="h-32 bg-green-800/50 flex justify-around items-center p-4 border-t-8 border-green-900/50 z-10">
          <div ref={recycleBinRef} className={`flex flex-col items-center text-white p-2 rounded-2xl transition-transform duration-200 ${lastSuccessBin === 'recycle' ? 'animate-bounce' : ''}`}>
            <div className="text-6xl drop-shadow-lg">♻️</div>
            <p className="font-bold">Recycle</p>
          </div>
          <div ref={compostBinRef} className={`flex flex-col items-center text-white p-2 rounded-2xl transition-transform duration-200 ${lastSuccessBin === 'compost' ? 'animate-bounce' : ''}`}>
            <div className="text-6xl drop-shadow-lg">🌱</div>
            <p className="font-bold">Compost</p>
          </div>
        </footer>
        <button onClick={() => setView('kid-home')} className="absolute top-2 left-2 text-white/80 hover:underline z-20 bg-black/20 rounded-full px-3 py-1 font-bold">
          ← Back
        </button>
      </div>
    </div>
  );
};

export default RepairMiniGameScreen;
