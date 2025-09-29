import React, { useEffect, useState } from 'react';
import { AlternativeLocation, RouteInfo } from '../types';
import { formatDistance, formatDuration } from '../lib/routing';
import LeafletMapView from './LeafletMapView';

interface AlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  alternatives: AlternativeLocation[];
  currentLocation: { coords: [number, number] };
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
  const [isLoading, setIsLoading] = useState(false);

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
        className="fixed inset-0 bg-black bg-opacity-50 modal-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Alternative Locations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
          <div className="lg:w-2/5 border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Select an alternative location:</h3>
              <p className="text-sm text-gray-600">
                Choose from the available locations below. Each option shows estimated revenue impact, distance, and travel time.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-4">
                {alternatives.map((alternative) => (
                  <div
                    key={alternative.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAlternative?.id === alternative.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectAlternative(alternative)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {alternative.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-green-600">
                            {alternative.revenueImpact}
                          </span>
                          <span className="text-xs text-gray-500">revenue impact</span>
                        </div>
                      </div>
                      {selectedAlternative?.id === alternative.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="ml-2 font-medium">
                          {alternative.routeInfo 
                            ? formatDistance(alternative.routeInfo.distance)
                            : 'Calculating...'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">ETA:</span>
                        <span className="ml-2 font-medium">
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
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                {selectedAlternative && (
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="btn-primary flex-1"
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
