export type AppointmentSolicitationRequest = {
  readonly studentId   : number;
  readonly professorId : number
  reason    : string;
  dateTime  : string;
}

export type AppointmentSolicitationResponse = {
  reason        : string;
  dateTime      : string;
  professorName : string;
}