import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Route, Stop, BusLocation } from '../types';

// Schedule data from Book1.csv
export interface ScheduleEntry {
  id: string;
  busId: string;
  time: string;
  route: string;
  direction: 'to' | 'from' | 'to-backstage' | 'from-backstage';
}

export interface ScheduleData {
  weekday: ScheduleEntry[];
  weekend: ScheduleEntry[];
}

export const scheduleData: Record<string, ScheduleData> = {
  'Camada to Bugas': {
    weekday: [
      { id: '1', busId: 'B2', time: '9:30 AM', route: 'Camada to Bugas', direction: 'to' },
      { id: '2', busId: 'B4', time: '10:30 AM', route: 'Camada to Bugas', direction: 'to' },
      { id: '3', busId: 'B2', time: '12:00 PM', route: 'Camada to Bugas', direction: 'to' },
      { id: '4', busId: 'B2', time: '2:45 PM', route: 'Camada to Bugas', direction: 'to' },
      { id: '5', busId: 'B2', time: '4:00 PM', route: 'Camada to Bugas', direction: 'to' },
    ],
    weekend: [
      { id: '6', busId: 'B2', time: '2:00 PM', route: 'Camada to Bugas', direction: 'to' },
      { id: '7', busId: 'B2', time: '11:00 AM', route: 'Camada to Bugas', direction: 'to' },
      { id: '8', busId: 'B2', time: '12:30 PM', route: 'Camada to Bugas', direction: 'to' },
    ],
  },
  'Bugas to Camada': {
    weekday: [
      { id: '9', busId: 'B4', time: '9:00 AM', route: 'Bugas to Camada', direction: 'from' },
      { id: '10', busId: 'B5', time: '11:00 AM', route: 'Bugas to Camada', direction: 'from' },
      { id: '11', busId: 'B2', time: '12:00 PM', route: 'Bugas to Camada', direction: 'from' },
      { id: '12', busId: 'B4', time: '2:00 PM', route: 'Bugas to Camada', direction: 'from' },
      { id: '13', busId: 'B2', time: '4:00 PM', route: 'Bugas to Camada', direction: 'from' },
      { id: '14', busId: 'B2', time: '6:30 AM', route: 'Bugas to Camada', direction: 'from' },
    ],
    weekend: [
      { id: '15', busId: 'B4', time: '11:00 AM', route: 'Bugas to Camada', direction: 'from' },
      { id: '16', busId: 'B2', time: '12:30 PM', route: 'Bugas to Camada', direction: 'from' },
    ],
  },
  'Bugas to Backstage': {
    weekday: [
      { id: '17', busId: 'B4', time: '3:30 PM', route: 'Bugas to Backstage', direction: 'to-backstage' },
      { id: '18', busId: 'B2', time: '5:00 PM', route: 'Bugas to Backstage', direction: 'to-backstage' },
      { id: '19', busId: 'B5', time: '6:00 PM', route: 'Bugas to Backstage', direction: 'to-backstage' },
      { id: '20', busId: 'B4', time: '5:30 PM', route: 'Bugas to Backstage', direction: 'to-backstage' },
    ],
    weekend: [
      { id: '21', busId: 'B2', time: '5:00 PM', route: 'Bugas to Backstage', direction: 'to-backstage' },
    ],
  },
  'Backstage to Bugas': {
    weekday: [
      { id: '22', busId: 'B4', time: '4:00 PM', route: 'Backstage to Bugas', direction: 'from-backstage' },
      { id: '23', busId: 'B2', time: '5:00 AM', route: 'Backstage to Bugas', direction: 'from-backstage' },
      { id: '24', busId: 'B5', time: '4:30 AM', route: 'Backstage to Bugas', direction: 'from-backstage' },
      { id: '25', busId: 'B4', time: '5:30 AM', route: 'Backstage to Bugas', direction: 'from-backstage' },
    ],
    weekend: [
      { id: '26', busId: 'B4', time: '5:30 AM', route: 'Backstage to Bugas', direction: 'from-backstage' },
    ],
  },
  'Camada to Backstage': {
    weekday: [
      { id: '27', busId: 'B2', time: '5:30 PM', route: 'Camada to Backstage', direction: 'to-backstage' },
      { id: '28', busId: 'B4', time: '5:00 PM', route: 'Camada to Backstage', direction: 'to-backstage' },
    ],
    weekend: [
      { id: '29', busId: 'B4', time: '5:00 PM', route: 'Camada to Backstage', direction: 'to-backstage' },
    ],
  },
  'Backstage to Camada': {
    weekday: [
      { id: '30', busId: 'B5', time: '4:30 AM', route: 'Backstage to Camada', direction: 'from-backstage' },
      { id: '31', busId: 'B4', time: '5:30 AM', route: 'Backstage to Camada', direction: 'from-backstage' },
    ],
    weekend: [
      { id: '32', busId: 'B4', time: '5:30 AM', route: 'Backstage to Camada', direction: 'from-backstage' },
    ],
  },
};

