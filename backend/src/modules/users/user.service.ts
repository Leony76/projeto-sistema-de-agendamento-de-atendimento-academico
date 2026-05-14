import type * as U from '@shared/types/dtos/managerUsersList.dto'; 
import { UserRepository } from './user.repository';

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
}