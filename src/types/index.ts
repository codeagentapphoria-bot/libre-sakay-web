export interface Route {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  stops?: Stop[];
  stops_count?: { count: number }[];
}

export interface Stop {
  id: string;
  route_id: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence_order: number;
}

export interface Bus {
  id: string;
  plate_number: string;
  capacity: number;
  route_id?: string;
  route?: Route;
}

export interface BusLocation {
  id: string;
  bus_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  recorded_at: string;
  bus?: Bus;
}

export type BusStatus = 'moving' | 'parked' | 'at_stop';
