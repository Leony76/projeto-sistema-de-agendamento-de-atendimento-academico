import { WelcomeMessageToStudent } from "./welcomeMessageToStudent";

export type WelcomeMessageToProfessor = Omit<WelcomeMessageToStudent, 'ra' | 'role'> & {
  role: 'PROFESSOR';
};