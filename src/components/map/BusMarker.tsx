import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { BusLocation } from '../../types';

const movingIcon = new L.DivIcon({
  className: 'bus-marker',
  html: `<div style="
    background: #16a34a;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
  ">
    <span style="font-size: 20px;">🚌</span>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const parkedIcon = new L.DivIcon({
  className: 'bus-marker',
  html: `<div style="
    background: #e11d48;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.4);
  ">
    <span style="font-size: 16px;">🅿️</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface BusMarkerProps {
  busLocation: BusLocation;
}

export default function BusMarker({ busLocation }: BusMarkerProps) {
  const isMoving = busLocation.speed > 5;
  const icon = isMoving ? movingIcon : parkedIcon;
  const routeName = busLocation.bus?.route?.name ?? 'Unknown Route';
  const plateNumber = busLocation.bus?.plate_number ?? 'N/A';

  return (
    <Marker
      position={[busLocation.latitude, busLocation.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="p-1">
          <p className="font-bold text-gray-900">{plateNumber}</p>
          <p className="text-sm text-gray-600">Route: {routeName}</p>
          <p className="text-sm font-semibold" style={{ color: isMoving ? '#16a34a' : '#e11d48' }}>
            {isMoving ? `Moving (${busLocation.speed.toFixed(1)} km/h)` : 'Parked/At Stop'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Updated: {new Date(busLocation.recorded_at).toLocaleTimeString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
