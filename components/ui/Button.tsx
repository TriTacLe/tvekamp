'use client';

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'web' | 'devops' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
  web: 'web-gradient hover:opacity-90',
  devops: 'devops-gradient hover:opacity-90',
  ghost: 'bg-white/10 hover:bg-white/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-xl font-body font-semibold text-white
        transition-all duration-200 shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
