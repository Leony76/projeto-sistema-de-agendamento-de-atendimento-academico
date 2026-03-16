import { ProfessorListDTO } from "../dtos/professorListDTO";

export type ProfessorsListPromise = {
  professors: {
    list       : ProfessorListDTO[];
    totalCount : number;
    pages      : { total: number };
  };
};