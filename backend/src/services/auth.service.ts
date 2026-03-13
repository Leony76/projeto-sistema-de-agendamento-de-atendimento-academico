import { prisma } from "../prisma";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { formattedUserDataResponse } from "../../types/dto/userDTO";
import { LoginAsStudentPromise } from "./types/auth/loginAsStudent.promise";
import { LoginAsManagerPromise } from "./types/auth/loginAsManager.promise";
import { provisoryPassword } from "../utils/provisoryPassword";
import { RegisterAsStudentPromise } from "./types/auth/registerAsStudent.promise";
import { UserRole } from "@prisma/client";
import { MailService } from "./mail.service";

export class AuthService {

  static async loginAsStudent(
    ra       : string,
    password : string,
  ):Promise<LoginAsStudentPromise>{
    const user = await prisma.user.findUnique({ 
      where: { ra },
      include: {
        appointments: {
          include: {
            history: true,
          },
        },
      },
    });
    
    if (!user || user?.role !== 'STUDENT' || !(await bcrypt.compare(password, user.password))) {
      return { error: 'Credenciais inválidas' };
    } 
  
    const token = jwt.sign({ 
      id:   user.id, 
      role: user.role 
    }, process.env.JWT_SECRET as string, { 
      expiresIn: '1d' 
    });
  
    return { 
      token, 
      user: formattedUserDataResponse(user), 
    };
  }

  //

  static async loginAsManager(
    email    : string,
    password : string,
  ):Promise<LoginAsManagerPromise> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user || user?.role !== 'MANAGER' || !(await bcrypt.compare(password, user.password))) {
      return { error: 'Credenciais inválidas' };
    }
  
    const token = jwt.sign({ 
      id: user.id, 
      role: user.role 
    }, process.env.JWT_SECRET as string, { 
      expiresIn: '1d' 
    });
  
    return { 
      token, 
      user: formattedUserDataResponse(user), 
    };
  }

  static async registerAsStudent(
    studentName : string,
    email       : string,
    ra          : string,
  ): Promise<RegisterAsStudentPromise> {
    try {   

      const tempPassword = provisoryPassword(); 
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const registerStudent = await prisma.user.create({
        data: {
          name:     studentName,
          email:    email,
          ra:       ra,
          password: hashedPassword,
        },
      });
      
      await MailService.sendWelcomeEmail(email, studentName, tempPassword, ra);

      return { 
        success: 'Aluno registrado com sucesso!',
        student: {
          name: registerStudent.name,
          ra: registerStudent.ra,
        },
      };
    } catch(error:any) {
      console.error(error);
      throw new Error('Erro ao cadastrar aluno. Verifique se o RA ou E-mail já existem.');
    }
  }

  static async registerAsManager(
    name     : string,
    email    : string,
    password : string,
    role     : UserRole,
  ):Promise<{ success: string }>{
    const userExists = await prisma.user.findFirst({
      where: { email }
    });
  
    if (userExists) {
      throw new Error('Usuário já cadastrado com este e-mail ou RA');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    
    return { success: 'Cadastro concluído' };
  }
}