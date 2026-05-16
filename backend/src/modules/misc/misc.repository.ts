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
      prisma.solicitation.count(),

      prisma.solicitation.count({
        where: { status: 'ACCEPTED' }
      }), 

      prisma.solicitation.count({
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
    const [ count, reserved, available, unavailable ] = await Promise.all([
      prisma.room.count(),

      prisma.room.count({
        where: { status: 'RESERVED' }
      }),

      prisma.room.count({
        where: { status: 'AVAILABLE' }
      }),

      prisma.room.count({
        where: { status: 'UNAVAILABLE' }
      }),
    ]);

    return {
      count,
      reserved,
      available,
      unavailable,
    }
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

  public static async getManagerBriefInfos() {
    
    const [ appointments, solicitations, students, professors ] = await Promise.all([
      prisma.appointment.count(),
      prisma.solicitation.count(),
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
          status      : 'CONFIRMED',
        }
      }),
      
      prisma.solicitation.count({
        where: {
          professorId : id,
          status      : 'PENDING'
        }
      }),

      prisma.appointment.findFirst({
        where: {
          professorId: id,
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
      appointmentsConfirmed,
      pendingSolicitations, 
      nextAppointmentDateTime,
    }
  }

  public static async getStudentBriefInfos(id: number) {
    
    const [ appointments, solicitations, students, professors ] = await Promise.all([
      prisma.appointment.count(),
      prisma.solicitation.count(),
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
}