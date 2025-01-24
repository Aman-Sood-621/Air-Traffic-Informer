import express from 'express';
import { getAirports, getAirportByLocalCode } from '../controllers/airportController.mjs';

const router = express.Router();

// Caching middleware for airports
const cacheAirports = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=604800');
  next();
};


/**
 * @swagger
 * /airports:
 *   get:
 *     tags:
 *       - Airports
 *     summary: Get a list of all airports
 *     responses:
 *       200:
 *         description: A list of airports with basic information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the airport
 *                       latitude_deg:
 *                         type: number
 *                         format: float
 *                         description: The latitude of the airport
 *                       longitude_deg:
 *                         type: number
 *                         format: float
 *                         description: The longitude of the airport
 *                       local_code:
 *                         type: string
 *                         description: The airport code (e.g., LAX, ORD)
 *                       url:
 *                         type: string
 *                         description: The URL to view the airport details
 *             example:
 *               data:
 *                 - name: "Los Angeles International Airport"
 *                   latitude_deg: 33.942501
 *                   longitude_deg: -118.407997
 *                   local_code: "LAX"
 *                   url: "/airport/LAX"
 *                 - name: "Chicago O'Hare International Airport"
 *                   latitude_deg: 41.9786
 *                   longitude_deg: -87.9048
 *                   local_code: "ORD"
 *                   url: "/airport/ORD"
 *       500:
 *         description: Internal server error
 */
router.get('/airports', cacheAirports, getAirports);

/**
 * @swagger
 * /airport/{localCode}:
 *   get:
 *     tags:
 *        - Airports
 *     summary: Get details of a specific airport by its local code
 *     parameters:
 *       - in: path
 *         name: localCode
 *         required: true
 *         description: The local code of the airport (e.g., DEN)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about a specific airport
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the airport
 *                   id:
 *                     type: integer
 *                     description: The internal identifier for the airport
 *                   ident:
 *                     type: string
 *                     description: The identifier code for the airport (e.g., KDEN)
 *                   type:
 *                     type: string
 *                     description: The type of airport (e.g., large_airport)
 *                   name:
 *                     type: string
 *                     description: The full name of the airport
 *                   latitude_deg:
 *                     type: number
 *                     format: float
 *                     description: The latitude of the airport
 *                   longitude_deg:
 *                     type: number
 *                     format: float
 *                     description: The longitude of the airport
 *                   elevation_ft:
 *                     type: integer
 *                     description: The elevation of the airport in feet
 *                   country_name:
 *                     type: string
 *                     description: The country where the airport is located
 *                   iso_country:
 *                     type: string
 *                     description: The ISO country code (e.g., US)
 *                   region_name:
 *                     type: string
 *                     description: The region where the airport is located
 *                   local_code:
 *                     type: string
 *                     description: The local code of the airport (e.g., DEN)
 *                   home_link:
 *                     type: string
 *                     description: The official website of the airport
 *                   last_updated:
 *                     type: string
 *                     format: date-time
 *                     description: The last update time for the airport information
 *             example:
 *               - _id: "672fac5f773088c27d47538c"
 *                 id: 3486
 *                 ident: "KDEN"
 *                 type: "large_airport"
 *                 name: "Denver International Airport"
 *                 latitude_deg: 39.86169815
 *                 longitude_deg: -104.6729965
 *                 elevation_ft: 5431
 *                 country_name: "United States"
 *                 iso_country: "US"
 *                 region_name: "Colorado"
 *                 local_code: "DEN"
 *                 home_link: "http://www.flydenver.com/"
 *                 last_updated: "2015-11-13T09:28:42.000Z"
 *       400:
 *         description: Bad request, invalid local code
 *       500:
 *         description: Internal server error
 */
router.get('/airport/:localCode', getAirportByLocalCode);

export default router;
