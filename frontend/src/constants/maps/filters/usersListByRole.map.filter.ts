export const USERS_LIST_BY_ROLE_FILTER_MAP = [
  { value: 'students'   , label: 'Alunos'      },
  { value: 'professors' , label: 'Professores' },
  { value: 'managers'   , label: 'Gestores'    },
] as const;

export const USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP = {
  students   : 'STUDENT',
  professors : 'PROFESSOR',
  managers   : 'MANAGER',
} as const;

export const USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP = {
  STUDENT   : 'students',
  PROFESSOR : 'professors',
  MANAGER   : 'managers',
} as const;

export const USERS_LIST_BY_ROLE_FILTER_VALUE_MAP =
  Object.fromEntries(
    USERS_LIST_BY_ROLE_FILTER_MAP.map((item) => [item.value, item.label]),
);