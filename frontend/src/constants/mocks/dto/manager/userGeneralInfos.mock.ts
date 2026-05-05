import type { UserDetails } from "@shared/types/userDetails.type";
import { USERS } from "../../data/users.mock";
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from "@shared/types/registeredUsers.type";
import { APPOINTMENTS_DATA } from "../../data/appointments.mock";
import { SOLICITATIONS_DATA } from "../../data/solicitations.mock";
import type { Appointment, StudentAppointment } from "@shared/types/appointment.type";
import type { Solicitation } from "@shared/types/solicitation.type";
import { DISCIPLINES } from "../../data/disciplines.mock";

const userGeneralInfos = (id:number): UserDetails => {

  const targetUser = USERS.find((user) => user.id === id);

  switch (targetUser?.role) {
    case "STUDENT": {
      
      const appointments: Appointment[] = APPOINTMENTS_DATA.filter((appointment) => appointment.studentId === targetUser.id);
      const solicitation: Solicitation[] = SOLICITATIONS_DATA.filter((solicitation) => solicitation.studentId === targetUser.id);

      const student: RegisteredStudent = { 
        ...targetUser,
        appointments  : appointments.length,
        solicitations : solicitation.length,
      };

      return {
        student,
        appointmentsList: appointments,
        solicitationsList: solicitation,
      };  

    } case "PROFESSOR": {

      const appointments: Appointment[] = APPOINTMENTS_DATA.filter((appointment) => appointment.professorId === targetUser.id);
      const solicitation: Solicitation[] = SOLICITATIONS_DATA.filter((solicitation) => solicitation.professorId === targetUser.id);

      const professor: RegisteredProfessor = { 
        ...targetUser,
        disciplines   : DISCIPLINES.filter((discipline) => discipline.professorId === targetUser.id),
        appointments  : appointments.length,
        solicitations : solicitation.length,
      };

      return {
        professor,
        appointments,
        solicitation,
      };  
    } case "MANAGER": {

      const manager: RegisteredManager = { ...targetUser };

      return manager;  
    } default: throw new Error('Invalid role');
  }
}

       