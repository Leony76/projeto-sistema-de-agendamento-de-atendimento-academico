import type { StudentSolicitation } from "@shared/types/solicitation.type";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { DISCIPLINES } from "../../data/disciplines.mock";

const studentId = LOGGED_USER_DATA.id;

export const STUDENT_SOLICITATIONS: StudentSolicitation[] = SOLICITATIONS_DATA
  .filter((solicitation) => solicitation.studentId === studentId)
  .map((solicitation) => {

  const targetProfessor = PROFESSORS.find((professor) => professor.id === solicitation.professorId)!;
  const professorDisciplines = DISCIPLINES.filter((disciplines) => disciplines.professorId === targetProfessor.id)!;

  const professor: StudentSolicitation['professor'] = {
    ...targetProfessor,
    disciplines: professorDisciplines,
  }; 

  return {
    id                  : solicitation.id,
    appoitmentDateTime  : solicitation.appoitmentDateTime,
    professor           : professor,
    status              : solicitation.status,
    reason              : solicitation.reason,
  }
});