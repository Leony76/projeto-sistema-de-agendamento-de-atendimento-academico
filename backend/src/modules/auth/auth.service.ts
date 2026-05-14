import bcrypt from 'bcrypt';
import { generateToken } from '@backend/lib/jwt';
import { ApiError } from '@backend/utils/apiError.util';
import { AuthRepository } from './auth.repository';
import type * as L from '@shared/types/dtos/login.type.dto'; 
import type * as R from '@shared/types/dtos/register.type.dto'; 

export class AuthService {

  private static async validatePassword(
    passwordRequest : string, 
    userPassword    : string
  ): Promise<void> {
    const passwordMatch = await bcrypt.compare(
      passwordRequest,
      userPassword,
    );

    if (!passwordMatch) 
      throw new ApiError('Credenciais inválidas', 401)
    ;
  }



  public static async studentRegistersHimself(
    data : R.StudentRegistersHimselfRequest
  ): Promise<L.LoginResponse<R.StudentRegistersHimselfResponse>> {

    const [ raAlreadyTaken, emailAlreadyTaken ] = await Promise.all([
      AuthRepository.raAlreadyTaken(data.ra),
      AuthRepository.emailAlreadyTaken(data.email),
    ]);

    if (emailAlreadyTaken) throw new ApiError('Este e-mail já está em uso', 422);
    if (raAlreadyTaken) throw new ApiError('Este RA já está cadastrado', 422);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const registeredStudent = await AuthRepository.registerStudent({
      ...data,
      password : hashedPassword,
    });

    if (!registeredStudent.student) 
      throw new ApiError('Houve um erro no seu cadastro. Tente novamente mais tarde!')
    ;

    const token = generateToken(registeredStudent.id);
    
    return {
      token,
      user: {
        ...registeredStudent,
        photo        : registeredStudent.photo ?? '',
        registeredAt : registeredStudent.createdAt.toISOString(),  
        ra           : registeredStudent.student.ra,
        role         : 'STUDENT'
      },
    }
  };



  public static async loginAsStudent(
    data: L.LoginAsStudentRequest
  ): Promise<L.LoginResponse<L.LoginAsStudentResponse>> {

    const student = await AuthRepository.getStudentByRa(data.ra);

    if (!student) 
      throw new ApiError('Credenciais inválidas', 401)
    ;

    this.validatePassword(data.password, student.user.password);

    const token = generateToken(student.user.id);

    return {
      token,
      user : {
        ...student.user,
        registeredAt : student.user.createdAt.toISOString(),
        photo        : student.user.photo ?? '',
        ra           : student.ra,
        role         : 'STUDENT'
      },
    };
  }



  public static async loginAsGeneric(
    data: L.LoginAsGenericRequest
  ): Promise<L.LoginResponse<L.LoginAsGenericResponse>> {

    const user = await AuthRepository.getUserByEmail(data.email);

    if (!user) 
      throw new ApiError('Credenciais inválidas', 401)
    ;

    await this.validatePassword(data.password, user.password);

    const token = generateToken(user.id);

    switch (user.role) {
      case 'PROFESSOR':
        return {
          token,
          user: {
            ...user,
            role         : 'PROFESSOR',
            disciplines  : user.professor?.disciplines.map((discipline) => discipline.name) ?? [],
            photo        : user.photo ?? '',
            registeredAt : user.createdAt.toISOString(),
          }
        }
      default:
        return {
          token,
          user: {
            ...user,
            role         : 'MANAGER',
            photo        : user.photo ?? '',
            registeredAt : user.createdAt.toISOString(),
          }
        }
    }
  }
}



