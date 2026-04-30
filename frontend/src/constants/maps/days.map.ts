import type { AvailableDays } from "@shared/types/availableDays.type";

export const AVAILABLE_DAYS = [
  { value: 'SUNDAY'    , label: 'Domingo'       }, 
  { value: 'MONDAY'    , label: 'Segunda-Feira' },
  { value: 'TUESDAY'   , label: 'Terça-Feira'   },
  { value: 'WEDNESDAY' , label: 'Quarta-Feira'  },
  { value: 'THURSDAY'  , label: 'Quinta-Feira'  },
  { value: 'FRIDAY'    , label: 'Sexta-Feira'   },
  { value: 'SATURDAY'  , label: 'Sábado'        },
];

export const AVAILABLE_DAYS_MAP = Object.fromEntries(
  AVAILABLE_DAYS.map(item => [item.value, item.label])
) as {
  [K in typeof AVAILABLE_DAYS[number]['value']]: typeof AVAILABLE_DAYS[number]['label']
};

export const DAYS_BY_INDEX_MAP: Record<AvailableDays, number> = {
  SUNDAY    : 0,
  MONDAY    : 1,
  TUESDAY   : 2,
  WEDNESDAY : 3,
  THURSDAY  : 4,
  FRIDAY    : 5,
  SATURDAY  : 6,
};