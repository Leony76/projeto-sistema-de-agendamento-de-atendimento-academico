import { prisma } from "@backend/lib/prisma";
import type { ManagerRegisterStudent } from "@shared/types/managerRegisterUser.type";

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

  public static async registerStudent(
    data: ManagerRegisterStudent & { 
      temporaryPassword: string 
    }
  ) {
    return await prisma.user.create({
      data: {
        email    : data.email,
        name     : data.name,
        role     : data.role,
        password : data.temporaryPassword,
        student: {
          create: {
            ra: data.ra,
          }
        }
      }
    });
  }
}