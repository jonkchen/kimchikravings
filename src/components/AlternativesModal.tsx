import React, { useEffect, useState, useRef } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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
      // Reset mobile mode when modal opens
      setIsMobileMode(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  // Update selected alternative when currentIndex changes (mobile only)
  useEffect(() => {
    // Only auto-select when in mobile mode and user is swiping
    if (alternatives[currentIndex] && isMobileMode) {
      onSelectAlternative(alternatives[currentIndex]);
    }
  }, [currentIndex, alternatives, onSelectAlternative, isMobileMode]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setIsMobileMode(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentIndex < alternatives.length - 1) {
        // Swipe left - next option
        setCurrentIndex(currentIndex + 1);
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe right - previous option
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    setIsDragging(false);
  };

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
        <div className="relative h-[calc(90vh-120px)]">
          {/* Map - Full background on mobile, side-by-side on desktop */}
          <div className="absolute inset-0 lg:relative lg:w-3/5 lg:h-full z-10">
            <LeafletMapView
              currentLocation={currentLocation}
              selectedLocation={selectedAlternative}
              routeInfo={selectedAlternative?.routeInfo}
              className="h-full w-full"
            />
          </div>

          {/* Mobile Overlay - Swipeable options */}
          <div className="
            lg:hidden
            absolute bottom-0 left-0 right-0
            bg-white/95 dark:bg-dark-surface/95
            backdrop-blur-xl backdrop-saturate-150
            border-t border-gray-200/50 dark:border-dark-border/50
            rounded-t-3xl
            shadow-2xl dark:shadow-3xl
            transition-all duration-500
            animate-liquid
            z-20
            h-80
          ">
            {/* Swipeable Content */}
            <div 
              ref={overlayRef}
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex gap-2">
                    {alternatives.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-blue-500 dark:bg-blue-400' 
                            : 'bg-gray-300 dark:bg-dark-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted transition-colors duration-300">
                    Swipe left or right to browse options
                  </p>
                  {/* Navigation buttons for desktop users */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentIndex > 0) {
                          setCurrentIndex(currentIndex - 1);
                          setIsMobileMode(true);
                        }
                      }}
                      disabled={currentIndex === 0}
                      className="
                        p-2 rounded-full
                        bg-gray-100 dark:bg-dark-border
                        text-gray-600 dark:text-dark-text-muted
                        hover:bg-gray-200 dark:hover:bg-dark-border/70
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                        shadow-sm hover:shadow-md
                      "
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (currentIndex < alternatives.length - 1) {
                          setCurrentIndex(currentIndex + 1);
                          setIsMobileMode(true);
                        }
                      }}
                      disabled={currentIndex === alternatives.length - 1}
                      className="
                        p-2 rounded-full
                        bg-gray-100 dark:bg-dark-border
                        text-gray-600 dark:text-dark-text-muted
                        hover:bg-gray-200 dark:hover:bg-dark-border/70
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                        shadow-sm hover:shadow-md
                      "
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Option Card */}
              <div className="px-6 pb-6">
                {alternatives[currentIndex] && (
                  <div className="
                    p-6 rounded-3xl border-2
                    border-blue-500/70 dark:border-blue-400/70 
                    bg-blue-50/80 dark:bg-blue-900/20 
                    shadow-xl dark:shadow-2xl
                    backdrop-blur-sm
                    transition-all duration-300
                    animate-glow
                  ">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2 transition-colors duration-300">
                          {alternatives[currentIndex].name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-dark-text-muted transition-colors duration-300">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {alternatives[currentIndex].routeInfo ? formatDistance(alternatives[currentIndex].routeInfo!.distance) : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {alternatives[currentIndex].routeInfo ? formatDuration(alternatives[currentIndex].routeInfo!.duration) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                          {alternatives[currentIndex].revenueImpact}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-text-muted transition-colors duration-300">
                          daily revenue
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                          Available Now
                        </span>
                      </div>
                      <button
                        className="
                          px-6 py-3 bg-blue-500 hover:bg-blue-600 
                          dark:bg-blue-600 dark:hover:bg-blue-700
                          text-white font-semibold rounded-2xl
                          shadow-lg hover:shadow-xl
                          transition-all duration-300
                          transform hover:scale-105
                          active:scale-95
                        "
                        onClick={handleConfirm}
                      >
                        Confirm Location
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="
            hidden lg:flex lg:flex-col
            absolute top-0 right-0 w-2/5 h-full
            bg-white/95 dark:bg-dark-surface/95
            backdrop-blur-xl backdrop-saturate-150
            border-l border-gray-200/50 dark:border-dark-border/50
            shadow-2xl dark:shadow-3xl
            transition-all duration-500
            animate-liquid
            z-20
          ">
            <div className="p-6 border-b border-gray-200/50 dark:border-dark-border/50 backdrop-blur-sm">
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
