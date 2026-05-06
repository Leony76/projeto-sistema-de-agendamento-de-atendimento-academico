import type { RegisteredStudent } from "@shared/types/registeredUsers.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import { STUDENTS } from "../../data/students.mock";

export const REGISTERED_STUDENTS: RegisteredStudent[] = STUDENTS.map((student) => {

  const count: { appointments: number, solicitations: number } = {
    appointments  : (() => {
      let count = 0;

      for (const appointment of APPOINTMENTS_DATA) 
        if (appointment.studentId === student.id) count++;

      return count;
    })(),
    solicitations : (() => {
      let count = 0;

      for (const solicitation of SOLICITATIONS_DATA) 
        if (solicitation.studentId === student.id) count++;

      return count;
    })(),
  };

  const studentData: RegisteredStudent = {
    ...student,
    appointments  : count.appointments,
    solicitations : count.solicitations,
  };

  return studentData;
});