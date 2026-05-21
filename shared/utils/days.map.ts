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

export const DAYS_TO_INDEX_MAP: Record<AvailableDays, number> = {
  MONDAY    : 1,
  TUESDAY   : 2,
  WEDNESDAY : 3,
  THURSDAY  : 4,
  FRIDAY    : 5,
  SATURDAY  : 6,
};

export const DAYS_BY_INDEX_MAP: Record<number, AvailableDays> = {
  1 : 'MONDAY'    ,
  2 : 'TUESDAY'   ,
  3 : 'WEDNESDAY' ,
  4 : 'THURSDAY'  ,
  5 : 'FRIDAY'    ,
  6 : 'SATURDAY'  ,
};