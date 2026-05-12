import { z } from 'zod';

export const newStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do aluno deve ter mínimo 3 caracteres')
    .max(244 , 'O nome do aluno deve ter até 255 caracteres'),
  ra: z
    .string()
    .trim()
    .length(11, "RA inválido"),
  email: z
    .email("E-mail inválido")
    .trim()
    .max(255, 'O e-mail deve ter até 255 caracteres'),  
  role: z
    .literal('STUDENT'),
});

export type NewStudentFormData = z.infer<typeof newStudentSchema>;

export const newProfessorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do professor deve ter mínimo 3 caracteres')
    .max(255 , 'O nome do professor deve ter até 255 caracteres'),
  email: z
    .email("E-mail inválido")
    .trim()
    .max(255, 'O e-mail deve ter até 255 caracteres'),
  disciplines: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma disciplina'),
  role: z
    .literal('PROFESSOR'),
});

export type NewProfessorFormData = z.infer<typeof newProfessorSchema>;

export const newManagerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do professor deve ter mínimo 3 caracteres')
    .max(255 , 'O nome do professor deve ter até 255 caracteres'),
  email: z
    .email("E-mail inválido")
    .trim()
    .max(255, 'O e-mail deve ter até 255 caracteres'),
  role: z
    .literal('MANAGER'),
});

export type NewManagerFormData = z.infer<typeof newManagerSchema>;

export const newUserSchema = z.discriminatedUnion('role', [
  z.object({
    ...newStudentSchema.shape,
  }),
  z.object({
    ...newProfessorSchema.shape,
  }),
  z.object({
    ...newManagerSchema.shape,
  }),
]);

export type NewUserFormData = z.infer<typeof newUserSchema>;