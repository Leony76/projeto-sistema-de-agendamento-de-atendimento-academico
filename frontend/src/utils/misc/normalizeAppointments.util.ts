export const normalizeAppointments = (appointments: string[]): Record<string, string[]> => {
  const map: Record<string, string[]> = {};

  appointments.forEach((iso) => {
    const date = new Date(iso);

    const dayKey = date.toISOString().split('T')[0];  
    const hour = String(date.getUTCHours()).padStart(2, '0') + ':' + String(date.getUTCMinutes()).padStart(2, '0');

    if (!map[dayKey]) map[dayKey] = [];
    
    map[dayKey].push(hour);
  });

  return map;
};