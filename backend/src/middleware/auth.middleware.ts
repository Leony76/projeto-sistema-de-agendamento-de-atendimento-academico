import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type TokenPayload = {
  sub: string;
};

const JWT_SECRET = process.env["JWT_SECRET"];

export async function authMiddleware(
  req  : Request,
  res  : Response,
  next : NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não foi provido'
    });
  }
  
  const [, token] = authHeader.split(' ');
  
  if (!token) {
    return res.status(401).json({
      error: 'Token não foi provido'
    });
  };

  if (!JWT_SECRET) {
    return res.status(401).json({
      error: 'JWT_SECRET não foi encontrado'
    });
  };
  
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as TokenPayload;

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
}