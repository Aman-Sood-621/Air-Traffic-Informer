import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse } from 'papaparse';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Reads airport data from a CSV file, parses it, and returns the data as an array of objects.
 * @async
 * @function readAirports
 * @returns {Promise<Object[]>} - Resolves with an array of airport objects parsed
 * from the CSV file.
 * @throws {Error} - Throws an error if the CSV file cannot be read or parsed.
 */
async function readAirports() {
  const filePath = path.join(__dirname, '../data/filtered_airports.csv'); 

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data } = parse(fileContent, { header: true, dynamicTyping: true });
    return data;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}
export default readAirports;