import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";

export const DEFAULT_SOLICITATIONS_FILTER_VALUES_MAP = [
  { value: 'nextOnes'   , label: 'Próximos'        },
  { value: 'lastOnes'   , label: 'Últimos'         },
  { value: 'mostRecent' , label: 'Mais recentes'   },
  { value: 'mostOld'    , label: 'Menos recentes'  },
  { value: 'accepted'   , label: 'Aceitos'         },
  { value: 'pending'    , label: 'Pendentes'       },
  { value: 'rejected'   , label: 'Rejeitados'      },
];

// -----> STUDENT

export const STUDENT_SOLICITATIONS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professor [A-Z]'     },
  { value: 'ZAProfessorName'   , label: 'Professor [Z-A]'     },
  { value: 'AZDisciplines'     , label: 'Disciplinas [A-Z]'   },
  { value: 'ZADisciplines'     , label: 'Disciplinas [Z-A]'   },
  ...DEFAULT_SOLICITATIONS_FILTER_VALUES_MAP,
] as const;

export const STUDENT_SOLICITATIONS_FILTER_VALUE_MAP = 
  createFilterValueMap(STUDENT_SOLICITATIONS_FILTER_MAP);

// -----> PROFESSOR

export const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZStudentName'     , label: 'Aluno [A-Z]'         },
  { value: 'ZAStudentName'     , label: 'Aluno [Z-A]'         },
  ...DEFAULT_SOLICITATIONS_FILTER_VALUES_MAP,
] as const;

export const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP =
  createFilterValueMap(STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP);