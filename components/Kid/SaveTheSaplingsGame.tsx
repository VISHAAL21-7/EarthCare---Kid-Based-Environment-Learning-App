import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- CONFIGURATION ---
const TOTAL_ITEMS_TO_SAVE = 12;
const MAX_ONSCREEN_ITEMS = 6;
const ITEM_SPAWN_INTERVAL = 1800;
const BASE_FALL_SPEED = 0.9;

// --- TYPES ---
type ZoneType = 'forest' | 'park' | 'desert' | 'island' | 'garden' | 'compost';
type SaplingType = 'pine' | 'oak' | 'cherry' | 'cactus' | 'palm' | 'bush' | 'withered';

interface ZoneVariation {
  name: string;
  emoji: string;
  bg: string;
  decoration?: { emoji: string; className: string };
}

const ZONE_VARIATIONS: Record<ZoneType, ZoneVariation[]> = {
  forest: [
    { name: 'Deep Forest', emoji: '🏞️', bg: 'bg-gradient-to-br from-green-700 to-green-900', decoration: { emoji: '🍄', className: 'absolute -bottom-1 -right-1 text-2xl opacity-70' } },
    { name: 'Misty Woods', emoji: '🌲', bg: 'bg-gradient-to-br from-emerald-800 to-slate-600', decoration: { emoji: '🌫️', className: 'absolute top-0 left-0 text-3xl opacity-50' } },
    { name: 'Sunny Grove', emoji: '🌳', bg: 'bg-gradient-to-br from-lime-600 to-green-700', decoration: { emoji: '🐿️', className: 'absolute bottom-0 -left-1 text-2xl opacity-90' } },
  ],
  park: [
    { name: 'City Park', emoji: '🏙️', bg: 'bg-gradient-to-br from-slate-500 to-slate-700', decoration: { emoji: '🕊️', className: 'absolute top-0 right-1 text-2xl opacity-70' } },
    { name: 'Playground', emoji: '🛝', bg: 'bg-gradient-to-br from-indigo-500 to-purple-600', decoration: { emoji: '⚽', className: 'absolute -bottom-1 -left-1 text-3xl opacity-80' } },
    { name: 'City Square', emoji: '🏢', bg: 'bg-gradient-to-br from-gray-600 to-gray-800', decoration: { emoji: '💡', className: 'absolute -top-1 right-0 text-3xl opacity-60' } },
  ],
  desert: [{ name: 'Arid Desert', emoji: '🏜️', bg: 'bg-gradient-to-br from-yellow-500 to-orange-600' }],
  island: [{ name: 'Tropical Island', emoji: '🏝️', bg: 'bg-gradient-to-br from-cyan-400 to-blue-600' }],
  garden: [{ name: 'Garden', emoji: '⛲', bg: 'bg-gradient-to-br from-pink-400 to-purple-500' }],
  compost: [{ name: 'Compost Bin', emoji: '🗑️', bg: 'bg-gradient-to-br from-yellow-800 to-yellow-900' }],
};
const ALL_ZONES = Object.keys(ZONE_VARIATIONS) as ZoneType[];


const ALL_SAPLING_TYPES: SaplingType[] = ['pine', 'oak', 'cherry', 'cactus', 'palm', 'bush', 'withered'];

const SAPLING_TO_ZONE: Record<SaplingType, ZoneType> = {
  pine: 'forest', oak: 'forest',
  cherry: 'park',
  cactus: 'desert',
  palm: 'island',
  bush: 'garden',
  withered: 'compost',
};

const SAPLING_CONFIG: Record<SaplingType, { emoji: string; name: string }> = {
  pine: { emoji: '🌲', name: 'Pine' },
  oak: { emoji: '🌳', name: 'Oak' },
  cherry: { emoji: '🌸', name: 'Cherry Blossom' },
  cactus: { emoji: '🌵', name: 'Cactus' },
  palm: { emoji: '🌴', name: 'Palm' },
  bush: { emoji: '🌷', name: 'Flowering Bush' },
  withered: { emoji: '🥀', name: 'Withered Sapling' },
};

interface Sapling {
  id: number;
  type: SaplingType;
  x: number;
  y: number;
  isWobbling?: boolean;
  isGolden?: boolean;
}

interface PowerUp {
  id: number;
  type: 'wateringCan';
  emoji: string;
  x: number;
  y: number;
}
type GameItem = Sapling | PowerUp;
type ZoneFeedback = 'success' | 'failure' | null;

