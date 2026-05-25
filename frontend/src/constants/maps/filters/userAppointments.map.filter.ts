import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";

export const APPOINTMENTS_FILTER_MAP = [
  { value: 'none'       , label: 'Nenhum'         },
  { value: 'nextOnes'   , label: 'Próximos'       },
  { value: 'lastOnes'   , label: 'Últimos'        },
  { value: 'mostRecent' , label: 'Mais recentes'  },
  { value: 'mostOld'    , label: 'Menos recentes' },
  { value: 'AZrooms'    , label: 'Salas [A-Z]'    },
  { value: 'ZArooms'    , label: 'Salas [Z-A]'    },
] as const;

// -----> STUDENT

export const STUDENT_APPOINTMENTS_FILTER_MAP = [
  ...APPOINTMENTS_FILTER_MAP,
  { value: 'AZProfessorName' , label: 'Professor [A-Z]'   },
  { value: 'ZAProfessorName' , label: 'Professor [Z-A]'   },
  { value: 'AZDisciplines'   , label: 'Disciplinas [A-Z]' },
  { value: 'ZADisciplines'   , label: 'Disciplinas [Z-A]' },
] as const;

export const STUDENT_APPOINTMENTS_FILTER_VALUE_MAP = 
  createFilterValueMap(STUDENT_APPOINTMENTS_FILTER_MAP);

// -----> PROFESSOR

export const PROFESSOR_APPOINTMENTS_FILTER_MAP = [
  ...APPOINTMENTS_FILTER_MAP,
  { value: 'AZStudentName'   , label: 'Aluno [A-Z]' },
  { value: 'ZAStudentName'   , label: 'Aluno [Z-A]' },
] as const;

export const PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP =
  createFilterValueMap(PROFESSOR_APPOINTMENTS_FILTER_MAP);
