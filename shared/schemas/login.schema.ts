import { z } from 'zod';
import { defaultFieldsConfigPresets } from './defaultFieldsConfigPresets.schema.config';

export const loginAsStudentSchema = z.object({
  ra: z
    .string()
    .regex(/^\d+$/, 'RA deve conter apenas números')
    .length(11, 'RA deve possuir 11 dígitos'),
  password: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
});

export const loginAsGenericSchema = z.object({
  email: z
    .email(defaultFieldsConfigPresets.email.invalid)
    .trim()
    .max(defaultFieldsConfigPresets.email.max.value, defaultFieldsConfigPresets.email.max.message),
  password: z
    .string()
    .trim()
    .min(defaultFieldsConfigPresets.password.min.value, defaultFieldsConfigPresets.password.min.message)
    .max(defaultFieldsConfigPresets.password.max.value, defaultFieldsConfigPresets.password.max.message),
});

export const loginAsManagerSchema = z.object({
  role: z
    .literal("MANAGER"),
  ...loginAsGenericSchema.shape,
});

export const loginAsProfessorSchema = z.object({
  role: z
    .literal("PROFESSOR"),
  ...loginAsGenericSchema.shape,
});

export const loginSchema = z.discriminatedUnion('role', [
  z.object({
    role: z
      .literal("STUDENT"),
    ...loginAsStudentSchema.shape,
  }),

  z.object({
    role: z
      .literal('GENERIC'),
    ...loginAsGenericSchema.shape,
  }),
]);

export type LoginAsStudentFormData = z.infer<typeof loginAsStudentSchema>;
export type LoginAsProfessorFormData = z.infer<typeof loginAsProfessorSchema>;
export type LoginAsManagerFormData = z.infer<typeof loginAsManagerSchema>;

export type LoginAsGenericFormData = z.infer<typeof loginAsGenericSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

