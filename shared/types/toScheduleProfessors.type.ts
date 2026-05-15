import { Discipline } from "./disciplines.type";
import { ProfessorAvailability } from "./professorAvailability.type";
import { Professor } from "./userBasicInfos.type";

export type ToScheduleProfessors = Professor & {
  disciplines  : Discipline['name'][];
  availability : ProfessorAvailability[];
}