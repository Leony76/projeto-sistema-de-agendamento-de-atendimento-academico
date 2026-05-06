export const generateTimeSlots = (
  start : number, 
  end   : number, 
  step = 30,
) => {
  const slots: string[] = [];

  const LUNCH_START = 720; 
  const LUNCH_END   = 780; 

  for (let i = start; i < end; i += step) {

    if (i >= LUNCH_START && i < LUNCH_END) continue;

    const h = Math.floor(i / 60).toString().padStart(2, '0');
    const m = (i % 60).toString().padStart(2, '0');

    slots.push(`${h}:${m}`);
  }

  return slots;
};