import type { ProfessorDetails, StudentDetails, UserDetails } from "@shared/types/userDetails.type";
import { USERS } from "../../data/users.mock";
import type { RegisteredManager, RegisteredProfessor } from "@shared/types/registeredUsers.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import type { ProfessorAppointment, StudentAppointment } from "@shared/types/appointment.type";
import type { StudentSolicitation, StudentSolicitationFromProfessorView } from "@shared/types/solicitation.type";
import { DISCIPLINES } from "../../data/disciplines.mock";
import { PROFESSORS } from "../../data/professors.mock";
import { ROOMS } from "../../data/rooms.mock";
import type { Discipline } from "@shared/types/disciplines.type";
import type { Professor } from "@shared/types/professor.type";
import { STUDENTS } from "../../data/students.mock";

export const getUserGeneralInfos = ( id: number ): UserDetails => {

  const targetUser = USERS.find((user) => user.id === id);

  switch (targetUser?.role) {
    case "STUDENT": {
      
      const appointments: StudentAppointment[] = APPOINTMENTS_DATA
        .filter((appointment) => appointment.studentId === targetUser.id)
        .map((appointment) => {

          const professor = PROFESSORS.find((professor) => professor.id === appointment.professorId)!;
          const room = ROOMS.find((room) => room.id === appointment.roomId)!;     

          return {
            ...appointment,
            professor,
            room: room.name,
          }
        }
      );

      const solicitations: StudentSolicitation[] = SOLICITATIONS_DATA
        .filter((solicitation) => solicitation.studentId === targetUser.id)
        .map((solicitation) => {

          const professor = PROFESSORS.find((professor) => professor.id === solicitation.professorId)!;     
          const disciplines = DISCIPLINES.filter((discipline) => discipline.professorId === professor.id)!;     

          const professorData: Professor & { disciplines: Discipline[] } = {
            ...professor,
            disciplines,
          }

          const solicitationData: StudentSolicitation = {
            ...solicitation,
            professor: professorData,
          };

          return solicitationData;
        }
      );
      
      const studentData: StudentDetails = {
        ...targetUser,
        solicitations     : solicitations.length,
        appointments      : appointments.length,
        appointmentsList  : appointments,
        solicitationsList : solicitations,          
      };

      return studentData;
    } case "PROFESSOR": {

      const appointments: ProfessorAppointment[] = APPOINTMENTS_DATA
        .filter((appointment) => appointment.professorId === targetUser.id)
        .map((appointment) => {

          const student = STUDENTS.find((student) => student.id === appointment.studentId)!;
          const room = ROOMS.find((room) => room.id === appointment.roomId)!;     

          return {
            ...appointment,
            student,
            room: room.name,
          }
        }
      );

      const solicitations: StudentSolicitationFromProfessorView[] = SOLICITATIONS_DATA
        .filter((solicitation) => solicitation.professorId === targetUser.id)
        .map((solicitation) => {

          const student = STUDENTS.find((student) => student.id === solicitation.studentId)!;     

          const solicitationData: StudentSolicitationFromProfessorView = {
            ...solicitation,
            student,
          };

          return solicitationData;
        }
      );

      const professor: RegisteredProfessor = { 
        ...targetUser,
        disciplines   : DISCIPLINES.filter((discipline) => discipline.professorId === targetUser.id),
        appointments  : appointments.length,
        solicitations : solicitations.length,
      };

      const professorData: ProfessorDetails = {
        ...professor,
        appointments      : appointments.length,
        solicitations     : solicitations.length,
        appointmentsList  : appointments,
        solicitationsList : solicitations,          
        role              : 'PROFESSOR',
      };

      return professorData;      
    } case "MANAGER": {

      const manager: RegisteredManager & { role: 'MANAGER' } = { 
        ...targetUser,
      };

      return manager;  
    } default: throw new Error('Invalid role');
  }
}

       