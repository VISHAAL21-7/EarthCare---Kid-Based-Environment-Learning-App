import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'home' | 'check-in' | 'repair' | 'badge' | 'default';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    home: 'bg-gradient-to-b from-card-blue-start to-card-blue-end text-white',
    'check-in': 'bg-card-green text-white',
    repair: 'bg-gradient-to-b from-sky-blue to-eco-green/80 text-white',
    badge: 'bg-gradient-to-b from-sky-blue/80 to-sun-yellow/70',
    default: 'bg-white/80'
  };
  
  return (
    <div className={`rounded-3xl shadow-cute-lg p-4 sm:p-6 text-center w-full max-w-sm border-4 border-white/50 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;