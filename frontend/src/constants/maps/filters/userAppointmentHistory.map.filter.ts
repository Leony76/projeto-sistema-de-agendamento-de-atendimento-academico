import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";

export const APPOINTMENT_HISTORY_FILTER_MAP = [
  { value: 'mostRecent' , label: 'Mais recentes' },
  { value: 'mostOld'    , label: 'Mais antigos'  },
] as const;

// -----> STUDENT

export const STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professor [A-Z]'     },
  { value: 'ZAProfessorName'   , label: 'Professor [Z-A]'     },
  { value: 'AZDisciplines'     , label: 'Disciplinas [A-Z]'   },
  { value: 'ZADisciplines'     , label: 'Disciplinas [Z-A]'   },
  ...APPOINTMENT_HISTORY_FILTER_MAP,
] as const;


export const STUDENT_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP = 
  createFilterValueMap(STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP);

// -----> PROFESSOR

export const PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'        },
  { value: 'AZStudentName'     , label: 'Alunos [A-Z]'  },
  { value: 'ZAStudentName'     , label: 'Alunos [Z-A]'  },
  ...APPOINTMENT_HISTORY_FILTER_MAP,
] as const;

export const PROFESSOR_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP = 
  createFilterValueMap(PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP);
