import { ProfessorDisciplinesMap } from "../../maps/professorDisciplinesMap";

export type ProfessorListDTO = {
  id           : number;  
  name         : string;
  email        : string;
  discipline   : ProfessorDisciplinesMap;
  registeredAt : string;
}