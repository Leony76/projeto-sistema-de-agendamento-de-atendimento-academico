import type { UserRole } from "@backend/generated/prisma/enums";
import { prisma } from "@backend/lib/prisma";

export class HistoryRepository {

  public static async isAppointmentHistoryAlreadyRemoved(
    id: number,
    role: Exclude<UserRole, 'MANAGER'>
  ) {
    return Boolean(
      await prisma.history.findFirst({
        where: {
          id,
          ...(role === 'STUDENT'
            ? { deletedByStudentAt: { not: null } }
            : { deletedByProfessorAt: { not: null } }
          ),
        },
      })
    );
  }



  public static async findAppointmentHistoryById(id: number) {
    return prisma.history.findUnique({
      where: { id },
      select: {
        appointment: {
          select: {
            studentId: true,
            professorId: true,
          }
        }
      }
    });
  }



  public static async getStudentAppointmentsHistory(id: number) {
    return await prisma.history.findMany({
      where: {
        deletedByStudentAt : null,
        appointment : { 
          studentId : id,
          status    : {
            in: ['DONE' , 'NO_SHOW'],
          }
        },
      },
      select: {
        id: true,
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
        deletedByProfessorAt : null,
        appointment   : { 
          professorId : id,
          status      : {
            in: ['DONE' , 'NO_SHOW'],
          }
        },
      },
      select: {
        id: true,
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



  public static async removeAppointmentHistory(id: number, role: Exclude<UserRole, 'MANAGER'>) {
    return await prisma.history.update({
      where  : { id },
      select : { id: true },
      data   : role === 'STUDENT' 
        ? { deletedByStudentAt   : new Date() } 
        : { deletedByProfessorAt : new Date() },
    });
  }
}