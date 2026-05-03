import type { Hours } from "@frontend/components/section/EditProfessorAvailability";
import { formatHoursToMinutes } from "../formats/formatHoursInMinutes.util";

export const normalizeShifts = (
  morning   : Hours | null,
  afternoon : Hours | null
) => {
  const morningEnd = morning ? formatHoursToMinutes(morning.end) : null;
  const afternoonStart = afternoon ? formatHoursToMinutes(afternoon.start) : null;

  if (morningEnd !== null && morningEnd < 720) {
    return {
      morning,
      afternoon: null
    };
  }

  if (afternoonStart !== null && afternoonStart >= 720) {
    return {
      morning: null,
      afternoon
    };
  }

  return { morning, afternoon };
};