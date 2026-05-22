import type { AppointmentStatus } from "@backend/generated/prisma/enums";

export const APPOINTMENT_STATUS_MAP: Record<AppointmentStatus, string> = {
  CANCELED    : 'Cancelado',
  CONFIRMED   : 'Confirmado',
  ACCEPTED    : 'Aceito',
  PENDING     : 'A confirmar',
  REJECTED    : 'Rejeitado',
  DONE        : 'Finalizado',
  NO_SHOW     : 'Não realizado',
} as const;