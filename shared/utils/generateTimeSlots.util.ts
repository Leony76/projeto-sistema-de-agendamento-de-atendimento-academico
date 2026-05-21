export const generateTimeSlots = (
  startMinutes : number,
  endMinutes   : number,
  interval = 30,
): string[] => {

  const slots: string[] = [];

  for (
    let current = startMinutes;
    current < endMinutes;
    current += interval
  ) {

    const hours = Math.floor(current / 60);
    const minutes = current % 60;

    slots.push(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    );
  }

  return slots;
};
