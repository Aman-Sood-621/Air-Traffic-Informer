import { db } from '../../db/db.mjs';

/**
 * Seeds the database with flights, aircrafts, and airports data.
 *
 * @async
 * @function seed
 * @param {Function} readFlightsFn - Function to fetch flight data.
 * @param {Function} readAircraftsFn - Function to fetch aircraft data.
 * @param {Function} readAirportsFn - Function to fetch airport data.
 * @param {Function} thrownFunction - Function to handle thrown errors.
 * @returns {Promise<void>} Resolves when seeding is complete.
 * @throws {Error} Propagates error if any function fails.
 */
export default async function seed(readFlightsFn, readAircraftsFn, readAirportsFn, thrownFunction) {
  try {
    console.log('Starting seed function');

    // Fetch all data first
    const [flights, aircrafts, airports] = await Promise.all([
      readFlightsFn(),
      readAircraftsFn(),
      readAirportsFn(),
    ]);

    const items = { flight: flights, aircraft: aircrafts, airport: airports };

    // Prepare the database operations
    const operations = Object.entries(items).map(async ([key, value]) => {
      await db.connect('DevProjectDb', key); 
      await db.createMany(value);
    });

    await Promise.all(operations);
    
  } catch (e) {
    thrownFunction(e);
  } finally {
    if (db) {
      await db.close(); 
    }
  }
}
