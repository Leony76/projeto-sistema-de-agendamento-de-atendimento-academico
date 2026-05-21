import { prisma } from "@backend/lib/prisma";

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
}