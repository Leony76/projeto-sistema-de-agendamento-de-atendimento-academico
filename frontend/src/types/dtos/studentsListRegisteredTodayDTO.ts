import { StudentListDTO } from "./studentListDTO";

export type StudentListRegisteredTodayDTO = Omit<StudentListDTO, 'registeredAt'>;