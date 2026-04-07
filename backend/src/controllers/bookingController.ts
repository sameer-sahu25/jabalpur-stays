import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { bookings, rooms, offers } from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { bookingSchema, getZodErrorMessage } from '../utils/validationSchemas';

export const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = bookingSchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new AppError(getZodErrorMessage(parseResult.error), 400));
  }

  const { roomId, checkIn, checkOut, appliedOfferIds } = parseResult.data;

  // Check if room exists
  const room = await db.select().from(rooms).where(eq(rooms.id, roomId));
  if (!room.length) {
    return next(new AppError('Room not found', 404));
  }

  // Calculate base price
  const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = Number(room[0].price) * days;
  
  let discountAmount = 0;
  let finalAppliedOffers: any[] = [];

  // Apply offers if any
  if (appliedOfferIds && appliedOfferIds.length > 0) {
    const selectedOffers = await db.select().from(offers).where(inArray(offers.id, appliedOfferIds));
    const now = new Date();

    for (const offer of selectedOffers) {
      // Basic validity checks
      const isValidDate = (!offer.validFrom || new Date(offer.validFrom) <= now) &&
                          (!offer.validTo || new Date(offer.validTo) >= now);
      
      const isUsageValid = !offer.maxUses || (offer.currentUses || 0) < offer.maxUses;
      
      const applicableRoomTypes = offer.applicableRoomTypes as string[];
      const isRoomTypeValid = !applicableRoomTypes || applicableRoomTypes.length === 0 || 
                              applicableRoomTypes.includes(room[0].type);
      
      const isMinStayValid = !offer.minStay || days >= offer.minStay;

      if (isValidDate && isUsageValid && isRoomTypeValid && isMinStayValid) {
        let offerDiscount = 0;
        if (offer.discountType === 'percentage') {
          offerDiscount = (basePrice * Number(offer.discountValue)) / 100;
        } else {
          offerDiscount = Number(offer.discountValue);
        }

        discountAmount += offerDiscount;
        finalAppliedOffers.push({
          id: offer.id,
          title: offer.title,
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          discountAmount: offerDiscount
        });

        // Increment usage
        await db.update(offers)
          .set({ currentUses: (offer.currentUses || 0) + 1 })
          .where(eq(offers.id, offer.id));
      }
    }
  }

  const totalPrice = basePrice - discountAmount;

  const newBooking = await db.insert(bookings).values({
    userId: req.user!.id,
    roomId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice: totalPrice.toString(),
    discountAmount: discountAmount.toString(),
    appliedOffers: finalAppliedOffers,
    status: 'pending',
  }).returning();

  res.status(201).json({
    status: 'success',
    data: { booking: newBooking[0] },
  });
});

export const getUserBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Allow admin to get any user's bookings, or user to get their own
  const userId = req.params.userId ? Number(req.params.userId) : req.user!.id;

  if (req.user!.role !== 'admin' && req.user!.id !== userId) {
    return next(new AppError('You do not have permission to view these bookings', 403));
  }

  const result = await db.select().from(bookings).where(eq(bookings.userId, userId));

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: { bookings: result },
  });
});

export const getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await db.select().from(bookings).where(eq(bookings.id, Number(req.params.id)));

  if (!result.length) {
    return next(new AppError('No booking found with that ID', 404));
  }

  if (req.user!.role !== 'admin' && req.user!.id !== result[0].userId) {
    return next(new AppError('You do not have permission to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { booking: result[0] },
  });
});

export const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const booking = await db.select().from(bookings).where(eq(bookings.id, Number(req.params.id)));

  if (!booking.length) {
    return next(new AppError('No booking found with that ID', 404));
  }

  if (req.user!.role !== 'admin' && req.user!.id !== booking[0].userId) {
    return next(new AppError('You do not have permission to cancel this booking', 403));
  }

  const updatedBooking = await db.update(bookings)
    .set({ status: 'cancelled' })
    .where(eq(bookings.id, Number(req.params.id)))
    .returning();

  res.status(200).json({
    status: 'success',
    data: { booking: updatedBooking[0] },
  });
});
