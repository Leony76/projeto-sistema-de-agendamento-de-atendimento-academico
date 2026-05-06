import type { StudentAppointment } from "@shared/types/appointment.type";
import { APPOINTMENTS_HISTORY_DATA } from "../../data/appointmentsHistory.mock";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { LOGGED_USER_DATA } from "../../loggedUserData.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { ROOMS } from "../../data/rooms.mock";

const getStudentLastAppointment = (): StudentAppointment | null => {
  const studentId = LOGGED_USER_DATA.id;
  
  const lastHistory = APPOINTMENTS_HISTORY_DATA
    .filter(h => {
      const appt = APPOINTMENTS_DATA.find(a => a.id === h.appointmentId);
      return appt?.studentId === studentId;
    })
    .sort((a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )[0];

  if (!lastHistory) return null;

  const targetAppointment = APPOINTMENTS_DATA.find(
    (appointment) => appointment.id === lastHistory.appointmentId
  );

  if (!targetAppointment) return null;

  const targetProfessor = PROFESSORS.find(
    (professor) => professor.id === targetAppointment.professorId
  );

  const targetRoom = ROOMS.find(
    (room) => room.id === targetAppointment.roomId
  );

  return {
    id        : targetAppointment.id,
    dateTime  : targetAppointment.dateTime,
    professor : targetProfessor!,
    reason    : targetAppointment.reason,
    room      : targetRoom?.name!,
  };
};

export const STUDENT_LAST_APPOINTMENT = getStudentLastAppointment();