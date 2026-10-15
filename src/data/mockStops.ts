/**
 * DEPRECATED: Hardcoded stops have been removed.
 * Fetch live route stops from GET /routes/{id}/stops instead.
 */
export interface RouteStop {
  id: string;
  stopName: string;
  status: 'past' | 'current' | 'upcoming' | 'destination';
  estimatedTime: string;
  relativeTime?: string;
  sequenceOrder: number;
}

export const mockRouteStops: RouteStop[] = [];
