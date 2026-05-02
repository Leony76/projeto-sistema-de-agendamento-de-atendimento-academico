import { AvailableDays } from "./availableDays.type";

export type ProfessorAvailability = {
  readonly          id : number;
  readonly professorId : number;

  dayOfWeek : AvailableDays;
  startHour : number;
  endHour   : number;
}