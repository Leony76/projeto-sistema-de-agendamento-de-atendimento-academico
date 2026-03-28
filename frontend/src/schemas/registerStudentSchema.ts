import z from 'zod';

export const registerStudentSchema = z.object({
  name: z.string().min(2, 'O nome do estudante deve conter até 2 caracteres'),
  email: z.email('E-mail inválido'),
  ra: z.string().min(11, 'O Resgitro Acadêmico do aluno deve ter exatamente 11 caracteres').max(11, 'O Resgitro Acadêmico do aluno deve ter exatamente 11 caracteres'),
});

export type RegisterStudentSchema = z.infer<typeof registerStudentSchema>;
