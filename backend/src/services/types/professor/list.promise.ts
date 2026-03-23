import { ProfessorListDTO } from "../../../../types/dto/professorListDTO";

export type ProfessorsListPromise = {
  list       : ProfessorListDTO[];
  totalCount : number;
  totalPaginationCount : number;
};