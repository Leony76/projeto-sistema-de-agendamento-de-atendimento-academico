export const REGISTERED_STUDENTS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZStudentName'     , label: 'Alunos [A-Z]'        },
  { value: 'ZAStudentName'     , label: 'Alunos [Z-A]'        },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
] as const;

export const REGISTERED_STUDENTS_FILTER_VALUE_MAP =
  Object.fromEntries(
    REGISTERED_STUDENTS_FILTER_MAP.map((item) => [item.value, item.label]),
);

export const REGISTERED_PROFESSORS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professores [A-Z]'   },
  { value: 'ZAProfessorName'   , label: 'Professores [Z-A]'   },
  { value: 'AZDisciplineName'  , label: 'Disciplina  [A-Z]'   },
  { value: 'ZADisciplineName'  , label: 'Disciplina  [Z-A]'   },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
] as const;

export const REGISTERED_PROFESSORS_FILTER_VALUE_MAP =
  Object.fromEntries(
    REGISTERED_STUDENTS_FILTER_MAP.map((item) => [item.value, item.label]),
);

export const REGISTERED_MANAGERS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZManagerName'     , label: 'Gestor [A-Z]'        },
  { value: 'ZAManagerName'     , label: 'Gestor [Z-A]'        },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
] as const;

export const REGISTERED_MANAGERS_FILTER_VALUE_MAP =
  Object.fromEntries(
    REGISTERED_STUDENTS_FILTER_MAP.map((item) => [item.value, item.label]),
);