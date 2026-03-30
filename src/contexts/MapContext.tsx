import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Stop, BusLocation } from '../types';

interface RouteFocusState {
  stops: Stop[] | null;
}

interface MapFocusState {
  center: [number, number] | null;
  zoom: number | null;
  routeFocus: RouteFocusState;
  selectedBus: BusLocation | null;
  userLocation: [number, number] | null;
}

interface MapContextType {
  focus: MapFocusState;
  setMapFocus: (center: [number, number], zoom?: number) => void;
  setRouteFocus: (stops: Stop[]) => void;
  setBusFocus: (bus: BusLocation) => void;
  setUserLocation: (location: [number, number] | null) => void;
  clearSelectedBus: () => void;
  clearMapFocus: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<MapFocusState>({ 
    center: null, 
    zoom: null,
    routeFocus: { stops: null },
    selectedBus: null,
    userLocation: null
  });

  const setMapFocus = useCallback((center: [number, number], zoom: number = 15) => {
    setFocus(prev => ({ ...prev, center, zoom, routeFocus: { stops: null }, selectedBus: null }));
  }, []);

  const setRouteFocus = useCallback((stops: Stop[]) => {
    if (stops.length === 0) return;
    
    const lats = stops.map(s => s.latitude);
    const lngs = stops.map(s => s.longitude);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    setFocus(prev => ({ 
      ...prev,
      center: [centerLat, centerLng], 
      zoom: 14,
      routeFocus: { stops },
      selectedBus: null
    }));
  }, []);

  const setBusFocus = useCallback((bus: BusLocation) => {
    if (!bus.latitude || !bus.longitude) return;
    setFocus(prev => ({
      ...prev,
      center: [bus.latitude, bus.longitude],
      zoom: 16,
      routeFocus: { stops: null },
      selectedBus: bus
    }));
  }, []);

  const setUserLocation = useCallback((location: [number, number] | null) => {
    setFocus(prev => ({ ...prev, userLocation: location }));
  }, []);

  const clearMapFocus = useCallback(() => {
    setFocus(prev => ({ ...prev, center: null, zoom: null, routeFocus: { stops: null }, selectedBus: null }));
  }, []);

  const clearSelectedBus = useCallback(() => {
    setFocus(prev => ({ ...prev, selectedBus: null }));
  }, []);

  return (
    <MapContext.Provider value={{ focus, setMapFocus, setRouteFocus, setBusFocus, setUserLocation, clearSelectedBus, clearMapFocus }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapFocus() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapFocus must be used within a MapProvider');
  }
  return context;
}
