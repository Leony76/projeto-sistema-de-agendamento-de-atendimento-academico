import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { type LoginAsStudentFormData } from '@shared/schemas/login.schema';
import type { LoginAsStudentResponse, LoginResponse } from '@shared/types/loginResponse.type';
import type { RegisterStudentFormData } from '@shared/schemas/register.schema';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import { type RegisterAsStudentResponse } from '@shared/types/RegisterResponse.type'

export class AuthController {

  public static async selfStudentRegistration(req: Request, res: Response) {

    const student: Omit<RegisterStudentFormData, 'repeatPassword'> = req.body;

    const user = await AuthService.selfStudentRegistration(student);

    const response: ApiResponse<RegisterAsStudentResponse> = {
      message: 'Cadastro feito com sucesso!',
      success: true,
      data: { 
        email: user.email,
        id: user.id,
        name: user.name,
        photo: user.photo ?? '',
        ra: user.student?.ra ?? '',
        registeredAt: user.createdAt.toISOString(),
        role: user.role,
      }
    }

    return res.status(201).json(response);
  }

  public static async loginAsStudent(req: Request, res: Response) {
    
    const data: LoginAsStudentFormData = req.body;

    const loginAsStudent: LoginResponse<LoginAsStudentResponse> = await AuthService.loginAsStudent(data);

    const response: ApiResponse<LoginResponse<LoginAsStudentResponse>> = {
      data    : loginAsStudent,
      message : 'Login realizado com sucesso!',
      success : true,
    };

    return res.status(200).json(response);
  }
}