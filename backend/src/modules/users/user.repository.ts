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
        disciplines: { select: { name: true }},
        user: {
          select: {
            id        : true,
            name      : true,
            email     : true,
            photo     : true,
            createdAt : true,
          },
        },
        appointments: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            status   : true,
            room: { select: { name: true }},
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
        appointments: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            status   : true,
            room     : { select : { name: true }},
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

  public static async excludeUsers(ids: number[]) {
    await prisma.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: { deletedAt: new Date() },
    });
  }

  public static async getManagerBriefInfos() {
    
    const [ appointments, solicitations, students, professors ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.student.count(),
      prisma.professor.count(),
    ]);

    return {
      appointments, 
      solicitations,
      students, 
      professors
    }
  }

  public static async getProfessorBriefInfos(id: number) {
    
    const [ appointmentsConfirmed, pendingSolicitations, nextAppointmentDateTime ] = await Promise.all([
      prisma.appointment.count({
        where: {
          professorId : id,
          status      : {
            in: ['ACCEPTED', 'CONFIRMED']
          },
        }
      }),
      
      prisma.appointment.count({
        where: {
          professorId : id,
          status      : 'PENDING'
        }
      }),

      prisma.appointment.findFirst({
        where: {
          professorId : id,
          dateTime    : { gte: new Date() },
          status      : {
            in: ['ACCEPTED', 'CONFIRMED']
          },
        },
        orderBy : { dateTime: 'asc' },
        select  : { dateTime: true  },
      })
    ]);

    return {
      appointmentsConfirmed,
      pendingSolicitations, 
      nextAppointmentDateTime,
    }
  }

  public static async getStudentBriefInfos(id: number) {
    
    const [ appointmentsMade, pendingSolicitations, nextAppointmentDateTime ] = await Promise.all([
      prisma.appointment.count({
        where: {
          studentId : id,
          status    : 'DONE',
        }
      }),
      
      prisma.appointment.count({
        where: {
          studentId : id,
          status    : 'PENDING'
        }
      }),

      prisma.appointment.findFirst({
        where: {
          studentId: id,
          dateTime: { gte: new Date() },
          status: 'CONFIRMED',
        },
        orderBy: {
          dateTime: 'asc',
        },
        select: {
          dateTime: true,
        },
      })
    ]);

    return {
      appointmentsMade,
      pendingSolicitations, 
      nextAppointmentDateTime,
    }
  }

  public static async getUserPasswordById(userId: number) {
    const data =  await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    return data?.password;
  }

  public static async changeUserTemporaryPassword(userId: number, newPassword: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password             : newPassword,
        hasTemporaryPassword : false,
      },
    });
  }
}