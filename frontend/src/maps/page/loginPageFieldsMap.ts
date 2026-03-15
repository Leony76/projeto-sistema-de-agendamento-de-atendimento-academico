import { studentSchema, managerSchema, professorSchema } from "../../schemas/loginSchema";

export const LOGIN_FIELDS_MAP = {
  STUDENT: {
    title: 'Aluno',
    schema: studentSchema,
    fields: [
      { name: 'ra', label: 'RA', type: 'text', placeholder: 'Insira o RA' },
      { name: 'password', label: 'Senha', type: 'password', placeholder: 'Insira a senha' },
    ],
  },

  PROFESSOR: {
    title: 'Professor',
    schema: professorSchema,
    fields: [
      { name: 'email', label: 'E-mail', type: 'email', placeholder: 'Insira o e-mail institucional' },
      { name: 'password', label: 'Senha', type: 'password', placeholder: 'Insira a senha' },
    ],
  },

  MANAGER: {
    title: 'Gestor',
    schema: managerSchema,
    fields: [
      { name: 'email', label: 'E-mail Institucional', type: 'email', placeholder: 'Insira o e-mail institucional' },
      { name: 'password', label: 'Senha', type: 'password', placeholder: 'Insira a senha' }
    ],
  },
};