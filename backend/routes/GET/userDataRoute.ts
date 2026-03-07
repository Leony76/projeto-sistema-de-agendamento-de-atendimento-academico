import { formattedUserDataResponse } from "../../@types/dto/userDTO";
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

  const userData = formattedUserDataResponse(user);

  return res.json(userData);
});

export default router;
