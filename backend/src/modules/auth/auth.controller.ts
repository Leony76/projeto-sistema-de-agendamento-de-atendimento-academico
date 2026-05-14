import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { ApiResponse } from '@shared/types/apiResponse.type';
import type * as L from '@shared/types/dtos/login.type.dto'; 
import type * as R from '@shared/types/dtos/register.type.dto'; 

export class AuthController {

  public static async studentRegistersHimself(req: Request, res: Response) {

    const request: R.StudentRegistersHimselfRequest = req.body;

    const studentRegistered = await AuthService.studentRegistersHimself(request);

    const response: ApiResponse<L.LoginResponse<R.StudentRegistersHimselfResponse>> = {
      message: 'Cadastro feito com sucesso!',
      success: true,
      data: studentRegistered,
    }

    return res.status(201).json(response);
  }



  public static async loginAsStudent(req: Request, res: Response) {
    
    const request: L.LoginAsStudentRequest = req.body;

    const loggedStudent: L.LoginResponse<L.LoginAsStudentResponse> = await AuthService.loginAsStudent(request);

    const response: ApiResponse<L.LoginResponse<L.LoginAsStudentResponse>> = {
      message : 'Login realizado com sucesso!',
      success : true,
      data    : loggedStudent,
    };

    return res.status(200).json(response);
  }


  

  public static async loginAsGeneric(req: Request, res: Response) {
    
    const request: L.LoginAsGenericRequest = req.body;

    const loggedUser: L.LoginResponse<L.LoginAsGenericResponse> = await AuthService.loginAsGeneric(request);

    const response: ApiResponse<L.LoginResponse<L.LoginAsGenericResponse>> = {
      message : 'Login realizado com sucesso!',
      success : true,
      data    : loggedUser,
    };

    return res.status(200).json(response);
  }



  public static async managerRegistersStudent(req: Request, res: Response) {
    
    const request: L.LoginAsGenericRequest = req.body;

    const loggedUser: L.LoginResponse<L.LoginAsGenericResponse> = await AuthService.loginAsGeneric(request);

    const response: ApiResponse<L.LoginResponse<L.LoginAsGenericResponse>> = {
      message : 'Login realizado com sucesso!',
      success : true,
      data    : loggedUser,
    };

    return res.status(200).json(response);
  }



  // public static async managerRegistersProfessor(req: Request, res: Response) {
    
  //   const request: R.ManagerRegistersProfessorRequest = req.body;

  //   const loggedUser: L.LoginResponse<L.LoginAsGenericResponse> = await AuthService.loginAsGeneric(request);

  //   const response: ApiResponse<L.LoginResponse<L.LoginAsGenericResponse>> = {
  //     message : 'Login realizado com sucesso!',
  //     success : true,
  //     data    : loggedUser,
  //   };

  //   return res.status(200).json(response);
  // }



  // public static async managerRegistersManager(req: Request, res: Response) {
    
  //   const request: R.ManagerRegistersManagerRequest = req.body;

  //   const loggedUser: L.LoginResponse<L.LoginAsGenericResponse> = await AuthService.loginAsGeneric(request);

  //   const response: ApiResponse<L.LoginResponse<L.LoginAsGenericResponse>> = {
  //     message : 'Login realizado com sucesso!',
  //     success : true,
  //     data    : loggedUser,
  //   };

  //   return res.status(200).json(response);
  // }
}