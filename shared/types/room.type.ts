export type Room = 
  | {
  readonly id : number;
  name        : string;
  status : 'AVAILABLE' | 'UNAVAILABLE';
  appointmentDate? : undefined;
  occupants?       : undefined;
} | {
  readonly id : number;
  name        : string;
  status      : 'RESERVED';
  appointmentDate : string;
  occupants : {
    student   : string;
    professor : string;
  };
};