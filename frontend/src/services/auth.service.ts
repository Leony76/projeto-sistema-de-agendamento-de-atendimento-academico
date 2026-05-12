import { api } from './api.service';
import type { LoginAsGenericFormData, LoginAsStudentFormData } from '@shared/schemas/login.schema';
import type { RegisterStudentFormData } from '@shared/schemas/register.schema';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import type { LoginAsGenericResponse, LoginAsStudentResponse, LoginResponse } from '@shared/types/loginResponse.type';
import type { RegisterAsStudentResponse } from '@shared/types/registerResponse.type'

export class AuthService {

  static async registerAsStudent(data: Omit<RegisterStudentFormData, 'repeatPassword'>) {

    const response = await api.post<ApiResponse<RegisterAsStudentResponse>>('auth/register/student', data);

    return response.data;
  };

  static async loginAsStudent(data: LoginAsStudentFormData) {

    const response = await api.post<ApiResponse<LoginResponse<LoginAsStudentResponse>>>('auth/login/student', data);

    return response.data;
  };

  static async loginAsGeneric(data: LoginAsGenericFormData) {

    const response = await api.post<ApiResponse<LoginResponse<LoginAsGenericResponse>>>('auth/login/generic', data);

    return response.data;
  };
}