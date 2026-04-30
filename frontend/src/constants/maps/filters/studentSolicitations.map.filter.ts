export const STUDENT_SOLICITATIONS_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZProfessorName'   , label: 'Professor [A-Z]'     },
  { value: 'ZAProfessorName'   , label: 'Professor [Z-A]'     },
  { value: 'AZDisciplines'     , label: 'Disciplinas [A-Z]'   },
  { value: 'ZADisciplines'     , label: 'Disciplinas [Z-A]'   },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
  { value: 'confirmed'         , label: 'Confirmados'         },
  { value: 'unconfirmed'       , label: 'Não confirmados'     },
  { value: 'canceled'          , label: 'Cancelados'          },
] as const;

export const STUDENT_SOLICITATIONS_FILTER_VALUE_MAP = 
  Object.fromEntries(
    STUDENT_SOLICITATIONS_FILTER_MAP.map((item) => [item.value, item.label]),
);

export const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP = [
  { value: 'none'              , label: 'Nenhum'              },
  { value: 'AZStudentName'     , label: 'Aluno [A-Z]'         },
  { value: 'ZAStudentName'     , label: 'Aluno [Z-A]'         },
  { value: 'mostRecent'        , label: 'Mais recentes'       },
  { value: 'mostOld'           , label: 'Mais antigos'        },
  { value: 'confirmed'         , label: 'Confirmados'         },
  { value: 'unconfirmed'       , label: 'Não confirmados'     },
  { value: 'canceled'          , label: 'Cancelados'          },
] as const;

export const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP =
  Object.fromEntries(
    STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP.map((item) => [item.value, item.label]),
);