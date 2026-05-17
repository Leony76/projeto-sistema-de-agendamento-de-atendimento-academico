import type { SystemReportsResponse } from "@shared/types/dtos/systemReports.dto";
import { api } from "./api.service";

export class MiscService {

  public static async getSystemReports() {

    const response = await api.get<SystemReportsResponse>('/misc/system-reports');

    return response.data;
  }
}