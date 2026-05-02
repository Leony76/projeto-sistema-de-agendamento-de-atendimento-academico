import { UserRole } from "../../backend/generated/prisma/enums";
import { Discipline } from "./disciplines.type";

export type LoggedUserData = {
  readonly id  : number;
  name         : string; 
  email        : string; 
  photo?       : string;
  role         : UserRole;
  ra?          : number;
};