import './FlightDetails.css';

/**
 * FlightDetails component that displays details of a flight.
 * It includes information like the flight date, carrier code, airport codes, 
 * flight duration, flight ID, and aircraft tail number.
 * The component also includes a button that triggers a close function.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.flight - The flight object containing flight details.
 * @param {Function} props.closeFunction - The function to close the flight details.
 * @returns {JSX.Element} - A JSX element displaying the flight details and a close button.
 */
const FlightDetails = ({ flight, closeFunction }) => {
  return (
    <div className="flight-details-container">
      <h2>Flight Details</h2>
      <ul>
        <li><em>Flight Number:  </em> {flight.flight_number}</li>
        <li><em>Carrier Code:  </em> {flight.carrier_code}</li>
        <li><em>Start AP Code:  </em> {flight.origin_airport}</li>
        <li><em>End AP Code:  </em> {flight.destination_airport}</li>

        <li>
          <em>Flight Time information:</em>
          <ul className="TimeDetails">
            <li><em>Departure:  </em> {flight.actual_departure_dt}</li>
            <li><em>Arrival:  </em> {flight.actual_arrival_dt}</li>
            <li><em>Duration:   </em> 
              {getFlightDuration(flight.actual_departure_dt, flight.actual_arrival_dt)}
            </li>
          </ul>
        </li>

        <li><em>Aircraft Tail Number:  </em> {flight.tail_number}</li>
      </ul>
      <div className="button-container">
        <button className="flight-details-button" onClick={closeFunction}>
        Close
        </button>
      </div>
    </div>
  );
};

/**
 * Calculates the flight duration between the departure and arrival times.
 * It returns the duration in hours and minutes.
 *
 * @param {string} start - The departure time in string format (e.g., '2019-05-01 0:32').
 * @param {string} end - The arrival time in string format (e.g., '2019-05-01 2:59').
 * @returns {string} - The flight duration in the format "Xh Ym", where X is hours and Y is minutes.
 */
const getFlightDuration = (start, end) => {
  const departure = new Date(start);
  const arrival = new Date(end);
  const durationMs = arrival - departure;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor(durationMs % (1000 * 60 * 60)) / (1000 * 60);
  return `${hours}h ${minutes}m`;
};

export default FlightDetails;