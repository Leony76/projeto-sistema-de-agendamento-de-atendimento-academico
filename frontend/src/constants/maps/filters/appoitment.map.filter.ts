export const APPOINTMENT_FILTER_MAP = [
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

export const APPOINTMENT_FILTER_VALUE_MAP = {
  none            : 'Nenhum'         ,
  mostRecent      : 'Mais recentes'  ,
  mostOld         : 'Mais antigos'   ,
  nextOnes        : 'Próximos'       ,
  lastOnes        : 'Últimos'        ,
  AZProfessorName : 'Professor [A-Z]',
  ZAProfessorName : 'Professor [Z-A]',
  confirmed       : 'Confirmados'    ,
  unconfirmed     : 'Não confirmados',
} as const;
