import bcrypt from 'bcrypt';
import type { RegisterManager, RegisterProfessor, RegisterStudent } from '@shared/types/registerUser.type';
import type { LoginProfessorOrManager, LoginStudent } from '@shared/types/loginUser.type';
import { generateToken } from '@backend/lib/jwt';
import type { LoginResponse } from '@shared/types/loginResponse.type';
import { ApiError } from '@backend/utils/apiError.util';
import { AuthRepository } from './auth.repository';

type Register = RegisterStudent | RegisterManager | RegisterProfessor;
type Login = LoginStudent | LoginProfessorOrManager;

export class AuthService {
  
  public static async register(data: Register) {
    
    switch (data.role) {
      case ( 'STUDENT' ):

        const [ raAlreadyTaken, emailAlreadyTaken ] = await Promise.all([
          AuthRepository.raAlreadyTaken(data.ra),
          AuthRepository.emailAlreadyTaken(data.email),
        ]);
    
        if (emailAlreadyTaken) throw new ApiError('Este e-mail já está em uso', 422);
        if (raAlreadyTaken) throw new ApiError('Este RA já está cadastrado', 422);
    
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        return await AuthRepository.registerStudent({
          ...data,
          password : hashedPassword,
        });

      case ( 'PROFESSOR' ):
        //
        return;
      default:
        //
        return;
    }
  };

  public static async login(data: Login): Promise<LoginResponse> {
    
    switch (data.role) {
      case ( 'STUDENT' ): {

        const student = await AuthRepository.getStudentByRa(data.ra);
    
        if (!student) throw new ApiError('Credenciais inválidas', 401);
    
        const passwordMatch = await bcrypt.compare(
          data.password,
          student.user.password,
        );
    
        if (!passwordMatch) throw new ApiError('Credenciais inválidas', 401);
    
        const token = generateToken(student.user.id);

        return {
          token,
          user : {
            id           : student.user.id,
            email        : student.user.email,
            name         : student.user.name,
            registeredAt : student.user.createdAt.toISOString(),
            photo        : student.user.photo ?? '',
            ra           : student.ra,
            role         : 'STUDENT',
          },
        };

      } case ( 'PROFESSOR/MANAGER' ): {

        const user = await AuthRepository.getUserByEmail(data.email);
    
        if (!user) throw new ApiError('Credenciais inválidas', );
       
        const passwordMatch = await bcrypt.compare(
          data.password,
          user.password,
        );

        if (!passwordMatch) throw new ApiError('Credenciais inválidas', 401);

        const token = generateToken(user.id);

        const basicData = {
          id           : user.id,
          email        : user.email,
          name         : user.name,
          photo        : user.photo ?? '',
          registeredAt : user.createdAt.toISOString(),
        };

        if (user.role === 'MANAGER') {
          return {
            token,
            user: {
              ...basicData,
              role : 'MANAGER',
            },
          };     
        } else {
          return {
            token,
            user: {
              ...basicData,
              disciplines  : user.professor?.disciplines.map((discipline) => discipline.name) ?? [],
              role         : 'PROFESSOR',
            },
          };
        }
      }
    }
  }
}