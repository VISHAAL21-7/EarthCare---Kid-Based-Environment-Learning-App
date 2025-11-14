import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Story, TapTarget, DragItem, SortDragItem, CatchAndSortItem } from '../../types';
import Button from '../UI/Button';
import Card from '../UI/Card';
import playSound from '../../utils/audio';

type FallingItem = CatchAndSortItem & { id: number; x: number; y: number; };

interface EcoStoryScreenProps {
  story: Story;
  onStoryComplete: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const EcoStoryScreen: React.FC<EcoStoryScreenProps> = ({ story, onStoryComplete, setView }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [interactionState, setInteractionState] = useState<any>({});
  const [isInteractionComplete, setIsInteractionComplete] = useState(false);
  const [incorrectTap, setIncorrectTap] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<{item: DragItem, offset: {x: number, y: number}} | null>(null);
  const [sortableItems, setSortableItems] = useState<(SortDragItem & {x: number, y: number, isReturning?: boolean})[]>([]);
  const [draggedSortable, setDraggedSortable] = useState<{item: SortDragItem, offset: {x: number, y: number}} | null>(null);
  
  // State for catch-and-sort mini-game
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [draggedFallingItem, setDraggedFallingItem] = useState<{item: FallingItem, offset: {x: number, y: number}} | null>(null);
  const [caughtCount, setCaughtCount] = useState(0);
  const [zoneFeedback, setZoneFeedback] = useState<Record<number, 'success' | 'failure' | null>>({});

  const interactionAreaRef = useRef<HTMLDivElement>(null);
  // FIX: Initialize timer refs with null for type safety and explicit state.
  const gameLoopRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);
  const nextItemId = useRef(0);
  const currentPage = story.pages[pageIndex];