// --- HELPER COMPONENTS ---
const ConfettiPiece: React.FC<{ initialX: number, delay: number, color: string }> = ({ initialX, delay, color }) => (
  <div className="absolute w-3 h-5 rounded-sm" style={{ left: `${initialX}%`, animation: `confetti-fall 3s linear ${delay}s infinite`, backgroundColor: color, top: '-20px' }}></div>
);

// --- MAIN COMPONENT ---
const SaveTheSaplingsGame: React.FC<{ onGameComplete: () => void }> = ({ onGameComplete }) => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [draggedSapling, setDraggedSapling] = useState<{ sapling: Sapling, offset: { x: number, y: number } } | null>(null);
  const [zoneFeedback, setZoneFeedback] = useState<Record<ZoneType, ZoneFeedback>>({ forest: null, park: null, desert: null, island: null, garden: null, compost: null });
  const [savedInZone, setSavedInZone] = useState<Record<ZoneType, {emoji: string}[]>>({ forest: [], park: [], desert: [], island: [], garden: [], compost: [] });
  const [combo, setCombo] = useState(0);
  const [isSlowed, setIsSlowed] = useState(false);
  const [effects, setEffects] = useState<{ id: number, x: number, y: number, emoji: string }[]>([]);
  const [popupMessage, setPopupMessage] = useState<{id: number; text: string; x: number; y: number} | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const [zoneConfig] = useState<Record<ZoneType, ZoneVariation>>(() => {
    const selectedConfigs: Partial<Record<ZoneType, ZoneVariation>> = {};
    for (const key in ZONE_VARIATIONS) {
        const zoneType = key as ZoneType;
        const variations = ZONE_VARIATIONS[zoneType];
        selectedConfigs[zoneType] = variations[Math.floor(Math.random() * variations.length)];
    }
    return selectedConfigs as Record<ZoneType, ZoneVariation>;
  });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const zoneRefs = ALL_ZONES.reduce((acc, type) => ({ ...acc, [type]: React.createRef<HTMLDivElement>() }), {} as Record<ZoneType, React.RefObject<HTMLDivElement>>);
  const nextId = useRef(0);
  const animationFrameRef = useRef<number>();
  const spawnIntervalRef = useRef<number>();

  const fallSpeed = isSlowed ? BASE_FALL_SPEED * 0.5 : BASE_FALL_SPEED;

  const gameLoop = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, y: item.y + fallSpeed })).filter(item => item.y < (gameAreaRef.current?.offsetHeight ?? 800)));
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [fallSpeed]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [gameLoop]);

  useEffect(() => {
    const spawnItem = () => {
      if (!gameAreaRef.current || items.length >= MAX_ONSCREEN_ITEMS || savedCount >= TOTAL_ITEMS_TO_SAVE) return;
      const rand = Math.random();
      let newItem: GameItem;
      if (rand < 0.1 && !items.some(item => 'type' in item && item.type === 'wateringCan')) {
        newItem = { id: nextId.current++, type: 'wateringCan', emoji: '💧', x: Math.random() * (gameAreaRef.current.offsetWidth - 60) + 10, y: -60 };
      } else {
        const healthySaplings = ALL_SAPLING_TYPES.filter(t => t !== 'withered');
        const type = Math.random() < 0.2 ? 'withered' : healthySaplings[Math.floor(Math.random() * healthySaplings.length)];
        const isGolden = type !== 'withered' && Math.random() < 0.15;
        newItem = { id: nextId.current++, type, isGolden, x: Math.random() * (gameAreaRef.current.offsetWidth - 60) + 10, y: -60 };
      }
      setItems(prev => [...prev, newItem]);
    };
    spawnIntervalRef.current = window.setInterval(spawnItem, ITEM_SPAWN_INTERVAL);
    return () => clearInterval(spawnIntervalRef.current);
  }, [items.length, savedCount]);
  
  useEffect(() => {
    if (savedCount >= TOTAL_ITEMS_TO_SAVE && !isComplete) {
      setIsComplete(true);
      clearInterval(spawnIntervalRef.current);
      setTimeout(() => onGameComplete(), 3000);
    }
  }, [savedCount, onGameComplete, isComplete]);
  
  const triggerEffect = (x: number, y: number, emoji: string) => {
    const id = Date.now();
    setEffects(prev => [...prev, { id, x, y, emoji }]);
    setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), 500);
  };
  
  const triggerPopup = (x: number, y: number, text: string) => {
    const id = Date.now();
    setPopupMessage({ id, text, x, y });
    setTimeout(() => setPopupMessage(prev => (prev?.id === id ? null : prev)), 1500);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, item: GameItem) => {
    if ('isGolden' in item || ALL_SAPLING_TYPES.includes((item as Sapling).type)) {
      const sapling = item as Sapling;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDraggedSapling({ sapling, offset: { x: e.clientX - rect.left, y: e.clientY - rect.top } });
      setItems(prev => prev.filter(s => s.id !== sapling.id));
    } else {
        const powerUp = item as PowerUp;
        if (powerUp.type === 'wateringCan') {
            triggerPopup(powerUp.x, powerUp.y, "Yay! You Saved The Water!");
            setIsSlowed(true);
            setTimeout(() => setIsSlowed(false), 4000);
            setItems(prev => prev.filter(i => i.id !== powerUp.id));
        }
    }
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedSapling || !gameAreaRef.current) return;
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    setDraggedSapling(prev => prev ? { ...prev, sapling: { ...prev.sapling, x: e.clientX - gameRect.left - prev.offset.x, y: e.clientY - gameRect.top - prev.offset.y } } : null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedSapling) return;
    
    let droppedInZone: ZoneType | null = null;
    let zoneCenter = { x: 0, y: 0 };
    for (const key in zoneRefs) {
      const zoneType = key as ZoneType;
      const zoneRef = zoneRefs[zoneType];
      if (zoneRef.current) {
        const zoneRect = zoneRef.current.getBoundingClientRect();
        if (e.clientX >= zoneRect.left && e.clientX <= zoneRect.right && e.clientY >= zoneRect.top && e.clientY <= zoneRect.bottom) {
          droppedInZone = zoneType;
          zoneCenter = { x: zoneRect.left + zoneRect.width / 2, y: zoneRect.top + zoneRect.height / 2 };
          break;
        }
      }
    }
    
    const triggerFeedback = (zone: ZoneType, type: ZoneFeedback) => {
      setZoneFeedback(prev => ({ ...prev, [zone]: type }));
      setTimeout(() => setZoneFeedback(prev => ({ ...prev, [zone]: null })), 400);
    };

    const correctZone = SAPLING_TO_ZONE[draggedSapling.sapling.type];
    if (droppedInZone && (correctZone === droppedInZone || (draggedSapling.sapling.isGolden && droppedInZone !== 'compost'))) {
      const points = draggedSapling.sapling.isGolden ? 2 : 1;
      const newCombo = combo + 1;
      const bonus = newCombo > 0 && newCombo % 3 === 0 ? 1 : 0;
      setSavedCount(prev => Math.min(TOTAL_ITEMS_TO_SAVE, prev + points + bonus));
      setCombo(newCombo);
      setSavedInZone(prev => ({ ...prev, [droppedInZone as ZoneType]: [...prev[droppedInZone as ZoneType], { emoji: SAPLING_CONFIG[draggedSapling.sapling.type].emoji }] }));
      triggerFeedback(droppedInZone, 'success');
      triggerEffect(zoneCenter.x - gameAreaRef.current!.getBoundingClientRect().left, zoneCenter.y - gameAreaRef.current!.getBoundingClientRect().top, draggedSapling.sapling.isGolden ? '✨' : '🍃');
    } else {
      if (droppedInZone) triggerFeedback(droppedInZone, 'failure');
      setCombo(0);
      const returnedSapling = { ...draggedSapling.sapling, isWobbling: true, y: 10 };
      setItems(prev => [...prev, returnedSapling]);
      setTimeout(() => setItems(prev => prev.map(s => s.id === returnedSapling.id ? { ...s, isWobbling: false } : s)), 800);
    }
    setDraggedSapling(null);
  };

  const progress = (savedCount / TOTAL_ITEMS_TO_SAVE) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-sky-blue to-eco-green/20">
      <div
        ref={gameAreaRef}
        className="w-full max-w-sm h-[90vh] max-h-[700px] bg-sky-200 rounded-3xl shadow-cute-lg overflow-hidden relative flex flex-col select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
      >
        {isComplete && (
            <div className="absolute inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
                {Array.from({ length: 20 }).map((_, i) => (<ConfettiPiece key={i} initialX={Math.random() * 100} delay={Math.random() * 3} color={['#FBBC05', '#EA4335', '#34A853', '#4285F4'][i % 4]} />))}
                <div className="text-white text-5xl font-black drop-shadow-lg animate-bounce">You did it!</div>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-green-200 z-0">
            <div className="absolute top-[10%] left-[15%] text-5xl opacity-30 animate-gentle-float">☀️</div>
            <div className="absolute top-[20%] right-[10%] text-4xl opacity-50 animate-float">☁️</div>
            <div className="absolute bottom-[25%] left-[5%] text-3xl opacity-70 animate-pulse">🦋</div>
        </div>
        
        <header className="p-4 z-20 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl text-white font-black drop-shadow-md">Save the Saplings!</h2>
            {combo > 1 && <div className="bg-sun-yellow text-text-dark font-bold px-3 py-1 rounded-full animate-bounce">x{combo} Combo!</div>}
          </div>
          <div className="w-full bg-black/20 rounded-full h-6 mt-2 border-2 border-white/50">
            <div
              className="bg-gradient-to-r from-sun-yellow to-yellow-300 h-full rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold text-text-dark"
              style={{ width: `${progress}%` }}
            >
              {savedCount} / {TOTAL_ITEMS_TO_SAVE}
            </div>
          </div>
        </header>

        <main className="flex-grow relative z-10">
          {items.map(item => {
            const isSapling = 'type' in item && ALL_SAPLING_TYPES.includes((item as Sapling).type);
            const sapling = item as Sapling;
            return (
              <div key={item.id} className={`absolute text-6xl cursor-grab active:cursor-grabbing ${isSapling && sapling.isWobbling ? 'animate-wobble' : ''} ${!isSapling ? 'animate-float' : ''}`} style={{ top: item.y, left: item.x }} onPointerDown={(e) => handlePointerDown(e, item)}>
                <span className={`drop-shadow-[0_4px_5px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-110 ${isSapling && sapling.isGolden ? 'animate-shimmer' : ''}`}>
                    {isSapling ? SAPLING_CONFIG[sapling.type].emoji : (item as PowerUp).emoji}
                </span>
                {isSapling && <span className="absolute -top-2 -right-2 text-3xl">😟</span>}
              </div>
            )
          })}
          {draggedSapling && (
             <div className="absolute text-7xl cursor-grabbing pointer-events-none" style={{ top: draggedSapling.sapling.y, left: draggedSapling.sapling.x, transform: 'scale(1.1) rotate(5deg)', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.3))' }} >
              <span className={draggedSapling.sapling.isGolden ? 'animate-shimmer' : ''}>{SAPLING_CONFIG[draggedSapling.sapling.type].emoji}</span>
              <span className="absolute -top-2 -right-2 text-3xl">😊</span>
            </div>
          )}
          {effects.map(e => <div key={e.id} className="absolute text-4xl pointer-events-none animate-burst-fade" style={{ left: e.x, top: e.y }}>{e.emoji}</div>)}
          {popupMessage && <div className="absolute text-white font-bold bg-black/40 px-3 py-1 rounded-full pointer-events-none animate-popup-fade" style={{ left: popupMessage.x, top: popupMessage.y }}>{popupMessage.text}</div>}
        </main>
        
        <footer className="h-64 bg-green-400/50 grid grid-cols-3 grid-rows-2 gap-1 p-1 border-t-8 border-green-600/50 z-20">
            {ALL_ZONES.map(type => {
                const config = zoneConfig[type];
                const feedbackClass = zoneFeedback[type] === 'success' ? 'scale-110 border-yellow-300 ring-4 ring-yellow-300/70' : zoneFeedback[type] === 'failure' ? 'scale-95 border-red-400 animate-wobble' : '';
                return (
                    <div key={type} ref={zoneRefs[type]} className={`h-full flex flex-col items-center justify-center pt-2 rounded-xl transition-all duration-200 ${config.bg} text-white shadow-inner-cute border-4 border-white/30 ${feedbackClass} relative overflow-hidden`}>
                        <div className="text-4xl z-10">{config.emoji}</div>
                        <p className="font-bold text-[10px] sm:text-xs mt-1 text-center z-10">{config.name}</p>
                        {config.decoration && (
                            <span className={config.decoration.className}>
                                {config.decoration.emoji}
                            </span>
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-end justify-center gap-0.5">
                            {savedInZone[type].slice(-5).map((s, i) => <span key={i} className="text-lg">{s.emoji}</span>)}
                        </div>
                    </div>
                );
            })}
        </footer>
      </div>
    </div>
  );
};

export default SaveTheSaplingsGame;