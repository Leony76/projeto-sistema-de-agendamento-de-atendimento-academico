export const DISCIPLINES_MAP = {
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

export const DISCIPLINES = Object.keys(DISCIPLINES_MAP) as [keyof typeof DISCIPLINES_MAP, ...(keyof typeof DISCIPLINES_MAP)[]];