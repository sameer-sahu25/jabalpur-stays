import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { hotels, rooms } from '../db/schema';
import { eq, like, and, gte, sql } from 'drizzle-orm';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { hotelSchema, getZodErrorMessage } from '../utils/validationSchemas';

export const getAllHotels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('GET /api/hotels', req.query);
  const { area, rating, search, page = 1, limit = 20 } = req.query;
  
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  let conditions = [];
  if (area) conditions.push(like(hotels.area, `%${area}%`));
  if (rating) conditions.push(gte(hotels.rating, rating as string));
  if (search) {
    const searchStr = `%${search}%`;
    conditions.push(sql`(${hotels.name} ILIKE ${searchStr} OR ${hotels.area} ILIKE ${searchStr} OR ${hotels.address} ILIKE ${searchStr})`);
  }

  try {
    const result = await db.select()
      .from(hotels)
      .where(and(...conditions))
      .limit(limitNum)
      .offset(offset);

    const totalCountResult = await db.select({ count: sql<number>`count(*)` })
      .from(hotels)
      .where(and(...conditions));
      
    const total = Number(totalCountResult[0].count);

    res.status(200).json({
      status: 'success',
      results: result.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: { hotels: result },
    });
  } catch (err) {
    console.error('Database error in getAllHotels:', err);
    throw err;
  }
});

export const getHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(hotels).where(eq(hotels.id, Number(req.params.id)));

  if (!result.length) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { hotel: result[0] },
  });
});

export const createHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = hotelSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const newHotel = await db.insert(hotels).values(parseResult.data as any).returning();

  res.status(201).json({
    status: 'success',
    data: { hotel: newHotel[0] },
  });
});

export const updateHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = hotelSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const updatedHotel = await db.update(hotels)
    .set(parseResult.data as any)
    .where(eq(hotels.id, Number(req.params.id)))
    .returning();

  if (!updatedHotel.length) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { hotel: updatedHotel[0] },
  });
});

export const getRoomsByHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  const result = await db.select().from(hotels).where(eq(hotels.id, Number(id)));
  if (!result.length) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  const hotelRooms = await db.select().from(rooms).where(eq(rooms.hotelId, Number(id)));

  res.status(200).json({
    status: 'success',
    results: hotelRooms.length,
    data: { rooms: hotelRooms },
  });
});
