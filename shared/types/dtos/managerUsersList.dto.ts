import { Student, Professor, Manager } from "../userBasicInfos.type";


export type ActiveManagersToManagerListResponse   = Manager;
export type ActiveStudentsToManagerListResponse   = Student;
export type ActiveProfessorsToManagerListResponse = Professor;

export type ActiveManagersToManagerList   = Manager;
export type ActiveStudentsToManagerList   = Student;
export type ActiveProfessorsToManagerList = Professor;

export type ActiveUsersToManagerList =
| ActiveManagersToManagerList
| ActiveStudentsToManagerList
| ActiveProfessorsToManagerList
;