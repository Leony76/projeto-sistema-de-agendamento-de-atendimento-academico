import { z } from 'zod';
import { defaultFieldsConfigPresets } from './defaultFieldsConfigPresets.schema.config';

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(6)
    .max(50),
});

export const newPasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
  repeatNewPassword: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
}).refine((data) => data.newPassword === data.repeatNewPassword, {
  message: "As senhas não coincidem",
  path: ["repeatNewPassword"], 
});

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;