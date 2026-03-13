import { SearchStudentsFilterValue } from "../maps/filters/searchStudentsFilter";
import axios from "axios";
import { StudentListPromise } from "../types/promises/studentsListPromise";
import { RegisterStudentPayload } from "../types/payloads/registerStudentPayload";
import { RegisterStudentSchema } from "../schemas/registerStudentSchema";
import { RegisteredTodayStudentsListPromise } from "../types/promises/registeredTodayStudentsListPromise";

export class StudentService {

  private static readonly baseApiURL = `${import.meta.env.VITE_BACKEND_BASE_URL}/api`;
  
  static async list(
    page   : number,
    search : string,
    filter : SearchStudentsFilterValue,
  ):Promise<StudentListPromise> {
    const URL = `${this.baseApiURL}/students/list?page=${page}&search=${search}&filter=${filter}`;
    
    const response = await axios.get<StudentListPromise>(URL);

    return response.data;
  };

  static async registeredInTheDayList(
    page : number,
  ):Promise<RegisteredTodayStudentsListPromise> {
    const URL = `${this.baseApiURL}/students/registered-today-list?page=${page}&today=true`;

    const response = await axios.get<RegisteredTodayStudentsListPromise>(URL);

    return response.data;
  };

  static async remove(
    ra : string,
  ):Promise<string> {
    const URL = `${this.baseApiURL}/students/remove/${ra}`;

    const response = await axios.put(URL, ra);

    return response.data.success;
  };

  static async edit(
    data      : RegisterStudentSchema,
    studentRa : string,
  ):Promise<string> {
    const URL = `${this.baseApiURL}/students/update/${studentRa}`;

    const response = await axios.put(URL, data);

    return response.data.success;
  };

  static async register(data:RegisterStudentPayload):Promise<string> {
    const URL = `${this.baseApiURL}/auth/register/student`;
    const payload:RegisterStudentPayload = {
      studentName : data.studentName, 
      email       : data.email,      
      ra          : data.ra,          
    };

    const response = await axios.post(URL, payload);

    return response.data.success;
  };
};