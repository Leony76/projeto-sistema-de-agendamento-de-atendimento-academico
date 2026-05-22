import { prisma } from "@backend/lib/prisma";
import type { AppointmentSolicitationRequest } from "@shared/types/dtos/appointmentSolicitation.dto";

export class AppointmentRepository {

  public static async getProfessorAvailabilityAndAppointments(
    professorId : number,
    date        : Date,
  ) {

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.professor.findUnique({
      where: {
        userId: professorId,
      },
      include: {
        availability: {
          where: {
            deletedAt: null,
          },
        },
        appointments: {
          where: {
            deletedAt: null,
            dateTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              not: 'CANCELED',
            },
          },
          select: {
            dateTime: true,
          },
        },
      },
    });
  }

  public static async getAvailableProfessorsToSchedule() {
    return await prisma.professor.findMany({
      where: {
        availability: {
          some: {
            deletedAt: null,
          },
        },
      },
      include: {
        user         : true,
        disciplines  : true,
        availability : {
          where: { deletedAt: null },
        },
      },
    });
  }

  public static async solicitateAppointment(data: AppointmentSolicitationRequest) {
    return await prisma.appointment.create({
      data: {
        dateTime    : data.dateTime,
        reason      : data.reason,
        studentId   : data.studentId,
        professorId : data.professorId,
        status      : 'PENDING',
      },
      select: {
        dateTime  : true,
        reason    : true,
        professor : { select: { user: { select: { name: true }}}}
      }
    });
  }

  public static async getStudentSolicitations(id: number) {
    return await prisma.appointment.findMany({
      where: {
        studentId: id,
        status: {
          in: ['PENDING', 'REJECTED', 'CONFIRMED']
        }
      },
      select: {
        id       : true,
        reason   : true,
        dateTime : true,
        status   : true,
        professor: {
          select: {
            user: {
              select: {
                name: true,
                photo: true,
              }
            },
            disciplines: {
              select: { name: true }
            },
          }
        }
      }
    })
  }

  public static async getProfessorSolicitations(id: number) {
    return await prisma.appointment.findMany({
      where: {
        professorId: id,
      },
      select: {
        id       : true,
        reason   : true,
        dateTime : true,
        status   : true,
        student: {
          select: {
            user: {
              select: {
                name: true,
                photo: true,
              }
            },
          }
        }
      }
    })
  }
}