import { RegisterProfessorSchema } from "../../schemas/registerProfessorSchema";
import { RegisterStudentSchema } from "../../schemas/registerStudentSchema"

export type REGISTER_SCHEMA_MAP = {
  STUDENT: RegisterStudentSchema;
  PROFESSOR: RegisterProfessorSchema;
}