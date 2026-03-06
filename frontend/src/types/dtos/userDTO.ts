import { AppointmentStatus, UserRole } from "../prismaEnums";

export type AppointmentsHistory = {
  id: number;
  notes: string;
  appointmentId: number;
};

export type UserAppointmentDTO = {
  id: number;
  date: string;
  subject: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  history: AppointmentsHistory;
};

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  ra: string;
  appointments: UserAppointmentDTO[];
}