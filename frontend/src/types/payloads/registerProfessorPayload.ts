import { ProfessorListDTO } from "../dtos/professorListDTO";

export type RegisterProfessorPayload = Omit<ProfessorListDTO, 'registeredAt' | 'id'>;