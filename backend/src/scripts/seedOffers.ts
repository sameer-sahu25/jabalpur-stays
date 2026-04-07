import { db } from '../config/db';
import { offers } from '../db/schema';
import { eq } from 'drizzle-orm';

const offerData = [
  {
    title: "Summer Special",
    description: "Get 15% off on all bookings during the summer season.",
    discountType: "percentage" as any,
    discountValue: "15",
    code: "SUMMER15",
    validFrom: new Date('2026-03-01'),
    validTo: new Date('2026-06-30'),
    minStay: 2,
  },
  {
    title: "Weekend Getaway",
    description: "Enjoy a ₹500 discount for your weekend stays.",
    discountType: "fixed" as any,
    discountValue: "500",
    code: "WEEKEND500",
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    minStay: 1,
  },
  {
    title: "Early Bird Offer",
    description: "Book at least 30 days in advance and save 20%.",
    discountType: "percentage" as any,
    discountValue: "20",
    code: "EARLY20",
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    minStay: 3,
  },
  {
    title: "Luxury Retreat",
    description: "Exclusive 25% discount for premium suites.",
    discountType: "percentage" as any,
    discountValue: "25",
    code: "LUXURY25",
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    applicableRoomTypes: ["Suite", "Deluxe"],
  }
];

async function seedOffers() {
  console.log('Seeding advanced offers...');
  
  try {
    for (const offer of offerData) {
      const existing = await db.select().from(offers).where(eq(offers.code, offer.code || ''));
      
      if (existing.length === 0) {
        await db.insert(offers).values(offer);
        console.log(`Added offer: ${offer.title}`);
      } else {
        await db.update(offers).set(offer).where(eq(offers.code, offer.code || ''));
        console.log(`Updated offer: ${offer.title}`);
      }
    }
    console.log('Offers seeding completed successfully');
  } catch (error) {
    console.error('Offers seeding failed:', error);
  }
  process.exit(0);
}

seedOffers();
