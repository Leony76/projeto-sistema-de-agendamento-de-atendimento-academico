import { StudentListDTO } from "../dtos/studentListDTO";

export type StudentListPromise = {
  studentsList: StudentListDTO[], 
  total: number,
  totalPages: number,
};