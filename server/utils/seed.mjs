import {db} from '../db/db.mjs';
import readFlights from 'readFlights.mjs';
import readAircrafts from './readAircrafts.mjs';
import readAirports from './readAirports.mjs';

/**
 * Loads data from CSV files and inserts it into the database collections.
 * The function reads flights, aircrafts, and airports data, then performs bulk inserts
 * into corresponding collections in the database.
 * 
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when all operations are complete.
 */
(async () => {
  try {
    const flights = await readFlights();
    const aircrafts = await readAircrafts();
    const airports = await readAirports();

    const items = {flight: flights, aircraft: aircrafts, airport: airports };

    const operations = Object.entries(items).map(async ([key, value]) => {
      await db.connect('DevProjectDb', key);
      const num = await db.createMany(key, value);
      console.log(`Inserted ${num} ${key}`);
    });

    await Promise.all(operations);
    
  } catch (e) {
    console.error(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();