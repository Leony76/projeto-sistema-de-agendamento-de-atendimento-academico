export const searchStudentsFilter = [
  { value: 'unselected'           , name: 'Filtro' },
  { value: 'AZnames'              , name: 'Nomes (A-Z)' },
  { value: 'ZAnames'              , name: 'Nomes (Z-A)' },
  { value: 'mostRecentsRegistered', name: 'Mais recentes' },
  { value: 'mostOldRegistered'    , name: 'Mais antigos' },
] as const;

export type SearchStudentsFilterValue = typeof searchStudentsFilter[number]['value'];