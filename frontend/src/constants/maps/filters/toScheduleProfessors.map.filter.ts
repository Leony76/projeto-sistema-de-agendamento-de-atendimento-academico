import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";

export const TO_SCHEDULE_PROFESSORS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professor [A-Z]'     },
  { value: 'ZAProfessorName'   , label: 'Professor [Z-A]'     },
  { value: 'AZDisciplines'     , label: 'Disciplinas [A-Z]'   },
  { value: 'ZADisciplines'     , label: 'Disciplinas [Z-A]'   },
  { value: 'includesMonday'    , label: 'Disp. segunda-feira' },
  { value: 'includesTuesday'   , label: 'Disp. terça-feira'   },
  { value: 'includesWednesday' , label: 'Disp. quarta-feira'  },
  { value: 'includesThursday'  , label: 'Disp. quinta-feira'  },
  { value: 'includesFriday'    , label: 'Disp. sexta-feira'   },
  { value: 'includesSaturday'  , label: 'Disp. sábado'        },
] as const;

export const TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP = 
  createFilterValueMap(TO_SCHEDULE_PROFESSORS_FILTER_MAP);
