import { StudentListDTO } from "../../../../@types/dto/studentListDTO";

export type ListPromise = {
  studentsList: StudentListDTO[];
  total: number;
  totalPages: number;
}