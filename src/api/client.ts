import { API_BASE_URL } from './config';

export interface Route {
  id: string;
  route_number?: string;
  name?: string;
  origin?: string;
  destination?: string;
  service_type?: 'normal' | 'express' | 'point_to_point' | string;
  stops_count?: number;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteStop {
  route_id: string;
  stop_id: string;
  sequence: number;
  scheduled_offset_minutes: number;
  name?: string;
  lat?: number;
  lng?: number;
}

export interface BusLive {
  bus_id: string;
  has_live_data: boolean;
  lat?: number | null;
  lng?: number | null;
  speed?: number | null;
  recorded_at?: string | null;
  seconds_since_last_update?: number | null;
  is_stale: boolean;
  status_text: string;
}

export interface Bus {
  id: string;
  route_id?: string | null;
  capacity: number;
  route?: Route | null;
  live?: BusLive | null;
}

export interface Alert {
  id: number;
  title: string;
  body: string;
  type: string;
  bus_id?: string | null;
  created_at: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText || response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    console.error(`Request to ${url} failed:`, error?.message || error);
    throw error;
  }
}

export async function getRoutes(): Promise<Route[]> {
  return request<Route[]>('/routes');
}

export async function getRouteStops(routeId: string): Promise<RouteStop[]> {
  return request<RouteStop[]>(`/routes/${encodeURIComponent(routeId)}/stops`);
}

export async function getBuses(routeId?: string): Promise<Bus[]> {
  const query = routeId ? `?route_id=${encodeURIComponent(routeId)}` : '';
  return request<Bus[]>(`/buses${query}`);
}

export async function getBus(busId: string): Promise<Bus> {
  return request<Bus>(`/buses/${encodeURIComponent(busId)}`);
}

export async function getBusLive(busId: string): Promise<BusLive> {
  return request<BusLive>(`/buses/${encodeURIComponent(busId)}/live`);
}

export async function postBusLocation(
  busId: string,
  lat: number,
  lng: number,
  timestamp?: string,
  speed: number = 0
): Promise<any> {
  return request(`/buses/${encodeURIComponent(busId)}/location`, {
    method: 'POST',
    body: JSON.stringify({
      lat,
      lng,
      timestamp,
      speed,
    }),
  });
}

export async function getStops(query?: string): Promise<Stop[]> {
  const queryString = query ? `?q=${encodeURIComponent(query)}` : '';
  return request<Stop[]>(`/stops${queryString}`);
}

export async function getAlerts(): Promise<Alert[]> {
  return request<Alert[]>('/alerts');
}
