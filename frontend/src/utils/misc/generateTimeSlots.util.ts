export const generateTimeSlots = (start: number, end: number, step = 30) => {
  const slots: string[] = [];

  for (let i = start; i < end; i += step) {
    const h = Math.floor(i / 60).toString().padStart(2, '0');
    const m = (i % 60).toString().padStart(2, '0');

    slots.push(`${h}:${m}`);
  }

  return slots;
};