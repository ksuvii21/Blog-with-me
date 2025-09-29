import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'currentColor',
  variant = 'default',
  speed = 1,
  withText = false,
  text = 'Loading...',
  textPosition = 'bottom',
  interactive = false,
  onComplete,
  duration,
  progress,
  showProgress = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Size classes mapping
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // Text size mapping
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  // Variant styles
  const variants = {
    default: {
      outer: 'opacity-25',
      inner: 'opacity-75'
    },
    primary: {
      outer: 'opacity-20 text-blue-500',
      inner: 'opacity-90 text-blue-600'
    },
    secondary: {
      outer: 'opacity-20 text-gray-500',
      inner: 'opacity-90 text-gray-600'
    },
    success: {
      outer: 'opacity-20 text-green-500',
      inner: 'opacity-90 text-green-600'
    },
    warning: {
      outer: 'opacity-20 text-yellow-500',
      inner: 'opacity-90 text-yellow-600'
    },
    error: {
      outer: 'opacity-20 text-red-500',
      inner: 'opacity-90 text-red-600'
    },
    gradient: {
      outer: 'opacity-20',
      inner: 'opacity-90'
    }
  };

  // Animation speed mapping
  const speedClasses = {
    0.5: 'animate-spin-slow',
    1: 'animate-spin',
    1.5: 'animate-spin-medium',
    2: 'animate-spin-fast',
    3: 'animate-spin-very-fast'
  };

  // Handle progress animation
  useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress);
    } else if (duration && onComplete) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              onComplete();
            }, 300);
            return 100;
          }
          return prev + (100 / (duration / 100));
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [progress, duration, onComplete]);

  // Handle gradient variant
  const getGradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  if (!isVisible && duration) return null;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${sizeClasses[size]}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-1/3 h-full rounded-full bg-${color} animate-bounce`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.6 / speed}s`,
                  transform: isHovered && interactive ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`rounded-full ${sizeClasses[size]} bg-${color} animate-pulse`}
            style={{
              animationDuration: `${1 / speed}s`,
              transform: isHovered && interactive ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        );

      case 'progress':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (currentProgress * 251.2) / 100}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            {showProgress && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${textSizeClasses[size]} font-semibold`}>
                  {Math.round(currentProgress)}%
                </span>
              </div>
            )}
          </div>
        );

      case 'gradient':
        return (
          <>
            <svg
              className={`${speedClasses[speed]} ${sizeClasses[size]}`}
              style={{ 
                color,
                animationDuration: `${1 / speed}s`,
                transform: isHovered && interactive ? 'scale(1.1)' : 'scale(1)'
              }}
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle
                className={variants[variant].outer}
                cx="12"
                cy="12"
                r="10"
                stroke={`url(#${getGradientId})`}
                strokeWidth="4"
                fill="none"
              />
              <path
                className={variants[variant].inner}
                fill={`url(#${getGradientId})`}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </>
        );

      default:
        return (
          <svg
            className={`${speedClasses[speed]} ${sizeClasses[size]}`}
            style={{ 
              color,
              animationDuration: `${1 / speed}s`,
              transform: isHovered && interactive ? 'scale(1.1)' : 'scale(1)'
            }}
            viewBox="0 0 24 24"
          >
            <circle
              className={variants[variant].outer}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className={variants[variant].inner}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const containerClasses = `
    inline-flex
    ${textPosition === 'right' || textPosition === 'left' ? 'flex-row items-center' : 'flex-col items-center'}
    gap-2
    transition-all duration-200
    ${interactive ? 'cursor-pointer hover:opacity-80' : ''}
  `;

  const textClasses = `
    ${textSizeClasses[size]}
    font-medium
    text-${color}
    transition-all duration-200
    ${isHovered && interactive ? 'scale-105' : ''}
  `;

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{ 
        opacity: isHovered && interactive ? 0.8 : 1 
      }}
    >
      {(textPosition === 'top' || textPosition === 'left') && withText && (
        <span className={textClasses}>{text}</span>
      )}
      
      {renderSpinner()}
      
      {(textPosition === 'bottom' || textPosition === 'right') && withText && (
        <span className={textClasses}>{text}</span>
      )}
    </div>
  );
};

// Enhanced with multiple spinner types
LoadingSpinner.Dots = (props) => <LoadingSpinner variant="dots" {...props} />;
LoadingSpinner.Pulse = (props) => <LoadingSpinner variant="pulse" {...props} />;
LoadingSpinner.Progress = (props) => <LoadingSpinner variant="progress" {...props} />;
LoadingSpinner.Gradient = (props) => <LoadingSpinner variant="gradient" {...props} />;

export default LoadingSpinner;