import { StudentLoginFormSchema, ManagerLoginFormSchema } from "../schemas/loginSchema";
import { isStudentData } from "../types/guards/managerAndStudentGuard";
import { ManagerPayload } from "../types/payloads/managerLoginPayload";
import { StudentPayload } from "../types/payloads/studentLoginPayload";
import { LoginPromise } from "../types/promises/login.promise";
import api from "../api";
import { SystemRoles } from "../types/systemRoles";

export class AuthService {

  static async login(
    data : StudentLoginFormSchema | ManagerLoginFormSchema,
    role : SystemRoles,
  ):Promise<LoginPromise> {
    
    const fetchURL:string = `/auth/login/${role.toLowerCase()}`;

    const payload: ManagerPayload | StudentPayload = isStudentData(data) 
      ? { ra    : data.ra    , password: data.password }
      : { email : data.email , password: data.password };

    const response = await api.post(fetchURL, payload);

    if (response.data.error) {
       throw new Error(response.data.error);
    }

    return {
      token: response.data.token,
      user:  response.data.user,
    };
  }
}