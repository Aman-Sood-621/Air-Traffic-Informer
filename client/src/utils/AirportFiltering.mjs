/**
 * Asynchronously fetches airport data from the server.
 * 
 * @async
 * @function
 * @returns {Promise<Array<Object>>} - Resolves with an array of airport data objects.
 * @throws {Error} - Throws an error if the data fetching fails.
 */
export async function fetchAirportData() {
  try {
    const response = await fetch('/api/airports');
    if (!response.ok) {
      throw new Error('Airport data not found');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching airport data:', error);
    throw error; 
  }
};
export function getUniqueAirportCodes(flights) {
  return Array.from(new Set(flights.flatMap(flight => [flight.origin_airport, flight.destination_airport])));
}
