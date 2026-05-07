import { UserRole } from "@shared/types/userRole.type";
import { Discipline } from "./disciplines.type";

export type LoggedUserData = {
  readonly id  : number;
  name         : string; 
  email        : string; 
  photo?       : string;
  role         : UserRole;
  ra?          : string;
  disciplines? : Discipline[];
};