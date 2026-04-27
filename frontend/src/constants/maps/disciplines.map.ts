export const DISCIPLINES_MAP = [
  { value: 'ARTS'       , label: 'Artes'      },
  { value: 'BIOLOGY'    , label: 'Biologia'   },
  { value: 'CHEMISTRY'  , label: 'Química'    },
  { value: 'GEOGRAPHY'  , label: 'Geografia'  },
  { value: 'HISTORY'    , label: 'História'   },
  { value: 'LITERATURE' , label: 'Literatura' },
  { value: 'MATH'       , label: 'Matemática' },
  { value: 'PHYSICS'    , label: 'Física'     },
  { value: 'PORTUGUESE' , label: 'Português'  },
  { value: 'ENGLISH'    , label: 'Inglês'     },
] as const;

export const DISCIPLINES_VALUE_MAP = {
  ARTS       : 'Artes'      ,
  BIOLOGY    : 'Biologia'   ,
  CHEMISTRY  : 'Química'    ,
  GEOGRAPHY  : 'Geografia'  ,
  HISTORY    : 'História'   ,
  LITERATURE : 'Literatura' ,
  MATH       : 'Matemática' ,
  PHYSICS    : 'Física'     ,
  PORTUGUESE : 'Português'  ,
  ENGLISH    : 'Inglês'     ,
} as const;

export const DISCIPLINES = Object.keys(DISCIPLINES_VALUE_MAP) as [keyof typeof DISCIPLINES_VALUE_MAP, ...(keyof typeof DISCIPLINES_VALUE_MAP)[]];