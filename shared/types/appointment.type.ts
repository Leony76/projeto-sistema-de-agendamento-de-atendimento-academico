export type Appointment<T> = {
  readonly id : number;
  dateTime    : string;
  reason      : string;
  room        : string;
  user        : T; 
};
