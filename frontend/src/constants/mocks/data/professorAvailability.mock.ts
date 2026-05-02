import type { ProfessorAvailability } from '@shared/types/professorAvailability.type'

export const PROFESSOR_AVAILABILITY: ProfessorAvailability[] = [
  { 
    id          : 1,
    professorId : 4,
    dayOfWeek   : 'MONDAY',
    endHour     : 1080,
    startHour   : 480,
  },
  { 
    id          : 2,
    professorId : 5,
    dayOfWeek   : 'TUESDAY',
    endHour     : 1080,
    startHour   : 480,
  },
  { 
    id          : 3,
    professorId : 4,
    dayOfWeek   : 'THURSDAY',
    endHour     : 1020,
    startHour   : 420,
  },
  { 
    id          : 4,
    professorId : 6,
    dayOfWeek   : 'SUNDAY',
    endHour     : 960,
    startHour   : 420,
  },
]