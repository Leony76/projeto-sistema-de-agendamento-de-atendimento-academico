import { api } from "./api.service";

export class DisciplineService {

  static async getUnboundNames() {
    
    const response = await api.get<string[]>('discipline/get-unbound-names');

    return response.data;
  };
}