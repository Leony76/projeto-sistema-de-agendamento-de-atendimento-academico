import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { StudentListDTO } from "../../@types/dto/studentListDTO";

const router = Router();

router.get('/registered-today-students-list', async(req, res) => {

  const page = Number(req.query.page) || 1;
  const onlyToday = req.query.today === 'true';
  const limit = 10;
  const skip = (page - 1) * limit;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const whereCondition: any = { role: 'STUDENT' };

  if (onlyToday) {
    whereCondition.createdAt = {
      gte: startOfDay,
      lte: endOfDay
    };
  }

  const [studentsListQuery, totalStudents] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
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
      where: whereCondition 
    })
  ]);

  const studentsRegisteredTodayList: StudentListDTO[] = studentsListQuery.map((student) => ({
    name:         student.name,
    email:        student.email ?? '[E-mail não registrado]',
    ra:           student.ra    ?? '[RA não registrado]',
    registeredAt: student.createdAt.toISOString(),
  }));

  res.json({ 
    studentsRegisteredTodayList, 
    totalStudentsRegisteredTodayCount:        totalStudents,
    totalStudentsRegisteredTodayPages: Math.ceil(totalStudents / limit) 
  });
});

export default router;