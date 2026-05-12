import { prisma } from "@backend/lib/prisma";
import type { RegisterStudentFormData } from "@shared/schemas/register.schema";

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

  public static async selfStudentRegistration(data: Omit<RegisterStudentFormData, 'repeatPassword'>) {
    return await prisma.user.create({
      data: {
        name     : data.name,
        email    : data.email,
        password : data.password,
        student: {
          create: {
            ra: data.ra,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }
}