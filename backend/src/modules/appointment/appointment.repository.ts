import { prisma } from "@backend/lib/prisma";
import type { EditAppointmentSolicitationFormData } from "@backend/schemas/appointmentSolicitation.schema";
import { ApiError } from "@backend/utils/apiError.util";
import type { AppointmentSolicitationRequest, EditAppointmentSolicitationResponse } from "@shared/types/dtos/appointmentSolicitation.dto";

export class AppointmentRepository {

  public static async findAppointmentById(id: number) {
    return Boolean(await prisma.appointment.findUnique({
      where: { id }
    }));
  }



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
              in: ['PENDING', 'ACCEPTED', 'CONFIRMED']
            }
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

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        professorId: data.professorId,
        dateTime: data.dateTime,
        status: {
          in: ['PENDING', 'ACCEPTED', 'CONFIRMED']
        }
      }
    });

    if (existingAppointment) {
      throw new ApiError('Já existe um agendamento para este horário.', 409);
    }

    return await prisma.appointment.create({
      data: {
        dateTime: data.dateTime,
        reason: data.reason,
        studentId: data.studentId,
        professorId: data.professorId,
        status: 'PENDING',
      },
      select: {
        dateTime: true,
        reason: true,
        professor: {
          select: {
            user: {
              select: {
                name: true
              },
            },
          },
        },
      },
    });
  }

  public static async getStudentSolicitations(id: number) {
    return await prisma.appointment.findMany({
      where: {
        studentId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ACCEPTED', 'CANCELED', 'REJECTED']
        }
      },
      select: {
        id       : true,
        reason   : true,
        dateTime : true,
        status   : true,
        registeredAt: true,
        updatedAt: true,
        professor: {
          select: {
            availability: {
              select: {
                dayOfWeek: true,
              }
            },
            user: {
              select: {
                id    : true,
                name  : true,       
                photo : true,
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
        status: {
          in: ['PENDING', 'CONFIRMED', 'ACCEPTED', 'CANCELED', 'REJECTED']
        }
      },
      select: {
        id       : true,
        reason   : true,
        dateTime : true,
        status   : true,
        registeredAt: true,
        updatedAt: true,
        student: {
          select: {
            user: {
              select: {
                id    : true,
                name  : true,
                photo : true,
              }
            },
          }
        }
      }
    })
  }

  public static async acceptAppointmentSolicitation(
    solicitationId : number,
  ) {

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: solicitationId,
      },
      select: {
        id       : true,
        dateTime : true,
      }
    });

    if (!appointment) {
      throw new ApiError('Agendamento não encontrado', 404);
    }

    const availableRooms = await prisma.room.findMany({
      where: {
        status: 'AVAILABLE',

        appointments: {
          none: {
            dateTime: appointment.dateTime,
          }
        }
      },

      select: {
        id: true,
      }
    });

    if (availableRooms.length === 0) {
      throw new ApiError('Nenhuma sala disponível', 404);
    }

    const randomIndex = Math.floor(
      Math.random() * availableRooms.length
    );

    const selectedRoom = availableRooms[randomIndex];

    if (!selectedRoom) throw new ApiError('Nenhuma sala disponível', 404);

    return await prisma.appointment.update({
      where: {
        id: solicitationId,
      },
      data: {
        status : 'ACCEPTED',
        roomId : selectedRoom.id,
      }
    });
  }

  public static async rejectAppointmentSolicitation(solicitationId : number) {
    return await prisma.appointment.update({
      where: {
        id: solicitationId,
      },
      data: {
        status: 'REJECTED',
      },
      select: { status: true }
    });
  }

  public static async getProfessorAppointments(id: number) {
    return await prisma.appointment.findMany({
      where: { 
        professorId : id,
        status      : {
          in: ['ACCEPTED', 'CONFIRMED']
        }
      },
      select: {
        id           : true,
        reason       : true,
        dateTime     : true,
        room         : { select: { name: true }},
        status       : true,
        registeredAt : true,
        updatedAt    : true,
        student : {
          select : {
            user : {
              select: {
                name  : true,
                photo : true,
              },
            },
          },
        },
      },
    });
  }

  public static async getStudentAppointments(id: number) {
    return await prisma.appointment.findMany({
      where: { 
        studentId : id,
        status    : {
          in: ['ACCEPTED', 'CONFIRMED']
        } 
      },
      select: {
        id           : true,
        reason       : true,
        dateTime     : true,
        room         : { select: { name: true }},
        status       : true,
        registeredAt : true,
        updatedAt    : true,
        professor : {
          select : {
            disciplines : { select: { name: true }},
            user : {
              select: {
                name  : true,
                photo : true,
              },
            },
          },
        },
      },
    });
  }

  public static async markAppointmentAsDone(id: number) {
    return await prisma.$transaction(async(tx) => {
      const appointment = await tx.appointment.findUnique({
        where  : { id },
        select : { 
          roomId: true,
          status: true,
        }
      });

      if (!appointment?.roomId)
        throw new ApiError('Não foi possível marcar o atendimento como concluído. Tente novamente mais tarde!', 500);

      if (appointment.status === 'DONE')
         throw new ApiError('Atendimento já foi concluído.', 400);
      
      return await tx.appointment.update({
        where: { id },
        data: {
          status  : 'DONE',
          roomId  : null,
          history : {
            create : {
              roomId: appointment.roomId
            }
          }
        },
        select: {
          id: true,
        }
      });
    })
  } 



  public static async editSolicitation(data: EditAppointmentSolicitationResponse) {
    return await prisma.appointment.update({
      where : { id: data.appointmentId },
      data : {
        dateTime : data.dateTime,
        reason   : data.reason,
      },
      select: {
        dateTime : true,
        id       : true,
        reason   : true,
      }
    });
  }



  public static async cancelSolicitation(id: number) {
    return await prisma.appointment.update({
      where  : { id },
      data   : { status: 'CANCELED' },
      select : { id: true }
    });
  }
}