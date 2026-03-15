export const searchProfessorsFilter = [
  { value: 'unselected'                , name: 'Filtro' },
  { value: 'AZnames'                   , name: 'Nomes (A-Z)' },
  { value: 'ZAnames'                   , name: 'Nomes (Z-A)' },
  { value: 'mostRecentsRegistered'     , name: 'Mais recentes' },
  { value: 'mostOldRegistered'         , name: 'Mais antigos' },
  { value: 'mostScheduledAppointments' , name: 'Mais Agendamentos'},
  { value: 'mostAppointmentsDone'      , name: 'Mais Atendimentos feitos'},
] as const;

export type SearchProfessorsFilterValue = typeof searchProfessorsFilter[number]['value'];