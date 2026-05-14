import { ApiError } from "@backend/utils/apiError.util";
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

  public static async add(data: string): Promise<string> {

    const disciplineAlreadyRegistered = await DisciplineRepository.disciplineAlreadyRegistered(data);

    if (disciplineAlreadyRegistered)
      throw new ApiError('Esta disciplina já está cadastrada');

    const newDiscipline = await DisciplineRepository.addDiscipline(data); 

    return newDiscipline.name;
  };
}