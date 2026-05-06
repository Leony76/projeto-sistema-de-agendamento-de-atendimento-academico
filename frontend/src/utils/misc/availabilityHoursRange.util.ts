import { formatMinutesToTime } from "../formats/formartMinutesInHours.util";

export const availabilityHoursRange = (
  startHour: number | undefined, 
  endHour: number | undefined,
) => {
  const NOON_IN_MINUTES = 720;

  const hasAvailability =
    startHour != null && endHour != null;

  if (!hasAvailability) {
    return {
      morning   : 'Não disponível',
      afternoon : 'Não disponível',
    };
  }

  let morning = 'Não disponível';
  let afternoon = 'Não disponível';

  if (startHour < NOON_IN_MINUTES && endHour > NOON_IN_MINUTES) {
    morning = `${formatMinutesToTime(startHour)} às 11:30`;
  } else if (startHour < NOON_IN_MINUTES && endHour <= NOON_IN_MINUTES) {
    morning = `${formatMinutesToTime(startHour)} às ${formatMinutesToTime(endHour)}`;
  }

  if (startHour < NOON_IN_MINUTES && endHour > NOON_IN_MINUTES) {
    afternoon = `13:00 às ${formatMinutesToTime(endHour)}`;
  } else if (startHour >= NOON_IN_MINUTES && endHour > NOON_IN_MINUTES) {
    afternoon = `${formatMinutesToTime(startHour)} às 18:00`;
  }

  return { morning, afternoon };
};