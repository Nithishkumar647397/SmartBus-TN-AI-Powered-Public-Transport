export interface RouteBus {
  id: string;
  busNumber: string;
  fullRoute: string[];
  currentStop: string;
  nextStop: string;
  etaToUser: number; // in minutes
  liveLat: number;
  liveLng: number;
  seatsFilled: number;
  seatsAvailable: number;
  totalCapacity: number;
  crowdLevel: 'low' | 'moderate' | 'high';
  status: 'On Time' | 'Delayed';
}

export const mockRouteBuses: RouteBus[] = [
  {
    id: 'bus_1',
    busNumber: 'TN-33-N-1234',
    fullRoute: ['Erode', 'Kangeyam', 'Mayanur', 'Karur'],
    currentStop: 'Kangeyam',
    nextStop: 'Mayanur',
    etaToUser: 5,
    liveLat: 11.0,
    liveLng: 77.5,
    seatsFilled: 20,
    seatsAvailable: 30,
    totalCapacity: 50,
    crowdLevel: 'low',
    status: 'On Time',
  },
  {
    id: 'bus_2',
    busNumber: 'TN-45-A-9876',
    fullRoute: ['Coimbatore', 'Palladam', 'Kangeyam', 'Mayanur', 'Trichy'],
    currentStop: 'Palladam',
    nextStop: 'Kangeyam',
    etaToUser: 15,
    liveLat: 11.02,
    liveLng: 77.4,
    seatsFilled: 45,
    seatsAvailable: 5,
    totalCapacity: 50,
    crowdLevel: 'high',
    status: 'Delayed',
  },
  {
    id: 'bus_3',
    busNumber: 'TN-38-C-5555',
    fullRoute: ['Erode', 'Kangeyam', 'Mayanur', 'Karur', 'Madurai'],
    currentStop: 'Erode',
    nextStop: 'Kangeyam',
    etaToUser: 30,
    liveLat: 11.1,
    liveLng: 77.6,
    seatsFilled: 30,
    seatsAvailable: 20,
    totalCapacity: 50,
    crowdLevel: 'moderate',
    status: 'On Time',
  },
];
