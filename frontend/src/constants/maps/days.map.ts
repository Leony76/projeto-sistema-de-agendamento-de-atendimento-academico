import type { AvailableDays } from "@/types/availableDays.type";

export const AVAILABLE_DAYS_MAP = {
  SUNDAY    : 'Domingo',
  MONDAY    : 'Segunda-Feira',
  TUESDAY   : 'Terça-Feira',
  WEDNESDAY : 'Quarta-Feira',
  THURSDAY  : 'Quinta-Feira',
  FRIDAY    : 'Sexta-Feira',
  SATURDAY  : 'Sábado',
} as const;

export const DAYS_BY_INDEX_MAP: Record<AvailableDays, number> = {
  SUNDAY    : 0,
  MONDAY    : 1,
  TUESDAY   : 2,
  WEDNESDAY : 3,
  THURSDAY  : 4,
  FRIDAY    : 5,
  SATURDAY  : 6,
};