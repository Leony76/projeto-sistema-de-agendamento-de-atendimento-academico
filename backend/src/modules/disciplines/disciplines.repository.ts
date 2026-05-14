import { prisma } from "@backend/lib/prisma";

export class DisciplineRepository {

  public static async disciplineAlreadyRegistered(name: string): Promise<boolean> {
    return Boolean(await prisma.discipline.findFirst({
      where: { name },
    }));
  };

  public static async getNames() {
    return await prisma.discipline.findMany({
      select: { name: true },
    })
  };

  public static async getUnboundNames() {
    return await prisma.discipline.findMany({
      where  : { professorId: null },
      select : { name: true },
    })
  };

  public static async addDiscipline(data: string) {
    return await prisma.discipline.create({
      data: {
        name: data,
      }
    });
  };
}