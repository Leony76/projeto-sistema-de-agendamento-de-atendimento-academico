import type { ProfessorAppointment } from "@shared/types/appointment.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { ROOMS } from "../../data/rooms.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { STUDENTS } from "../../data/students.mock";

export const PROFESSOR_APPOINTMENTS: ProfessorAppointment[] = 
  APPOINTMENTS_DATA
  .filter((appointment) => appointment.professorId === LOGGED_USER_DATA.id)
  .map((appointment) => {

  const student = STUDENTS.find((p) => p.id === appointment.studentId)!;
  const room = ROOMS.find((r) => r.id === appointment.roomId)!;

  return {
    id        : appointment.id,
    dateTime  : appointment.dateTime,
    student   : student,
    reason    : appointment.reason,
    room      : room?.name,
  }
})