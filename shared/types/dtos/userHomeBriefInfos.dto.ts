export type StudentHomeBriefInfosResponse = {
  appointmentsMade        : number;
  pendingSolicitations    : number;
  nextAppointmentDateTime : string;
};

export type ProfessorHomeBriefInfosResponse = {
  appointmentsConfirmed   : number;
  pendingSolicitations    : number;
  nextAppointmentDateTime : string;
};

export type ManagerHomeBriefInfosResponse = {
  students       : number;
  professors    : number;
  appointments  : number;
  solicitations : number;
};

export type UserHomeBriefInfosResponse = 
| StudentHomeBriefInfosResponse
| ProfessorHomeBriefInfosResponse
| ManagerHomeBriefInfosResponse
;