import React from 'react';
import { Location } from '../types';

interface BlockedCardProps {
  blockedLocation: Location;
  selectedAlternative?: Location;
  onShowAlternatives: () => void;
}

const BlockedCard: React.FC<BlockedCardProps> = ({
  blockedLocation,
  selectedAlternative,
  onShowAlternatives
}) => {
  return (
    <div className="
      bg-white/80 dark:bg-dark-surface/80
      backdrop-blur-xl backdrop-saturate-150
      border border-gray-200/50 dark:border-dark-border/50
      rounded-3xl p-6 mb-6
      shadow-xl dark:shadow-2xl
      transition-all duration-500
      hover:shadow-2xl dark:hover:shadow-3xl
      animate-liquid
    ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="
            w-8 h-8 bg-red-100/80 dark:bg-red-900/30 
            rounded-xl flex items-center justify-center 
            backdrop-blur-sm border border-red-200/50 dark:border-red-700/50
            transition-all duration-300
          ">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text transition-colors duration-300">
              Drive to {blockedLocation.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-muted transition-colors duration-300">Location currently blocked</p>
          </div>
        </div>
        <span className="
          px-3 py-1 rounded-full text-xs font-medium
          bg-red-100/80 dark:bg-red-900/30 
          text-red-800 dark:text-red-300
          border border-red-200/50 dark:border-red-700/50
          backdrop-blur-sm
          transition-all duration-300
        ">
          Blocked
        </span>
      </div>
      
      {selectedAlternative ? (
        <div className="
          bg-blue-50/80 dark:bg-blue-900/20
          backdrop-blur-sm backdrop-saturate-150
          border border-blue-200/50 dark:border-blue-700/50
          rounded-2xl p-4 mb-4
          transition-all duration-300
          hover:shadow-lg dark:hover:shadow-xl
          animate-float
        ">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 transition-colors duration-300">Selected Alternative</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">Location:</span>
              <span className="ml-2 font-medium text-blue-900 dark:text-blue-300 transition-colors duration-300">{selectedAlternative.name}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">Revenue Impact:</span>
              <span className="ml-2 font-medium text-green-600 dark:text-green-400 transition-colors duration-300">{selectedAlternative.revenueImpact}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">Status:</span>
              <span className="
                ml-2 px-2 py-1 rounded-full text-xs font-medium
                bg-green-100/80 dark:bg-green-900/30 
                text-green-800 dark:text-green-300
                border border-green-200/50 dark:border-green-700/50
                backdrop-blur-sm
                transition-all duration-300
              ">
                Active
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="
          bg-red-50/80 dark:bg-red-900/20
          backdrop-blur-sm backdrop-saturate-150
          border border-red-200/50 dark:border-red-700/50
          rounded-2xl p-4 mb-4
          transition-all duration-300
          hover:shadow-lg dark:hover:shadow-xl
        ">
          <p className="text-red-800 dark:text-red-300 text-sm transition-colors duration-300">
            This location is currently blocked due to construction. Please select an alternative location to continue operations.
          </p>
        </div>
      )}
      
      <button
        onClick={onShowAlternatives}
        className="
          w-full px-6 py-3
          bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500
          text-white font-medium
          rounded-2xl
          shadow-lg dark:shadow-xl
          transition-all duration-300
          hover:shadow-xl dark:hover:shadow-2xl
          hover:scale-[1.02]
          active:scale-[0.98]
          backdrop-blur-sm
          border border-blue-500/20 dark:border-blue-400/20
          animate-glow
        "
        aria-label="View alternative locations"
      >
        {selectedAlternative ? 'Change Location' : 'See Alternatives'}
      </button>
    </div>
  );
};

export default BlockedCard;
