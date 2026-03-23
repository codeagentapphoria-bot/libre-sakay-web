import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBusLocations } from '../../api/queries';
import BusMarker from './BusMarker';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { useMapFocus } from '../../contexts/MapContext';
import type { Stop } from '../../types';
import 'leaflet/dist/leaflet.css';

const BORONGAN_CENTER: [number, number] = [11.5077, 125.4377];
const DEFAULT_ZOOM = 13;

interface BusMapProps {
  height?: string;
}

function createNumberedIcon(number: number) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: #2563eb;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapController() {
  const { focus, clearMapFocus } = useMapFocus();
  const map = useMap();
  const prevFocusRef = useRef<string>('');

  useEffect(() => {
    if (focus.center) {
      const focusKey = `${focus.center[0]}-${focus.center[1]}-${focus.zoom}-${focus.routeFocus.stops?.length}-${focus.selectedBus?.id}`;
      if (prevFocusRef.current !== focusKey) {
        map.flyTo(focus.center, focus.zoom ?? 15, { duration: 1 });
        prevFocusRef.current = focusKey;
      }
    }
  }, [focus, map, clearMapFocus]);

  return null;
}

function MapControlsInternal() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}

function RouteStops({ stops }: { stops: Stop[] }) {
  const polylinePositions: [number, number][] = stops
    .sort((a, b) => a.sequence_order - b.sequence_order)
    .map(s => [s.latitude, s.longitude]);

  return (
    <>
      <Polyline 
        positions={polylinePositions} 
        color="#2563eb" 
        weight={4} 
        opacity={0.8}
        dashArray="10, 10"
      />
      {stops.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={createNumberedIcon(stop.sequence_order)}
        >
          <Popup>
            <div className="text-sm font-medium">
              {stop.sequence_order}. {stop.name}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function BusMap({ height = '100%' }: BusMapProps) {
  const { data: buses, isLoading } = useBusLocations(0);
  const { focus } = useMapFocus();
  const activeBuses = buses?.filter(b => b.latitude && b.longitude) ?? [];
  const routeStops = focus.routeFocus.stops;

  return (
    <div className="relative w-full bg-gray-100" style={{ height }}>
      <MapContainer
        center={BORONGAN_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={false}
        zoomControl={false}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routeStops && <RouteStops stops={routeStops} />}

        {activeBuses.map((bus) => (
          <BusMarker key={bus.id} busLocation={bus} />
        ))}

        {activeBuses.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">No buses currently tracked</p>
              <p className="text-gray-400 text-sm mt-1">Tap refresh to check again</p>
            </div>
          </div>
        )}

        {/* Map Controls - inside MapContainer */}
        <MapControlsInternal />
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-[1000]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-3 font-medium">Loading buses...</p>
          </div>
        </div>
      )}
    </div>
  );
}
