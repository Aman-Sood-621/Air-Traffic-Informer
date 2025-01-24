import { useState, useEffect } from 'react';
import './Mainview.css';
import Header from './Header';
import Map from './Map';
import {fetchAirportData, getUniqueAirportCodes } from '../utils/AirportFiltering.mjs';

/**
 * Mainview component that serves as the primary view for the application.
 * Displays airport data on a map and provides filtering functionality based on regions and flights.
 *
 * @component
 * @returns {JSX.Element} The Mainview component.
 */
export default function Mainview() {
  const [airportData, setAirportData] = useState([]);
  const [visibleAirports, setVisibleAirports] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isRegionLocked, setIsRegionLocked] = useState(false);
  /**
   * useEffect hook to fetch airport data on initial render.
   * Calls the asynchronous function getAirportData to retrieve airport locations.
   */
  useEffect(() => {
    const getAirportData = async () => {
      const data = await fetchAirportData();
      setAirportData(data);
      setVisibleAirports(data);
      const uniqueRegion = [...new Set(data.map(airport => airport.region_name))];
      setRegions(uniqueRegion);
    };
    getAirportData();
  }, []);

  /**
   * Filters the visible airports based on the unique local codes derived from flight data.
   * Updates the visible airports in the state.
   *
   * @param {Array} flights - Array of flight objects used to filter airports.
   */
  const filterVisibleAirports = async (flights) => {
    try {
      const uniqueLocalCodes = getUniqueAirportCodes(flights);
      const filteredAirports = airportData.filter(airport =>
        uniqueLocalCodes.includes(airport.local_code)
      );
      setVisibleAirports(filteredAirports);
    } catch (error) {
      console.error('Error fetching filtered airports:', error);
      setVisibleAirports([]); 
    }
  };
  
  /**
   * Filters visible airports based on the selected region.
   * If no region is selected, resets to show all airports.
   *
   * @param {string} region - The name of the selected region.
   */
  const filterVisibleAirportsByRegion = async (region) => {
    if (!region) {
      setVisibleAirports(airportData);
    } else {
      // Filter the airports based on the selected municipality
      const filtered = airportData.filter(airport => airport.region_name === region);
      setVisibleAirports(filtered);
    }
  };
 
  /**
   * Restores the default view of airports, clearing any filters.
   * Resets visible airports, selected region, and the region lock state.
   */
  const restore = () => {
    setVisibleAirports(airportData);
    setSelectedRegion('');
    setIsRegionLocked(false);
  };

  return (
    <div className="main-container">
      <Header 
        regions={regions} 
        onRegionChange={filterVisibleAirportsByRegion} 
        selectedRegion = {selectedRegion}
        setSelectedRegion = {setSelectedRegion}
        restore = {restore}
        isRegionLocked={isRegionLocked}
      />
      <div className="map-container">
        <Map
          visibleAirports={visibleAirports}  
          filterVisibleAirports={filterVisibleAirports} 
          restore={restore}
          setIsRegionLocked = {setIsRegionLocked}
        />
      </div>

    </div>
  );
}
