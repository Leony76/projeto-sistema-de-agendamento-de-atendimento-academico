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

  public static async findUserById(id: number): Promise<boolean> {
    return Boolean(await prisma.user.findUnique({
      where: { id },
    }));
  }

  public static async getProfessorGeneralInfos(id: number) {
    return await prisma.professor.findUnique({
      where  : { userId: id },
      select : {
        disciplines: {
          select: { name: true }
        },
        user: {
          select: {
            id        : true,
            name      : true,
            email     : true,
            photo     : true,
            createdAt : true,
          },
        },
        solicitations: {
          select: {
            id       : true,
            dateTime : true,
            status   : true,
            appointment: {
              select: { reason: true },
            },
            student: {
              select: {
                user: {
                  select: {
                    name  : true,
                    photo : true,
                  },
                },
              },
            },
          },
        },
        appointments: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            room: {
              select: { name: true },
            },
            student: {
              select: {
                user: {
                  select: {
                    name  : true,
                    photo : true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  public static async getStudentGeneralInfos(id: number) {
    return await prisma.student.findUnique({
      where  : { userId: id },
      select : {
        ra: true,
        user: {
          select: {
            id        : true,
            name      : true,
            email     : true,
            photo     : true,
            createdAt : true,
          },
        },
        solicitations: {
          select: {
            id       : true,
            dateTime : true,
            status   : true,
            appointment: {
              select: { reason: true },
            },
            professor: {
              select: {
                user: {
                  select: {
                    name  : true,
                    photo : true,
                  },
                },
              },
            },
          },
        },
        appointments: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            room: {
              select: { name: true },
            },
            professor: {
              select: {
                user: {
                  select: {
                    name  : true,
                    photo : true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  public static async getManagerGeneralInfos(id: number) {
    return await prisma.manager.findUnique({
      where  : { userId: id },
      select : {
        ra   : true,
        user : {
          select: {
            id        : true,
            name      : true,
            email     : true,
            photo     : true,
            createdAt : true,
          },
        },
      },
    });
  }
}