import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
        }
        shadow-lg hover:shadow-xl transform hover:scale-105
        backdrop-blur-sm border border-glass-border
        ${isDarkMode ? 'animate-glow' : ''}
      `}
      aria-label="Toggle dark mode"
    >
      {/* Toggle knob */}
      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg
          transition-all duration-300 ease-in-out transform
          ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}
          flex items-center justify-center
        `}
      >
        {/* Icon */}
        <div className="text-xs">
          {isDarkMode ? (
            // Moon icon
            <svg
              className="w-3 h-3 text-gray-800"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            // Sun icon
            <svg
              className="w-3 h-3 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      
      {/* Background glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full opacity-0 transition-opacity duration-300
          ${isDarkMode ? 'opacity-20' : 'opacity-10'}
          ${isDarkMode 
            ? 'bg-gradient-to-r from-purple-400 to-blue-400' 
            : 'bg-gradient-to-r from-yellow-300 to-orange-400'
          }
          blur-sm
        `}
      />
    </button>
  );
};

export default DarkModeToggle;
