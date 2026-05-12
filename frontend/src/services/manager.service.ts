import type { NewStudentFormData } from "@shared/schemas/newUser.schema";
import { api } from "./api.service";
import type { ApiResponse } from '@shared/types/apiResponse.type';

export class ManagerService {

  public static async registerStudent(
    data : NewStudentFormData,
  ): Promise<ApiResponse<NewStudentFormData>> {
    const response = await api.post<ApiResponse<NewStudentFormData>>('manager/register/student', data);

    return response.data;
  };
}