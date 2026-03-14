import { UserRole } from "@prisma/client";
import { NextFunction , Response, Request} from "express";

export const authorize = ( 
  roles : UserRole[], 
) => (
  req  : Request, 
  res  : Response, 
  next : NextFunction,
) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.sendStatus(403);
  }

  next();
};