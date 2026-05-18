export const hoursToIntMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);

  if (
    hours === undefined ||
    minutes === undefined ||
    isNaN(hours) ||
    isNaN(minutes)
  ) {
    return NaN;
  }

  return (hours * 60) + minutes;
};