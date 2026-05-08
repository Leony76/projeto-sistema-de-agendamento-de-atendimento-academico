import { prisma } from "@backend/lib/prisma";
import type { RegisterStudent } from "@shared/types/registerUser.type";

export class AuthRepository {
  
  public static async raAlreadyTaken(ra: string) {
    return Boolean(await prisma.student.findUnique({ where: { ra }}));
  }; 

  public static async emailAlreadyTaken(email: string) {
    return Boolean(await prisma.user.findUnique({ where: { email }}));
  };

  public static async getStudentByRa(ra: string) {
    return await prisma.student.findUnique({
      where  : { ra },
      select : { 
        ra   : true,
        user : {
          omit: { 
            deletedAt: true,
            updatedAt: true,
          },
        }, 
      },
    });
  };

  public static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        manager   : true,
        professor : { 
          include : { disciplines: true },
        },
      },
    });
  };

  public static async registerStudent(data: Omit<RegisterStudent, 'role'>) {
    return await prisma.$transaction( async(tx) => {
      const user = await tx.user.create({
        data: {
          name     : data.name,
          email    : data.email,
          password : data.password,
        },
      });

      const student = await tx.student.create({
        data: {
          userId : user.id,
          ra     : data.ra,
        },
      });

      return {
        id     : user.id, 
        name   : user.name,
        email  : user.email,
        ra     : student.ra,
      };
    });
  }
}