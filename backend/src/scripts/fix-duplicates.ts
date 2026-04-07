import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL!;

async function fixDuplicates() {
  console.log('Cleaning up duplicate hotels and leaving one unique entry for "Vijan Mahal" and "Shawn Elizey"...');

  try {
    const sql = neon(connectionString);
    
    const targetHotels = ['Vijan Mahal', 'Shawn Elizey'];
    
    for (const name of targetHotels) {
      // Find all hotels with this name
      const hotelsFound = await sql`
        SELECT id, name FROM hotels 
        WHERE name = ${name}
        ORDER BY id ASC
      `;
      
      if (hotelsFound.length > 1) {
        const keeperId = hotelsFound[0].id;
        const duplicateIds = hotelsFound.slice(1).map(h => h.id);
        
        console.log(`Found ${hotelsFound.length} entries for "${name}". Keeping ID ${keeperId}, deleting IDs: ${duplicateIds.join(', ')}`);
        
        // Delete bookings for duplicates
        await sql`
          DELETE FROM bookings 
          WHERE room_id IN (
            SELECT id FROM rooms WHERE hotel_id = ANY(${duplicateIds})
          )
        `;
        
        // Delete rooms for duplicates
        await sql`
          DELETE FROM rooms 
          WHERE hotel_id = ANY(${duplicateIds})
        `;
        
        // Delete duplicates
        await sql`
          DELETE FROM hotels 
          WHERE id = ANY(${duplicateIds})
        `;
        
        console.log(`Successfully cleaned up duplicates for "${name}".`);
      } else if (hotelsFound.length === 1) {
        console.log(`Only one entry for "${name}" exists. No cleanup needed.`);
      } else {
        console.log(`No entries for "${name}" found. Re-creating one unique entry...`);
        
        const hotelData = name === 'Vijan Mahal' 
          ? {
              name: 'Vijan Mahal',
              address: 'Mandla Road, Jabalpur',
              area: 'Tilhari',
              description: 'Luxury hotel with royal architecture.',
              rating: '4.5',
              amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Gym']),
              imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            }
          : {
              name: 'Shawn Elizey',
              address: 'Nagpur Road, Jabalpur',
              area: 'Bhedaghat Road',
              description: 'Premium resort experience.',
              rating: '4.8',
              amenities: JSON.stringify(['WiFi', 'Pool', 'Restaurant']),
              imageUrl: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81?w=800&q=80',
            };
            
        await sql`
          INSERT INTO hotels (name, address, area, description, rating, amenities, image_url)
          VALUES (${hotelData.name}, ${hotelData.address}, ${hotelData.area}, ${hotelData.description}, ${hotelData.rating}, ${hotelData.amenities}, ${hotelData.imageUrl})
        `;
        console.log(`Re-created unique entry for "${name}".`);
      }
    }
    
    // Now enforce the unique constraint on the name column
    console.log('Enforcing UNIQUE constraint on hotel names...');
    try {
      await sql`ALTER TABLE hotels ADD CONSTRAINT hotels_name_unique UNIQUE (name)`;
      console.log('Successfully added UNIQUE constraint to hotels table.');
    } catch (err: any) {
      if (err.code === '42710') {
        console.log('UNIQUE constraint already exists.');
      } else {
        throw err;
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:');
    console.error(error);
    process.exit(1);
  }
}

fixDuplicates();
