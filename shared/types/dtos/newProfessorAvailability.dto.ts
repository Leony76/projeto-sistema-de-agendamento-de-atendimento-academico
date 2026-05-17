import { ProfessorAvailability } from "../professorAvailability.type"

export type NewProfessorAvailabilityRequest = 
  Omit<ProfessorAvailability, 'id' | 'professorId'>;

export type NewProfessorAvailabilityResponse = 
  Omit<ProfessorAvailability, 'id' | 'professorId'>
