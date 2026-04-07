import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { rooms } from '../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { roomSchema, getZodErrorMessage } from '../utils/validationSchemas';

export const getAllRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { hotelId, type, minPrice, maxPrice } = req.query;

  let conditions = [];
  if (hotelId) conditions.push(eq(rooms.hotelId, Number(hotelId)));
  if (type) conditions.push(eq(rooms.type, type as string));
  if (minPrice) conditions.push(gte(rooms.price, minPrice as string));
  if (maxPrice) conditions.push(lte(rooms.price, maxPrice as string));

  const result = await db.select().from(rooms).where(and(...conditions));

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: { rooms: result },
  });
});

export const getRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(rooms).where(eq(rooms.id, Number(req.params.id)));

  if (!result.length) {
    return next(new AppError('No room found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { room: result[0] },
  });
});

export const createRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = roomSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const newRoom = await db.insert(rooms).values(parseResult.data as any).returning();

  res.status(201).json({
    status: 'success',
    data: { room: newRoom[0] },
  });
});

export const updateRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = roomSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const updatedRoom = await db.update(rooms)
    .set(parseResult.data as any)
    .where(eq(rooms.id, Number(req.params.id)))
    .returning();

  if (!updatedRoom.length) {
    return next(new AppError('No room found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { room: updatedRoom[0] },
  });
});
