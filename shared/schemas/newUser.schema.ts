import { z } from 'zod';
import { defaultFieldsConfigPresets } from './defaultFieldsConfigPresets.schema.config';

export const newStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do aluno deve ter mínimo 3 caracteres')
    .max(255 , 'O nome do aluno deve ter até 255 caracteres'),
  ra: z
    .string()
    .trim()
    .length(11, "RA inválido"),
  email: z
    .email(defaultFieldsConfigPresets.email.invalid)
    .trim()
    .max(defaultFieldsConfigPresets.email.max.value, defaultFieldsConfigPresets.email.max.message),  
    role: z
    .literal('STUDENT'),
});
    
export const newProfessorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do professor deve ter mínimo 3 caracteres')
    .max(255 , 'O nome do professor deve ter até 255 caracteres'),
  email: z
    .email(defaultFieldsConfigPresets.email.invalid)
    .trim()
    .max(defaultFieldsConfigPresets.email.max.value, defaultFieldsConfigPresets.email.max.message),  
  disciplines: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma disciplina'),
  role: z
    .literal('PROFESSOR'),
});
  
export const newManagerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3   , 'O nome do professor deve ter mínimo 3 caracteres')
    .max(255 , 'O nome do professor deve ter até 255 caracteres'),
  email: z
    .email(defaultFieldsConfigPresets.email.invalid)
    .trim()
    .max(defaultFieldsConfigPresets.email.max.value, defaultFieldsConfigPresets.email.max.message),  
  role: z
    .literal('MANAGER'),
});

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

export type ManagerRegistersStudentFormData =   z.infer<typeof newStudentSchema>;
export type ManagerRegistersProfessorFormData = z.infer<typeof newProfessorSchema>;
export type ManagerRegistersManagerFormData =   z.infer<typeof newManagerSchema>;

export type ManagerRegistersUserFormData = z.infer<typeof newUserSchema>;
