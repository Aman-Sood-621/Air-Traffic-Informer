import './FlightPanel.css';

/**
 * Component for displaying a list of flights with their respective flight numbers.
 * If flights have been fetched and are available, it displays each flight as an item.
 * If no flights match the selected criteria, a message is shown.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.flights - An array of flight objects to display.
 * @param {boolean} props.hasFetched - Boolean indicating whether flights have been fetched.
 * @param {Function} props.handleDetailsClick - Function to handle the click event 
 * for viewing flight details.
 * @returns {JSX.Element} A JSX element rendering the list of flights or appropriate messages.
 */
const FlightList = ({ flights, hasFetched, handleDetailsClick }) => {
  return (
    <div className="flight-ids">
      <h4>Flight Numbers</h4>
      {hasFetched ?  
        flights.length > 0 ? 
          flights.map((flight) => 
            <div key={flight.id} className="flight-item">
              <img src="/expand.png" alt="Flight icon" className="flight-icon" />
              <p>{flight.flight_number}</p>
              <button className="details-button" 
                onClick={() => handleDetailsClick(flight)}>Details</button>
            </div>
          )
          : <p>No flights available for the selected criteria</p>
        : <p>Click Display Flights to see results</p>
      }
    </div>
  );
};

export default FlightList;