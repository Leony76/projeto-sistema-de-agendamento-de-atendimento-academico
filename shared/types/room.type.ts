export type Room = {
  readonly id : number;
  name        : string;
  status      : 'AVAILABLE' | 'UNAVAILABLE';

  appointments?: {
    dateTime: string;
    occupants: {
      student: string;
      professor: string;
    };
  }[];
};