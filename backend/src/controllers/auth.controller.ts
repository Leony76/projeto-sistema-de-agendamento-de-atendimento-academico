import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {

  static async loginAsStudent(
    req: Request, 
    res: Response,
  ):Promise<Response>{
    try {
      const { ra, password } = req.body;
  
      const response = await AuthService.loginAsStudent(
        ra, password
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Credenciais inválidas';
      
      return res.status(isExpectedError ? 401 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro interno ao fazer login como estudante',
      });
    }
  }

  static async loginAsManager(
    req : Request,
    res : Response,
  ):Promise<Response>{
    try {
      const { email, password } = req.body;
  
      const response = await AuthService.loginAsManager(
        email, password
      )
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Credenciais inválidas';
      
      return res.status(isExpectedError ? 401 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro interno ao fazer login como gestor',
      });
    }
  }

  static async loginAsProfessor(
    req : Request,
    res : Response,
  ):Promise<Response>{
    try {
      const { email, password } = req.body;
  
      const response = await AuthService.loginAsProfessor(
        email, password
      )
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Credenciais inválidas';
      
      return res.status(isExpectedError ? 401 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro interno ao fazer login como professor',
      });
    }
  }
  
  static async registerAsStudent(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {
      const {
        studentName,
        email,
        ra,
      } = req.body;
  
      const response = await AuthService.registerAsStudent(
        studentName, email, ra
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Aluno já cadastrado com este e-mail ou RA';

      return res.status(isExpectedError ? 409 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro ao cadastrar o aluno',
      });
    }
  };

  static async registerAsManager(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {     
      const {
        name,
        email,
        password,
        role
      } = req.body;
  
      const response = await AuthService.registerAsManager(
        name, email, password, role
      );
  
      return res.json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Gestor já cadastrado com estas credenciais';

      return res.status(isExpectedError ? 409 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro ao cadastrar o gestor',
      });
    }
  }

  static async registerAsProfessor(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {     
      const {
        name,
        email,
        password,
        role
      } = req.body;
  
      const response = await AuthService.registerAsProfessor(
        name, email, password, role
      );
  
      return res.json(response);
    } catch (error:any) {
      console.error(error);
      const isExpectedError = error.message === 'Professor já cadastrado com estas credenciais';

      return res.status(isExpectedError ? 409 : 500).json({
        error: isExpectedError
          ? error.message
          : 'Houve um erro ao cadastrar o professor',
      });
    }
  }
}