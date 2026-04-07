import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { registerSchema, loginSchema, getZodErrorMessage } from '../utils/validationSchemas';

const signToken = (id: number) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ id }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1000d') as any,
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const { name, email, password } = parseResult.data;

  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    return next(new AppError('Email already in use', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: 'user', // Default role
  }).returning();

  const token = signToken(newUser[0].id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        role: newUser[0].role,
      },
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const { email, password } = parseResult.data;

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user[0].id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
      },
    },
  });
});

export const logout = (req: Request, res: Response) => {
  // For JWT, client handles logout by deleting token. 
  // We can just send success response.
  res.status(200).json({ status: 'success' });
};
