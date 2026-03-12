import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.put('/students/update-student/:ra', async(req, res) => {
  const { ra } = req.params;
  const {
    studentName,
    email,
  } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { ra:ra } });
    
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado para edição' });

    const updateData = await prisma.user.update({
      where: { ra },
      data: {
        name: studentName,
        email,
      },
    });

    return res.status(200).json({
      success: 'Edição efetuada com sucesso!',
      newData: {
        name:  updateData.name,
        email: updateData.email,
      },
    });
  } catch (error:any) {
    res.status(400).json({ error: 'Houve um erro ao processar a edição. Tente mais tarde!' });
  }
});

export default router;