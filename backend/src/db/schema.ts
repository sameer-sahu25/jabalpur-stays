import { pgTable, serial, text, integer, timestamp, boolean, decimal, jsonb, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Hotels Table
export const hotels = pgTable('hotels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  address: text('address').notNull(),
  area: text('area').notNull(), // e.g., "Napier Town", "Sadar"
  description: text('description'),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
  amenities: jsonb('amenities').default([]), // ["WiFi", "Pool"]
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Rooms Table
export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  hotelId: integer('hotel_id').references(() => hotels.id).notNull(),
  type: text('type').notNull(), // "Deluxe", "Suite"
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  capacity: integer('capacity').notNull(),
  amenities: jsonb('amenities').default([]),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Offers Table
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  discountType: discountTypeEnum('discount_type').default('percentage'),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minStay: integer('min_stay').default(1),
  applicableRoomTypes: jsonb('applicable_room_types').default([]), // e.g. ["Deluxe", "Suite"]
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  validFrom: timestamp('valid_from'),
  validTo: timestamp('valid_to'),
  code: text('code').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookings Table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  status: bookingStatusEnum('status').default('pending'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  appliedOffers: jsonb('applied_offers').default([]), // Array of offer IDs or names
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const hotelsRelations = relations(hotels, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
}));