  const cleanupGame = useCallback(() => {
    // FIX: Use strict null check for clearing timers to handle all IDs correctly (including 0).
    if (spawnIntervalRef.current !== null) clearInterval(spawnIntervalRef.current);
    if (gameLoopRef.current !== null) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  useEffect(() => {
    cleanupGame();
    setFeedback(null);
    setIncorrectTap(null);
    const interaction = currentPage.interaction;
    setIsInteractionComplete(!interaction);

    if (interaction?.type === 'tap-collect') {
      setInteractionState({ tapped: [] });
    }
    if (interaction?.type === 'drag-drop') {
      const draggable = interaction.data.draggable!;
      setInteractionState({ item: { ...draggable, x: draggable.startX, y: draggable.startY } });
    }
    if (interaction?.type === 'sort') {
      const items = interaction.data.sortables?.items.map(item => ({ ...item, x: item.startX, y: item.startY })) || [];
      setSortableItems(items);
    }
    if (interaction?.type === 'catch-and-sort') {
      setFallingItems([]);
      setCaughtCount(0);
      nextItemId.current = 0;
      
      const gameData = interaction.data.catchAndSort!;
      
      const spawnItem = () => {
        if (!interactionAreaRef.current) return;
        const itemsToSpawn = gameData.itemsToSpawn;
        const newItemProto = itemsToSpawn[Math.floor(Math.random() * itemsToSpawn.length)];
        const newItem: FallingItem = {
          ...newItemProto,
          id: nextItemId.current++,
          x: Math.random() * 85, // % position
          y: -10, // start off-screen
        };
        setFallingItems(prev => [...prev, newItem]);
      };
      
      spawnIntervalRef.current = window.setInterval(spawnItem, 2000);

      const runGameLoop = () => {
        if (!interactionAreaRef.current) {
          gameLoopRef.current = requestAnimationFrame(runGameLoop);
          return;
        }
        const areaHeight = interactionAreaRef.current.offsetHeight;
        setFallingItems(prev => prev.map(item => ({ ...item, y: item.y + (areaHeight > 0 ? (100 / areaHeight) * 0.8 : 0) })).filter(item => item.y < 110));
        gameLoopRef.current = requestAnimationFrame(runGameLoop);
      };
      gameLoopRef.current = requestAnimationFrame(runGameLoop);
    }

    return cleanupGame;
  }, [pageIndex, story, cleanupGame]);
  
  const handleNext = () => {
    if (pageIndex < story.pages.length - 1) {
        playSound('pageTurn');
        setPageIndex(pageIndex + 1);
    } else {
        playSound('win');
        setShowConfetti(true);
        setTimeout(() => {
            onStoryComplete();
        }, 1500)
    }
  }
  
  const handleChoice = (response: string) => {
    setFeedback(response);
    setTimeout(() => {
      setFeedback(null);
      handleNext();
    }, 2500); 
  };

  const handleTapTarget = (target: TapTarget) => {
    const isFindOneGame = currentPage.interaction?.data.targets?.some(t => t.isCorrect);

    if (isFindOneGame) {
        if (target.isCorrect) {
            playSound('success');
            setInteractionState({ tapped: currentPage.interaction?.data.targets?.map(t => t.id) || [] });
            setTimeout(() => setIsInteractionComplete(true), 500);
        } else {
            playSound('error');
            setIncorrectTap(target.id);
            setTimeout(() => setIncorrectTap(null), 800);
        }
    } else {
        if (interactionState.tapped?.includes(target.id)) return;
        playSound('success', 0.3);
        const newTapped = [...interactionState.tapped, target.id];
        setInteractionState({ tapped: newTapped });
        const totalTargets = currentPage.interaction?.data.targets?.length || 0;
        if (newTapped.length >= totalTargets) {
            setTimeout(() => setIsInteractionComplete(true), 500);
        }
    }
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionAreaRef.current) return;
    const parentRect = interactionAreaRef.current.getBoundingClientRect();
    
    if (draggedItem) {
        const x = ((e.clientX - parentRect.left - draggedItem.offset.x) / parentRect.width) * 100;
        const y = ((e.clientY - parentRect.top - draggedItem.offset.y) / parentRect.height) * 100;
        setInteractionState({ item: { ...interactionState.item, x, y } });
    }
    if (draggedSortable) {
        const x = ((e.clientX - parentRect.left - draggedSortable.offset.x) / parentRect.width) * 100;
        const y = ((e.clientY - parentRect.top - draggedSortable.offset.y) / parentRect.height) * 100;
        setSortableItems(prev => prev.map(it => it.id === draggedSortable.item.id ? {...it, x, y} : it));
    }
    if (draggedFallingItem) {
      const x = ((e.clientX - parentRect.left - draggedFallingItem.offset.x) / parentRect.width) * 100;
      const y = ((e.clientY - parentRect.top - draggedFallingItem.offset.y) / parentRect.height) * 100;
      setDraggedFallingItem(prev => prev ? {...prev, item: {...prev.item, x, y}} : null);
    }
  };
  
  const handlePointerUp = () => {
    if (draggedItem && currentPage.interaction?.data.dropZone) {
      const { item } = interactionState;
      const { dropZone } = currentPage.interaction.data;
      const itemCenterX = item.x + 5;
      const itemCenterY = item.y + 5;
      if (itemCenterX > dropZone.x && itemCenterX < dropZone.x + dropZone.width && itemCenterY > dropZone.y && itemCenterY < dropZone.y + dropZone.height) {
        playSound('success');
        setIsInteractionComplete(true);
        setInteractionState({});
      }
      setDraggedItem(null);
    }
    
    if (draggedSortable) {
      const dragged = sortableItems.find(i => i.id === draggedSortable.item.id);
      if (!dragged) return;
      const zones = currentPage.interaction?.data.sortables?.zones || [];
      let droppedCorrectly = false;
      let wasDropAttempted = false;

      for (const zone of zones) {
        const itemCenterX = dragged.x + 5;
        const itemCenterY = dragged.y + 5;
        if (itemCenterX > zone.x && itemCenterX < zone.x + zone.width && itemCenterY > zone.y && itemCenterY < zone.y + zone.height) {
          wasDropAttempted = true;
          if (dragged.correctZoneId === zone.id) {
            playSound('success');
            droppedCorrectly = true;
            const newItems = sortableItems.filter(i => i.id !== dragged.id);
            setSortableItems(newItems);
            if (newItems.length === 0) {
              setTimeout(() => setIsInteractionComplete(true), 300);
            }
          }
          break;
        }
      }
      if (!droppedCorrectly) {
        if (wasDropAttempted) playSound('error');
        setSortableItems(prev => prev.map(it => it.id === dragged.id ? { ...it, x: it.startX, y: it.startY, isReturning: true } : it));
        setTimeout(() => setSortableItems(prev => prev.map(it => it.id === dragged.id ? {...it, isReturning: false} : it)), 500);
      }
      setDraggedSortable(null);
    }
    
    if (draggedFallingItem) {
      const zones = currentPage.interaction?.data.catchAndSort?.zones || [];
      let droppedCorrectly = false;
      for (const zone of zones) {
        const itemCenterX = draggedFallingItem.item.x + 5;
        const itemCenterY = draggedFallingItem.item.y + 5;
        if (itemCenterX > zone.x && itemCenterX < zone.x + zone.width && itemCenterY > zone.y && itemCenterY < zone.y + zone.height) {
            if (draggedFallingItem.item.correctZoneId === zone.id) {
                playSound('success');
                droppedCorrectly = true;
                const newCaughtCount = caughtCount + 1;
                setCaughtCount(newCaughtCount);
                setZoneFeedback(prev => ({...prev, [zone.id]: 'success'}));
                setTimeout(() => setZoneFeedback(prev => ({...prev, [zone.id]: null})), 300);
                
                const total = currentPage.interaction?.data.catchAndSort?.totalToCatch || 0;
                if (newCaughtCount >= total) {
                  cleanupGame();
                  setIsInteractionComplete(true);
                }
            } else {
                playSound('error');
                setZoneFeedback(prev => ({...prev, [zone.id]: 'failure'}));
                setTimeout(() => setZoneFeedback(prev => ({...prev, [zone.id]: null})), 300);
            }
            break;
        }
      }
      setDraggedFallingItem(null);
    }
  };

  const handleFallingItemPointerDown = (e: React.PointerEvent<HTMLDivElement>, item: FallingItem) => {
    playSound('pickup');
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = interactionAreaRef.current!.getBoundingClientRect();
    setFallingItems(prev => prev.filter(i => i.id !== item.id));
    setDraggedFallingItem({ item, offset: { x: e.clientX - rect.left, y: e.clientY - rect.top } });
  };
  
  const handleSortablePointerDown = (e: React.PointerEvent<HTMLDivElement>, item: SortDragItem) => {
    playSound('pickup');
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedSortable({ item, offset: { x: e.clientX - rect.left, y: e.clientY - rect.top } });
  };
  
  const progress = ((pageIndex + 1) / story.pages.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-sun-yellow/30 to-sky-blue/30">
        {showConfetti && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-2xl animate-burst-fade" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }}>
                ⭐
            </div>
        ))}
      <Card variant="default" className="w-full max-w-md h-[90vh] max-h-[700px] flex flex-col justify-between">
        <header className="text-center">
          <h2 className="text-2xl font-black text-eco-green-dark">{story.title}</h2>
           <div className="w-full bg-black/10 rounded-full h-2.5 mt-2">
            <div className="bg-eco-green h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </header>
        
