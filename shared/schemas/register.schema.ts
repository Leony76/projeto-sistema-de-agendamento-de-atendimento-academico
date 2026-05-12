import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome completo deve conter ao menos 3 caracteres')
    .max(255, 'O nome completo deve ter até 255 caracteres'),
  ra: z
    .string()
    .trim()
    .length(11, "RA inválido"),
  email: z
    .email("E-mail inválido")
    .trim()
    .max(255, 'O e-mail deve ter até 255 caracteres'),
  password: z
    .string()
    .trim()
    .min(6, "Senha muito curta"),
  repeatPassword: z
    .string()
    .trim()
    .min(6, "Senha muito curta"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "As senhas não coincidem",
  path: ["repeatPassword"], 
});;

export type RegisterStudentFormData = z.infer<typeof registerSchema>;