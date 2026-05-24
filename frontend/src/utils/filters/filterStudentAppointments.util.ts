import type { STUDENT_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointments.map.filter";
import type { StudentAppointmentResponse as StudentAppointment } from '@shared/types/dtos/appointment.dto';
import { createFilter } from "./createFilter.util";
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";

export const filterStudentAppointments = (
  studentAppoitmentsData : StudentAppointment[],
  searchValue            : string,
  filterValue            : typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value'],
): StudentAppointment[] => {
  
  const getDisciplinesString = (disciplines: string[]) =>
    disciplines.join(', ');

  return createFilter(
    studentAppoitmentsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (appointment) => appointment.id.toString(),
        (appointment) => appointment.professor.name,
        (appointment) => appointment.reason,
        (appointment) => appointment.professor.disciplines.join(', '),
        (appointment) => appointment.room,
        (appointment) => appointment.status,
        (appointment) => formatDate(appointment.dateTime),
        (appointment) => formatTime(appointment.dateTime),
      ],

      sorts: {
         nextOnes: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        lastOnes: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),

        mostRecent: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        mostOld: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),

        AZProfessorName: (a, b) => a.professor.name.localeCompare(b.professor.name),
    
        ZAProfessorName: (a, b) => b.professor.name.localeCompare(a.professor.name), 

        AZDisciplines: (a, b) =>
          getDisciplinesString(a.professor.disciplines).localeCompare(
            getDisciplinesString(b.professor.disciplines)
          ,
        ),

        ZADisciplines: (a, b) =>
          getDisciplinesString(b.professor.disciplines).localeCompare(
            getDisciplinesString(a.professor.disciplines)
          ,
        ),

        AZrooms: (a, b) => a.room.localeCompare(b.room),
    
        ZArooms: (a, b) => b.room.localeCompare(a.room), 
      },
    }
  );
}