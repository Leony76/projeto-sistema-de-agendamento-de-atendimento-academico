import { z } from 'zod';
import { defaultFieldsConfigPresets } from './defaultFieldsConfigPresets.schema.config';

export const studentRegisterHimselfSchema = z.object({
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
    .email(defaultFieldsConfigPresets.email.invalid)
    .trim()
    .max(defaultFieldsConfigPresets.email.max.value, defaultFieldsConfigPresets.email.max.message),
  password: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
  repeatPassword: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
}).refine((data) => data.password === data.repeatPassword, {
  message: "As senhas não coincidem",
  path: ["repeatPassword"], 
});;

export type StudentRegistersHimselfFormData = z.infer<typeof studentRegisterHimselfSchema>;