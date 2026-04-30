import type { AvailableHours } from "./availableHours.type";
import type { AvailableDays } from "./availableDays.type";
import type { Discipline } from "./disciplines.type";

export type Professor = {
  readonly id : number;
  name        : string;
  photo       : string;
  discipline  : Discipline;
  available   : {
    days  : AvailableDays[];
    hours : AvailableHours[];
  };
};