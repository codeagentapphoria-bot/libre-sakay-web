import { MapContainer, TileLayer } from 'react-leaflet';
import { useBusLocations } from '../../api/queries';
import BusMarker from './BusMarker';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { RefreshCw, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const BORONGAN_CENTER: [number, number] = [11.5077, 125.4377];
const DEFAULT_ZOOM = 13;

interface BusMapProps {
  showRefreshButton?: boolean;
  height?: string;
}

export default function BusMap({ showRefreshButton = true, height = '100%' }: BusMapProps) {
  const { data: buses, isLoading, refetch, isFetching } = useBusLocations(0);
  const activeBuses = buses?.filter(b => b.latitude && b.longitude) ?? [];

  return (
    <div className="relative w-full bg-gray-100" style={{ height }}>
      <MapContainer
        center={BORONGAN_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
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
      </MapContainer>

      {showRefreshButton && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1000]">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Refresh</span>
          </Button>
        </div>
      )}

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
