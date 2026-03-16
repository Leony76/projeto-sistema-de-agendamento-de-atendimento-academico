import z from 'zod';

const disciplines = [
  "PORTUGUESE",
  "MATH",
  "GEOGRAPHY",
  "HISTORY",
  "BIOLOGY",
  "LITERATURE",
  "CHEMISTRY"
] as const;

export const registerProfessorSchema = z.object({
  professorName: z.string().min(2, 'O nome do professor deve conter até 2 caracteres'),
  email: z.email('E-mail inválido'),
  discipline: z.enum(disciplines, "A disciplina deve ser selecionada"),
});

export type RegisterProfessorSchema = z.infer<typeof registerProfessorSchema>;
