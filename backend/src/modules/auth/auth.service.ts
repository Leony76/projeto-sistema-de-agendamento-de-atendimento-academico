import bcrypt from 'bcrypt';
import { prisma } from '@backend/lib/prisma';
import type { RegisterUser } from '@shared/types/registerUser.type';
import { generateToken } from '@backend/lib/jwt';

export class AuthService {
  
  static async register( data: RegisterUser ) {
    
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (userAlreadyExists) {
      throw new Error('Usuário com este e-mail já existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name     : data.name,
        email    : data.email,
        password : hashedPassword
      }
    });

    return user;
  };



  static async login(email: string, password: string) {
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  }
}