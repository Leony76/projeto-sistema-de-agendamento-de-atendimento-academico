import type { ProfessorAppointmentHistory } from "@shared/types/appointmentHistory.type";
import { APPOINTMENTS_HISTORY_DATA } from "../../data/appointmentsHistory.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { STUDENTS } from "../../data/students.mock";

const professorId = LOGGED_USER_DATA.id;

export const PROFESSOR_APPOINTMENTS_HISTORY: ProfessorAppointmentHistory[] = APPOINTMENTS_HISTORY_DATA.map((history) => {

  const appointment = APPOINTMENTS_DATA.find((appointment) => appointment.id === history.appointmentId);

  if (!appointment || appointment.professorId !== professorId) return null;

  const student = STUDENTS.find((student) => student.id === appointment.studentId)!;

  return {
    id                 : appointment.id,
    appoitmentDateTime : appointment.dateTime,
    reason             : appointment.reason,
    student,
  };
}).filter((item): item is ProfessorAppointmentHistory => item !== null);