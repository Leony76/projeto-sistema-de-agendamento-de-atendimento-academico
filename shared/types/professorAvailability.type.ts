import { AvailableDays } from "./availableDays.type";

export type Shift = 'MORNING' | 'AFTERNOON';

export type ShiftHours = {
  start : string; 
  end   : string; 
};

export type ProfessorAvailability = {
  dayOfWeek : AvailableDays;
  shift     : Record<Shift, ShiftHours>;
}