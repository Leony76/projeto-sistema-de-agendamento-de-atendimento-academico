import { ProfessorAvailability } from "../professorAvailability.type"

export type NewProfessorAvailabilityRequest  = ProfessorAvailability;
export type NewProfessorAvailabilityResponse = Omit<ProfessorAvailability, 'shift'>

export type ProfessorAvailabilityResponse = ProfessorAvailability;
