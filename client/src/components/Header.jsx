import { useState } from 'react';
import './Header.css';

/**
 * Header component provides a UI for filtering airports by municipality and a details panel
 * explaining the app's functionality. Allows users to select a region and restore airport list.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.selectedRegion - The currently selected municipality.
 * @param {Function} props.setSelectedRegion - Function to set the selected municipality.
 * @param {Array<string>} props.regions - Array of available regions to filter airports by.
 * @param {Function} props.onRegionChange - Function called when a municipality is selected.
 * @param {Function} props.restore - Function to restore the default airport list.
 * @param {boolean} props.isRegionLocked - Boolean indicating if the region selection is disabled.
 * 
 * @returns {JSX.Element} A JSX element rendering the header with municipality 
 * filtering options and app info.
 */
export default function Header({ selectedRegion, setSelectedRegion,
  regions, onRegionChange, restore, isRegionLocked }) {
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Toggles the visibility of the app details panel.
   */
  const toggleDetailsPanel = () => {
    setShowDetails(!showDetails);
  };

  /**
   * Handles changes in the selected region and updates the region filter.
   * 
   * @param {Object} event - The event object containing the selected region.
   */
  const handleRegionChange = (event) => {
    const selected = event.target.value;
    setSelectedRegion(selected);
    onRegionChange(selected); 
  };

  return (
    <header className="header-container">
      <div className="logo">
        <p className="page-title">Air Traffic Informer</p>
        <img className="logo-image" src="/logo.webp" alt="App Logo" />
      </div>
      <div className="header-inputs">
        <div className="municipality-dropdown">
          <label htmlFor="municipality">Filter by Municipality</label>
          <select
            id="municipality"
            value={selectedRegion}
            onChange={handleRegionChange} 
            disabled={isRegionLocked} 
          >
            <option value="">Select Municipality</option>
            {regions.map((municipality, index) => 
              <option key={index} value={municipality}>
                {municipality}
              </option>
            )}
          </select>
        </div>
        <div className="refresh-airports">
          <button type="button" className="button" onClick={restore}  >
            <span className="button-text">Restore</span>
            <span className="refresh-image-container"><img
              className="refresh-icon"
              src="/refresh.webp"
              alt="App Info"
        
            /></span>
          </button>
        </div>
      </div>
      <div className="info">
        <img
          className="info-icon"
          src="/info.webp"
          alt="App Info"
          onClick={toggleDetailsPanel}  
        />
      </div>
          
      {showDetails && 
        <div className="details-panel">
          <h3>Air Traffic Informer</h3>
          <p>

            This app allows users to search for flights based off airports. Click on
            an airport on the map to display its flights. 
            You can filter flights by the minimum
            and maximum dates as well as directions, 
            and access more details by clicking on a specific
            flight.
            <br/>
            <strong>Devs : Soufiane, Aman, Abdullah</strong>
          </p>
          <button onClick={toggleDetailsPanel}>Close</button>
        </div>
      }


    
    </header>
  );
}
