import React from 'react';
import { View } from '../../types';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface BadgeAwardedScreenProps {
  badgeCount: number;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const ConfettiPiece: React.FC<{ initialX: number, delay: number, color: string }> = ({ initialX, delay, color }) => {
  return (
    <div 
      className="absolute w-3 h-5 rounded-sm"
      style={{
        left: `${initialX}%`,
        animation: `confetti-fall 3s linear ${delay}s infinite`,
        backgroundColor: color,
        top: '-20px',
      }}
    ></div>
  );
};

const BadgeAwardedScreen: React.FC<BadgeAwardedScreenProps> = ({ badgeCount, setView }) => {
  const confettiColors = ['#FBBC05', '#EA4335', '#34A853', '#4285F4'];
  const confettiPieces = Array.from({ length: 20 }).map((_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 3,
    color: confettiColors[i % confettiColors.length],
  }));

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {confettiPieces.map((p, i) => (
        <ConfettiPiece key={i} initialX={p.x} delay={p.delay} color={p.color} />
      ))}
      <Card variant="default" className="relative z-10">
        <div className="text-9xl animate-bounce">🏆</div>
        <h1 className="text-4xl font-black my-2 text-sun-yellow-dark drop-shadow-md">Badge Awarded!</h1>
        <p className="text-xl font-bold text-text-dark mb-6">
          You are an Eco Hero! This is your badge #{badgeCount}.
        </p>
        <p className="mb-6">Keep up the amazing work protecting our planet!</p>
        <Button variant="warning" onClick={() => setView('kid-home')}>
          Awesome!
        </Button>
      </Card>
    </div>
  );
};

export default BadgeAwardedScreen;
