import { APPOINTMENTS_DATA } from "../../data/appointments.mock"
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock"
import type { ProfessorBriefInfos } from "@shared/types/professorBriefInfos.type"
import { LOGGED_USER_DATA } from "../../loggedUserData.mock"

const getProfessorBriefInfos = (): ProfessorBriefInfos => {

  const professorId = LOGGED_USER_DATA.id;

  const appointmentsConfirmed = APPOINTMENTS_DATA.filter((appointment) => 
    appointment.professorId === professorId
    &&
    !appointment.wasDone
  ).length;

  const pendingSolicitations = SOLICITATIONS_DATA.filter((solicitation) => 
    solicitation.professorId === professorId
    &&
    solicitation.status === 'UNCONFIRMED'
  ).length;
  
  const nextAppointmentDateTime = APPOINTMENTS_DATA.filter((appointment) => 
    appointment.professorId === professorId
    &&
    new Date(appointment.dateTime) > new Date()
  ).sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )[0]?.dateTime ?? '';

  return {  
    appointmentsConfirmed,
    pendingSolicitations,
    nextAppointmentDateTime,
  }
} 

export const PROFESSOR_BRIEF_INFOS = getProfessorBriefInfos();