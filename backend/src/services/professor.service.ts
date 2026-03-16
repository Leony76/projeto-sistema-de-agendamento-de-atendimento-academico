import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { EditPromise } from './types/student/edit.promise';
import { ProfessorsListPromise } from './types/professor/list.promise';
import { ProfessorsRegisteredTodayListPromise } from './types/professor/registeredTodayList.promise';
import { RemovePromise } from './types/student/remove.promise';
import { ProfessorListDTO } from '../../types/dto/professorListDTO';

export class ProfessorService {

  static async list(
    page   : number, 
    search : string, 
    filter : string,
  ):Promise<ProfessorsListPromise>{
    
    const limit = 10;
    const skip = (Number(page) - 1) * limit;
  
    const whereCondition:Prisma.UserWhereInput = { 
      role: 'PROFESSOR',
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

      case 'AZnames'                   : orderBy = { name:      'asc' }; break;
      case 'ZAnames'                   : orderBy = { name:      'desc'}; break;
      case 'mostRecentsRegistered'     : orderBy = { createdAt: 'desc'}; break;
      case 'mostOldRegistered'         : orderBy = { createdAt: 'asc' }; break;
      case 'mostScheduledAppointments' : orderBy = { createdAt: 'asc' }; break;
      case 'mostAppointmentsDone'      : orderBy = { createdAt: 'asc' }; break;
    };
  
    const [professorsListQuery, totalProfessors] = await Promise.all([
      // studentsListQuery
      prisma.user.findMany({
        where: whereCondition,
        select: { 
          name       : true, 
          email      : true, 
          discipline : true,
          createdAt  : true,
        },
        take    : limit,
        skip    : skip,
        orderBy : orderBy,
      }),
  
      // totalStudents
      prisma.user.count({ 
        where: whereCondition 
      })
    ]);
  
    const professorsList: ProfessorListDTO[] = professorsListQuery.map((professor) => ({
      name:         professor.name,
      email:        professor.email ??  '[E-mail não registrado]',
      discipline:   professor.discipline ?? 'PORTUGUESE',
      registeredAt: professor.createdAt.toISOString(),
    }));
    
    return {
      professors: {
        list       : professorsList,
        totalCount : totalProfessors,
        pages      : { total: Math.ceil(totalProfessors / limit) }
      }
    }
  }

  static async registeredTodayList(
    page      : number,
    onlyToday : boolean,
  ):Promise<ProfessorsRegisteredTodayListPromise>{
    const limit = 10;
    const skip = (page - 1) * limit;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const whereCondition:Prisma.UserWhereInput = { 
      role: 'PROFESSOR',
    };

    if (onlyToday) {
      whereCondition.createdAt = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    const [
      professorListQuery, 
      totalProfessors
    ] = await Promise.all([
      // professorListQuery
      prisma.user.findMany({
        where: whereCondition,
        select: { 
          name       : true, 
          email      : true, 
          discipline : true, 
          createdAt  : true, 
        },
        take    : limit,
        skip    : skip,
        orderBy : { createdAt: 'desc' },
      }),

      // totalProfessor
      prisma.user.count({ 
        where: whereCondition 
      }),
    ]);

    const professorsRegisteredTodayList: ProfessorListDTO[] = professorListQuery.map((professor) => ({
      name:         professor.name,
      email:        professor.email ?? '[E-mail não registrado]',
      discipline:   professor.discipline  ?? 'PORTUGUESE',
      registeredAt: professor.createdAt.toISOString(),
    }));

    return {
      professors: {
        list       : professorsRegisteredTodayList,
        totalCount : totalProfessors,
        pages      : { total: Math.ceil(totalProfessors / limit) }
      }
    }
  }

  static async edit(
    ra            : string,
    professorName : string,
    email         : string,
  ):Promise<EditPromise>{
    const user = await prisma.user.findUnique({ where: { ra } });
    
    if (!user) throw new Error('Aluno não encontrado para edição');

    const updateData = await prisma.user.update({
      where: { ra },
      data: {
        name: professorName,
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
    name  : string, 
    email : string, 
  ):Promise<RemovePromise>{
    const user = await prisma.user.findUnique({ 
      where: { name, email } 
    });

    if (!user) throw new Error('Professor não encontrado para ser removido');

    const removed = await prisma.user.update({
      where: { 
        name, 
        email, 
        role: 'PROFESSOR' 
      },
      data: { status: 'REMOVED' },
    });

    return {
      success: 'Professor removido do sistema com sucesso!',
      info: removed.name,
    }
  }
}