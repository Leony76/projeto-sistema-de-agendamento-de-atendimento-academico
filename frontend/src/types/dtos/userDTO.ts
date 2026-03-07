import { AppointmentStatus } from "../prismaEnums";

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