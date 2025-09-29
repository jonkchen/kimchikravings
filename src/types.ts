export interface Location {
  id: string;
  name: string;
  coords: [number, number]; // [longitude, latitude]
  revenueImpact?: string;
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: GeoJSON.LineString;
}

export interface AlternativeLocation extends Location {
  routeInfo?: RouteInfo;
  isSelected?: boolean;
}

export interface MapboxRouteResponse {
  routes: Array<{
    distance: number;
    duration: number;
    geometry: GeoJSON.LineString;
  }>;
  waypoints: Array<{
    name: string;
    location: [number, number];
  }>;
}

export interface DashboardData {
  currentLocation: Location;
  blockedLocation: Location;
  alternativeLocations: AlternativeLocation[];
  selectedAlternative?: AlternativeLocation;
}
