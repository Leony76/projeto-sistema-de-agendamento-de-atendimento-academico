import { ProfessorListDTO } from "./professorListDTO";

export type ProfessorsRegisteredTodayDTO = Omit<ProfessorListDTO, 'registeredAt'>;