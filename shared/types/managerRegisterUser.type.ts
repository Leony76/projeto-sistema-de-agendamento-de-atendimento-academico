import { NewUserFormData } from "@frontend/schemas/newUser.schema";
import { RegisterStudent, RegisterManager, RegisterProfessor } from "./registerUser.type";

export type ManagerRegisterStudent = Omit<RegisterStudent, 'password'>;

export type ManagerRegisterManager = Omit<RegisterManager, 'password'>;

export type ManagerRegisterProfessor = Omit<RegisterProfessor, 'password' | 'disciplines'> & {  
  disciplines: string[]
};

export type ManagerRegisterUser = NewUserFormData;