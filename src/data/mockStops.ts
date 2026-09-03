export interface RouteStop {
  id: string;
  stopName: string;
  status: 'past' | 'current' | 'upcoming' | 'destination';
  estimatedTime: string;
  relativeTime?: string;
  sequenceOrder: number;
}

export const mockRouteStops: RouteStop[] = [
  { id: '1', stopName: 'Tiruppur Central', status: 'past', estimatedTime: '10:00 AM', sequenceOrder: 1 },
  { id: '2', stopName: 'Tiruppur Old Bus Stand', status: 'past', estimatedTime: '10:15 AM', sequenceOrder: 2 },
  { id: '3', stopName: 'Palladam', status: 'current', estimatedTime: '10:45 AM', sequenceOrder: 3 },
  { id: '4', stopName: 'Kangeyam', status: 'upcoming', estimatedTime: '11:15 AM', relativeTime: '30 mins', sequenceOrder: 4 },
  { id: '5', stopName: 'Vellakoil', status: 'upcoming', estimatedTime: '11:45 AM', relativeTime: '1h 0m', sequenceOrder: 5 },
  { id: '6', stopName: 'TODO Placeholder Stop 6', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 6 },
  { id: '7', stopName: 'TODO Placeholder Stop 7', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 7 },
  { id: '8', stopName: 'TODO Placeholder Stop 8', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 8 },
  { id: '9', stopName: 'TODO Placeholder Stop 9', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 9 },
  { id: '10', stopName: 'TODO Placeholder Stop 10', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 10 },
  { id: '11', stopName: 'TODO Placeholder Stop 11', status: 'upcoming', estimatedTime: 'TODO', relativeTime: 'TODO', sequenceOrder: 11 },
  { id: '12', stopName: 'Karur', status: 'destination', estimatedTime: '12:20 PM', relativeTime: '1h 35m', sequenceOrder: 12 },
];
