import { db } from '../config/db';
import { hotels } from '../db/schema';
import { sql } from 'drizzle-orm';

const hotelData = [
  { name: "Grand Heritage Narmada Jacksons", rating: 4.5, price: 5999, location: "Civil Lines", amenities: ["wifi", "pool", "spa", "gym"] },
  { name: "Royal Orbit", rating: 4.3, price: 4499, location: "Wright Town", amenities: ["wifi", "restaurant", "bar"] },
  { name: "Hilton Garden Inn Jabalpur", rating: 4.7, price: 7999, location: "Civic Centre", amenities: ["wifi", "pool", "gym", "conference"] },
  { name: "Welcomhotel by ITC Hotels, Jabalpur", rating: 4.8, price: 8999, location: "Napier Town", amenities: ["wifi", "pool", "spa", "luxury"] },
  { name: "Hotel O Dwarika Inn", rating: 3.9, price: 1499, location: "Gorakhpur", amenities: ["wifi", "parking"] },
  { name: "Max Hotels Jabalpur", rating: 4.1, price: 2499, location: "Vijay Nagar", amenities: ["wifi", "restaurant"] },
  { name: "Hotel The Galaxy", rating: 4.0, price: 2299, location: "Madan Mahal", amenities: ["wifi", "ac"] },
  { name: "Hotel O Eleven", rating: 3.8, price: 1299, location: "Adhartal", amenities: ["wifi"] },
  { name: "Capital O Kartik", rating: 3.7, price: 1199, location: "Ranjhi", amenities: ["wifi", "parking"] },
  { name: "Hotel The Elite", rating: 4.2, price: 3499, location: "Civil Lines", amenities: ["wifi", "bar"] },
  { name: "Jaiswal Homestay", rating: 4.4, price: 1799, location: "Gwarighat", amenities: ["wifi", "home"] },
  { name: "Hotel Ashirwad", rating: 3.6, price: 999, location: "Bus Stand Road", amenities: ["wifi"] },
  { name: "Hotel O Panda Celebration", rating: 3.8, price: 1399, location: "Rani Durgavati Nagar", amenities: ["wifi", "parking"] },
  { name: "Vijan Palace", rating: 4.0, price: 2799, location: "Napier Town", amenities: ["wifi", "restaurant"] },
  { name: "Hotel O Agrawal Inn", rating: 3.5, price: 899, location: "Jabalpur Cantt", amenities: ["wifi"] },
  { name: "Hotel O Godavari Lawn", rating: 3.9, price: 1599, location: "Wright Town", amenities: ["wifi", "garden"] },
  { name: "Hotel Kadamb Tree", rating: 4.1, price: 2199, location: "Bhedaghat Road", amenities: ["wifi", "view"] },
  { name: "Spot On Standard", rating: 3.4, price: 799, location: "Station Road", amenities: ["wifi"] },
  { name: "Hotel O Raj Mahal", rating: 3.7, price: 1099, location: "Gorakhpur", amenities: ["wifi"] },
  { name: "Collection O Bargi Hills", rating: 4.3, price: 3299, location: "Bargi", amenities: ["wifi", "nature"] },
  { name: "Townhouse ISBT Vijay Nagar", rating: 3.9, price: 1699, location: "Vijay Nagar", amenities: ["wifi", "ac"] },
  { name: "Hotel Rishi Regency", rating: 4.0, price: 2399, location: "South Civil Lines", amenities: ["wifi", "restaurant"] },
  { name: "Hotel Neelkanth", rating: 3.8, price: 1499, location: "Gol Bazar", amenities: ["wifi"] },
  { name: "Hotel O Value", rating: 3.5, price: 899, location: "Adhartal", amenities: ["wifi"] },
  { name: "Wow Rooms 4 You", rating: 3.6, price: 999, location: "Madan Mahal", amenities: ["wifi"] },
  { name: "Hotel Siddhali Inn", rating: 3.7, price: 1199, location: "Wright Town", amenities: ["wifi"] },
  { name: "Hotel O by OYO City Era", rating: 3.8, price: 1399, location: "Napier Town", amenities: ["wifi"] },
  { name: "Hotel Utsav", rating: 4.0, price: 2099, location: "Civil Lines", amenities: ["wifi", "restaurant"] },
  { name: "Hotel O Aarambh Palace", rating: 3.6, price: 1099, location: "Ranjhi", amenities: ["wifi"] },
  { name: "Hotel O MN Palace", rating: 3.5, price: 999, location: "Station Road", amenities: ["wifi"] },
  { name: "Hotel P4 City Center", rating: 4.1, price: 2499, location: "Civic Centre", amenities: ["wifi", "ac"] },
  { name: "Hotel Cozy Residency", rating: 3.9, price: 1799, location: "South Civil Lines", amenities: ["wifi"] },
  { name: "Hotel O by OYO Orchid Homes", rating: 3.7, price: 1299, location: "Adhartal", amenities: ["wifi"] },
  { name: "Hotel Standard Palace", rating: 3.4, price: 799, location: "Bus Stand Road", amenities: ["wifi"] },
  { name: "Hotel O Virashat", rating: 3.8, price: 1499, location: "Wright Town", amenities: ["wifi"] },
  { name: "Hotel Surya / Hotel Suryaa", rating: 4.0, price: 2199, location: "Civil Lines", amenities: ["wifi", "bar"] },
  { name: "Aditya Premium HomeStay", rating: 4.2, price: 2799, location: "Gwarighat", amenities: ["wifi", "home"] },
  { name: "M Square Premier", rating: 4.3, price: 3499, location: "Napier Town", amenities: ["wifi", "restaurant"] },
  { name: "Hotel JK Celebration", rating: 3.9, price: 1699, location: "Vijay Nagar", amenities: ["wifi", "hall"] },
  { name: "StayVista at Riverfront Cottage", rating: 4.6, price: 5499, location: "Bhedaghat", amenities: ["wifi", "river", "view"] },
  { name: "Gopala Grand", rating: 4.0, price: 2299, location: "Madan Mahal", amenities: ["wifi"] },
  { name: "5 Star Yatri Vishram Dormitory & Rooms", rating: 3.3, price: 599, location: "Station Road", amenities: ["wifi", "dorm"] },
  { name: "Pratibha Home Stay", rating: 4.1, price: 1899, location: "Gwarighat", amenities: ["wifi", "home"] },
  { name: "7 Vachan Lawns and Banquet", rating: 4.2, price: 2999, location: "Bargi Road", amenities: ["wifi", "banquet"] },
  { name: "Ayushmaan – Premium", rating: 4.0, price: 2199, location: "Civil Lines", amenities: ["wifi"] },
  { name: "Hotel O by OYO White House", rating: 3.6, price: 1099, location: "Gorakhpur", amenities: ["wifi"] },
  { name: "Thube Saheb B&B", rating: 4.4, price: 2499, location: "Napier Town", amenities: ["wifi", "bnb"] },
  { name: "Hotel O 7 Seas", rating: 3.7, price: 1299, location: "Adhartal", amenities: ["wifi"] },
  { name: "Narmada Vatika", rating: 4.5, price: 3999, location: "Bhedaghat", amenities: ["wifi", "garden"] },
  { name: "Hotel RS Residency", rating: 3.8, price: 1499, location: "Wright Town", amenities: ["wifi"] },
  { name: "Hotel Blueberry", rating: 3.9, price: 1699, location: "Vijay Nagar", amenities: ["wifi"] },
  { name: "Malaiya Homestay – Grandeur Living Experience", rating: 4.3, price: 2799, location: "Gwarighat", amenities: ["wifi", "luxury"] },
  { name: "AV The Fun Destination", rating: 4.1, price: 3299, location: "Bargi", amenities: ["wifi", "fun"] },
  { name: "Vaibhav Hotel", rating: 3.5, price: 899, location: "Station Road", amenities: ["wifi"] },
  { name: "Hotel Shikhar Palace", rating: 4.0, price: 2099, location: "South Civil Lines", amenities: ["wifi"] },
  { name: "Hotel O Russell Chowk", rating: 3.6, price: 999, location: "Russell Chowk", amenities: ["wifi"] },
];

