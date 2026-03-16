export const PROFESSOR_DISCIPLINES_MAP = {
  PORTUGUESE : 'Português',
  MATH       : 'Matemática',
  GEOGRAPHY  : 'Geografia',
  HISTORY    : 'História',
  BIOLOGY    : 'Biologia',
  LITERATURE : 'Literatura',
  CHEMISTRY  : 'Química',
} as const;

export type ProfessorDisciplinesMap = [keyof typeof PROFESSOR_DISCIPLINES_MAP]['0'];