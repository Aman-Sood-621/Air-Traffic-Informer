import { Polyline } from 'react-leaflet';

/**
 * Generates a series of intermediate points to create a smooth curved path between two coordinates.
 *
 * @param {Array<number>} origin - The origin coordinates [latitude, longitude].
 * @param {Array<number>} destination - The destination coordinates [latitude, longitude].
 * @param {number} index - The index of the flight, used to calculate offset and curve direction.
 * @returns {Array<Array<number>>} Array of coordinates representing the curved path.
 */
const generateCurvedPath = (origin, destination, index) => {
  
  const numberOfPoints = 100; 
  const points = [];
  
  const offsetFactor = 0.2 * (index + 1);
  const direction = index % 2 === 0 ? 1 : -1;

  // Generate points along the path to create a curve effect
  for (let i = 0; i <= numberOfPoints; i++) {
    const t = i / numberOfPoints; 

    const lat = origin[0] * (1 - t) + destination[0] * t;
    const lng = origin[1] * (1 - t) + destination[1] * t;

    const offset = Math.sin(t * Math.PI) * offsetFactor * direction;
    const curvedLat = lat + offset;
    const curvedLng = lng - offset;

    points.push([curvedLat, curvedLng]);
  }

  return points;
};

/**
 * FlightPolyline component renders curved lines between origin and destination airports on a map.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array<Object>} props.flights - Array of flight data, each with origin and 
 * destination airport codes.
 * @param {Array<Object>} props.airportData - Array of airport data to get coordinates 
 * for each airport.
 *
 * @returns {JSX.Element|null} Renders a Polyline component for each flight path if 
 * coordinates are available.
 */
const FlightPolyline = ({ flights, airportData }) => {
  const getCoordinates = (code) => {
    const airport = airportData.find((a) => a.local_code === code);
    return airport ? [airport.latitude_deg, airport.longitude_deg] : null;
  };

  return flights.map((flight, index) => {
    const originCoords = getCoordinates(flight.origin_airport);
    const destinationCoords = getCoordinates(flight.destination_airport);

    if (originCoords && destinationCoords) {
      const curvedPath = generateCurvedPath(originCoords, destinationCoords, index);
      return (
        <Polyline
          key={`${flight.origin_airport}-${flight.destination_airport}-${index}`}
          positions={curvedPath}
          color={flight.color}
          weight={3}
        />
      );
    }
    return null;
  }).filter(Boolean);
};

export default FlightPolyline;
