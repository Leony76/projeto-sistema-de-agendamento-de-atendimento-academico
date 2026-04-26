import { z } from 'zod';
import { DISCIPLINES } from '@/constants/maps/disciplines.map';

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
  discipline: z
    .array(z.enum(DISCIPLINES))
    .min(1, 'A disciplina é obrigatória'),
});

export type NewProfessorFormData = z.infer<typeof newProfessorSchema>;