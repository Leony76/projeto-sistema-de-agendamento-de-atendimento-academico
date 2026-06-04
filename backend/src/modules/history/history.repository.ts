import { prisma } from "@backend/lib/prisma";

export class HistoryRepository {

  public static async getStudentAppointmentsHistory(id: number) {
    return await prisma.history.findMany({
      where: {
        appointment : { 
          studentId : id,
          status    : {
            in: ['DONE' , 'NO_SHOW'],
          }
        },
      },
      select: {
        room: {
          select: { name: true }
        },
        appointment: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            status   : true,
            registeredAt: true,
            updatedAt: true,
            professor: {
              select: {
                disciplines: { select: { name: true }},
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
      orderBy: { registeredAt: 'desc' },
    });
  }

  public static async getProfessorAppointmentsHistory(id: number) {
    return await prisma.history.findMany({
      where: {
        appointment   : { 
          professorId : id,
          status      : {
            in: ['DONE' , 'NO_SHOW'],
          }
        },
      },
      select: {
        room : { select: { name: true }},
        appointment: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,           
            status   : true,
            registeredAt: true,
            updatedAt: true,
            student  : {
              select : {
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
      orderBy: { registeredAt: 'desc' },
    });
  }
}