export function useSchedule(routeName?: string) {
  return useQuery({
    queryKey: ['schedule', routeName],
    queryFn: () => {
      if (routeName) {
        return scheduleData[routeName] || null;
      }
      return scheduleData;
    },
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return (data ?? []) as Route[];
    },
  });
}

export function useRoute(routeId: string) {
  return useQuery({
    queryKey: ['routes', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*, stops(*)')
        .eq('id', routeId)
        .single();
      
      if (error) throw error;
      return data as Route;
    },
    enabled: !!routeId,
  });
}

export function useRouteStops(routeId: string) {
  return useQuery({
    queryKey: ['routes', routeId, 'stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('route_id', routeId)
        .order('sequence_order');
      
      if (error) throw error;
      return (data ?? []) as Stop[];
    },
    enabled: !!routeId,
  });
}

export function useRouteWithStops(routeId: string) {
  return useQuery({
    queryKey: ['routes', routeId, 'with-stops'],
    queryFn: async () => {
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .select('*')
        .eq('id', routeId)
        .single();
      
      if (routeError) throw routeError;
      
      const { data: stops, error: stopsError } = await supabase
        .from('stops')
        .select('*')
        .eq('route_id', routeId)
        .order('sequence_order');
      
      if (stopsError) throw stopsError;
      
      return { route, stops: stops ?? [] };
    },
    enabled: !!routeId,
  });
}

export function useBusLocations(refetchInterval = 30000) {
  return useQuery({
    queryKey: ['bus-locations'],
    queryFn: async () => {
      // Step 1: Get latest location per bus
      const { data: locations, error: locError } = await supabase
        .from('bus_locations')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (locError) throw locError;
      if (!locations || locations.length === 0) return [];
      
      // Step 2: Get unique bus IDs
      const busIds = [...new Set(locations.map(l => l.bus_id))];
      
      // Step 3: Fetch all buses with their routes via bus_routes junction table
      const { data: buses, error: busError } = await supabase
        .from('buses')
        .select(`
          id,
          plate_number,
          bus_routes (
            route_id,
            is_primary,
            routes (id, name)
          )
        `)
        .in('id', busIds);
      
      if (busError) throw busError;
      
      // Step 4: Create bus lookup map with routes
      const busMap = new Map<string, typeof buses[0]>();
      for (const bus of buses ?? []) {
        busMap.set(bus.id, bus);
      }
      
      // Step 5: Combine data - keep only latest location per bus
      const latestPerBus = new Map<string, typeof locations[0]>();
      for (const loc of locations) {
        if (!latestPerBus.has(loc.bus_id)) {
          latestPerBus.set(loc.bus_id, loc);
        }
      }
      
      // Step 6: Map bus data to locations
      return Array.from(latestPerBus.values()).map(loc => {
        const bus = busMap.get(loc.bus_id);
        // Extract routes from bus_routes junction table
        const routesData = bus?.bus_routes as unknown as {
          route_id: string;
          is_primary: boolean;
          routes: { id: string; name: string };
        }[] | undefined;
        
        const routes = routesData?.map(br => br.routes).filter(Boolean) ?? [];
        
        return {
          ...loc,
          bus: bus ? {
            id: bus.id,
            plate_number: bus.plate_number,
            routes: routes.length > 0 ? routes : undefined
          } : undefined
        } as BusLocation;
      });
    },
    refetchInterval,
    refetchIntervalInBackground: false,
    staleTime: 10000,
  });
}
