import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from "express";
import { formattedUserDataResponse } from '../../@types/dto/userDTO';

const router = Router();

// FOR STUDENT

router.post('/login/student', async (req, res) => {

  const { ra, password } = req.body;
  const user = await prisma.user.findUnique({ 
    where: { ra },
    include: {
      appointments: {
        include: {
          history: true,
        },
      },
    },
  });
  
  if (!user || user?.role !== 'STUDENT' || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  } 

  const token = jwt.sign({ 
    id: user.id, 
    role: user.role 
  }, process.env.JWT_SECRET as string, { 
    expiresIn: '1d' 
  });

  return res.json({ 
    token, 
    user: formattedUserDataResponse(user), 
  });
});

// FOR MANAGER

router.post('/login/manager', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user?.role !== 'MANAGER' || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ 
    id: user.id, 
    role: user.role 
  }, process.env.JWT_SECRET as string, { 
    expiresIn: '1d' 
  });

  return res.json({ 
    token, 
    user: formattedUserDataResponse(user), 
  });
});

export default router;