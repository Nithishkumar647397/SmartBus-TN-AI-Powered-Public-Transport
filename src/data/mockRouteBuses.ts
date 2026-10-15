/**
 * DEPRECATED: Hardcoded route buses have been removed.
 * Fetch live buses and positions from GET /buses and GET /buses/{id}/live instead.
 */
export interface RouteBus {
  id: string;
  busNumber: string;
  fullRoute: string[];
  currentStop: string;
  nextStop: string;
  etaToUser: number;
  liveLat: number;
  liveLng: number;
  seatsFilled: number;
  seatsAvailable: number;
  totalCapacity: number;
  crowdLevel: 'low' | 'moderate' | 'high';
  status: 'On Time' | 'Delayed';
  serviceType: 'normal' | 'express' | 'point_to_point';
}

export const mockRouteBuses: RouteBus[] = [];
