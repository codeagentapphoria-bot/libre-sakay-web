import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { BusLocation } from '../../types';

// Convert heading (0-360) to compass direction
function getCardinalDirection(heading: number): string {
  if (heading === null || heading === undefined) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
}

const createBusIcon = (isMoving: boolean, busId: string) => {
  const size = 36;
  const bgColor = isMoving ? '#16a34a' : '#e11d48';
  
  return new L.DivIcon({
    className: 'bus-marker',
    html: `<div style="
      background: ${bgColor};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    ">
      <span style="color: white; font-size: 12px; font-weight: bold;">${busId}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface BusMarkerProps {
  busLocation: BusLocation;
}

export default function BusMarker({ busLocation }: BusMarkerProps) {
  const isMoving = busLocation.speed > 5;
  const busData = busLocation.bus;
  const plateNumber = busData?.plate_number ?? 'N/A';
  const icon = createBusIcon(isMoving, plateNumber);
  const direction = getCardinalDirection(busLocation.heading ?? 0);
  
  // Handle routes data - support different response formats
  const routesData = busData?.routes as unknown;
  let routeName = 'Unknown Route';
  
  if (Array.isArray(routesData) && routesData.length > 0) {
    routeName = routesData[0].name ?? 'Unknown Route';
  } else if (routesData && typeof routesData === 'object' && 'name' in routesData) {
    routeName = (routesData as { name: string }).name;
  }

  return (
    <Marker
      position={[busLocation.latitude, busLocation.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="p-1">
          <p className="font-bold text-heading-700">{plateNumber}</p>
          <p className="text-sm text-heading-600">Route: {routeName}</p>
          <p className="text-sm font-semibold" style={{ color: isMoving ? '#16a34a' : '#e11d48' }}>
            {isMoving ? `Moving (${(busLocation.speed ?? 0).toFixed(1)} km/h)` : 'Parked/At Stop'}
          </p>
          {direction && isMoving && (
            <p className="text-xs text-heading-500 mt-1">
              Direction: {direction}
            </p>
          )}
          <p className="text-xs text-heading-400 mt-1">
            Updated: {new Date(busLocation.recorded_at).toLocaleTimeString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
