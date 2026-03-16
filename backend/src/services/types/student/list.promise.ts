import { StudentListDTO } from "../../../../types/dto/studentListDTO";

export type StudentsListPromise = {
  students: {
    list       : StudentListDTO[];
    totalCount : number;
    pages      : { total: number };
  };
};