        <main 
            ref={interactionAreaRef}
            className="flex-grow flex flex-col items-center justify-center text-center my-4 relative overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div className={`text-8xl mb-4 transition-transform duration-500 ${!isInteractionComplete && currentPage.interaction ? 'scale-75 -translate-y-4' : 'animate-gentle-float'}`}>{currentPage.image}</div>
            <p className="text-lg leading-relaxed text-text-dark/90 h-24 px-2">
                {feedback || currentPage.interaction?.prompt || currentPage.text}
            </p>
            {/* --- INTERACTION LAYER --- */}
            {currentPage.interaction?.type === 'tap-collect' && currentPage.interaction.data.targets?.map(target =>
                !interactionState.tapped?.includes(target.id) && (
                    <div key={target.id} className={`absolute text-5xl cursor-pointer transition-transform hover:scale-125 ${incorrectTap === target.id ? 'animate-wobble' : ''}`} style={{ left: `${target.x}%`, top: `${target.y}%` }} onClick={() => handleTapTarget(target)}>
                        {target.emoji}
                    </div>
                )
            )}
             {currentPage.interaction?.type === 'drag-drop' && interactionState.item && (
                 <>
                    <div
                        onPointerDown={(e) => {
                           playSound('pickup');
                           setDraggedItem({item: interactionState.item, offset: {x:e.nativeEvent.offsetX, y:e.nativeEvent.offsetY}});
                        }}
                        className="absolute text-6xl cursor-grab active:cursor-grabbing"
                        style={{ left: `${interactionState.item.x}%`, top: `${interactionState.item.y}%`, transform: draggedItem ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.1s' }}
                    >
                        {interactionState.item.emoji}
                    </div>
                    <div className="absolute text-7xl opacity-80" style={{ left: `${currentPage.interaction.data.dropZone?.x}%`, top: `${currentPage.interaction.data.dropZone?.y}%`}}>
                        {currentPage.interaction.data.dropZone?.emoji}
                    </div>
                 </>
             )}
             {currentPage.interaction?.type === 'sort' && (
                <>
                  {currentPage.interaction.data.sortables?.zones.map(zone => (
                    <div key={zone.id} className="absolute flex flex-col items-center justify-center text-5xl bg-black/10 rounded-2xl border-2 border-dashed border-black/20 p-2" style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}>
                      {zone.emoji}
                      <p className="text-xs font-bold mt-1">{zone.name}</p>
                    </div>
                  ))}
                  {sortableItems.map(item => (
                    <div key={item.id}
                      onPointerDown={(e) => handleSortablePointerDown(e, item)}
                      className={`absolute text-5xl cursor-grab active:cursor-grabbing ${item.isReturning ? 'transition-all duration-500' : ''}`}
                      style={{ left: `${item.x}%`, top: `${item.y}%`, transform: draggedSortable?.item.id === item.id ? 'scale(1.2)' : 'scale(1)' }}
                    >
                      {item.emoji}
                    </div>
                  ))}
                </>
             )}
              {currentPage.interaction?.type === 'catch-and-sort' && (
                <>
                  <div className='absolute top-0 right-2 text-lg font-bold bg-white/50 px-3 py-1 rounded-full'>
                    Caught: {caughtCount} / {currentPage.interaction.data.catchAndSort?.totalToCatch}
                  </div>
                  {currentPage.interaction.data.catchAndSort?.zones.map(zone => {
                    const feedbackClass = zoneFeedback[zone.id] === 'success' ? 'animate-bounce border-yellow-300 ring-4 ring-yellow-300/70' : zoneFeedback[zone.id] === 'failure' ? 'animate-wobble border-red-500' : 'border-black/20';
                    return (
                        <div key={zone.id} className={`absolute flex flex-col items-center justify-center text-5xl bg-black/10 rounded-2xl border-2 border-dashed transition-all duration-200 ${feedbackClass}`} style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}>
                            <div>{zone.emoji}</div>
                            <div className='text-xs font-bold mt-1'>{zone.name}</div>
                        </div>
                    );
                  })}
                  {fallingItems.map(item => (
                    <div key={item.id}
                      onPointerDown={(e) => handleFallingItemPointerDown(e, item)}
                      className="absolute text-5xl cursor-grab active:cursor-grabbing"
                      style={{ left: `${item.x}%`, top: `${item.y}%`}}
                    >
                      {item.emoji}
                    </div>
                  ))}
                  {draggedFallingItem && (
                     <div className="absolute text-6xl cursor-grabbing pointer-events-none" style={{ top: `${draggedFallingItem.item.y}%`, left: `${draggedFallingItem.item.x}%`, transform: 'scale(1.2) rotate(5deg)', filter: 'drop-shadow(0 5px 4px rgba(0,0,0,0.3))' }} >
                        {draggedFallingItem.item.emoji}
                    </div>
                  )}
                </>
              )}
        </main>
        
        <footer>
            {currentPage.choice && !feedback ? (
                 <div className="space-y-3">
                    <p className="font-bold text-lg">{currentPage.choice.prompt}</p>
                    {currentPage.choice.options.map((opt, i) => (
                        <Button key={i} variant='primary' onClick={() => handleChoice(opt.response)}>
                            {opt.text}
                        </Button>
                    ))}
                 </div>
            ) : (
                <Button variant='secondary' onClick={handleNext} disabled={!isInteractionComplete && !feedback} className="w-full">
                    {pageIndex < story.pages.length - 1 ? 'Next →' : 'Finish Story!'}
                </Button>
            )}
             <button onClick={() => setView('kid-home')} className="mt-4 text-text-dark/60 hover:underline w-full">
                ← Back to Home
            </button>
        </footer>
      </Card>
    </div>
  );
};

export default EcoStoryScreen;
