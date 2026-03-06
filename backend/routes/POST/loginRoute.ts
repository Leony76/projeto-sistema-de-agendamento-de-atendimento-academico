import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from "express";

const router = Router();

// FOR STUDENT

router.post('/login/student', async (req, res) => {

  const { ra, password } = req.body;
  const user = await prisma.user.findUnique({ where: { ra } });
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  if (user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Não autorizado'});
  }

  if (await bcrypt.compare(password, user.password)) {

    const token = jwt.sign({ 
      id: user.id, 
      role: user.role 
    }, process.env.JWT_SECRET as string, { 
      expiresIn: '1d' 
    });

    return res.json({ 
      token, 
      role: user.role 
    });
  }
});

// FOR MANAGER

router.post('/login/manager', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  if (user?.role !== 'MANAGER') {
    return res.status(403).json({ error: 'Não autorizado'});
  }

  if (await bcrypt.compare(password, user.password)) {

    const token = jwt.sign({ 
      id: user.id, 
      role: user.role 
    }, process.env.JWT_SECRET as string, { 
      expiresIn: '1d' 
    });

    return res.json({ 
      token, 
      role: user.role 
    });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

export default router;