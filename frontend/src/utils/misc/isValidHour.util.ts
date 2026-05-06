import type { Hours } from "@frontend/components/section/EditProfessorAvailability";
import { formatHoursToMinutes } from "../formats/formatHoursInMinutes.util";

const isValidTimeString = (time: string): boolean => {
  if (!time) return false;

  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23) return false;
  if (minutes < 0 || minutes > 59) return false;

  return true;
};

export const isValidHours = (hours: Hours | null): boolean => {
  if (!hours) return false;

  if (!isValidTimeString(hours.start)) return false;
  if (!isValidTimeString(hours.end)) return false;

  const start = formatHoursToMinutes(hours.start);
  const end   = formatHoursToMinutes(hours.end);

  return start < end;
};