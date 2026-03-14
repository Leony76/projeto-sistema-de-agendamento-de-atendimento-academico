import { SearchStudentsFilterValue } from "../maps/filters/searchStudentsFilter";
import axios from "axios";
import { StudentListPromise } from "../types/promises/studentsListPromise";
import { RegisterStudentPayload } from "../types/payloads/registerStudentPayload";
import { RegisterStudentSchema } from "../schemas/registerStudentSchema";
import { RegisteredTodayStudentsListPromise } from "../types/promises/registeredTodayStudentsListPromise";
import api from "../api";

export class StudentService {

  private static readonly baseApiURL = `${import.meta.env.VITE_BACKEND_BASE_URL}/api`;
  
  static async list(
    page   : number,
    search : string,
    filter : SearchStudentsFilterValue,
  ):Promise<StudentListPromise> {

    const URL:string = `/students/list?page=${page}&search=${search}&filter=${filter}`;
    
    const response = await api.get<StudentListPromise>(URL);

    return response.data;
  };

  static async registeredInTheDayList(
    page : number,
  ):Promise<RegisteredTodayStudentsListPromise> {

    const URL:string = `/students/registered-today-list?page=${page}&today=true`;

    const response = await api.get<RegisteredTodayStudentsListPromise>(URL);

    return response.data;
  };

  static async remove(
    ra : string,
  ):Promise<string> {

    const URL:string = `/students/remove/${ra}`;

    const response = await api.put(URL, ra);

    return response.data.success;
  };

  static async edit(
    data      : RegisterStudentSchema,
    studentRa : string,
  ):Promise<string> {

    const URL:string = `/students/update/${studentRa}`;

    const response = await api.put(URL, data);

    return response.data.success;
  };

  static async register(
    data : RegisterStudentPayload
  ):Promise<string> {

    const URL:string = `/auth/register/student`;

    const payload:RegisterStudentPayload = {
      studentName : data.studentName, 
      email       : data.email,      
      ra          : data.ra,          
    };

    const response = await api.post(URL, payload);

    return response.data.success;
  };
};