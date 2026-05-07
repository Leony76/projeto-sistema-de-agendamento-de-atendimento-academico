import { Discipline } from "./disciplines.type";
import { Manager } from "./manager.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type";

export type AuthUserBasicInfos =
| Student   & { role: 'STUDENT'   }
| Manager   & { role: 'MANAGER'   }
| Professor & { 
  role        : 'PROFESSOR';
  disciplines : Discipline['name'][]; 
};