export type UserAppointment = {
  id       : number;
  reason   : string;
  dateTime : Date;
  room     : {
    name   : string;
  };
  entity : {
    user : {
      name: string;
      photo: string | null;
    };
  };
};

export const userAppointmentMapper = (
  appointment: UserAppointment
) => {

  return {
    id       : appointment.id,
    reason   : appointment.reason,
    room     : appointment.room.name,
    dateTime : appointment.dateTime.toISOString(),

    user: {
      name  : appointment.entity.user.name,
      photo : appointment.entity.user.photo,
    },
  };
};