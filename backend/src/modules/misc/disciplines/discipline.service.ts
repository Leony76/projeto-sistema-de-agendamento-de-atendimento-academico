import { DisciplineRepository } from "./disciplines.repository";

export class DisciplineService {

  public static async getNames(): Promise<string[]> {
    const disciplines = await DisciplineRepository.getNames(); 

    return disciplines.map((discipline) => discipline.name);
  };

  public static async getUnboundNames(): Promise<string[]> {
    const disciplines = await DisciplineRepository.getUnboundNames(); 

    return disciplines.map((discipline) => discipline.name);
  };
}