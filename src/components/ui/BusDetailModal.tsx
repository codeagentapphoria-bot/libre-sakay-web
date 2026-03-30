import { useState, useEffect } from 'react';
import { X, Navigation, MapPin, Clock } from 'lucide-react';
import Button from './Button';
import { getRouteETA, formatDuration, formatDistance, RouteResult } from '../../api/routing';
import type { BusLocation } from '../../types';

interface BusDetailModalProps {
  bus: BusLocation;
  userLocation: [number, number] | null;
  onClose: () => void;
}

export default function BusDetailModal({ bus, userLocation, onClose }: BusDetailModalProps) {
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation || !bus.latitude || !bus.longitude) {
      return;
    }

    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getRouteETA(
        userLocation[0],
        userLocation[1],
        bus.latitude,
        bus.longitude
      );

      if (result) {
        setRouteInfo(result);
      } else {
        setError('Could not calculate route');
      }

      setIsLoading(false);
    };

    fetchRoute();
  }, [userLocation, bus.latitude, bus.longitude]);

  const isMoving = (bus.speed ?? 0) > 5;
  const barangayName = bus.barangay?.name;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-heading-900">Bus Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-heading-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: isMoving ? '#16a34a' : '#e11d48' }}
            >
              {bus.bus?.plate_number ?? 'N/A'}
            </div>
            <div>
              <p className="text-xl font-bold text-heading-900">{bus.bus?.plate_number}</p>
              <p className="text-sm text-heading-500">
                {isMoving ? `Moving at ${(bus.speed ?? 0).toFixed(1)} km/h` : 'Parked'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-heading-500 uppercase tracking-wide mb-1">Location</p>
              <p className="font-medium text-heading-900">{barangayName || 'Unknown'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-heading-500 uppercase tracking-wide mb-1">Status</p>
              <p className="font-medium text-heading-900">{isMoving ? 'In Transit' : 'Stopped'}</p>
            </div>
          </div>

          {!userLocation ? (
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-primary-800 font-medium">Location Required</p>
              <p className="text-primary-600 text-sm">Click the crosshair button on the map to set your location</p>
            </div>
          ) : isLoading ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-heading-600">Calculating route...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : routeInfo ? (
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-xs text-primary-700 uppercase tracking-wide mb-3 font-semibold">Estimated Arrival</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-primary-900">{formatDuration(routeInfo.duration)}</p>
                    <p className="text-xs text-primary-600">away</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-primary-900">{formatDistance(routeInfo.distance)}</p>
                    <p className="text-xs text-primary-600">distance</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Button
            onClick={onClose}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
