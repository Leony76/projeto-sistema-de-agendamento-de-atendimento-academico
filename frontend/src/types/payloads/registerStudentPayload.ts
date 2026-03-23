import { StudentListDTO } from "../dtos/studentListDTO";

export type RegisterStudentPayload = Omit<StudentListDTO, 'registeredAt'>;