import type { PROFESSOR_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointments.map.filter";
import type { ProfessorAppointmentResponse as ProfessorAppointment } from "@shared/types/dtos/appointment.dto";
import { createFilter } from "./createFilter.util";

export const filterProfessorAppointments = (
  professorAppoitmentsData : ProfessorAppointment[],
  searchValue              : string,
  filterValue              : typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'],
): ProfessorAppointment[] => {
  
  return createFilter(
    professorAppoitmentsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (appointment) => appointment.student.name,
        (appointment) => appointment.reason,
        (appointment) => appointment.room,
        (appointment) => appointment.dateTime,
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.dateTime).getTime() 
          -
          new Date(a.dateTime).getTime(),

        mostOld: (a, b) =>
          new Date(a.dateTime).getTime() 
          -
          new Date(b.dateTime).getTime(),

        AZStudentName: (a, b) =>
          a.student.name.localeCompare(b.student.name),

        ZAStudentName: (a, b) =>
          b.student.name.localeCompare(a.student.name),      
      }
    }
  )
}