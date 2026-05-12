import { z } from 'zod';

const loginSchemaPresets = {
  email: {
    invalid: { 
      message: 'E-mail inválido' 
    },
    max : {
      value: 255,
      message : 'O e-mail deve ter até 255 caracteres'
    },
  },

  password: {
    min : {
      value: 6,
      message : 'Senha muito curta'
    },
    max : {
      value: 50,
      message : 'A senha deve ter até 50 caracteres',
    },
  },
}

export const loginAsStudentSchema = z.object({
  ra: z
    .string()
    .trim()
    .length(11, "RA inválido"),
  password: z
    .string()
    .trim()
    .min(loginSchemaPresets.password.min.value, loginSchemaPresets.password.min.message)
    .max(loginSchemaPresets.password.max.value, loginSchemaPresets.password.max.message),
});

export type LoginAsStudentFormData = z.infer<typeof loginAsStudentSchema>;

export const loginAsGenericSchema = z.object({
  email: z
    .email(loginSchemaPresets.email.invalid)
    .trim()
    .max(loginSchemaPresets.email.max.value, loginSchemaPresets.email.max.message),
  password: z
    .string()
    .trim()
    .min(loginSchemaPresets.password.min.value, loginSchemaPresets.password.min.message)
    .max(loginSchemaPresets.password.max.value, loginSchemaPresets.password.max.message),
});

export type LoginAsGenericFormData = z.infer<typeof loginAsGenericSchema>;

export const loginAsManagerSchema = z.object({
  role: z
    .literal("MANAGER"),
  ...loginAsGenericSchema.shape,
});

export type LoginAsManagerFormData = z.infer<typeof loginAsManagerSchema>;

export const loginAsProfessorSchema = z.object({
  role: z
    .literal("PROFESSOR"),
  ...loginAsGenericSchema.shape,
});

export type LoginAsProfessorFormData = z.infer<typeof loginAsProfessorSchema>;

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

export type LoginFormData = z.infer<typeof loginSchema>;