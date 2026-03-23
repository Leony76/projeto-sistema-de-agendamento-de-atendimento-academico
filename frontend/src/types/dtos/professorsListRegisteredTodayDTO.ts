import { ProfessorListDTO } from "./professorListDTO";

export type ProfessorsListRegisteredTodayDTO = Omit<ProfessorListDTO, 'registeredAt'>;