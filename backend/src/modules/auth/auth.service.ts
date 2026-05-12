import bcrypt from 'bcrypt';
import { generateToken } from '@backend/lib/jwt';
import type { LoginAsStudentResponse, LoginResponse } from '@shared/types/loginResponse.type';
import { ApiError } from '@backend/utils/apiError.util';
import { AuthRepository } from './auth.repository';
import type { RegisterStudentFormData } from '@shared/schemas/register.schema';
import type { LoginAsStudentFormData } from '@shared/schemas/login.schema';

export class AuthService {

  public static async selfStudentRegistration(data: Omit<RegisterStudentFormData, 'repeatPassword'>) {

    const [ raAlreadyTaken, emailAlreadyTaken ] = await Promise.all([
      AuthRepository.raAlreadyTaken(data.ra),
      AuthRepository.emailAlreadyTaken(data.email),
    ]);

    if (emailAlreadyTaken) throw new ApiError('Este e-mail já está em uso', 422);
    if (raAlreadyTaken) throw new ApiError('Este RA já está cadastrado', 422);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return await AuthRepository.selfStudentRegistration({
      ...data,
      password : hashedPassword,
    });
  };

  public static async loginAsStudent(data: LoginAsStudentFormData): Promise<LoginResponse<LoginAsStudentResponse>> {

    const student = await AuthRepository.getStudentByRa(data.ra);

    if (!student) 
      throw new ApiError('Credenciais inválidas', 401)
    ;

    const passwordMatch = await bcrypt.compare(
      data.password,
      student.user.password,
    );

    if (!passwordMatch) 
      throw new ApiError('Credenciais inválidas', 401)
    ;

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
        role         : 'STUDENT'
      },
    };
  }
}



