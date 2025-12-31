import React from 'react';
import { clsx } from 'clsx';
import { ThemeColor } from '../../types';

interface BCardProps {
  children: React.ReactNode;
  color?: ThemeColor;
  className?: string;
  onClick?: () => void;
}

export const BCard: React.FC<BCardProps> = ({ children, color = 'white', className, onClick }) => {
  const bgColors = {
    lime: 'bg-lime-400',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    white: 'bg-white',
    black: 'bg-black'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 transition-all",
        bgColors[color],
        onClick && "cursor-pointer active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
        className
      )}
    >
      {children}
    </div>
  );
};

interface BButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'dark' | 'orange';
}

export const BButton: React.FC<BButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-lime-400 text-black',
    secondary: 'bg-cyan-400 text-black',
    danger: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    dark: 'bg-black text-white',
    orange: 'bg-orange-500 text-white'
  };

  return (
    <button
      className={clsx(
        "border-4 border-black font-black uppercase tracking-wider py-3 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const BInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={clsx(
        "border-4 border-black p-2 font-bold focus:outline-none focus:ring-4 focus:ring-cyan-400 w-full rounded-md",
        props.className
      )}
    />
  )
}