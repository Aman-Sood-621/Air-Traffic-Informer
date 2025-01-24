import express from 'express';
import * as flight from '../controllers/flightController.mjs';

const router = express.Router();

// Caching middleware for flights
const cacheFlights = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=86400');
  next();
};

/**
 * @swagger
 * /flights/{airport_code}/{direction}/{min_date}/{max_date}:
 *   get:
 *     tags:
 *       - Flights
 *     summary: Get flight information based on airport, direction, and date range
 *     parameters:
 *       - in: path
 *         name: airport_code
 *         required: true
 *         description: The airport code for the origin airport (e.g., LAX, SFO)
 *         schema:
 *           type: string
 *       - in: path
 *         name: direction
 *         required: true
 *         schema:
 *           type: string
 *           enum: [inbound, outbound]
 *         description: The flight direction, either 'inbound' or 'outbound'
 *       - in: path
 *         name: min_date
 *         required: true
 *         description: The minimum day of the month (1-31)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 31
 *       - in: path
 *         name: max_date
 *         required: true
 *         description: The maximum day of the month (1-31)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 31
 *       - in: query
 *         name: carrier_code
 *         required: false
 *         description: The airline carrier code (e.g., "F9")
 *         schema:
 *           type: string
 *       - in: query
 *         name: flight_number
 *         required: false
 *         description: The flight number (e.g, 402)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tail_number
 *         required: false
 *         description: The tail number of the aircraft (e.g., "N7709A")
 *         schema:
 *           type: string
 *       - in: query
 *         name: weekday
 *         required: false
 *         description: The day of the week of the flight (e.g., 1 for Monday)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *     responses:
 *       200:
 *         description: A list of flights matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the flight record
 *                   carrier_code:
 *                     type: string
 *                     description: The airline carrier code (e.g., F9)
 *                   flight_number:
 *                     type: integer
 *                     description: The flight number
 *                   origin_airport:
 *                     type: string
 *                     description: The code of the origin airport (e.g., LAX)
 *                   destination_airport:
 *                     type: string
 *                     description: The code of the destination airport (e.g., DEN)
 *                   tail_number:
 *                     type: string
 *                     description: The tail number of the aircraft
 *                   day:
 *                     type: integer
 *                     description: The day of the month of the flight
 *                   weekday:
 *                     type: integer
 *                     description: The day of the week of the flight (e.g., 1 for Monday)
 *                   actual_departure_dt:
 *                     type: string
 *                     description: The actual departure date and time in YYYY-MM-DD HH:mm format
 *                   actual_arrival_dt:
 *                     type: string
 *                     description: The actual arrival date and time in YYYY-MM-DD HH:mm format
 *             example:
 *               - _id: "672fac60773088c27d47aaa4"
 *                 carrier_code: "F9"
 *                 flight_number: 402
 *                 origin_airport: "LAX"
 *                 destination_airport: "DEN"
 *                 tail_number: "N702FR"
 *                 day: 2
 *                 weekday: 3
 *                 actual_departure_dt: "2019-05-02 1:48"
 *                 actual_arrival_dt: "2019-05-02 4:54"
 *               - _id: "672fac60773088c27d47aaa5"
 *                 carrier_code: "F9"
 *                 flight_number: 662
 *                 origin_airport: "SFO"
 *                 destination_airport: "DEN"
 *                 tail_number: "N318FR"
 *                 day: 2
 *                 weekday: 3
 *                 actual_departure_dt: "2019-05-02 1:06"
 *                 actual_arrival_dt: "2019-05-02 4:23"
 *       400:
 *         description: Bad request, one or more parameters are invalid
 *       500:
 *         description: Internal server error
 */
router.get(
  '/flights/:airport_code/:direction/:min_date/:max_date', cacheFlights, flight.getFlights);

export default router;
