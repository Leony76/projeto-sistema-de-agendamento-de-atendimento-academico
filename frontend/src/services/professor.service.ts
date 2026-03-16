import api from "../api";
import { SearchProfessorsFilterValue } from "../maps/filters/searchProfessorsFilter";
import { ProfessorsListPromise } from "../types/promises/professorsListPromise";
import { RegisteredTodayProfessorsListPromise } from "../types/promises/registeredTodayProfessorsListPromise";
import { RegisterProfessorSchema } from "../schemas/registerProfessorSchema";
import { RegisterProfessorPayload } from "../types/payloads/registerProfessorPayload";

export class ProfessorService {
  
  static async list(
    page   : number,
    search : string,
    filter : SearchProfessorsFilterValue,
  ):Promise<ProfessorsListPromise> {

    const URL:string = `/professors/list?page=${page}&search=${search}&filter=${filter}`;
    
    const response = await api.get<ProfessorsListPromise>(URL);

    return response.data;
  };

  static async registeredInTheDayList(
    page : number,
  ):Promise<RegisteredTodayProfessorsListPromise> {

    const URL:string = `/professors/registered-today-list?page=${page}&today=true`;

    const response = await api.get<RegisteredTodayProfessorsListPromise>(URL);

    return response.data;
  };

  static async remove(
    email : string,
  ):Promise<string> {

    const URL:string = `/professors/remove/${email}`;

    const response = await api.put(URL, email);

    return response.data.success;
  };

  static async edit(
    data           : RegisterProfessorSchema,
    professorEmail : string,
  ):Promise<string> {

    const URL:string = `/professors/update/${professorEmail}`;

    const response = await api.put(URL, data);

    return response.data.success;
  };

  static async register(
    data : RegisterProfessorPayload
  ):Promise<string> {

    const URL:string = `/auth/register/professor`;

    const payload:RegisterProfessorPayload = {
      name        : data.name, 
      email       : data.email,      
      discipline  : data.discipline,          
    };

    const response = await api.post(URL, payload);

    return response.data.success;
  };
};