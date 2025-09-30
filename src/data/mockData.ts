import { DashboardData } from '../types';

export const mockDashboardData: DashboardData = {
  currentLocation: {
    id: 'current',
    name: 'Culver City',
    coords: [-118.3965, 34.0211] // Culver City coordinates
  },
  blockedLocation: {
    id: 'blocked',
    name: 'Culver City Downtown',
    coords: [-118.3965, 34.0211]
  },
  alternativeLocations: [
    {
      id: 'alt1',
      name: 'Santa Monica Pier',
      coords: [-118.4969, 34.0089],
      revenueImpact: '+$1,800/day'
    },
    {
      id: 'alt2',
      name: 'Venice Beach Boardwalk',
      coords: [-118.4912, 33.9856],
      revenueImpact: '+$1,600/day'
    },
    {
      id: 'alt3',
      name: 'Beverly Hills',
      coords: [-118.4004, 34.0736],
      revenueImpact: '+$1,400/day'
    },
    {
      id: 'alt4',
      name: 'West Hollywood',
      coords: [-118.3617, 34.0900],
      revenueImpact: '+$1,300/day'
    },
    {
      id: 'alt5',
      name: 'Marina del Rey',
      coords: [-118.4517, 33.9806],
      revenueImpact: '+$1,200/day'
    },
    {
      id: 'alt6',
      name: 'Manhattan Beach',
      coords: [-118.4103, 33.8847],
      revenueImpact: '+$1,100/day'
    }
  ]
};

// Mock route data for fallback when no API available
export const mockRouteData = {
  'alt1': {
    distance: 8500, // meters (8.5 km)
    duration: 1200,  // seconds (20 minutes)
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.4100, 34.0200], // Head west on Venice Blvd
        [-118.4300, 34.0150], // Continue west
        [-118.4500, 34.0120], // Approach Santa Monica
        [-118.4700, 34.0100], // Santa Monica area
        [-118.4969, 34.0089]  // Santa Monica Pier
      ]
    }
  },
  'alt2': {
    distance: 6500, // meters (6.5 km)
    duration: 900,  // 15 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.4100, 34.0150], // Head southwest
        [-118.4300, 34.0050], // Continue toward Venice
        [-118.4500, 33.9950], // Venice area
        [-118.4700, 33.9900], // Approach boardwalk
        [-118.4912, 33.9856]  // Venice Beach Boardwalk
      ]
    }
  },
  'alt3': {
    distance: 6000, // meters (6 km)
    duration: 900,  // 15 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.3900, 34.0300], // Head north
        [-118.3850, 34.0400], // Continue north
        [-118.3800, 34.0500], // Approach Beverly Hills
        [-118.3950, 34.0650], // Beverly Hills area
        [-118.4004, 34.0736]  // Beverly Hills destination
      ]
    }
  },
  'alt4': {
    distance: 12000, // meters (12 km)
    duration: 1500,  // 25 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.3800, 34.0300], // Head northeast
        [-118.3700, 34.0400], // Continue northeast
        [-118.3650, 34.0500], // Approach West Hollywood
        [-118.3630, 34.0700], // West Hollywood area
        [-118.3617, 34.0900]  // West Hollywood destination
      ]
    }
  },
  'alt5': {
    distance: 5500, // meters (5.5 km)
    duration: 780,  // 13 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.4100, 34.0150], // Head southwest
        [-118.4250, 34.0100], // Continue southwest
        [-118.4400, 33.9950], // Approach Marina del Rey
        [-118.4500, 33.9850], // Marina del Rey area
        [-118.4517, 33.9806]  // Marina del Rey destination
      ]
    }
  },
  'alt6': {
    distance: 15000, // meters (15 km)
    duration: 1800,  // 30 minutes
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [-118.3965, 34.0211], // Culver City
        [-118.4000, 34.0100], // Head south
        [-118.4050, 33.9900], // Continue south
        [-118.4080, 33.9700], // Approach Manhattan Beach
        [-118.4100, 33.9000], // Manhattan Beach area
        [-118.4103, 33.8847]  // Manhattan Beach destination
      ]
    }
  }
};
