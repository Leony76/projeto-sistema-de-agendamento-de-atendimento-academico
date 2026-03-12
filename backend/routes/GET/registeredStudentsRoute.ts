import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { StudentListDTO } from "../../@types/dto/studentListDTO";

const router = Router();

router.get('/students-list', async(req, res) => {

  const { 
    page = 1, 
    search = '', 
    filter = '' 
  } = req.query;
  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  const whereCondition:any = { 
    role: 'STUDENT',
    ...(search && {
      OR: [
        { name: { contains: String(search), mode: 'insensitive' }},
        { ra:   { contains: String(search), mode: 'insensitive' }}
      ],
    }),
  };

  let orderBy: any = { createdAt: 'desc' };

  switch (filter) {
    case 'AZnames':               orderBy = { name:      'asc' }; break;
    case 'ZAnames':               orderBy = { name:      'desc'}; break;
    case 'mostRecentsRegistered': orderBy = { createdAt: 'desc'}; break;
    case 'mostOldRegistered':     orderBy = { createdAt: 'asc' }; break;
  };

  const [studentsListQuery, totalStudents] = await Promise.all([
    // studentsListQuery
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
      orderBy: orderBy,
    }),

    // totalStudents
    prisma.user.count({ 
      where: whereCondition 
    })
  ]);

  const studentsList: StudentListDTO[] = studentsListQuery.map((student) => ({
    name:         student.name,
    email:        student.email ??  '[E-mail não registrado]',
    ra:           student.ra    ??  '[RA não registrado]',
    registeredAt: student.createdAt.toISOString(),
  }));

  res.json({ 
    studentsList, 
    total:      totalStudents,
    totalPages: Math.ceil(totalStudents / limit) 
  });
});

export default router;