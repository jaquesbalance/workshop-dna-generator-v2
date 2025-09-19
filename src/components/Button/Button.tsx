import React from 'react';
import './Button.css';

interface ButtonProps {
  variant?: 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses = [
    'md-button',
    `md-button--${variant}`,
    `md-button--${size}`,
    `md-button--${color}`,
    disabled && 'md-button--disabled',
    loading && 'md-button--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
    >
      {loading && <span className="md-button__loading-spinner" />}
      {startIcon && <span className="md-button__icon md-button__icon--start">{startIcon}</span>}
      <span className="md-button__label">{children}</span>
      {endIcon && <span className="md-button__icon md-button__icon--end">{endIcon}</span>}
    </button>
  );
}