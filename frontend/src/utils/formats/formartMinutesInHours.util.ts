export const formatMinutesToTime = ( totalMinutes: number ) => {

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  return `${hh}:${mm}`;
};
