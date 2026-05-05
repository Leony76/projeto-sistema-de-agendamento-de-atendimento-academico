import { type StudentBriefInfos } from '@shared/types/studentBriefInfos.type'
import { APPOINTMENTS_DATA } from '../../data/appointments.mock'
import { SOLICITATIONS_DATA } from '../../data/solicitations.mock'
import { LOGGED_USER_DATA } from '../../loggedUserData.mock';

const loggedId = LOGGED_USER_DATA.id;

const appointmentsMade = APPOINTMENTS_DATA.filter(
  (appointment) => 
    appointment.studentId === loggedId
  &&
    appointment.status === 'DONE'
).length;

const nextAppointmentDateTime = APPOINTMENTS_DATA
  .filter(
    (appointment) =>
      appointment.studentId === loggedId 
    &&
      new Date(appointment.dateTime) > new Date()
  )
  .sort(
    (a, b) =>
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )[0]?.dateTime ?? ''
;

const pendingSolicitations = SOLICITATIONS_DATA.filter(
  (solicitation) => 
    solicitation.status === 'UNCONFIRMED'
  &&
    solicitation.studentId === loggedId
).length;

export const STUDENT_BRIEF_INFOS_DATA: StudentBriefInfos = {
  appointmentsMade,
  nextAppointmentDateTime,
  pendingSolicitations,
};