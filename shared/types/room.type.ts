export type Room = 
  | {
  readonly id : number;
  name        : string;
  status : 'AVAILABLE' | 'UNAVAILABLE';
} | {
  readonly id : number;
  name        : string;
  status      : 'RESERVED';
  appointments: {
    dateTime : string;
    occupants : {
      student   : string;
      professor : string;
    };
  }[];
};