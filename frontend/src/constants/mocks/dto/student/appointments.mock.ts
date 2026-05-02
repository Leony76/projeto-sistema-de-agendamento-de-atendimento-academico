import type { StudentAppointment } from "@shared/types/appointment.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { ROOMS } from "../../data/rooms.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";

export const STUDENT_APPOINTMENTS_DATA: StudentAppointment[] = 
  APPOINTMENTS_DATA
  .filter((appointment) => appointment.studentId === LOGGED_USER_DATA.id)
  .map((appointment) => {

  const professor = PROFESSORS.find((p) => p.id === appointment.professorId)!;
  const room = ROOMS.find((r) => r.id === appointment.roomId)!;

  return {
    id        : appointment.id,
    dateTime  : appointment.dateTime,
    professor : professor,
    reason    : appointment.reason,
    room      : room?.name,
  }
})