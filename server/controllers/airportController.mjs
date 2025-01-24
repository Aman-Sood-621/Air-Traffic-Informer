import { db } from '../db/db.mjs';

/**
 * Retrieves all airports and sends a JSON response with airport data.
 * Each airport includes a URL with its local code.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a JSON response containing airports data
 *  or an error status.
 */
export async function getAirports(req, res){
  try{
    const airports = await db.QueryAllAirports('airport');

    if (airports && airports.length > 0) {
      const response = {
        data: airports.map(airport => ({
          ...airport,
          url: `/airport/${airport.local_code}`
        }))
      };

      res.json(response);
    } else {
      res.status(404).json({ error: 'No airports found' });
    }
  } catch(error){
    console.error('Error fetching airports:', error);
    res.status(500).send('Internal Server Error');
  } 
}

/**
 * Retrieves a specific airport by its local code and sends a JSON response.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.localCode - The local code of the airport to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a JSON response containing the airport data
 *  or an error status.
 */
export async function getAirportByLocalCode(req, res){
  const localCode = req.params.localCode;
  
  try{
    const airport = await db.findQuery('airport', {'iata_code': localCode});
  
    if (airport && airport.length > 0) {
      res.json(airport);
    } else {
      res.status(404).json({ error: 'No airport found for the specified local code' });
    }
  } catch(error){
    console.error('Error fetching airport by local code:', error);
    res.status(500).send('Internal Server Error');
  } 
}

