import { prisma } from "@backend/lib/prisma";
import type * as R from '@shared/types/dtos/register.type.dto';

export class AuthRepository {
  
  public static async raAlreadyTaken(ra: string) {
    return Boolean(await prisma.student.findUnique({ where: { ra }}));
  }; 

  public static async emailAlreadyTaken(email: string) {
    return Boolean(await prisma.user.findUnique({ where: { email }}));
  };

  public static async getStudentByRa(ra: string) {
    return await prisma.student.findUnique({
      where  : { ra },
      select : { 
        ra   : true,
        user : {
          omit: { 
            deletedAt: true,
            updatedAt: true,
          },
        }, 
      },
    });
  };

  public static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        manager   : true,
        professor : { 
          include : { disciplines: true },
        },
      },
    });
  };

  public static async professorsDisciplineAlreadyTaken(
    disciplines : string[]
  ): Promise<boolean> {
    return Boolean(await prisma.professor.findFirst({
      where: {
        disciplines: {
          some: {
            name: { in: disciplines }
          }
        }
      }
    }));
  }

  public static async registerProfessor(
    data: R.ManagerRegistersProfessorRequest & { password: string }
  ) { 
    return await prisma.$transaction(async (tx) => {

      const professorAsUser = await tx.user.create({
        data: { 
          name     : data.name,
          email    : data.email,
          password : data.password,
          role     : 'PROFESSOR',
        },
      });

      const professor = await tx.professor.create({
        data: {
          userId: professorAsUser.id,
        },
      });

      await tx.discipline.updateMany({
        where: {
          name: {
            in: data.disciplines,
          },
        },
        data: {
          professorId: professor.userId,
        },
      });

      return await tx.user.findUnique({
        where: {
          id: professorAsUser.id,
        },
        select: {
          id    : true,
          name  : true,
          email : true,
          professor: {
            select: {
              disciplines: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  }

  public static async registerManager(data: R.ManagerRegistersManagerRequest & { password: string }) {
    const managerAsUser = await prisma.user.create({
      data: {
        ...data,
      }
    });

    await prisma.manager.create({ data: { userId: managerAsUser.id } });

    return managerAsUser;
  }

  public static async registerStudent(
    data: R.ManagerRegistersStudentRequest & { password: string } 
        | R.StudentRegistersHimselfRequest
  ) {
    return await prisma.user.create({
      data: {
        name     : data.name,
        email    : data.email,
        password : data.password,
        student: {
          create: {
            ra : data.ra,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }
}