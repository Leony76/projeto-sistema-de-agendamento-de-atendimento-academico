import type { ApiResponse } from "@shared/types/apiResponse.type";
import { api } from "./api.service";

export class DisciplineService {

  public static async getUnboundNames() {
    
    const response = await api.get<string[]>('discipline/unbound-names');

    return response.data;
  };

  public static async addDiscipline(name: string) {

    const response = await api.post<ApiResponse<string>>('discipline/add', { name });

    return response.data;
  }
}