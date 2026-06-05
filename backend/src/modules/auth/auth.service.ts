import bcrypt from 'bcrypt';
import { generateToken } from '@backend/lib/jwt';
import { ApiError } from '@backend/utils/apiError.util';
import { AuthRepository } from './auth.repository';
import type * as L from '@shared/types/dtos/login.type.dto'; 
import type * as R from '@shared/types/dtos/register.type.dto'; 
import { generateTemporaryPassword } from '@backend/utils/generateTemporaryPassword.util';
import { MailService } from '../mail/mail.service';
import { studentBasicInfosFromRegistrationMapper, studentBasicInfosMapper } from './mappers/studentBasicInfos.mapper';
import { professorBasicInfosMapper } from './mappers/professorBasicInfos.mapper';
import { managerBasicInfosMapper } from './mappers/managerBasicInfos.mapper';

export class AuthService {

  private static async ensureUserDoesNotExist(email: string, ra?: string): Promise<void> {

    const emailPromise = AuthRepository.emailAlreadyTaken(email);

    if (ra) {
      const [emailAlreadyTaken, raAlreadyTaken] = await Promise.all([
        emailPromise,
        AuthRepository.raAlreadyTaken(ra),
      ]);

      if (emailAlreadyTaken)
        throw new ApiError('Já há um usuário cadastrado com esse e-mail', 422);
      if (raAlreadyTaken)
        throw new ApiError('Já há um aluno cadastrado com esse RA', 422);

      return;
    }

    const emailAlreadyTaken = await emailPromise;

    if (emailAlreadyTaken)
      throw new ApiError('Já há um usuário cadastrado com esse e-mail', 422);
  }


  
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



  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }



  public static async studentRegistersHimself(
    data : R.StudentRegistersHimselfRequest
  ): Promise<L.LoginResponse<R.StudentRegistersHimselfResponse>> {

    await this.ensureUserDoesNotExist(data.email, data.ra);

    const hashedPassword = await this.hashPassword(data.password);

    const registeredStudent = await AuthRepository.registerStudent({
      ...data,
      password : hashedPassword,
    });

    if (!registeredStudent.student) 
      throw new ApiError('Houve um erro no seu cadastro. Tente novamente mais tarde!', 500);

    const token = generateToken(registeredStudent.id, registeredStudent.role);
    
    return {
      token,
      user : studentBasicInfosFromRegistrationMapper(registeredStudent),
    }
  };



  public static async managerRegistersStudent(
    data: R.ManagerRegistersStudentRequest
  ): Promise<R.ManagersRegistersStudentResponse> {

    await this.ensureUserDoesNotExist(data.email, data.ra);

    const temporaryPassword = generateTemporaryPassword(8);
    const hashedPassword = await this.hashPassword(temporaryPassword);

    const studentRegistered = await AuthRepository.registerStudent({
      ...data,
      password: hashedPassword,
    }, true);

    if (!studentRegistered.student || !studentRegistered)
      throw new ApiError('Houve um erro ao tentar cadastrar o aluno. Tente novamente mais tarde!', 500);

    await MailService.sendTemporaryPasswordEmail(
      studentRegistered.email,
      studentRegistered.name,
      temporaryPassword,
      studentRegistered.student.ra,
    );
    
    return {
      name  : studentRegistered.name,
      email : studentRegistered.email,
      ra    : studentRegistered.student.ra,
    }
  }



  public static async managerRegistersProfessor(
    data: R.ManagerRegistersProfessorRequest
  ): Promise<R.ManagerRegistersProfessorResponse> {

    await this.ensureUserDoesNotExist(data.email);

    const professorsDisciplineAlreadyTaken = await AuthRepository.professorsDisciplineAlreadyTaken(data.disciplines);

    if (professorsDisciplineAlreadyTaken)
      throw new ApiError('Uma ou mais disciplinas já possuem professor', 409)

    const temporaryPassword = generateTemporaryPassword(8);
    const hashedPassword = await this.hashPassword(temporaryPassword);

    const professorRegistered = await AuthRepository.registerProfessor({
      ...data,
      password: hashedPassword
    });

    if (!professorRegistered)
      throw new ApiError('Houve um erro no cadastro do professor. Tente novamente mais tarde!');
    
    await MailService.sendTemporaryPasswordEmail(
      professorRegistered.email,
      professorRegistered.name,
      temporaryPassword,
    );
    
    return {
      name        : professorRegistered.name,
      email       : professorRegistered.email,
      disciplines : professorRegistered.professor?.disciplines.map(
        (discipline) => discipline.name
      ) ?? [],
    }
  };
  
  
  
  public static async managerRegistersManager(
    data: R.ManagerRegistersManagerRequest
  ): Promise<R.ManagerRegistersManagerResponse> {
    
    await this.ensureUserDoesNotExist(data.email);
    
    const temporaryPassword = generateTemporaryPassword(8);
    const hashedPassword = await this.hashPassword(temporaryPassword);
    
    const managerRegistered = await AuthRepository.registerManager({
      ...data,
      password : hashedPassword,
    });

    if (!managerRegistered)
      throw new ApiError('Houve um erro no cadastro do gestor. Tente novamente mais tarde!', 500);

    await MailService.sendTemporaryPasswordEmail(
      managerRegistered.email,
      managerRegistered.name,
      temporaryPassword,
    );

    return { 
      email : managerRegistered.email,
      name  : managerRegistered.name,
    };
  };



  public static async loginAsStudent(
    data: L.LoginAsStudentRequest
  ): Promise<L.LoginResponse<L.LoginAsStudentResponse>> {

    const student = await AuthRepository.getStudentByRa(data.ra);

    if (!student) throw new ApiError('Credenciais inválidas', 401);

    await this.validatePassword(data.password, student.user.password);

    const token = generateToken(student.user.id, student.user.role);

    return {
      token,
      user : studentBasicInfosMapper(student),
    };
  }



  public static async loginAsGeneric(
    data: L.LoginAsGenericRequest
  ): Promise<L.LoginResponse<L.LoginAsGenericResponse>> {

    const user = await AuthRepository.getUserByEmail(data.email);

    if (!user) 
      throw new ApiError('Credenciais inválidas', 401);

    await this.validatePassword(data.password, user.password);

    const token = generateToken(user.id, user.role);

    switch (user.role) {
      case 'PROFESSOR':
        return {
          token,
          user: professorBasicInfosMapper(user),
        }
      default:
        return {
          token,
          user: managerBasicInfosMapper(user),
        }
    }
  }
}



