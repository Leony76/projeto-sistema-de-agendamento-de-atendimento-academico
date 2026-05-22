import { prisma } from "@backend/lib/prisma";

export class MiscRepository {

  public static async getAppointmentsMetrics() {
    const [ count, done, canceled, noShow ] = await Promise.all([
      prisma.appointment.count(),

      prisma.appointment.count({
        where: { status: 'DONE' }
      }),

      prisma.appointment.count({
        where: { status: 'CANCELED' }
      }),

      prisma.appointment.count({
        where: { status: 'NO_SHOW' }
      }),

    ]);

    return {
      count,
      canceled,
      done,
      noShow,
    }
  }

  public static async getSolicitationsMetrics() {
    const [ count, accepted, rejected ] = await Promise.all([
      prisma.appointment.count({
        where: { status: 'PENDING' }
      }),

      prisma.appointment.count({
        where: { status: 'CONFIRMED' }
      }), 

      prisma.appointment.count({
        where: { status: 'REJECTED' }
      }), 
    ]);

    return {
      count,
      accepted,
      rejected,
    }
  }

  public static async getRoomsMetrics() {

    const [ count, available, unavailable, reserved ] = await Promise.all([

      prisma.room.count(),

      prisma.room.count({
        where: { status: 'AVAILABLE' }
      }),

      prisma.room.count({
        where: { status: 'UNAVAILABLE' }
      }),

      prisma.room.count({
        where: {
          appointments: {
            some: {}
          }
        }
      }),
    ]);

    return {
      count,
      reserved,
      available,
      unavailable,
    };
  }

  public static async getUsersMetrics() {
    const [ users, students, professors, managers ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: { role: 'STUDENT' },
      }),

      prisma.user.count({
        where: { role: 'PROFESSOR' },
      }),

      prisma.user.count({
        where: { role: 'MANAGER' },
      }),
    ]);

    return {
      users,
      students,
      professors,
      managers,
    }
  }
}