import type { StudentAppointmentHistory } from "@shared/types/appointmentHistory.type";
import { APPOINTMENTS_HISTORY_DATA } from "../../data/appointmentsHistory.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { DISCIPLINES } from "../../data/disciplines.mock";

const studentId = LOGGED_USER_DATA.id;

export const STUDENT_APPOINTMENTS_HISTORY: StudentAppointmentHistory[] = APPOINTMENTS_HISTORY_DATA.map((history) => {

  const appointment = APPOINTMENTS_DATA.find((appointment) => appointment.id === history.appointmentId);

  if (!appointment || appointment.studentId !== studentId) return null;

  const professor = PROFESSORS.find((professor) => professor.id === appointment.professorId)!;
  const professorDisciplines = DISCIPLINES.filter((discipline) => discipline.professorId === professor.id);

  return {
    id: appointment.id,
    appoitmentDateTime: appointment.dateTime,
    reason: appointment.reason,
    professor: {
      ...professor,
      disciplines: professorDisciplines,
    },
  };
}).filter((item): item is StudentAppointmentHistory => item !== null);