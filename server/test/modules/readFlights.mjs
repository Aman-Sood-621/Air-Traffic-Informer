import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Papa from 'papaparse';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function readFlights() {
  const filePath = path.join(__dirname, '../../data/test_flights.csv'); 

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data } = Papa.parse(fileContent, { header: true, dynamicTyping: true });
    return data;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}
export default readFlights;
