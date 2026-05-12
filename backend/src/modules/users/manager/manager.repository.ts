import { prisma } from "@backend/lib/prisma";

export class ManagerRepository {
  
  public static async verifyStudentAlreadyRegisteredByRa(ra: string): Promise<boolean> {
    const count = await prisma.student.count({
      where: { ra }
    });

    return count > 0;
  }

  public static async verifyStudentAlreadyRegisteredByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email }
    });

    return count > 0;
  }

  public static async getStudentByRa(ra: string) {
    return await prisma.student.findUnique({
      where: { ra }
    });
  };
}