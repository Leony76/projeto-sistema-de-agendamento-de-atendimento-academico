import { z } from 'zod';

export const appointmentSolicitationSchema = z.object({
  professorName: z
    .string()
    .min(1   , 'O nome do professor deve ser provido')
    .max(255 , 'O nome do professor deve ter até 255 caracteres'),
  professorId: z
    .number(),
  studentId: z
    .number(),
  appointmentDate: z
    .string()
    .min(1  , 'A data do agendamento deve ser fornecido'),
  hour: z
    .string()
    .min(1  , 'A hora do agendamento deve ser fornecida'),
  reason: z
    .string()
    .min(3  , 'O motivo deve ter ao menos 3 caracteres')
    .max(50 , 'O motivo deve ter até 50 caracteres')
});

export const editAppointmentSolicitationSchema = z.object({
  appointmentId: z
    .number(),
  appointmentDate: z
    .string()
    .min(1  , 'A data do agendamento deve ser fornecido'),
  hour: z
    .string()
    .min(1  , 'A hora do agendamento deve ser fornecida'),
  reason: z
  .string()
    .min(3  , 'O motivo deve ter ao menos 3 caracteres')
    .max(50 , 'O motivo deve ter até 50 caracteres')
});
  
  export type AppointmentSolicitationFormData = z.infer<typeof appointmentSolicitationSchema>;
  export type EditAppointmentSolicitationFormData = z.infer<typeof editAppointmentSolicitationSchema>;