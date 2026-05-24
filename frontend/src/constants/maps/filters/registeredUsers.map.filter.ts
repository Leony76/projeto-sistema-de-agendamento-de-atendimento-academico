import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";

export const DEFAULT_REGISTERED_USER_FILTER_MAP = [
  { value: 'none'       , label: 'Nenhum'        },
  { value: 'mostRecent' , label: 'Mais recentes' },
  { value: 'mostOld'    , label: 'Mais antigos'  },
];

// -----> STUDENTS

export const REGISTERED_STUDENTS_FILTER_MAP = [
  { value: 'AZStudentName' , label: 'Alunos [A-Z]'  },
  { value: 'ZAStudentName' , label: 'Alunos [Z-A]'  },
  ...DEFAULT_REGISTERED_USER_FILTER_MAP,
] as const;

export const REGISTERED_STUDENTS_FILTER_VALUE_MAP =
  createFilterValueMap(REGISTERED_STUDENTS_FILTER_MAP);

// -----> PROFESSORS

export const REGISTERED_PROFESSORS_FILTER_MAP = [
  { value: 'AZProfessorName'  , label: 'Professores [A-Z]'   },
  { value: 'ZAProfessorName'  , label: 'Professores [Z-A]'   },
  { value: 'AZDisciplineName' , label: 'Disciplina  [A-Z]'   },
  { value: 'ZADisciplineName' , label: 'Disciplina  [Z-A]'   },
  ...DEFAULT_REGISTERED_USER_FILTER_MAP,
] as const;

export const REGISTERED_PROFESSORS_FILTER_VALUE_MAP =
  createFilterValueMap(REGISTERED_PROFESSORS_FILTER_MAP);

// MANAGERS

export const REGISTERED_MANAGERS_FILTER_MAP = [
  { value: 'AZManagerName' , label: 'Gestor [A-Z]' },
  { value: 'ZAManagerName' , label: 'Gestor [Z-A]' },
  ...DEFAULT_REGISTERED_USER_FILTER_MAP,
] as const;

export const REGISTERED_MANAGERS_FILTER_VALUE_MAP =
  createFilterValueMap(REGISTERED_MANAGERS_FILTER_MAP);