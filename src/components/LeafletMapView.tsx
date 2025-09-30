import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location, RouteInfo } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Animated Polyline Component
interface AnimatedPolylineProps {
  positions: [number, number][];
  color: string;
  weight: number;
  opacity: number;
  animationClass: string;
}

const AnimatedPolyline: React.FC<AnimatedPolylineProps> = ({
  positions,
  color,
  weight,
  opacity,
  animationClass
}) => {
  const polylineRef = useRef<L.Polyline>(null);

  useEffect(() => {
    if (polylineRef.current) {
      const element = polylineRef.current.getElement();
      if (element) {
        element.classList.add(animationClass);
      }
    }
  }, [animationClass]);

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      color={color}
      weight={weight}
      opacity={opacity}
      pathOptions={{
        className: animationClass,
      }}
    />
  );
};

// Custom markers
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0zm0 19c-3.59 0-6.5-2.91-6.5-6.5S8.91 6 12.5 6 19 8.91 19 12.5 16.09 19 12.5 19z" fill="#3b82f6"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0zm0 19c-3.59 0-6.5-2.91-6.5-6.5S8.91 6 12.5 6 19 8.91 19 12.5 16.09 19 12.5 19z" fill="#8B0000"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapBoundsProps {
  currentLocation: Location;
  selectedLocation?: Location;
}

const MapBounds: React.FC<MapBoundsProps> = ({ currentLocation, selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      const bounds = L.latLngBounds(
        [currentLocation.coords[1], currentLocation.coords[0]],
        [selectedLocation.coords[1], selectedLocation.coords[0]]
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      map.setView([currentLocation.coords[1], currentLocation.coords[0]], 13);
    }
  }, [currentLocation, selectedLocation, map]);

  return null;
};

interface LeafletMapViewProps {
  currentLocation: Location;
  selectedLocation?: Location;
  routeInfo?: RouteInfo;
  className?: string;
}

const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  currentLocation,
  selectedLocation,
  routeInfo,
  className = ''
}) => {
  const center: [number, number] = [currentLocation.coords[1], currentLocation.coords[0]];

  // Convert route geometry to Leaflet format
  const routeCoordinates = routeInfo?.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);

  return (
    <div className={`rounded-lg overflow-hidden relative ${className}`} style={{ zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-filter"
        />
        
        {/* Current Location Marker */}
        <Marker
          position={[currentLocation.coords[1], currentLocation.coords[0]]}
          icon={currentLocationIcon}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-semibold text-blue-600">{currentLocation.name}</h4>
              <p className="text-sm text-gray-600">Current Position</p>
              <p className="text-xs text-gray-500 mt-1">
                {currentLocation.coords[1].toFixed(4)}, {currentLocation.coords[0].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Selected Location Marker */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.coords[1], selectedLocation.coords[0]]}
            icon={selectedLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-red-600">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-600">Selected Location</p>
                {selectedLocation.revenueImpact && (
                  <p className="text-sm text-red-600 font-medium">{selectedLocation.revenueImpact}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {selectedLocation.coords[1].toFixed(4)}, {selectedLocation.coords[0].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line - Base */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#dc2626"
            weight={12}
            opacity={0.3}
          />
        )}

        {/* Route Line - Animated Flow */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <AnimatedPolyline
            positions={routeCoordinates}
            color="#dc2626"
            weight={8}
            opacity={1.0}
            animationClass="animate-flow-ruby"
          />
        )}

        {/* Route Line - Inner Highlight */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <AnimatedPolyline
            positions={routeCoordinates}
            color="#ffffff"
            weight={4}
            opacity={0.9}
            animationClass="animate-glow-white"
          />
        )}

        {/* Auto-fit bounds */}
        <MapBounds currentLocation={currentLocation} selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
};

export default LeafletMapView;
