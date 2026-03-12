import { StudentListDTO } from '../../@types/dto/studentListDTO';
import { prisma } from '../prisma';
import { EditPromise } from './types/student/edit.promise';
import { ListPromise } from './types/student/list.promise';
import { RegisteredTodayListPromise } from './types/student/registeredTodayList.promise';

export class StudentService {

  static async list(
    page:   number, 
    search: string, 
    filter: string,
  ):Promise<ListPromise>{
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
    
    return {
      studentsList, 
      total:        totalStudents,
      totalPages:   Math.ceil(totalStudents / limit) 
    }
  }

  //

  static async registeredTodayList(
    page      : number,
    onlyToday : boolean
  ):Promise<RegisteredTodayListPromise>{
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

    return {
      studentsRegisteredTodayList, 
      totalStudentsRegisteredTodayCount: totalStudents,
      totalStudentsRegisteredTodayPages: Math.ceil(totalStudents / limit) 
    }
  }

  //

  static async edit(
    ra          : string,
    studentName : string,
    email       : string,
  ):Promise<EditPromise>{
    try {
      const user = await prisma.user.findUnique({ where: { ra:ra } });
      
      if (!user) return { error: 'Usuário não encontrado para edição' };

      const updateData = await prisma.user.update({
        where: { ra },
        data: {
          name: studentName,
          email,
        },
      });

      return {
        success: 'Edição efetuada com sucesso!',
        newData: {
          name:  updateData.name,
          email: updateData.email,
        },
      };
    } catch (error:any) {
      return { error: 'Houve um erro ao processar a edição. Tente mais tarde!' };
    }
  }
}