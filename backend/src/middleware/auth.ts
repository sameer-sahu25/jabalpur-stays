import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface JwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if (!currentUser.length) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser[0];
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role && !roles.includes(req.user.role))) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
