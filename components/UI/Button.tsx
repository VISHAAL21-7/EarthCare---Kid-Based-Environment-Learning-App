import React from 'react';
import playSound from '../../utils/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'home-yellow' | 'home-green' | 'home-blue';
  layout?: 'default' | 'icon-left' | 'icon-top';
  icon?: React.ReactNode;
  className?: string;
  disableSound?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', layout = 'default', icon, className = '', disableSound = false, onClick, ...props }) => {
  const baseClasses = 'w-full rounded-2xl font-bold text-lg transition-all duration-150 ease-in-out transform active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed shadow-cute focus:outline-none focus:ring-4 disabled:bg-slate-400 disabled:shadow-none';
  
  const variantClasses = {
    primary: 'bg-sky-blue text-white shadow-[0_4px_0_0_#356AC2] active:shadow-[0_2px_0_0_#356AC2] focus:ring-sky-blue/50',
    secondary: 'bg-eco-green text-white shadow-[0_4px_0_0_#2C8C42] active:shadow-[0_2px_0_0_#2C8C42] focus:ring-eco-green/50',
    danger: 'bg-skip-red text-white shadow-[0_4px_0_0_#C5372B] active:shadow-[0_2px_0_0_#C5372B] focus:ring-skip-red/50',
    warning: 'bg-sun-yellow text-text-dark shadow-[0_4px_0_0_#D49B04] active:shadow-[0_2px_0_0_#D49B04] focus:ring-sun-yellow/50',
    'home-yellow': 'bg-sun-yellow text-text-dark shadow-[0_6px_0_0_#D49B04] active:shadow-[0_3px_0_0_#D49B04] focus:ring-sun-yellow/50 rounded-3xl',
    'home-green': 'bg-eco-green text-white shadow-[0_6px_0_0_#2C8C42] active:shadow-[0_3px_0_0_#2C8C42] focus:ring-eco-green/50 rounded-3xl',
    'home-blue': 'bg-sky-blue text-white shadow-[0_6px_0_0_#356AC2] active:shadow-[0_3px_0_0_#356AC2] focus:ring-sky-blue/50 rounded-3xl',
    ghost: 'bg-transparent text-text-dark/80 dark:text-gray-300 shadow-none border-b-4 border-transparent active:translate-y-0 focus:ring-earth-brown/30'
  };

  const layoutClasses = {
    default: 'min-h-[56px] px-6 py-3',
    'icon-left': 'min-h-[64px] px-6 py-3 flex items-center justify-center space-x-3 text-xl',
    'icon-top': 'h-28 px-2 py-4 flex flex-col items-center justify-center space-y-2 text-base'
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disableSound && !props.disabled) {
      playSound('click');
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${layoutClasses[layout]} ${className}`} onClick={handleClick} {...props}>
      {layout === 'icon-left' && <span className="text-3xl">{icon}</span>}
      {layout === 'icon-top' && <span className="text-4xl h-10">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
