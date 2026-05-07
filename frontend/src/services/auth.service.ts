import type { RegisterUser } from '@shared/types/registerUser.type';
import { api } from './api.service';

type LoginUser = {
  email: string;
  password: string;
};

export class AuthService {

  static async register(data: RegisterUser) {
    const response = await api.post('/register', data);

    return response.data;
  };



  static async login(data: LoginUser) {
    const response = await api.post('/login', data);

    return response.data;
  };
}