import type { ManagerRegistersStudentFormData } from "@shared/schemas/newUser.schema";
import { api } from "./api.service";
import type { ApiResponse } from '@shared/types/apiResponse.type';

export class ManagerService {

  public static async registerStudent(
    data : ManagerRegistersStudentFormData,
  ): Promise<ApiResponse<ManagerRegistersStudentFormData>> {
    const response = await api.post<ApiResponse<ManagerRegistersStudentFormData>>('manager/register/student', data);

    return response.data;
  };
}