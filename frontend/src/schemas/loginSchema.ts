import z from 'zod';

export const studentSchema = z.object({
  ra: z.string().min(11, "RA deve ter exatamente 11 dígitos").max(11, "RA deve ter exatamente 11 dígitos"),
  password: z.string().min(8, "A senha deve conter ao menos 8 caracteres").max(50, "O máximo de caracteres para a senha é de 50"),
});

export const managerSchema = z.object({
  email: z.email("E-mail inválido").max(50, "O e-mail não deve conter mais de 50 caracteres"),
  password: z.string().min(8, "Sua senha deve conter ao menos 8 caracteres").max(50, "O máximo de caracteres para a senha é de 50"),
});

export const professorSchema = managerSchema;

export type StudentLoginFormSchema = z.infer<typeof studentSchema>;
export type ManagerLoginFormSchema = z.infer<typeof managerSchema>;
export type ProfessorLoginFormSchema = z.infer<typeof professorSchema>;