const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1560200353-ce0a76b1d438?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop",
];

async function seed() {
  console.log('Seeding hotels...');
  
  try {
    // Optional: Clear existing hotels if you want a fresh start
    // await db.delete(hotels);

    for (let i = 0; i < hotelData.length; i++) {
      const hotel = hotelData[i];
      const image = images[i % images.length]; // Cycle through images
      
      // Check if hotel exists
      const existing = await db.select().from(hotels).where(sql`${hotels.name} = ${hotel.name}`);
      
      if (existing.length === 0) {
        await db.insert(hotels).values({
          name: hotel.name,
          address: `${hotel.location}, Jabalpur`,
          area: hotel.location,
          description: `Experience a comfortable stay at ${hotel.name}, located in the heart of ${hotel.location}.`,
          rating: hotel.rating.toString(),
          amenities: hotel.amenities,
          imageUrl: image,
        });
        console.log(`Added: ${hotel.name}`);
      } else {
        // Update existing to ensure format is correct
        await db.update(hotels).set({
           rating: hotel.rating.toString(),
           amenities: hotel.amenities,
           imageUrl: image,
           address: `${hotel.location}, Jabalpur`,
           area: hotel.location,
        }).where(sql`${hotels.name} = ${hotel.name}`);
        console.log(`Updated: ${hotel.name}`);
      }
    }
    
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
  process.exit(0);
}

seed();
