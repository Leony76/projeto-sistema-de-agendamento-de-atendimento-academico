import type { RegisterManager, RegisterProfessor, RegisterStudent } from '@shared/types/registerUser.type';
import type { LoginProfessorOrManager, LoginStudent } from '@shared/types/loginUser.type';
import type { LoginResponse } from '@shared/types/loginResponse.type';
import { api } from './api.service';

export class AuthService {

  static async register(data: RegisterStudent | RegisterProfessor | RegisterManager) {

    const response = await api.post('auth/register', data);

    return response.data;
  };



  static async login(data: LoginStudent | LoginProfessorOrManager) {

    const response = await api.post<LoginResponse>('auth/login', data);

    return response.data;
  };
}