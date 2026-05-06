import { MANAGERS } from "./managers.mock";
import { PROFESSORS } from "./professors.mock";
import { STUDENTS } from "./students.mock";

export const USERS = [
  ...STUDENTS.map(student => ({
    ...student,
    role: 'STUDENT' as const,
  })),

  ...PROFESSORS.map(professor => ({
    ...professor,
    role: 'PROFESSOR' as const,
  })),

  ...MANAGERS.map(manager => ({
    ...manager,
    role: 'MANAGER' as const,
  })),
];