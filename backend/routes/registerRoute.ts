import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/register', async(req, res) => {
  const {
    name,
    email,
    password,
    role
  } = req.body;

  const userExists = await prisma.user.findFirst({
    where: { email }
  });

  if (userExists) {
    return res.status(400).json('Usuário já cadastrado com este e-mail ou RA');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  res.status(201).json('Cadastro concluído');
});

export default router;