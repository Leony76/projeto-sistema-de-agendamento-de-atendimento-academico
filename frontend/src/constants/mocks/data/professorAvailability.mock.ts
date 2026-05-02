import type { ProfessorAvailability } from '@shared/types/professorAvailability.type'

export const PROFESSOR_AVAILABILITY: ProfessorAvailability[] = [
  { 
    id          : 1,
    professorId : 4,
    dayOfWeek   : 'MONDAY',
    startHour   : 780,
    endHour     : 1080,
  },
  { 
    id          : 2,
    professorId : 5,
    dayOfWeek   : 'TUESDAY',
    startHour   : 480,
    endHour     : 1080,
  },
  { 
    id          : 3,
    professorId : 4,
    dayOfWeek   : 'THURSDAY',
    startHour   : 420,
    endHour     : 1020,
  },
  { 
    id          : 4,
    professorId : 6,
    dayOfWeek   : 'SUNDAY',
    startHour   : 420,
    endHour     : 960,
  },
]