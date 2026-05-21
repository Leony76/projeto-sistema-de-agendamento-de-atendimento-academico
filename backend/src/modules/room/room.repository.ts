import { prisma } from "@backend/lib/prisma";

export class RoomRepository {

  public static async roomAlreadyExists(name: string) {
    return Boolean(await prisma.room.findFirst({
      where: { name }
    }));
  }

  public static async getRooms() {
    return await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        appointments: {
          select: {
            dateTime  : true,
            professor : { select: { user: { select: { name: true } } } },
            student   : { select: { user: { select: { name: true } } } },
          }
        }
      }
    });
  }

  public static async addRoom(name: string) {
    return await prisma.room.create({
      data: {
        name,
        status : 'AVAILABLE',
      },
      select: {
        name : true,
      }
    });
  }
}