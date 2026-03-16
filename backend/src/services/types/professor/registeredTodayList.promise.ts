import { ProfessorListDTO } from "../../../../types/dto/professorListDTO";

export type ProfessorsRegisteredTodayListPromise = {
  professors: {
    list       : ProfessorListDTO[];
    totalCount : number;
    pages      : { total: number };
  };
};