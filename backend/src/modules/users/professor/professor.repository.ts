import { prisma } from "@backend/lib/prisma";
import { hoursToIntMinutes } from "@backend/utils/hoursToIntMinutes.util";
import type { NewProfessorAvailabilityRequest } from "@shared/types/dtos/newProfessorAvailability.dto";

export class ProfessorRepository {

  public static async newAvailability(
    professorId: number,
    data: NewProfessorAvailabilityRequest,
  ) {
    const operations = [];

    if (data.shift.MORNING.start && data.shift.MORNING.end) {
      operations.push(
        prisma.professorAvailability.upsert({
          where: {
            professorId_dayOfWeek_shift: {
              professorId,
              dayOfWeek : data.dayOfWeek,
              shift     : 'MORNING',
            },
          },
          update: {
            startTime: hoursToIntMinutes(data.shift.MORNING.start),
            endTime: hoursToIntMinutes(data.shift.MORNING.end),
          },

          create: {
            dayOfWeek : data.dayOfWeek,
            shift     : 'MORNING',
            startTime : hoursToIntMinutes(data.shift.MORNING.start),
            endTime   : hoursToIntMinutes(data.shift.MORNING.end),
            professor : {
              connect : {
                userId : professorId,
              },
            },
          },
        })
      );
    }

    if (data.shift.AFTERNOON.start && data.shift.AFTERNOON.end) {
      operations.push(
        prisma.professorAvailability.upsert({
          where: {
            professorId_dayOfWeek_shift: {
              professorId,
              dayOfWeek : data.dayOfWeek,
              shift     : 'AFTERNOON',
            },
          },
          update: {
            startTime : hoursToIntMinutes(data.shift.AFTERNOON.start),
            endTime   : hoursToIntMinutes(data.shift.AFTERNOON.end),
          },
          create: {
            dayOfWeek : data.dayOfWeek,
            shift     : 'AFTERNOON',
            startTime : hoursToIntMinutes(data.shift.AFTERNOON.start),
            endTime   : hoursToIntMinutes(data.shift.AFTERNOON.end),
            professor : {
              connect : {
                userId : professorId,
              },
            },
          },
        })
      );
    }

    return prisma.$transaction(operations);
  }

  public static async getAvailability(professorId: number) {
    return await prisma.professorAvailability.findMany({
      where: { professorId },
      select: {
        dayOfWeek : true,
        endTime   : true,
        startTime : true,
        shift     : true,
      }
    });
  }
}