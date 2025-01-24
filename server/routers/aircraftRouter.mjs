import express from 'express';
import { getAircraftByRegistration } from '../controllers/aircraftController.mjs';  

const router = express.Router();
/**
 * @swagger
 * /aircraft/registration/{registration}:
 *   get:
 *     tags:
 *       - Aircraft
 *     summary: Get aircraft details by registration
 *     description: Retrieve aircraft information by its registration number.
 *     parameters:
 *       - in: path
 *         name: registration
 *         required: true
 *         description: The registration number of the aircraft (e.g., "N7709A")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aircraft details found for the given registration
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   icao24:
 *                     type: string
 *                   built:
 *                     type: string
 *                     nullable: true
 *                   categoryDescription:
 *                     type: string
 *                   country:
 *                     type: string
 *                   engines:
 *                     type: string
 *                   firstFlightDate:
 *                     type: string
 *                     nullable: true
 *                   icaoAircraftClass:
 *                     type: string
 *                   manufacturerName:
 *                     type: string
 *                   model:
 *                     type: string
 *                   operator:
 *                     type: string
 *                   operatorIcao:
 *                     type: string
 *                   owner:
 *                     type: string
 *                   registration:
 *                     type: string
 *             example:
 *               - _id: "672fac61773088c27d5351d6"
 *                 icao24: "a3b05d"
 *                 built: null
 *                 categoryDescription: "''"
 *                 country: "United States"
 *                 engines: "CFM INTL LEAP-1A26"
 *                 firstFlightDate: null
 *                 icaoAircraftClass: "L2J"
 *                 manufacturerName: "Airbus"
 *                 model: "A320-251N"
 *                 operator: "Frontier Airlines"
 *                 operatorIcao: "FFT"
 *                 owner: "Wells Fargo Trust Co Na Trustee"
 *                 registration: "N337FR"
 *       400:
 *         description: Bad request, invalid registration number
 *       404:
 *         description: Aircraft not found with the provided registration number
 *       500:
 *         description: Internal server error
 */
router.get('/aircraft/registration/:registration', getAircraftByRegistration);


export default router;