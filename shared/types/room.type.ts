export type RoomStatus = 'RESERVED' | 'AVAILABLE' | 'UNAVAILABLE';

export type Room = {
  readonly id : number;
  name        : string;
  status      : RoomStatus;
};