import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env["JWT_SECRET"]!;

export const generateToken = (userId: number) => {
  
  return jwt.sign(
    { sub: userId },
    JWT_SECRET, 
    {
      expiresIn: '7d'
    }
  );
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};