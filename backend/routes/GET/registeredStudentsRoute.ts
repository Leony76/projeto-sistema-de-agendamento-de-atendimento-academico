import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { StudentListDTO } from "../../@types/dto/studentListDTO";

const router = Router();

router.get('/students-list', async(req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [studentsListQuery, totalStudents] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { 
        name:      true, 
        email:     true, 
        ra:        true, 
        createdAt: true 
      },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ 
      where: { role: 'STUDENT' } 
    })
  ]);

  const studentsList: StudentListDTO[] = studentsListQuery.map((student) => ({
    name:         student.name,
    email:        student.email ?? '[E-mail não registrado]',
    ra:           student.ra    ?? '[RA não registrado]',
    registeredAt: student.createdAt.toISOString(),
  }));

  res.json({ 
    studentsList, 
    total:      totalStudents,
    totalPages: Math.ceil(totalStudents / limit) 
  });
});

export default router;