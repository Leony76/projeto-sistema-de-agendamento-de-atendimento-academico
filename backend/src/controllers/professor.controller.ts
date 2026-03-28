import { ProfessorService } from "../services/professor.service";
import { Response, Request } from "express";

export class ProfessorController {

  static async list(
    req : Request,
    res : Response,
  ):Promise<Response>{
    try {
      const page = Number(req.query.page) || 1;
      const search = String(req.query.search || '');
      const filter = String(req.query.filter || '');
  
      const response = await ProfessorService.list(
        page, search, filter
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Houve um erro na listagem:', error);
      return res.status(500).json({
        error: 'Não foi possível carregar a lista de professores. Tente novamente mais tarde.',
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
  
      const response = await ProfessorService.registeredTodayList(
        page, onlyToday,
      );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Houve um erro ao mostrar a lista de professores cadastrados no dia:', error);
      return res.status(500).json({
        error: 'Não foi possível carregar a lista de proefessores cadastrados hoje. Tente novamente mais tarde.',
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
        discipline,
      } = req.body;
      
      const response = await ProfessorService.edit( Number(id), name, email, discipline );
  
      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Erro ao editar aluno:', error);
      const isExpectedError = error.message === 'Professor não encontrado para edição';
      return res.status(isExpectedError ? 404 : 500).json({
        error: isExpectedError
          ? error.message 
          : 'Houve um erro interno ao editar as informações do professor.',
      });
    }
  }

  static async remove(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {
      const { id } = req.params;

      const response = await ProfessorService.remove(Number(id));

      return res.status(200).json(response);
    } catch (error:any) {
      console.error('Erro ao remover professor:', error);
      const isExpectedError = error.message === 'Professor não encontrado para ser removido';
      return res.status(isExpectedError ? 404 : 500).json({
        error: isExpectedError 
          ? error.message 
          : 'Houve um erro interno ao remover o professor.',
      });
    }
  }
}