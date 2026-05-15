import { ManagerRegistersManagerFormData, ManagerRegistersProfessorFormData, ManagerRegistersStudentFormData } from "@shared/schemas/newUser.schema";
import { Student, Professor, Manager } from "../userBasicInfos.type";
import { StudentRegistersHimselfFormData } from "@shared/schemas/studentRegistersHimself.schema";

export type StudentRegistersHimselfRequest = Omit<StudentRegistersHimselfFormData, 'repeatPassword'>;
export type StudentRegistersHimselfResponse = Student & { role: 'STUDENT' };

export type ManagerRegistersStudentRequest   = Omit<ManagerRegistersStudentFormData, 'role'>;
export type ManagerRegistersProfessorRequest = Omit<ManagerRegistersProfessorFormData, 'role'>;
export type ManagerRegistersManagerRequest   = Omit<ManagerRegistersManagerFormData, 'role'>;

export type ManagersRegistersStudentResponse  = Pick<Student, 'name'   | 'ra' | 'email'>;
export type ManagerRegistersManagerResponse   = Pick<Manager, 'name'   | 'email'>;
export type ManagerRegistersProfessorResponse = Pick<Professor, 'name' | 'email' | 'disciplines'>;