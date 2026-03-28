import { StudentService } from "../services/student.service";
import { Response, Request } from "express";

export class StudentController {

  static async list(
    req : Request,
    res : Response,
  ):Promise<Response>{
    try {
      const page = Number(req.query.page) || 1;
      const search = String(req.query.search || '');
      const filter = String(req.query.filter || '');
  
      const response = await StudentService.list(
        page, search, filter
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Houve um erro na listagem:', error);
      return res.status(500).json({
        error: 'Não foi possível carregar a lista de alunos. Tente novamente mais tarde.',
      });
    } 
  }

  static async registeredTodayList(
    req : Request, 
    res : Response
  ):Promise<Response>{
    try {
      const page = Number(req.query.page) || 1;
      const onlyToday = req.query.today === 'true';
  
      const response = await StudentService.registeredTodayList(
        page, onlyToday,
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Houve um erro ao mostrar a lista de alunos cadastrados no dia:', error);
      return res.status(500).json({
        error: 'Não foi possível carregar a lista de alunos cadastrados hoje. Tente novamente mais tarde.',
      });
    }
  }

  static async edit(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {  
      const { id } = req.params;
      const {
        name,
        email,
      } = req.body;
      
      const response = await StudentService.edit(
        Number(id), name, email
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Erro ao editar aluno:', error);
      const isExpectedError = error.message === 'Aluno não encontrado para edição';
      return res.status(isExpectedError ? 404 : 500).json({
        error: isExpectedError
          ? error.message 
          : 'Houve um erro interno ao editar as informações do aluno.',
      });
    }
  }

  static async remove(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {
      const { id } = req.params;

      const response = await StudentService.remove(Number(id));

      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Erro ao remover aluno:', error);
      const isExpectedError = error.message === 'Aluno não encontrado para ser removido';
      return res.status(isExpectedError ? 404 : 500).json({
        error: isExpectedError 
          ? error.message 
          : 'Houve um erro interno ao remover o aluno.',
      });
    }
  }
}