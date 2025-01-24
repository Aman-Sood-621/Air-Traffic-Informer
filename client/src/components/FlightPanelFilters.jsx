import { useState } from 'react';

import './FlightPanelFilters.css';

/**
 * FlightPanelFilters component provides filtering options for flights 
 * based on date range and direction.
 * Allows users to select a minimum and maximum date, and the direction of 
 * flights (inbound or outbound).
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.selectedAirport - The airport object containing information of 
 * the selected airport.
 * @param {Function} props.filterFlights - Function to filter flights based on selected criteria.
 * @param {Function} props.setIsFilterVisible - Function to toggle the visibility of 
 * the filter panel.
 * 
 * @returns {JSX.Element} A JSX element rendering the flight filtering options.
 */
export default function  FlightPanelFilters({selectedAirport, filterFlights, setIsFilterVisible}){
  const [minDate, setMinDate] = useState(1);
  const [maxDate, setMaxDate] = useState(1);
  const [direction, setDirection] = useState('inbound');

  /**
   * Updates the flight direction based on user selection.
   * 
   * @param {Object} e - The event object containing the selected direction.
   */
  const handleDirectionChange = (e) => {
    setDirection(e.target.value);
  };

  /**
   * Sets the minimum date for filtering flights.
   * 
   * @param {Object} e - The event object containing the selected minimum date.
   */
  const handleMinDateChange = (e) => {
    const date = new Date(e.target.value);
    setMinDate(date.getUTCDate());
  };
  
  /**
   * Sets the maximum date for filtering flights.
   * 
   * @param {Object} e - The event object containing the selected maximum date.
   */
  const handleMaxDateChange = (e) => {
    const date = new Date(e.target.value);
    setMaxDate(date.getUTCDate());
  };

  /**
   * Executes the filter action with the selected airport, direction, and date range.
   */
  const handleFilterClick = () => {
    filterFlights(selectedAirport, direction, minDate, maxDate);
  };

  return(
    <>
      <div className="filter-header-container">
        <h1 className ="header">
            Filters
        </h1>
        <button className="close-btn-filter" 
          onClick={() => setIsFilterVisible(prev => !prev)}>X</button>


      </div>
     
      <div className="date-filters">
        <div className="min-date">
          <label htmlFor="min-date">Min Date</label>
          <input
            type="date"
            id="min-date"
            defaultValue="2019-05-01"
            min="2019-05-01"
            max="2019-05-31"
            onChange={handleMinDateChange}
          />
        </div>
        <div className="max-date">
          <label htmlFor="max-date">Max Date</label>
          <input
            type="date"
            id="max-date"
            defaultValue="2019-05-01"
            min="2019-05-01"
            max="2019-05-31"
            onChange={handleMaxDateChange}
          />
        </div>
        <div className="select-direction-container">
          <label htmlFor="direction">Direction</label>
          <select 
            id="direction"
            value={direction}
            onChange={handleDirectionChange}
          >
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
        </div>
        <button className="submit-filter" onClick={handleFilterClick}><span>Filter</span>
        </button>
      </div>
    </>
  );
}
