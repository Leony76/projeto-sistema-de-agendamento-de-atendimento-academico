export const professorsDisciplineOptions = [
  { value: 'NONE'       , name: 'Disciplina' },
  { value: 'PORTUGUESE' , name: 'Português'  },
  { value: 'MATH'       , name: 'Matemática' },
  { value: 'GEOGRAPHY'  , name: 'Geografia'  },
  { value: 'HISTORY'    , name: 'História'   },
  { value: 'BIOLOGY'    , name: 'Biologia'   },
  { value: 'LITERATURE' , name: 'Literatura' },
  { value: 'CHEMISTRY'  , name: 'Química'    },
] as const;

export type SearchStudentsFilterValue = typeof professorsDisciplineOptions[number]['value'];