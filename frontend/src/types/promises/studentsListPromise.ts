import { StudentListDTO } from "../dtos/studentListDTO";

export type StudentListPromise = {
  students: {
    list       : StudentListDTO[];
    totalCount : number;
    pages      : { total: number };
  };
};