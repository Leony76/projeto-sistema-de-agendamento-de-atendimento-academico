import type * as U from '@shared/types/dtos/managerUsersList.dto'; 
import type * as G from '@shared/types/dtos/userGeneralInfos.dto'; 
import { UserRepository } from './user.repository';
import { ApiError } from '@backend/utils/apiError.util';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import { prisma } from '@backend/lib/prisma';

export class UserService {

  public static async getActiveStudentsToManagerList(): Promise<U.ActiveStudentsToManagerListResponse[]> {

    const activeStudents = await UserRepository.getActiveStudentsToManagerList();
    
    return activeStudents.map(({ createdAt, student, ...user }) => ({
      ...user,
      registeredAt : createdAt.toISOString(),
      ra           : student?.ra ?? '"RA não encontrado"',
    }));
  }

  public static async getActiveProfessorsToManagerList(): Promise<U.ActiveProfessorsToManagerListResponse[]> {

    const activeProfessors = await UserRepository.getActiveProfessorsToManagerList();

    return activeProfessors.map(({ createdAt, professor, ...user }) => ({
      ...user,
      registeredAt : createdAt.toISOString(),
      disciplines  : professor?.disciplines.map(
        (discipline) => discipline.name
      ) ?? [],
    }));
  }

  public static async getActiveManagersToManagerList(): Promise<U.ActiveManagersToManagerListResponse[]> {

    const activeManagers = await UserRepository.getActiveManagersToManagerList();

    return activeManagers.map(({ createdAt, ...user }) => ({
      ...user,
      registeredAt : createdAt.toISOString(),
    }));
  }

  public static async getStudentGeneralInfos(id: number): Promise<G.StudentGeneralInfosResponse> {

    const studentInfos = await UserRepository.getStudentGeneralInfos(id);

    if (!studentInfos) throw new ApiError('Informações do aluno não foram encontradas!');

    return {
      ...studentInfos.user,
      ra   : studentInfos.ra,
      role : 'STUDENT',
      registeredAt: studentInfos.user.createdAt.toISOString(),
      appointmentsList : studentInfos.appointments.map((appointment) => ({
        id       : appointment.id,
        reason   : appointment.reason,
        room     : appointment.room.name,
        dateTime : appointment.dateTime.toISOString(),
        user: {
          name  : appointment.professor.user.name,
          photo : appointment.professor.user.photo,
        },
      })),
      solicitationsList: studentInfos.solicitations.map((solicitation) => ({
        id: solicitation.id,
        appoitmentDateTime: solicitation.dateTime.toISOString(),
        reason: solicitation.appointment?.reason ?? '',
        status: solicitation.status,
        user: {
          name: solicitation.professor.user.name,
          photo: solicitation.professor.user.photo,
        },
      })),
    }
  }
  
  public static async getProfessorGeneralInfos(id: number): Promise<G.ProfessorGeneralInfosResponse> {
    
    const professorInfos = await UserRepository.getProfessorGeneralInfos(id);
    
    if (!professorInfos) throw new ApiError('Informações do aluno não foram encontradas!');
    
    return {
      id: professorInfos.user.id,
      name: professorInfos.user.name,
      email: professorInfos.user.email,
      photo: professorInfos.user.photo,
      registeredAt: professorInfos.user.createdAt.toISOString(),
      role: 'PROFESSOR',
      disciplines: professorInfos.disciplines.map((discipline) => discipline.name),
      appointmentsList: professorInfos.appointments.map((appointment) => ({
        id       : appointment.id,
        reason   : appointment.reason,
        room     : appointment.room.name,
        dateTime : appointment.dateTime.toISOString(),
        user: {
          name  : appointment.student.user.name,
          photo : appointment.student.user.photo,
        },
      })),
      solicitationsList: professorInfos.solicitations.map((solicitation) => ({
        id: solicitation.id,
        appoitmentDateTime: solicitation.dateTime.toISOString(),
        reason: solicitation.appointment?.reason ?? '',
        status: solicitation.status,
        user: {
          name: solicitation.student.user.name,
          photo: solicitation.student.user.photo,
        },
      })),
    }
  }
  
  public static async getManagerGeneralInfos(id: number): Promise<G.ManagerGeneralInfosResponse> {
    
    const managerInfos = await UserRepository.getManagerGeneralInfos(id);
    
    if (!managerInfos) throw new ApiError('Informações do aluno não foram encontradas!');
    
    return {
      id           : managerInfos.user.id,
      role         : 'MANAGER',
      name         : managerInfos.user.name,
      email        : managerInfos.user.email,
      photo        : managerInfos.user.photo,
      registeredAt : managerInfos.user.createdAt.toISOString(),
    }
  }

  public static async excludeUsers(ids: number[]): Promise<number[]> {

    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length === 0) {
      throw new ApiError('Nenhum usuário informado para exclusão');
    }

    await prisma.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: { deletedAt: new Date() },
    });

    return ids;
  }
}