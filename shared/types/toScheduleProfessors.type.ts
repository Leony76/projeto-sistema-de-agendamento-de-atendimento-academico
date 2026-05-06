import { Discipline } from "./disciplines.type";
import { Professor } from "./professor.type";
import { ProfessorAvailability } from "./professorAvailability.type";

export type ToScheduleProfessors = Professor & {
  disciplines  : Discipline['name'][];
  availability : ProfessorAvailability[];
}