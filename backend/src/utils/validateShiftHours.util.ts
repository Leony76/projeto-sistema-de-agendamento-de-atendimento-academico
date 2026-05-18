import type { ShiftHours } from "@shared/types/professorAvailability.type";

export const validateShiftHours = (
  shift: ShiftHours,
  shiftName: 'manhã' | 'tarde',
): string | null => {

  const { start, end } = shift;

  if (!start.trim() && !end.trim()) {
    return null;
  }

  if (!start.trim() || !end.trim()) {
    return `Preencha início e fim do turno ${shiftName}`;
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(start)) {
    return `Horário inicial inválido no turno ${shiftName}`;
  }

  if (!timeRegex.test(end)) {
    return `Horário final inválido no turno ${shiftName}`;
  }

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  const startInMinutes = (startHour * 60) + startMinute;
  const endInMinutes = (endHour * 60) + endMinute;

  if (startInMinutes === endInMinutes) {
    return `O início e fim do turno ${shiftName} não podem ser iguais`;
  }

  if (startInMinutes > endInMinutes) {
    return `O início do turno ${shiftName} não pode ser maior que o fim`;
  }

  return null;
};