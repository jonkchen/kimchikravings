import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location, RouteInfo } from '../types';
import { hasMapboxToken } from '../lib/routing';

interface MapViewProps {
  currentLocation: Location;
  selectedLocation?: Location;
  routeInfo?: RouteInfo;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  selectedLocation,
  routeInfo,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    try {
      // For demo purposes, let's use a simple fallback when no token
      if (!hasMapboxToken()) {
        console.log('No Mapbox token found, showing fallback map');
        setMapError('Mapbox token not configured. Showing location preview.');
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: currentLocation.coords,
        zoom: 12,
        accessToken: import.meta.env.VITE_MAPBOX_TOKEN
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add current location marker
      const currentMarker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 1.2
      })
        .setLngLat(currentLocation.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h4 class="font-semibold text-blue-600">${currentLocation.name}</h4>
            <p class="text-sm text-gray-600">Current Position</p>
          </div>
        `))
        .addTo(map.current);

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Using fallback view.');
    }
  }, [currentLocation]);

  useEffect(() => {
    if (!map.current) return;

    // Add selected location marker
    if (selectedLocation) {
      const selectedMarker = new mapboxgl.Marker({
        color: '#10b981',
        scale: 1.2
      })
        .setLngLat(selectedLocation.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h4 class="font-semibold text-green-600">${selectedLocation.name}</h4>
            <p class="text-sm text-gray-600">Selected Location</p>
            ${selectedLocation.revenueImpact ? `<p class="text-sm text-green-600">${selectedLocation.revenueImpact}</p>` : ''}
          </div>
        `))
        .addTo(map.current);

      // Fit bounds to show both locations
      const bounds = new mapboxgl.LngLatBounds()
        .extend(currentLocation.coords)
        .extend(selectedLocation.coords);
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });

      return () => {
        selectedMarker.remove();
      };
    }
  }, [selectedLocation, currentLocation]);

  useEffect(() => {
    if (!map.current || !routeInfo) return;

    // Add route line
    const sourceId = 'active-route';
    const layerId = 'active-route-line';

    // Remove existing route if any
    if (map.current.getSource(sourceId)) {
      map.current.removeLayer(layerId);
      map.current.removeSource(sourceId);
    }

    // Add route source and layer
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeInfo.geometry
      }
    });

    map.current.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    return () => {
      if (map.current && map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(sourceId);
      }
    };
  }, [routeInfo]);

  if (mapError || !hasMapboxToken()) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-lg ${className}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white bg-opacity-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Location Overview</span>
            </div>
            <p className="text-sm text-gray-600">Interactive map requires Mapbox token</p>
          </div>

          {/* Location Info */}
          <div className="flex-1 p-6 space-y-6">
            {/* Current Location */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Current Position</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{currentLocation.name}</p>
              <p className="text-xs text-gray-500">Coordinates: {currentLocation.coords[1].toFixed(4)}, {currentLocation.coords[0].toFixed(4)}</p>
            </div>

            {/* Selected Location */}
            {selectedLocation && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Selected Location</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{selectedLocation.name}</p>
                <p className="text-xs text-gray-500 mb-3">Coordinates: {selectedLocation.coords[1].toFixed(4)}, {selectedLocation.coords[0].toFixed(4)}</p>
                {selectedLocation.revenueImpact && (
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-green-700 text-sm font-medium">{selectedLocation.revenueImpact}</p>
                  </div>
                )}
              </div>
            )}

            {/* Route Info */}
            {selectedLocation && routeInfo && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium text-gray-900">Route Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Distance:</span>
                    <span className="ml-2 font-medium">{(routeInfo.distance * 0.000621371).toFixed(1)} mi</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ETA:</span>
                    <span className="ml-2 font-medium">{Math.round(routeInfo.duration / 60)} min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium text-sm">Interactive Map Available</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Add your Mapbox token to the .env file to see the interactive map with real routing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapView;
