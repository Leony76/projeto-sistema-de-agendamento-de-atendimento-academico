export const STUDENT_APPOINTMENTS_FILTER_MAP = [
  { value: 'none'            , label: 'Nenhum'          },
  { value: 'mostRecent'      , label: 'Mais recentes'   },
  { value: 'mostOld'         , label: 'Mais antigos'    },
  { value: 'nextOnes'        , label: 'Próximos'        },
  { value: 'lastOnes'        , label: 'Últimos'         },
  { value: 'AZProfessorName' , label: 'Professor [A-Z]' },
  { value: 'ZAProfessorName' , label: 'Professor [Z-A]' },
  { value: 'confirmed'       , label: 'Confirmados'     },
  { value: 'unconfirmed'     , label: 'Não confirmados' },
] as const;

export const STUDENT_APPOINTMENTS_FILTER_VALUE_MAP = 
  Object.fromEntries(
    STUDENT_APPOINTMENTS_FILTER_MAP.map((item) => [item.value, item.label])
);
