import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface JwtUserPayload extends JwtPayload {
  id: number;
  email: string;
  role: 'MANAGER' | 'STUDENT';
}

export const authenticateToken = (
  req: Request, 
  res: Response, 
  next: NextFunction,
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'HYPER_SECRET_APPOINTMENT', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as JwtUserPayload; 
    next();
  });
};