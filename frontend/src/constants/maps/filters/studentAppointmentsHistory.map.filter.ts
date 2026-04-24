export const STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professor [A-Z]'     },
  { value: 'ZAProfessorName'   , label: 'Professor [Z-A]'     },
  { value: 'AZDisciplines'     , label: 'Disciplinas [A-Z]'   },
  { value: 'ZADisciplines'     , label: 'Disciplinas [Z-A]'   },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
] as const;


export const STUDENT_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP = 
  Object.fromEntries(
    STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP.map((item) => [item.value, item.label]),
);
