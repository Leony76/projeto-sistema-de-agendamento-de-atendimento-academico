import { AvailableDays } from "../availableDays.type";
import { Professor } from "../userBasicInfos.type";

export type AvailableProfessorToScheduleResponse = Professor & {
  availableDays: AvailableDays[];
};
