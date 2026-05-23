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
        appointment: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            room     : { select: { name: true }},
            status   : true,
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
        appointment: {
          select: {
            id       : true,
            reason   : true,
            dateTime : true,
            room     : { select: { name: true }},
            status   : true,
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
    });
  }
}