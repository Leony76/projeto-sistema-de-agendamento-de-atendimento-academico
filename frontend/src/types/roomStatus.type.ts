export type RoomStatus = 'RESERVED' | 'AVAILABLE';

export type RoomDetails = {
  readonly id : number;
  name        : string; 
  status      : RoomStatus;
  appointmentDate? : string;
  occupants? : {
    student   : string;
    professor : string;
  };
};