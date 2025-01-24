import { db } from '../db/db.mjs';

/**
 * Retrieves an aircraft by its registration number and sends a JSON response.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.registration - The registration number of the aircraft to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a JSON response containing the aircraft data or
 *  an error status.
 */
export async function getAircraftByRegistration(req, res){
  const { registration } = req.params;

  try{
    const aircraft = await db.findQuery('aircraft', {registration});

    if (aircraft && aircraft.length > 0) {
      res.json(aircraft);
    } else {
      res.status(404).json({ error: 'No aircraft found for the specified registration' });
    }
  } catch(error){
    console.error('Error fetching aircraft by registration:', error);
    res.status(500).send('Internal Server Error');
  } 
}

