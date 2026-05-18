export const formatHoursToMinutes = (timeString: string): number => {

  if (!timeString.includes(':')) return NaN;

  const [hours, minutes] = timeString.split(':').map(Number);

  return (hours * 60) + minutes;
}

export const formatHoursToStringMinutes = (timeString: string): string => {

  if (!timeString.includes(':')) return 'Inválido';

  const [hours, minutes] = timeString.split(':').map(Number);

  return String((hours * 60) + minutes);
}