import type { TokenPayload } from '@backend/@types/express/tokenPayload.type';
import type { UserRole } from '@backend/generated/prisma/enums';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env["JWT_SECRET"]!;

export const generateToken = (
  userId : number,
  role   : UserRole
) => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    JWT_SECRET,
    { 
      expiresIn: '7d' 
    }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Token de payload inválido!');
  }

  const role = decoded['role'];

  if (
    typeof decoded.sub !== 'number' ||
    !role
  ) {
    throw new Error('Token de payload inválido!');
  }

  return {
    sub  : decoded.sub,
    role : role as UserRole,
  };
};