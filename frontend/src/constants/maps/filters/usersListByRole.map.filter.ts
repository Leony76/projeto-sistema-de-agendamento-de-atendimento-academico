import { createFilterValueMap } from "@frontend/utils/filters/createFilterValueMap.util";
import { createReverseFilterValueMap } from "@frontend/utils/filters/createReverseFilterValueMap.util";

export const USERS_LIST_BY_ROLE_FILTER_MAP = [
  { value: 'students'   , label: 'Alunos'      },
  { value: 'professors' , label: 'Professores' },
  { value: 'managers'   , label: 'Gestores'    },
] as const;

export const USERS_LIST_BY_ROLE_FILTER_VALUE_MAP =
  createFilterValueMap(USERS_LIST_BY_ROLE_FILTER_MAP);

export const USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP = {
  students   : 'STUDENT',
  professors : 'PROFESSOR',
  managers   : 'MANAGER',
} as const;

export const USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP = 
  createReverseFilterValueMap(USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP);
