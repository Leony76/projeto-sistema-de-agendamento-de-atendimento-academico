import type { AvailableDays } from "@shared/types/availableDays.type";

export const AVAILABLE_DAYS = [
  { value: 'MONDAY'    , label: 'Segunda-Feira' },
  { value: 'TUESDAY'   , label: 'Terça-Feira'   },
  { value: 'WEDNESDAY' , label: 'Quarta-Feira'  },
  { value: 'THURSDAY'  , label: 'Quinta-Feira'  },
  { value: 'FRIDAY'    , label: 'Sexta-Feira'   },
  { value: 'SATURDAY'  , label: 'Sábado'        },
] as const;

export const AVAILABLE_DAYS_MAP = {
  MONDAY     : 'Segunda-feira',
  TUESDAY    : 'Terça-feira',
  WEDNESDAY  : 'Quarta-feira', 
  THURSDAY   : 'Quinta-feira',
  FRIDAY     : 'Sexta-feira',
  SATURDAY   : 'Sábado',
} as const;

export const DAYS_BY_INDEX_MAP: Record<AvailableDays, number> = {
  MONDAY    : 0,
  TUESDAY   : 1,
  WEDNESDAY : 2,
  THURSDAY  : 3,
  FRIDAY    : 4,
  SATURDAY  : 5,
};