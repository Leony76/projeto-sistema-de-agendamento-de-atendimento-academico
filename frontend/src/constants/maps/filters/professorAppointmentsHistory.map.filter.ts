export const PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'        },
  { value: 'AZStudentName'     , label: 'Alunos [A-Z]'  },
  { value: 'ZAStudentName'     , label: 'Alunos [Z-A]'  },
  { value: 'mostRecent'        , label: 'Mais recentes' },
  { value: 'mostOld'           , label: 'Mais antigos'  },
] as const;

export const PROFESSOR_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP = 
  Object.fromEntries(
    PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP.map((item) => [item.value, item.label]),
);
