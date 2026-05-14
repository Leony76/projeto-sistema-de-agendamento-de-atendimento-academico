import { prisma } from "@backend/lib/prisma";

export class UserRepository {

  public static async getActiveStudentsToManagerList() {
    return await prisma.user.findMany({
      where: {
        deletedAt : null,
        role      : 'STUDENT',
      },
      select: {
        createdAt : true,
        name      : true,
        id        : true,
        email     : true,
        photo     : true,
        student   : {
          select  : { ra: true },
        },
      },
    });
  }
  
  public static async getActiveProfessorsToManagerList() {
    return await prisma.user.findMany({
      where: {
        deletedAt: null,
        role      : 'PROFESSOR',
      },
      select: {
        createdAt : true,
        name      : true,
        id        : true,
        email     : true,
        photo     : true,
        professor   : {
          select  : {
            disciplines: {
              select: { name: true },
            },
          },
        },
      },
    });
  }
  
  public static async getActiveManagersToManagerList() {
    return await prisma.user.findMany({
      where: {
        deletedAt: null,
        role      : 'MANAGER',
      },
      select: {
        createdAt : true,
        name      : true,
        id        : true,
        email     : true,
        photo     : true,
      },
    });
  }
}