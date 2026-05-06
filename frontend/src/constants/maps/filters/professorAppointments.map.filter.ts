export const PROFESSOR_APPOINTMENTS_FILTER_MAP = [
  { value: 'none'            , label: 'Nenhum'          },
  { value: 'mostRecent'      , label: 'Mais recentes'   },
  { value: 'mostOld'         , label: 'Mais antigos'    },
  { value: 'nextOnes'        , label: 'Próximos'        },
  { value: 'lastOnes'        , label: 'Últimos'         },
  { value: 'AZStudentName'   , label: 'Aluno [A-Z]'     },
  { value: 'ZAStudentName'   , label: 'Aluno [Z-A]'     },
] as const;

export const PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP =
  Object.fromEntries(
    PROFESSOR_APPOINTMENTS_FILTER_MAP.map((item) => [item.value, item.label])
);
