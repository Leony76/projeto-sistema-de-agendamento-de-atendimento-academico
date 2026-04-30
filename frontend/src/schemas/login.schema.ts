import { z } from 'zod';

export const loginSchema = z.discriminatedUnion("role", [
  z.object({
    role: z
      .literal("STUDENT"),
    identifier: z
      .string()
      .trim()
      .length(11, "RA inválido"),
    password: z
      .string()
      .trim()
      .min(6, "Senha muito curta"),
  }),
  z.object({
    role: z
      .literal("PROFESSOR"),
    identifier: z
      .email("E-mail inválido")
      .trim()
      .max(255, 'O e-mail deve ter até 255 caracteres'),
    password: z
      .string()
      .trim()
      .min(6, "Senha muito curta"),
  }),
]);

export type LoginFormData = z.infer<typeof loginSchema>;