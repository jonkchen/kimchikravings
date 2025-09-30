import React, { useEffect, useState } from 'react';
import { AlternativeLocation, Location } from '../types';
import { formatDistance, formatDuration } from '../lib/routing';
import LeafletMapView from './LeafletMapView';

interface AlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  alternatives: AlternativeLocation[];
  currentLocation: Location;
  selectedAlternative?: AlternativeLocation;
  onSelectAlternative: (alternative: AlternativeLocation) => void;
  onConfirmSelection: (alternative: AlternativeLocation) => void;
}

const AlternativesModal: React.FC<AlternativesModalProps> = ({
  isOpen,
  onClose,
  alternatives,
  currentLocation,
  selectedAlternative,
  onSelectAlternative,
  onConfirmSelection
}) => {
  const [isLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (selectedAlternative) {
      onConfirmSelection(selectedAlternative);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm modal-overlay transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="
        relative 
        bg-white/90 dark:bg-dark-surface/90
        backdrop-blur-xl backdrop-saturate-150
        border border-gray-200/50 dark:border-dark-border/50
        rounded-3xl shadow-2xl dark:shadow-3xl 
        max-w-6xl w-full mx-4 max-h-[90vh] 
        overflow-hidden modal-content
        transition-all duration-500
        animate-liquid
      ">
        {/* Header */}
        <div className="
          flex items-center justify-between p-6 
          border-b border-gray-200/50 dark:border-dark-border/50
          backdrop-blur-sm
        ">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text transition-colors duration-300">
            Alternative Locations
          </h2>
          <button
            onClick={onClose}
            className="
              text-gray-400 dark:text-dark-text-muted 
              hover:text-gray-600 dark:hover:text-dark-text 
              transition-colors duration-300
              p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-dark-border/30
              backdrop-blur-sm
            "
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Map */}
          <div className="lg:w-3/5 h-64 lg:h-full relative z-10">
            <div className="h-full">
              <LeafletMapView
                currentLocation={currentLocation}
                selectedLocation={selectedAlternative}
                routeInfo={selectedAlternative?.routeInfo}
                className="h-full"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="
            lg:w-2/5 
            border-l border-gray-200/50 dark:border-dark-border/50 
            flex flex-col
            backdrop-blur-sm
          ">
            <div className="
              p-6 
              border-b border-gray-200/50 dark:border-dark-border/50
              backdrop-blur-sm
            ">
              <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2 transition-colors duration-300">
                Select an alternative location:
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-text-muted transition-colors duration-300">
                Choose from the available locations below. Each option shows estimated revenue impact, distance, and travel time.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-4">
                {alternatives.map((alternative) => (
                  <div
                    key={alternative.id}
                    className={`
                      p-4 rounded-2xl border-2 cursor-pointer 
                      transition-all duration-300
                      backdrop-blur-sm
                      ${selectedAlternative?.id === alternative.id
                        ? 'border-blue-500/70 dark:border-blue-400/70 bg-blue-50/80 dark:bg-blue-900/20 shadow-lg dark:shadow-xl'
                        : 'border-gray-200/50 dark:border-dark-border/50 bg-white/50 dark:bg-dark-surface/30 hover:border-gray-300/70 dark:hover:border-dark-border/70 hover:bg-gray-50/80 dark:hover:bg-dark-surface/50 hover:shadow-md dark:hover:shadow-lg'
                      }
                      hover:scale-[1.02] active:scale-[0.98]
                    `}
                    onClick={() => onSelectAlternative(alternative)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-dark-text mb-1 transition-colors duration-300">
                          {alternative.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                            {alternative.revenueImpact}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-dark-text-muted transition-colors duration-300">revenue impact</span>
                        </div>
                      </div>
                      {selectedAlternative?.id === alternative.id && (
                        <div className="
                          w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full 
                          flex items-center justify-center
                          shadow-lg backdrop-blur-sm
                          transition-all duration-300
                        ">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">Distance:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text transition-colors duration-300">
                          {alternative.routeInfo 
                            ? formatDistance(alternative.routeInfo.distance)
                            : 'Calculating...'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">ETA:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-dark-text transition-colors duration-300">
                          {alternative.routeInfo 
                            ? formatDuration(alternative.routeInfo.duration)
                            : 'Calculating...'
                          }
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="
              p-6 
              border-t border-gray-200/50 dark:border-dark-border/50 
              bg-gray-50/80 dark:bg-dark-surface/50
              backdrop-blur-sm
            ">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="
                    flex-1 px-6 py-3
                    bg-gray-100/80 dark:bg-dark-border/50
                    text-gray-700 dark:text-dark-text
                    font-medium rounded-2xl
                    shadow-lg dark:shadow-xl
                    transition-all duration-300
                    hover:shadow-xl dark:hover:shadow-2xl
                    hover:scale-[1.02] active:scale-[0.98]
                    backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50
                  "
                >
                  Cancel
                </button>
                {selectedAlternative && (
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="
                      flex-1 px-6 py-3
                      bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500
                      text-white font-medium
                      rounded-2xl
                      shadow-lg dark:shadow-xl
                      transition-all duration-300
                      hover:shadow-xl dark:hover:shadow-2xl
                      hover:scale-[1.02] active:scale-[0.98]
                      backdrop-blur-sm
                      border border-blue-500/20 dark:border-blue-400/20
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      animate-glow
                    "
                  >
                    {isLoading ? 'Processing...' : 'Confirm Selection'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativesModal;
