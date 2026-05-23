import { api } from './api.service';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import type * as R from '@shared/types/dtos/register.type.dto';
import type * as L from '@shared/types/dtos/login.type.dto';

export class AuthService {

  public static async studentRegisterHimself(data: R.StudentRegistersHimselfRequest) {

    const response = await api.post<
      ApiResponse<
        L.LoginResponse<
          R.StudentRegistersHimselfResponse>>>
            ('/auth/register/student', data);

    return response.data;
  };



  public static async registerStudent(data: R.ManagerRegistersStudentRequest) {

    const response = await api.post<
      ApiResponse<
        R.ManagersRegistersStudentResponse>>
          ('/auth/manager/register/student', data);

    return response.data;
  };



  public static async registerProfessor(data: R.ManagerRegistersProfessorRequest) {

    const response = await api.post<
      ApiResponse<
        R.ManagerRegistersProfessorResponse>>
          ('/auth/manager/register/professor', data);

    return response.data;
  };



  public static async registerManager(data: R.ManagerRegistersManagerRequest) {

    const response = await api.post<
      ApiResponse<
        R.ManagerRegistersManagerResponse>>
          ('/auth/manager/register/manager', data);

    return response.data;
  };



  public static async loginAsStudent(data: L.LoginAsStudentRequest) {

    const response = await api.post<
      ApiResponse<
        L.LoginResponse<
          L.LoginAsStudentResponse>>>
            ('/auth/login/student', data);

    return response.data;
  };



  public static async loginAsGeneric(data: L.LoginAsGenericRequest) {

    const response = await api.post<
      ApiResponse<
        L.LoginResponse<
          L.LoginAsGenericResponse>>>
            ('/auth/login/generic', data);

    return response.data;
  };
}