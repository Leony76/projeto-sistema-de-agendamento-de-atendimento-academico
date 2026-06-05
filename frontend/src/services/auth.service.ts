import { api } from './api.service';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import type * as R from '@shared/types/dtos/register.type.dto';
import type * as L from '@shared/types/dtos/login.type.dto';
import type { LoginAs } from '@shared/types/loginAs.type';
import type { UserRole } from '@backend/generated/prisma/enums';

export class AuthService {

  public static async studentRegisterHimself(data: R.StudentRegistersHimselfRequest) {

    const response = await api.post<ApiResponse<L.LoginResponse<R.StudentRegistersHimselfResponse>>>(
      '/auth/register/student', data
    );

    return response.data;
  };



  public static async managerRegisterUser<T extends Lowercase<UserRole>>(
    role : T,
    data : R.ManagerRegisterUserRequest,
  ) {

    const response = await api.post<ApiResponse<
      T extends 'student'
        ? R.ManagersRegistersStudentResponse
      : T extends 'professor'
        ? R.ManagerRegistersProfessorResponse
        : R.ManagerRegistersManagerResponse
    >>(
      `/auth/manager/register/${role}`, data
    );

    return response.data;
  };



  public static async login<T extends Lowercase<LoginAs>>(
    as   : T,
    data : L.LoginRequest,
  ) {

    const response = await api.post<ApiResponse<L.LoginResponse<
      T extends 'student' 
        ? L.LoginAsStudentResponse
        : L.LoginAsGenericResponse
    >>>(
      `/auth/login/${as}`, data
    );

    return response.data;
  };
}