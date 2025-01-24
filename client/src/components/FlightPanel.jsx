import './FlightPanel.css';
import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import FlightDetails from './FlightDetails';

/**
 * FlightPanel component that displays flight information for a specific airport.
 * Allows users to view flight numbers, filter flights, and view detailed 
 * information for selected flights.
 * Includes pagination and loading states.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.airport - The airport object with details of the selected airport.
 * @param {Array} props.flights - Array of flight objects available for the selected airport.
 * @param {Function} props.onClose - Function to close the flight panel.
 * @param {Function} props.setDetailsVisible - Function to toggle the visibility of flight details.
 * @param {boolean} props.detailsVisible - Boolean indicating if flight details are 
 * currently visible.
 * @param {Array} props.displayedFlights - Array of flights to display on the current page.
 * @param {Function} props.setDisplayedFlights - Function to update the flights displayed 
 * on the current page.
 * @param {Function} props.setIsFilterVisible - Function to toggle the filter visibility.
 * @param {boolean} props.loading - Boolean indicating if the flights data is currently loading.
 * 
 * @returns {JSX.Element} A JSX element rendering the flight panel with filtering 
 * and pagination options.
 */
function FlightPanel({ 
  airport, 
  flights, 
  onClose, 
  setDetailsVisible, 
  detailsVisible,
  displayedFlights,
  setDisplayedFlights,
  setIsFilterVisible,
  loading }) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [details, setDetails] = useState();
  const itemsPerPage = 10;

  /**
   * Resets pagination and updates displayedFlights when flights change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [flights]);

  /**
   * Updates displayedFlights based on the current page and itemsPerPage.
   */
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedFlights(flights.slice(start, end));
  }, [currentPage, flights, itemsPerPage, setDisplayedFlights]);

  /**
   * Handles the "Details" button click event to display flight details.
   * 
   * @param {Object} flight - The flight object containing details of the selected flight.
   */
  const handleButtonClick = (flight) => {
    setDetails(flight);
    setDetailsVisible(true);
  };

  /**
   * Closes the flight details view.
   */
  const closeFlightDetails = () => {
    setDetailsVisible(false);
  };

  return (
    <div className="flight-panel">
      <div className="panel-head-buttons">
        <div>
          <button 
            onClick={() => setIsFilterVisible(prev => !prev)} 
            className="filter-toggle-button"
          >
              Filters
          </button>
        </div>
        
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
      <h2>{airport.name}</h2>

      <div className="flight-ids">
        <h3>Scheduled Flights</h3>
        {
          loading ?  
            <p>Loading flights...</p>
            : flights.length > 0 ? 
              <>
                {displayedFlights.map((flight) => 
                  <div key={flight.id} 
                    className="flight-item">
                    <div 
                      className="flight-color-indicator" 
                      style={{ backgroundColor: flight.color }}
                    ></div>
                    <span className="flight-number">{flight.flight_number}</span> 
                    <span className="flight-route">
                      {flight.origin_airport} → {flight.destination_airport}
                    </span>
                    <button 
                      className="details-button" 
                      onClick={() => handleButtonClick(flight)}
                    >
                      Details
                    </button>
                  </div>
                )}
                {detailsVisible && 
                    <FlightDetails flight={details} closeFunction={closeFlightDetails} />
                }
                <Pagination 
                  items={flights} 
                  itemsPerPage={itemsPerPage} 
                  onPageChange={setDisplayedFlights}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage} 
                />
              </>
              : 
              <p>No flights available for the selected criteria</p>
        }
      </div>
    </div>
  );
}

export default FlightPanel;
