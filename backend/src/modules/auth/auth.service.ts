import bcrypt from 'bcrypt';
import { prisma } from '@backend/lib/prisma';
import type { RegisterManager, RegisterProfessor, RegisterStudent } from '@shared/types/registerUser.type';
import type { LoginProfessorOrManager, LoginStudent } from '@shared/types/loginUser.type';
import { generateToken } from '@backend/lib/jwt';
import type { AuthUserBasicInfos } from '@shared/types/authUserBasicInfos.type';
import type { LoginResponse } from '@shared/types/loginResponse.type';

export class AuthService {
  
  static async register( data: RegisterStudent | RegisterManager | RegisterProfessor ) {
    
    switch (data.role) {
      case 'STUDENT':

        const [ raAlreadyTaken, emailAlreadyTaken ] = await Promise.all([
          prisma.student.findUnique({ where: { ra: data.ra } }),
          prisma.user.findUnique({ where: { email: data.email } }),
        ]);
    
        if (emailAlreadyTaken) throw new Error('Este e-mail já está em uso');
        if (raAlreadyTaken) throw new Error('Este RA já está cadastrado');
    
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        return await prisma.$transaction( async(tx) => {
          const user = await tx.user.create({
            data: {
              name     : data.name,
              email    : data.email,
              password : hashedPassword,
            },
          });

          const student = await tx.student.create({
            data: {
              userId : user.id,
              ra     : data.ra,
            },
          });

          return {
            student : user.name,
            email   : user.email,
            ra      : student.ra,
          };
        });

      case 'PROFESSOR':
        //
        return;
      default:
        //
        return;
    }
  };



  static async login(data: LoginStudent | LoginProfessorOrManager): Promise<LoginResponse> {
    
    switch (data.role) {
      case 'STUDENT': {
        const student = await prisma.student.findUnique({
          where   : { ra: data.ra },
          include : { user: true  }
        });
    
        if (!student) throw new Error('Credenciais inválidas');
    
        const passwordMatch = await bcrypt.compare(
          data.password,
          student.user.password,
        );
    
        if (!passwordMatch) throw new Error('Credenciais inválidas');
    
        const token = generateToken(student.user.id);

        const studentBasicData: AuthUserBasicInfos = {
          id           : student.user.id,
          email        : student.user.email,
          name         : student.user.name,
          registeredAt : student.user.createdAt.toISOString(),
          photo        : student.user.photo ?? '',
          ra           : student.ra,
          role         : 'STUDENT',
        }; 
    
        return {
          user: studentBasicData,
          token,
        };

      } case 'PROFESSOR/MANAGER': {

        const user = await prisma.user.findUnique({
          where: { email: data.email },
          include: {
            manager   : true,
            professor : { 
              include : { disciplines: true },
            },
          },
        });
    
        if (!user) throw new Error('Credenciais inválidas');
       
        const passwordMatch = await bcrypt.compare(
          data.password,
          user.password,
        );

        if (!passwordMatch) throw new Error('Credenciais inválidas');

        const token = generateToken(user.id);

        const basicData = {
          id           : user.id,
          email        : user.email,
          name         : user.name,
          photo        : user.photo ?? '',
          registeredAt : user.createdAt.toISOString(),
        };

        if (user.role === 'MANAGER') {
          const managerBasicData: AuthUserBasicInfos = {
            ...basicData,
            role : 'MANAGER',
          } 

          return {
            user: managerBasicData,
            token,
          };
          
        } else {

          const professorBasicData: AuthUserBasicInfos = {
            ...basicData,
            disciplines  : user.professor?.disciplines.map((discipline) => discipline.name) ?? [],
            role         : 'PROFESSOR',
          }; 
  
          const response: LoginResponse = {
            user: professorBasicData,
            token,
          };
  
          return response;
        }
      }
    }
  }
}