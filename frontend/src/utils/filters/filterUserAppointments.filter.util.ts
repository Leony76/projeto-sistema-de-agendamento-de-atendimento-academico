import type { PROFESSOR_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointments.map.filter";
import type { ProfessorAppointmentResponse as ProfessorAppointment } from "@shared/types/dtos/appointment.dto";
import { createFilter } from "./createFilter.util";
import type { STUDENT_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointments.map.filter";
import type { StudentAppointmentResponse as StudentAppointment } from '@shared/types/dtos/appointment.dto';
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";

// -----> STUDENT

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
        (appointment) => formatDate(appointment.updatedAt),
        (appointment) => formatTime(appointment.updatedAt),
      ],

      sorts: {
        nextOnes: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(), 

        lastOnes: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        mostRecent: (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime(),

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

        AZrooms: (a, b) => 
          (a.room ?? '').localeCompare(b.room ?? ''),
    
        ZArooms: (a, b) => 
          (b.room ?? '').localeCompare(a.room ?? ''), 
      },
    }
  );
}

// -----> PROFESSOR

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
        (appointment) => appointment.status,
        (appointment) => formatDate(appointment.dateTime),
        (appointment) => formatTime(appointment.dateTime),
        (appointment) => formatDate(appointment.updatedAt),
        (appointment) => formatTime(appointment.updatedAt),
      ],

      sorts: {
        nextOnes: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(), 

        lastOnes: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        mostRecent: (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime(),

        AZStudentName: (a, b) =>
          a.student.name.localeCompare(b.student.name),

        ZAStudentName: (a, b) =>
          b.student.name.localeCompare(a.student.name),     
        
        AZrooms: (a, b) => 
          (a.room ?? '').localeCompare(b.room ?? ''),
    
        ZArooms: (a, b) => 
          (b.room ?? '').localeCompare(a.room ?? ''), 
      }
    }
  )
}