import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { offers, rooms } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { offerSchema, getZodErrorMessage } from '../utils/validationSchemas';

export const getAllOffers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(offers);

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: { offers: result },
  });
});

export const createOffer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = offerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const newOffer = await db.insert(offers).values({
    ...parseResult.data,
    discountValue: parseResult.data.discountValue.toString(),
    validFrom: parseResult.data.validFrom ? new Date(parseResult.data.validFrom) : undefined,
    validTo: parseResult.data.validTo ? new Date(parseResult.data.validTo) : undefined,
  }).returning();

  res.status(201).json({
    status: 'success',
    data: { offer: newOffer[0] },
  });
});

export const updateOffer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = offerSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const dataToUpdate: any = { ...parseResult.data };
  if (parseResult.data.discountValue) dataToUpdate.discountValue = parseResult.data.discountValue.toString();
  if (parseResult.data.validFrom) dataToUpdate.validFrom = new Date(parseResult.data.validFrom);
  if (parseResult.data.validTo) dataToUpdate.validTo = new Date(parseResult.data.validTo);

  const updatedOffer = await db.update(offers)
    .set(dataToUpdate)
    .where(eq(offers.id, Number(req.params.id)))
    .returning();

  if (!updatedOffer.length) {
    return next(new AppError('No offer found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { offer: updatedOffer[0] },
  });
});

export const validateOfferCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code, roomId, checkIn, checkOut } = req.body;

  if (!code || !roomId || !checkIn || !checkOut) {
    return next(new AppError('Please provide code, roomId, checkIn, and checkOut', 400));
  }

  // Find offer
  const offer = await db.select().from(offers).where(eq(offers.code, code)).limit(1);
  if (!offer.length) {
    return next(new AppError('Invalid offer code', 404));
  }

  const currentOffer = offer[0];
  const now = new Date();

  // Check validity dates
  if (currentOffer.validFrom && new Date(currentOffer.validFrom) > now) {
    return next(new AppError('This offer is not yet active', 400));
  }
  if (currentOffer.validTo && new Date(currentOffer.validTo) < now) {
    return next(new AppError('This offer has expired', 400));
  }

  // Check usage limits
  if (currentOffer.maxUses && (currentOffer.currentUses || 0) >= currentOffer.maxUses) {
    return next(new AppError('This offer has reached its maximum usage limit', 400));
  }

  // Check room type applicability
  const room = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (!room.length) {
    return next(new AppError('Room not found', 404));
  }

  const applicableRoomTypes = currentOffer.applicableRoomTypes as string[];
  if (applicableRoomTypes && applicableRoomTypes.length > 0 && !applicableRoomTypes.includes(room[0].type)) {
    return next(new AppError(`This offer is only applicable for: ${applicableRoomTypes.join(', ')}`, 400));
  }

  // Check minimum stay
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
  if (currentOffer.minStay && nights < currentOffer.minStay) {
    return next(new AppError(`This offer requires a minimum stay of ${currentOffer.minStay} nights`, 400));
  }

  // Calculate discount
  const basePrice = Number(room[0].price) * nights;
  let discountAmount = 0;

  if (currentOffer.discountType === 'percentage') {
    discountAmount = (basePrice * Number(currentOffer.discountValue)) / 100;
  } else {
    discountAmount = Number(currentOffer.discountValue);
  }

  res.status(200).json({
    status: 'success',
    data: {
      offer: currentOffer,
      discountAmount,
      totalPrice: basePrice - discountAmount,
    },
  });
});
