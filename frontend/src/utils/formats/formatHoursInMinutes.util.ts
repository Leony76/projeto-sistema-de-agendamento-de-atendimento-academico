export const formatHoursToMinutes = (timeString: string): number => {

  if (!timeString.includes(':')) return NaN;

  const [hours, minutes] = timeString.split(':').map(Number);

  return (hours * 60) + minutes;
}