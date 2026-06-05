import type { UserRole } from '@backend/generated/prisma/enums';
import type { TokenPayload } from './tokenPayload.type';

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}

export {};