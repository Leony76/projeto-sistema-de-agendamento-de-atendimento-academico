import { app, prisma } from "..";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// FOR STUDENT

app.post('/login/student', async (req, res) => {
  const { 
    ra,
    password 
  } = req.body;
  const user = await prisma.user.findUnique({ where: { ra } });

  if (user && ra === user.ra) {

    const token = jwt.sign({ 
      userId: user.id, 
      role: user.role 
    },'HYPER_SECRET_APPOINTMENT', { 
      expiresIn: '1d' 
    });

    return res.json({ 
      token, 
      role: user.role 
    });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

// FOR MANAGER

app.post('/login/manager', async (req, res) => {
  const { 
    email, 
    password 
  } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && await bcrypt.compare(password, user.password)) {

    const token = jwt.sign({ 
      userId: user.id, 
      role: user.role 
    },'HYPER_SECRET_APPOINTMENT', { 
      expiresIn: '1d' 
    });

    return res.json({ 
      token, 
      role: user.role 
    });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});
