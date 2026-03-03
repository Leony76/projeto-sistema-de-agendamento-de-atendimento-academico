import { app, prisma } from '..';

import bcrypt from 'bcrypt';

app.post('/register', async(req, res) => {
  const {
    name,
    email,
    password,
    role
  } = req.body;

  const hashedPassword = bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword as unknown as string,
      role,
    },
  });

  res.status(201).json(user);
});