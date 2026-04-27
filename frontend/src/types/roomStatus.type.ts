import type { Room } from "./room.type";

export type RoomStatus = {
  readonly id : number;
  name        : Room; 
  status      : 'RESERVED' | 'AVAILABLE';
  appointmentDate? : string;
  occupants? : {
    student   : string;
    professor : string;
  };
};