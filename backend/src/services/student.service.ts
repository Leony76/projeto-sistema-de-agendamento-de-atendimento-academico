import { Prisma } from '@prisma/client';
import { StudentListDTO } from '../../types/dto/studentListDTO';
import { prisma } from '../prisma';
import { EditPromise } from './types/student/edit.promise';
import { StudentsListPromise } from './types/student/list.promise';
import { StudentsRegisteredTodayListPromise } from './types/student/registeredTodayList.promise';
import { RemovePromise } from './types/student/remove.promise';

export class StudentService {

  static async list(
    page   : number, 
    search : string, 
    filter : string,
  ):Promise<StudentsListPromise>{
    
    const limit = 10;
    const skip = (Number(page) - 1) * limit;
  
    const whereCondition:Prisma.UserWhereInput = { 
      role: 'STUDENT',
      status: 'ACTIVE',
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
      students: {
        list: studentsList,
        totalCount: totalStudents,
        pages: { total: Math.ceil(totalStudents / limit) }
      }
    }
  }

  static async registeredTodayList(
    page      : number,
    onlyToday : boolean,
  ):Promise<StudentsRegisteredTodayListPromise>{
    const limit = 10;
    const skip = (page - 1) * limit;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const whereCondition:Prisma.UserWhereInput = { 
      role: 'STUDENT',
    };

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
      students: {
        list       : studentsRegisteredTodayList,
        totalCount : totalStudents,
        pages      : { total: Math.ceil(totalStudents / limit) },
      }
    }
  }

  static async edit(
    ra          : string,
    studentName : string,
    email       : string,
  ):Promise<EditPromise>{
    const user = await prisma.user.findUnique({ where: { ra } });
    
    if (!user) throw new Error('Aluno não encontrado para edição');

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
  }

  static async remove( 
    ra : string 
  ):Promise<RemovePromise>{
    const user = await prisma.user.findUnique({ 
      where: { ra } 
    });

    if (!user) throw new Error('Aluno não encontrado para ser removido');

    const remove = await prisma.user.update({
      where: { ra },
      data: { status: 'REMOVED' },
    });

    return {
      success: 'Aluno removido do sistema com sucesso!',
      info: remove.ra,
    }
  }
}