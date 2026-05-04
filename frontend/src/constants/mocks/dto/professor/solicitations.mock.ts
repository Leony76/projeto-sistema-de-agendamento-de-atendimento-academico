import type { StudentSolicitationFromProfessorView } from "@shared/types/solicitation.type";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { STUDENTS } from "../../data/students.mock";

const professorId = LOGGED_USER_DATA.id;

export const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW: StudentSolicitationFromProfessorView[] = SOLICITATIONS_DATA
  .filter((solicitation) => solicitation.professorId === professorId)
  .map((solicitation) => {

  const targetStudent = STUDENTS.find((student) => student.id === solicitation.studentId)!;

  return {
    id                  : solicitation.id,
    appoitmentDateTime  : solicitation.appoitmentDateTime,
    student             : targetStudent,
    status              : solicitation.status,
    reason              : solicitation.reason,
  }
});