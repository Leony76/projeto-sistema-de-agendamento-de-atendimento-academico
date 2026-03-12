import { StudentService } from "../services/student.service";
import { Response, Request } from "express";

export class StudentController {

  static async list(req:Request, res:Response):Promise<Response> {
    const page = Number(req.query.page) || 1;
    const search = String(req.query.search || '');
    const filter = String(req.query.filter || '');

    const response = await StudentService.list(
      page, search, filter
    );

    return res.json(response);
  }

  //

  static async registeredTodayList(req:Request, res:Response):Promise<Response> {

    const page = Number(req.query.page) || 1;
    const onlyToday = req.query.today === 'true';

    const response = await StudentService.registeredTodayList(
      page, onlyToday,
    );

    return res.json(response);
  }

  //

  static async edit(req:Request, res:Response):Promise<Response> {
    const { ra } = req.params;
    const {
      studentName,
      email,
    } = req.body;
    
    const response = await StudentService.edit(
      String(ra), studentName, email
    );

    return res.json(response);
  }
}