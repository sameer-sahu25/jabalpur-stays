import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const hotelSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  area: z.string().min(2),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
});

export const roomSchema = z.object({
  hotelId: z.number(),
  type: z.string(),
  price: z.number().positive(),
  capacity: z.number().int().positive(),
  amenities: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
});

export const bookingSchema = z.object({
  roomId: z.number(),
  checkIn: z.string().datetime(), // ISO string
  checkOut: z.string().datetime(),
  appliedOfferIds: z.array(z.number()).optional(),
});

export const offerSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']).default('percentage'),
  discountValue: z.number().positive(),
  minStay: z.number().int().min(1).default(1),
  applicableRoomTypes: z.array(z.string()).optional(),
  maxUses: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validTo: z.string().datetime().optional(),
  code: z.string().min(2).optional(),
});

export const getZodErrorMessage = (error: z.ZodError): string => {
  const issues = (error as any).issues || (error as any).errors;
  return issues?.[0]?.message || 'Validation error';
};

