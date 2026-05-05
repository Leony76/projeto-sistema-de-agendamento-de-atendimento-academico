import type { RegisteredProfessor } from "@shared/types/registeredUsers.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { DISCIPLINES } from "../../data/disciplines.mock";

export const REGISTERED_PROFESSORS: RegisteredProfessor[] = PROFESSORS.map((professor) => {

  const professorData: RegisteredProfessor = {
    ...professor,
    disciplines   : DISCIPLINES.filter((discipline) => discipline.professorId === professor.id),
    appointments  : (() => {
      let count = 0;

      for (const appointment of APPOINTMENTS_DATA) 
        if (appointment.professorId === professor.id) count++;

      return count;
    })(),
    solicitations : (() => {
      let count = 0;

      for (const solicitation of SOLICITATIONS_DATA) 
        if (solicitation.professorId === professor.id) count++;

      return count;
    })(),
  };

  return professorData;
});