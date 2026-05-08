import type { ManagerRegisterUser } from '@shared/types/managerRegisterUser.type'

export class ManagerService {

  public static async registerNewUser(data: ManagerRegisterUser) {
    switch (data.role) {
      case 'STUDENT': {

        const [] = 

        return;
      } case 'PROFESSOR': {
        
        return;
      } case 'MANAGER': {
        
        return;
      }
    }
  };
}