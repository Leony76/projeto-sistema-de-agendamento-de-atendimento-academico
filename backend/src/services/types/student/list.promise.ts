import { StudentListDTO } from "../../../../types/dto/studentListDTO";

export type StudentsListPromise = {
  list       : StudentListDTO[];
  totalCount : number;
  totalPaginationCount : number;
};