const OSRM_BASE_URL = 'https://router.project-osrm.org';

export interface RouteResult {
  duration: number;
  distance: number;
}

export async function getRouteETA(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult | null> {
  try {
    const url = `${OSRM_BASE_URL}/route/v1/driving/${userLng},${userLat};${destLng},${destLat}?overview=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('OSRM request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('OSRM no route found:', data);
      return null;
    }
    
    const route = data.routes[0];
    return {
      duration: route.duration,
      distance: route.distance
    };
  } catch (error) {
    console.error('OSRM error:', error);
    return null;
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) {
    return 'Less than 1 min';
  }
  if (minutes === 1) {
    return '1 min';
  }
  return `${minutes} mins`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
