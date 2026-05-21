import type { AvailableDay, Shift } from "@backend/generated/prisma/enums";
import type { AvailableProfessorToScheduleResponse } from "@shared/types/dtos/availableProfessorToSchedule";

export type ProfessorAvailability = {
  dayOfWeek : AvailableDay;
  shift     : Shift;
  startTime : number;
  endTime   : number;
};

export type AvailableProfessor = {
  user: {
    id         : number;
    name       : string;
    email      : string;
    photo      : string | null;
    createdAt  : Date;
  };
  disciplines: {
    name: string;
  }[];
  availability: ProfessorAvailability[];
};



export const availableProfessorToScheduleMapper = (
  professor: AvailableProfessor
): AvailableProfessorToScheduleResponse => {

  return {
    id           : professor.user.id,
    name         : professor.user.name,
    email        : professor.user.email,
    photo        : professor.user.photo,
    registeredAt : professor.user.createdAt.toISOString(),

    disciplines:
      professor.disciplines.map(
        (discipline) => discipline.name
      ),

    availableDays: [...new Set(professor.availability.map((day) => day.dayOfWeek))],
  };
};

