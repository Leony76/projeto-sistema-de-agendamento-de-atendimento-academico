import type * as U from '@shared/types/dtos/managerUsersList.dto'; 
import type * as G from '@shared/types/dtos/userGeneralInfos.dto'; 
import type * as Brief from '@shared/types/dtos/userHomeBriefInfos.dto';
import { UserRepository } from './user.repository';
import { prisma } from '@backend/lib/prisma';
import { ApiError } from '@backend/utils/apiError.util';
import bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import type { AuthUserBasicInfos } from '@shared/types/authUserBasicInfos.type';
import type { UserRole } from '@backend/generated/prisma/enums';
import { AuthRepository } from '../auth/auth.repository';
import { studentBasicInfosMapper } from '../auth/mappers/studentBasicInfos.mapper';
import { professorBasicInfosMapper } from '../auth/mappers/professorBasicInfos.mapper';
import { managerBasicInfosMapper } from '../auth/mappers/managerBasicInfos.mapper';
import { studentGeneralInfosMapper } from './mappers/studentGeneralInfos.mapper';
import { professorGeneralInfosMapper } from './mappers/professorGeneralInfos.mapper';

export class UserService {

  public static async getUserBasicInfos(userId: number, role: UserRole): Promise<AuthUserBasicInfos> {

    const apiError: string = 'Não foi possível carregar seus dados';
    
    switch (role) {
      case 'STUDENT':
        const student = await AuthRepository.getStudentById(userId);
        if (!student) throw new ApiError(apiError);

        return studentBasicInfosMapper(student);
      case 'PROFESSOR':
        const professor = await AuthRepository.getUserById(userId);
        if (!professor) throw new ApiError(apiError);

        return professorBasicInfosMapper(professor);
      case 'MANAGER':
        const manager = await AuthRepository.getUserById(userId);
        if (!manager) throw new ApiError(apiError);

        return managerBasicInfosMapper(manager);
    }
  }

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

    return studentGeneralInfosMapper(studentInfos);
  }
  
  public static async getProfessorGeneralInfos(id: number): Promise<G.ProfessorGeneralInfosResponse> {
    
    const professorInfos = await UserRepository.getProfessorGeneralInfos(id);
    
    if (!professorInfos) throw new ApiError('Informações do professor não foram encontradas!');
    
    return professorGeneralInfosMapper(professorInfos);
  }
  
  public static async getManagerGeneralInfos(id: number): Promise<G.ManagerGeneralInfosResponse> {
    
    const managerInfos = await UserRepository.getManagerGeneralInfos(id);
    
    if (!managerInfos) throw new ApiError('Informações do gestor não foram encontradas!');
    
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

  public static async getManagerBriefInfos(): Promise<Brief.ManagerHomeBriefInfosResponse> {

    const brief = await UserRepository.getManagerBriefInfos();

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das métricas do sistema');
    
    return brief;
  }

  public static async getProfessorBriefInfos(id: number): Promise<Brief.ProfessorHomeBriefInfosResponse> {

    const brief = await UserRepository.getProfessorBriefInfos(id);

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das suas métricas');
    
    return {
      ...brief,
      nextAppointmentDateTime: brief.nextAppointmentDateTime?.dateTime.toISOString() ?? '',
    };
  }

  public static async getStudentBriefInfos(id: number): Promise<Brief.StudentHomeBriefInfosResponse> {

    const brief = await UserRepository.getStudentBriefInfos(id);

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das suas métricas');
    
    return {
      ...brief,
      nextAppointmentDateTime: brief.nextAppointmentDateTime?.dateTime.toISOString() ?? '',
    };
  }

  public static async changeUserTemporaryPassword(userId: number, newPassword: string): Promise<{success: boolean}> {

    const userCurrentPassword = await UserRepository.getUserPasswordById(userId);

    if (!userCurrentPassword) 
      throw new ApiError('Houve um erro ao alterar a senha. Tente novamente mais tarde!', 500);
    
    if (await bcrypt.compare(newPassword, userCurrentPassword)) 
      throw new ApiError('A nova senha não pode ser a mesma da anteriora', 409);

    const hashedPassword = await AuthService.hashPassword(newPassword);

    const result = await UserRepository.changeUserTemporaryPassword(userId, hashedPassword);

    if (!result) throw new ApiError('Não foi possível trocar a sua senha. Tente novamente mais tarde');
    
    return { success: true };
  }
}