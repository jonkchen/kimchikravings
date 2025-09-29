import { RouteInfo, MapboxRouteResponse } from '../types';
import { mockRouteData } from '../data/mockData';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const hasMapboxToken = (): boolean => {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN !== 'your_mapbox_token_here');
};

export const getRoute = async (
  fromCoords: [number, number],
  toCoords: [number, number],
  profile: 'driving' | 'driving-traffic' = 'driving'
): Promise<RouteInfo | null> => {
  try {
    // Use OSRM (Open Source Routing Machine) - completely free
    const [fromLon, fromLat] = fromCoords;
    const [toLon, toLat] = toCoords;
    
    // OSRM public API - no API key required
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson&steps=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('OSRM API failed, using mock data');
      return getMockRoute(toCoords);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching route:', error);
    return getMockRoute(toCoords);
  }
};

const getMockRoute = (toCoords: [number, number]): RouteInfo | null => {
  // Find mock data based on destination coordinates
  const mockEntries = Object.entries(mockRouteData);
  for (const [key, mockRoute] of mockEntries) {
    const mockCoords = mockRoute.geometry.coordinates[1];
    if (Math.abs(mockCoords[0] - toCoords[0]) < 0.01 && 
        Math.abs(mockCoords[1] - toCoords[1]) < 0.01) {
      return mockRoute as RouteInfo;
    }
  }
  
  // Fallback mock route
  return {
    distance: 3000,
    duration: 600,
    geometry: {
      type: 'LineString',
      coordinates: [toCoords, toCoords]
    }
  };
};

export const formatDistance = (meters: number): string => {
  const miles = meters * 0.000621371;
  return `${miles.toFixed(1)} mi`;
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
};

export const precomputeRoutes = async (
  fromCoords: [number, number],
  toCoordsList: [number, number][]
): Promise<RouteInfo[]> => {
  const routePromises = toCoordsList.map(coords => getRoute(fromCoords, coords));
  return Promise.all(routePromises);
};
