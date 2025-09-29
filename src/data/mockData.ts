import { DashboardData } from '../types';

export const mockDashboardData: DashboardData = {
  currentLocation: {
    id: 'current',
    name: 'Current Position',
    coords: [-118.244, 34.052] // DTLA
  },
  blockedLocation: {
    id: 'blocked',
    name: 'Financial District',
    coords: [-118.249, 34.053]
  },
  alternativeLocations: [
    {
      id: 'alt1',
      name: 'Arts District',
      coords: [-118.233, 34.044],
      revenueImpact: '+$1,250/day'
    },
    {
      id: 'alt2',
      name: 'Echo Park Lake',
      coords: [-118.259, 34.078],
      revenueImpact: '+$900/day'
    },
    {
      id: 'alt3',
      name: 'Koreatown',
      coords: [-118.308, 34.061],
      revenueImpact: '+$1,050/day'
    }
  ]
};

// Mock route data for fallback when no API available
export const mockRouteData = {
  'alt1': {
    distance: 2100, // meters
    duration: 420,  // seconds (7 minutes)
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.244, 34.052], // Current position (DTLA)
        [-118.240, 34.051], // Turn onto main street
        [-118.236, 34.048], // Continue on route
        [-118.233, 34.044]  // Arts District
      ]
    }
  },
  'alt2': {
    distance: 3500,
    duration: 600,  // 10 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.244, 34.052], // Current position (DTLA)
        [-118.246, 34.055], // Head north
        [-118.250, 34.062], // Continue on route
        [-118.254, 34.068], // Turn west
        [-118.257, 34.073], // Approach destination
        [-118.259, 34.078]  // Echo Park Lake
      ]
    }
  },
  'alt3': {
    distance: 5800,
    duration: 900,  // 15 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.244, 34.052], // Current position (DTLA)
        [-118.248, 34.054], // Head west
        [-118.255, 34.056], // Continue on route
        [-118.265, 34.058], // Major intersection
        [-118.275, 34.059], // Continue west
        [-118.285, 34.060], // Approach Koreatown
        [-118.295, 34.060], // Final approach
        [-118.308, 34.061]  // Koreatown destination
      ]
    }
  }
};
