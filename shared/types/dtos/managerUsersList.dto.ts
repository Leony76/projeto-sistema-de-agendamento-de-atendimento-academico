import { Manager } from "../manager.type";
import { Professor } from "../professor.type";
import { Student } from "../student.type";


export type ActiveManagersToManagerListResponse   = Manager;
export type ActiveStudentsToManagerListResponse   = Student;
export type ActiveProfessorsToManagerListResponse = Professor;

export type ActiveManagersToManagerList   = Manager;
export type ActiveStudentsToManagerList   = Student;
export type ActiveProfessorsToManagerList = Professor;