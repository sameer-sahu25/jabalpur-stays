import { db } from '../config/db';
import { hotels, rooms, offers, users } from '../db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await db.insert(users).values({
    name: 'Admin User',
    email: 'admin@jabalpurstays.com',
    password: hashedPassword,
    role: 'admin',
  }).onConflictDoNothing();

  // Create Hotels
  const hotelList = [
    {
      name: 'Vijan Mahal',
      address: 'Mandla Road, Jabalpur',
      area: 'Tilhari',
      description: 'Luxury hotel with royal architecture.',
      rating: '4.5',
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
      imageUrl: 'https://example.com/vijan.jpg',
    },
    {
      name: 'Shawn Elizey',
      address: 'Nagpur Road, Jabalpur',
      area: 'Bhedaghat Road',
      description: 'Premium resort experience.',
      rating: '4.8',
      amenities: ['WiFi', 'Pool', 'Restaurant'],
      imageUrl: 'https://example.com/shawn.jpg',
    },
  ];

  const createdHotels = await db.insert(hotels).values(hotelList).returning();

  // Create Rooms
  for (const hotel of createdHotels) {
    await db.insert(rooms).values([
      {
        hotelId: hotel.id,
        type: 'Deluxe',
        price: '3500',
        capacity: 2,
        amenities: ['AC', 'TV', 'WiFi'],
      },
      {
        hotelId: hotel.id,
        type: 'Suite',
        price: '6000',
        capacity: 4,
        amenities: ['AC', 'TV', 'WiFi', 'Bathtub'],
      },
    ]);
  }

  // Create Offers
  await db.insert(offers).values([
    {
      title: 'Early Bird',
      description: 'Book 15 days in advance',
      discountType: 'percentage',
      discountValue: '15',
      code: 'EARLY15',
    },
    {
      title: 'Long Stay',
      description: 'Stay for 5+ nights',
      discountType: 'percentage',
      discountValue: '20',
      code: 'LONG20',
      minStay: 5,
    },
  ]);

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
