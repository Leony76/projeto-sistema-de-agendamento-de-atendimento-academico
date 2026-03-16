import { ProfessorListDTO } from "../../../../types/dto/professorListDTO";

export type ProfessorsListPromise = {
  professors: {
    list       : ProfessorListDTO[];
    totalCount : number;
    pages      : { total: number };
  };
};