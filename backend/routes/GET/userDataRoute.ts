import { UserBasePropsDTO, UserDTO } from "../../@types/dto/userDTO";
import { prisma } from "../../lib/prisma";
import { Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";

const router = Router();

router.get('/me', authenticate, async (req, res) => {

  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      appointments: {
        include: {
          history: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const baseProps: UserBasePropsDTO = {
    id: user.id,
    name: user.name,
    password: user.password,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  let formattedUser: UserDTO;

  if (user.role === 'STUDENT') {
    formattedUser = {
      ...baseProps,
      role: 'STUDENT',
      ra: user.ra || "",
      appointments: user.appointments.map(app => ({
        id: app.id,
        date: app.date.toISOString(),
        subject: app.subject,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        history: app.history
      }))
    };
  } else {
    formattedUser = {
      ...baseProps,
      role: 'MANAGER',
      email: user.email || "",
    };
  }

  return res.json(formattedUser);
});

export default router;
