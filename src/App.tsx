import React, { useState, useEffect } from 'react';
import { AlternativeLocation, RouteInfo } from './types';
import { mockDashboardData } from './data/mockData';
import { precomputeRoutes } from './lib/routing';
import BlockedCard from './components/BlockedCard';
import AlternativesModal from './components/AlternativesModal';
import LeafletMapView from './components/LeafletMapView';
import ConfirmationAnimation from './components/ConfirmationAnimation';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Location Finder
          </h1>
          <p className="text-gray-600">
            Manage blocked locations and select alternative routes for your food truck operations.
          </p>
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
            <div className="card p-6 h-96 lg:h-[500px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location Overview
              </h3>
              <LeafletMapView
                currentLocation={dashboardData.currentLocation}
                selectedLocation={selectedAlternative}
                routeInfo={selectedAlternative?.routeInfo}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        {selectedAlternative && (
          <div className="mt-8">
            <div className="card p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                Selected Location Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-sm text-gray-600 block">Location</span>
                  <span className="font-medium text-green-900">{selectedAlternative.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Revenue Impact</span>
                  <span className="font-medium text-green-600">{selectedAlternative.revenueImpact}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Distance</span>
                  <span className="font-medium text-green-900">
                    {selectedAlternative.routeInfo 
                      ? `${(selectedAlternative.routeInfo.distance * 0.000621371).toFixed(1)} mi`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">ETA</span>
                  <span className="font-medium text-green-900">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading route information...</span>
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
  );
};

export default App;
