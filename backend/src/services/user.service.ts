import { prisma } from "../prisma";
import { formattedUserDataResponse } from "../../types/dto/userDTO";

export class UserService {

  static async me(userId:number) {

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        appointments: {
          include: {
            history: true
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return formattedUserDataResponse(user);
  }

}