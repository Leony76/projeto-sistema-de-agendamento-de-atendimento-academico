import { prisma } from "@backend/lib/prisma";

export class DisciplineRepository {

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
}