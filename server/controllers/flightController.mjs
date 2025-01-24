/* eslint-disable camelcase */

import { db } from '../db/db.mjs';

/**
 * Retrieves flights based on query parameters and sends a JSON response.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.min_date - Minimum date filter for flight data.
 * @param {string} req.params.max_date - Maximum date filter for flight data.
 * @param {string} req.params.direction - Direction of the flight (inbound/outbound).
 * @param {string} req.params.airport_code - The airport code to filter flights by.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a JSON response containing flights data.
 */

export const getFlights = async (req, res) => {
  const min_date = parseInt(req.params.min_date, 10);
  const max_date = parseInt(req.params.max_date, 10);
  const direction = req.params.direction;
  const airport_code = req.params.airport_code;
  // Validate parameters
  if (validateParams(req.query, airport_code, direction, min_date, max_date, res)) return;

  // Construct the query object 
  const query = Object.fromEntries(
    Object.entries(req.query).filter(([, value]) => value !== null)
  );
  query.day = { $gte: min_date, $lte: max_date };

  // Set airport based on direction
  if (direction === 'inbound') {
    query.destination_airport = airport_code; 
  } else if (direction === 'outbound') {
    query.origin_airport = airport_code; 
  }
  try {
    const flights = await db.findQuery('flight', query);
    res.status(200).json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).send('Internal Server Error');
  }
};


/**
 * Validates the parameters provided in the request.
 * @param {Object} query - The query parameters from the request.
 * @param {string} airport_code - The airport code to be validated.
 * @param {string} direction - The flight direction (inbound/outbound) to be validated.
 * @param {number} min_date - The minimum date filter for flight data.
 * @param {number} max_date - The maximum date filter for flight data.
 * @param {Object} res - Express response object for sending validation error responses.
 * @returns {boolean} - Returns true if any validation error is found, otherwise false.
 */
function validateParams(query, airport_code, direction, min_date, max_date, res) {
  // Validate direction
  if (!direction || !['inbound', 'outbound'].includes(direction)) {
    res.status(400).json({
      message: `Invalid direction parameter. It must be either 'inbound' or 'outbound'.`
    });
    return true; 
  }

  // Validate dates
  if (isNaN(min_date) || isNaN(max_date) || min_date < 1 || min_date > 31 
  || max_date < 1 || max_date > 31 || max_date < min_date) {
    res.status(400).json({
      message: `Invalid query parameters.\n
      Ensure min_date and max_date are numbers between 1 and 31,\n
      and min_date is less than or equal to max_date.`
    });
    return true; 
  }

  // Validate allowed query parameters
  const validParams = ['min_date', 'max_date', 'carrier_code',
    'flight_number', 'tail_number', 'weekday'];
  const unknownParams = Object.keys(query).filter(param => !validParams.includes(param));
  if (unknownParams.length > 0) {
    res.status(400).json({
      message: `Invalid query parameters: ${unknownParams.join(', ')}. 
        Valid parameters are: ${validParams.join(', ')}.`
    });
    return true; 
  }

  // Validate airport code format
  const airportCodePattern = /^[A-Z]{3}$/;
  if (!airportCodePattern.test(airport_code)) {
    res.status(400).json({
      message: `Invalid airport_code format. It must be exactly 3 uppercase letters.`
    });
    return true; 
  }
  return false; 
}
