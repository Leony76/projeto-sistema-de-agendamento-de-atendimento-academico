import { AppointmentStatus } from "@prisma/client";

export type AppointmentsHistory = {
  id: number;
  notes: string;
  appointmentId: number;
} | null;

export type UserAppointmentDTO = {
  id: number;
  date: string;
  subject: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  history: AppointmentsHistory;
} | null;

export type UserBasePropsDTO = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type UserDTO = | UserBasePropsDTO & {
  role: 'STUDENT'
  ra: string;
  appointments?: UserAppointmentDTO[];
} | UserBasePropsDTO & {
  role: 'MANAGER'
  email: string;
}

// MAP FORMATER

export const formattedUserDataResponse = (user: any): UserDTO => {
  const baseProps = {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  if (user.role === 'STUDENT') {
    return {
      ...baseProps,
      role: 'STUDENT',
      ra: user.ra || "",
      appointments: user.appointments?.map((app: any) => ({
        id: app.id,
        date: app.date.toISOString(),
        subject: app.subject,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        history: app.history
      })) || []
    };
  }

  return {
    ...baseProps,
    role: 'MANAGER',
    email: user.email || "",
  };
};