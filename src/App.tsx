import React, { useState, useEffect } from 'react';
import { AlternativeLocation, RouteInfo } from './types';
import { mockDashboardData } from './data/mockData';
import { precomputeRoutes } from './lib/routing';
import BlockedCard from './components/BlockedCard';
import AlternativesModal from './components/AlternativesModal';
import LeafletMapView from './components/LeafletMapView';
import ConfirmationAnimation from './components/ConfirmationAnimation';
import DarkModeToggle from './components/DarkModeToggle';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App: React.FC = () => {
  const [dashboardData] = useState(mockDashboardData);
  const [alternatives, setAlternatives] = useState<AlternativeLocation[]>([]);
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeLocation | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize alternatives with route data
  useEffect(() => {
    const initializeAlternatives = async () => {
      setIsLoadingRoutes(true);
      
      const alternativesWithRoutes = [...dashboardData.alternativeLocations];
      const coordsList = alternativesWithRoutes.map(alt => alt.coords);
      
      try {
        const routes = await precomputeRoutes(dashboardData.currentLocation.coords, coordsList);
        
        // Update alternatives with route information
        const updatedAlternatives = alternativesWithRoutes.map((alt, index) => ({
          ...alt,
          routeInfo: routes[index] || undefined
        }));
        
        setAlternatives(updatedAlternatives);
      } catch (error) {
        console.error('Error loading routes:', error);
        // Fallback to alternatives without route data
        setAlternatives(alternativesWithRoutes);
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    initializeAlternatives();
  }, [dashboardData]);

  const handleShowAlternatives = () => {
    setIsModalOpen(true);
  };

  const handleSelectAlternative = (alternative: AlternativeLocation) => {
    setSelectedAlternative(alternative);
  };

  const handleConfirmSelection = (alternative: AlternativeLocation) => {
    setSelectedAlternative(alternative);
    setIsModalOpen(false);
    setShowConfirmation(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlternative(undefined);
  };

  const handleConfirmationComplete = () => {
    setShowConfirmation(false);
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-all duration-500">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg transition-all duration-1000" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] transition-all duration-1000" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2 transition-colors duration-300">
                Location Finder
              </h1>
              <p className="text-gray-600 dark:text-dark-text-muted transition-colors duration-300">
                Manage blocked locations and select alternative routes for your food truck operations.
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-dark-text-muted transition-colors duration-300">
                Dark Mode
              </span>
              <DarkModeToggle />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Blocked Card */}
            <div className="lg:col-span-1">
              <BlockedCard
                blockedLocation={dashboardData.blockedLocation}
                selectedAlternative={selectedAlternative}
                onShowAlternatives={handleShowAlternatives}
              />
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              <div className="
                bg-white/80 dark:bg-dark-surface/80 
                backdrop-blur-xl backdrop-saturate-150
                border border-gray-200/50 dark:border-dark-border/50
                rounded-3xl p-6 h-96 lg:h-[600px]
                shadow-xl dark:shadow-2xl
                transition-all duration-500
                hover:shadow-2xl dark:hover:shadow-3xl
                animate-liquid
                flex flex-col
              ">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 transition-colors duration-300">
                  Location Overview
                </h3>
                <div className="flex-1 min-h-0">
                  <LeafletMapView
                    currentLocation={dashboardData.currentLocation}
                    selectedLocation={selectedAlternative}
                    routeInfo={selectedAlternative?.routeInfo}
                    className="h-full rounded-2xl overflow-hidden"
                  />
                </div>
                
                {/* Extended content area below map */}
                <div className="mt-4 pt-4 border-t border-gray-200/30 dark:border-dark-border/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100/80 dark:bg-blue-900/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-dark-text-muted block text-xs">Current Location</span>
                        <span className="font-medium text-gray-900 dark:text-dark-text text-sm">{dashboardData.currentLocation.name}</span>
                      </div>
                    </div>
                    
                    {selectedAlternative && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100/80 dark:bg-green-900/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-text-muted block text-xs">Selected Location</span>
                          <span className="font-medium text-gray-900 dark:text-dark-text text-sm">{selectedAlternative.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          {selectedAlternative && (
            <div className="mt-8">
              <div className="
                bg-green-50/80 dark:bg-emerald-900/20
                backdrop-blur-xl backdrop-saturate-150
                border border-green-200/50 dark:border-emerald-700/50
                rounded-3xl p-6
                shadow-xl dark:shadow-2xl
                transition-all duration-500
                animate-float
              ">
                <h3 className="text-lg font-semibold text-green-900 dark:text-emerald-400 mb-4 transition-colors duration-300">
                  Selected Location Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-dark-text-muted block transition-colors duration-300">Location</span>
                    <span className="font-medium text-green-900 dark:text-emerald-400 transition-colors duration-300">{selectedAlternative.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-dark-text-muted block transition-colors duration-300">Revenue Impact</span>
                    <span className="font-medium text-green-600 dark:text-emerald-300 transition-colors duration-300">{selectedAlternative.revenueImpact}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-dark-text-muted block transition-colors duration-300">Distance</span>
                    <span className="font-medium text-green-900 dark:text-emerald-400 transition-colors duration-300">
                      {selectedAlternative.routeInfo 
                        ? `${(selectedAlternative.routeInfo.distance * 0.000621371).toFixed(1)} mi`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-dark-text-muted block transition-colors duration-300">ETA</span>
                    <span className="font-medium text-green-900 dark:text-emerald-400 transition-colors duration-300">
                      {selectedAlternative.routeInfo 
                        ? `${Math.round(selectedAlternative.routeInfo.duration / 60)} min`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingRoutes && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 transition-all duration-300">
              <div className="
                bg-white/90 dark:bg-dark-surface/90
                backdrop-blur-xl backdrop-saturate-150
                border border-gray-200/50 dark:border-dark-border/50
                rounded-3xl p-6 flex items-center gap-4
                shadow-2xl
                animate-liquid
              ">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="text-gray-700 dark:text-dark-text transition-colors duration-300">Loading route information...</span>
              </div>
            </div>
          )}
        </div>

        {/* Alternatives Modal */}
        <AlternativesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          alternatives={alternatives}
          currentLocation={dashboardData.currentLocation}
          selectedAlternative={selectedAlternative}
          onSelectAlternative={handleSelectAlternative}
          onConfirmSelection={handleConfirmSelection}
        />

        {/* Confirmation Animation */}
        {selectedAlternative && (
          <ConfirmationAnimation
            isVisible={showConfirmation}
            selectedLocation={selectedAlternative}
            onComplete={handleConfirmationComplete}
          />
        )}
      </div>
    </DarkModeProvider>
  );
};

export default App;
