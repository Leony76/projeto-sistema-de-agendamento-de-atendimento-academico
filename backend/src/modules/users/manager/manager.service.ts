import type { ManagerRegisterUser } from '@shared/types/managerRegisterUser.type'
import { ManagerRepository } from './manager.repository'
import { ApiError } from '@backend/utils/apiError.util';
import { generateTemporaryPassword } from '@backend/utils/generateTemporaryPassword.util';

export class ManagerService {

  public static async registerNewUser(data: ManagerRegisterUser) {
    switch (data.role) {
      case 'STUDENT': {

        const [
          studentAlreadyRegisteredByRa,
          studentAlreadyRegisteredByEmail,
        ] = await Promise.all([
          ManagerRepository.verifyStudentAlreadyRegisteredByRa(data.ra),
          ManagerRepository.verifyStudentAlreadyRegisteredByEmail(data.email),
        ]); 

        if (studentAlreadyRegisteredByEmail) 
          throw new ApiError('O e-mail do estudante a ser cadastrado já existe nos registros!', 409)
        ;

        if (studentAlreadyRegisteredByRa) 
          throw new ApiError('O RA do estudante a ser cadastrado já existe nos registros!', 409)
        ;

        const temporaryPassword = generateTemporaryPassword();

        const student = await ManagerRepository.registerStudent({
          ...data,
          temporaryPassword,
        });

        return {
          message : 'Aluno cadastrado como sucesso!',
          success : true,
          student : student.name,
        };
      } case 'PROFESSOR': {
        


        return;
      } case 'MANAGER': {
        
        return;
      }
    }
  };
}