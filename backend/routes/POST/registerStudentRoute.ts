import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { provisoryPassword } from "../../utils/provisoryPassword";

const router = Router();

router.post('/students/register-student', async(req, res) => {
  try {
    const {
      studentName,
      email,
      ra,
    } = req.body;
  
    const registerStudent = await prisma.user.create({
      data: {
        name:     studentName,
        email:    email,
        ra:       ra,
        password: provisoryPassword(),
      },
    });
  
    res.status(201).json({ 
      success: 'Aluno registrado com sucesso!',
      student: {
        name: registerStudent.name,
        ra: registerStudent.ra,
      },
    });
  } catch(error:any) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao cadastrar aluno. Verifique se o RA ou E-mail já existem.' });
  }
});

export default router;