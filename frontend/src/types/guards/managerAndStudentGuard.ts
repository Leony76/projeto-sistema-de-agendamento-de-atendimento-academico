import { StudentLoginFormSchema, ManagerLoginFormSchema } from "../../schemas/loginSchema";

export function isStudentData(
  data: StudentLoginFormSchema | ManagerLoginFormSchema
): data is StudentLoginFormSchema {
  return (data as StudentLoginFormSchema).ra !== undefined;
}