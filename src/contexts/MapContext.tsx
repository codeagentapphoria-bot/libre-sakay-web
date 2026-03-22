import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Stop } from '../types';

interface RouteFocusState {
  stops: Stop[] | null;
}

interface MapFocusState {
  center: [number, number] | null;
  zoom: number | null;
  routeFocus: RouteFocusState;
}

interface MapContextType {
  focus: MapFocusState;
  setMapFocus: (center: [number, number], zoom?: number) => void;
  setRouteFocus: (stops: Stop[]) => void;
  clearMapFocus: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<MapFocusState>({ 
    center: null, 
    zoom: null,
    routeFocus: { stops: null }
  });

  const setMapFocus = useCallback((center: [number, number], zoom: number = 15) => {
    setFocus({ center, zoom, routeFocus: { stops: null } });
  }, []);

  const setRouteFocus = useCallback((stops: Stop[]) => {
    if (stops.length === 0) return;
    
    const lats = stops.map(s => s.latitude);
    const lngs = stops.map(s => s.longitude);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    setFocus({ 
      center: [centerLat, centerLng], 
      zoom: 14,
      routeFocus: { stops }
    });
  }, []);

  const clearMapFocus = useCallback(() => {
    setFocus({ center: null, zoom: null, routeFocus: { stops: null } });
  }, []);

  return (
    <MapContext.Provider value={{ focus, setMapFocus, setRouteFocus, clearMapFocus }}>
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
