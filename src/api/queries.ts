import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Route, Stop, BusLocation } from '../types';

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

export function useBusLocations(refetchInterval = 30000) {
  return useQuery({
    queryKey: ['bus-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bus_locations')
        .select('*, buses(plate_number, routes(name))')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return (data ?? []) as BusLocation[];
    },
    refetchInterval,
    refetchIntervalInBackground: false,
  });
}
