import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useState, useEffect } from 'react';
import FlightPanel from './FlightPanel';
import FlightPanelFilters from './FlightPanelFilters';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import airport from '../assets/airport.webp';
import selectedAirport from '../assets/selected.webp';
import FlightPolyline from './FlightPolyline';

const airportIcon = new Icon({
  iconUrl: airport,
  iconSize: [38, 38],
  iconAnchor: [22, 30],
});
const selectedAirportIcon = new Icon({
  iconUrl: selectedAirport,
  iconSize: [38, 38],
  iconAnchor: [22, 30],
});

/**
 * Generates unique colors for flights.
 *
 * @param {number} num - The number of colors to generate.
 * @returns {Array<string>} An array of hex color strings.
 */
const generateUniqueColors = (num) => {
  const colors = [];
  while(colors.length < num){
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);

    const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

    //to avoid displaying light colors because of the backgroung being white
    if (brightness <= 180) {
      colors.push(color);
    }
  }
  return colors;
};

/**
 * Assigns a unique color to each flight.
 *
 * @param {Array<Object>} flights - Array of flight objects.
 * @returns {Array<Object>} Array of flights with assigned colors.
 */
const assignColors = (flights) =>{
  const colors = generateUniqueColors(flights.length);
  return flights.map((flight, index) => ({
    ...flight,
    color: colors[index],
  }));
};


/**
* Map component to render an interactive Leaflet map displaying airport markers.
*
* @component
* @param {Object} props - Component properties.
* @param {Array<Object>} props.visibleAirports - List of airports to display as markers on the map.
* @param {Function} props.filterVisibleAirports - Function to filter visible airports based
 on selected airport.
* @param {Function} props.restore - Function to reset the view and filters.
* @param {Function} props.setIsRegionLocked - Sets the region lock state.
* @returns {JSX.Element} Map component containing airport markers and flight polylines.
*/
export default function Map({ visibleAirports, filterVisibleAirports, 
  restore, setIsRegionLocked }) {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isFlightDetailsVisible, setIsFlightDetailsVisible] = useState(false);
  const [flights, setFlights] = useState([]);
  const [displayedFlights, setDisplayedFlights] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false); 

  /**
   * Handles airport selection and fetches flights for the selected airport.
   *
   * @param {Object} airport - The selected airport.
   * @param {string} direction - Direction of flights to fetch (inbound or outbound).
   * @param {number} minDate - Minimum date filter.
   * @param {number} maxDate - Maximum date filter.
   */
  const handleAirportClick = 
    async (airport, direction = 'inbound', minDate = 1, maxDate = 1) => {
      setFlights([]);
      setDisplayedFlights([]);
      setLoading(true); 
      try {
        const response = await fetch(
          `/api/flights/${airport.local_code}/${direction}/${minDate}/${maxDate}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        const flightsWithColors = assignColors(data);
        setFlights(flightsWithColors);
        filterVisibleAirports(data);
      } catch (err) {
        console.error('Error fetching flights:', err.message);
      } finally {
        setLoading(false); 
      }
    };


  const usCenter = [37.0902, -95.7129];
  const usBounds = [
    [10.0, -180.0],
    [72.0, -50.0]
  ];

  /**
   * Handles clicking on a marker to display flight data for the selected airport.
   *
   * @param {Object} airport - The airport selected by the user.
   */
  const handleMarkerClick = async (airport) => {
    setSelectedAirport(airport); 
    setIsPanelVisible(true);
    await handleAirportClick(airport);
  };



  return (
    <div className="map-panel-container">
      <div className="map-wrapper">
        <MapContainer
          center={usCenter}
          zoom={8}
          zoomControl={true}
          updateWhenZooming={false}
          updateWhenIdle={true}
          preferCanvas={true}
          minZoom={6}
          maxZoom={10}
          maxBounds={usBounds}
          maxBoundsViscosity={1.0}
          className="leaflet-container"
        >
          <TileLayer attribution={attribution} url={tileUrl} />
          {visibleAirports.map((airport) => 
            <Marker
              key={airport.local_code}
              position={[airport.latitude_deg, airport.longitude_deg]}
              icon={selectedAirport && selectedAirport.local_code 
                === airport.local_code ? selectedAirportIcon : airportIcon} 
              eventHandlers={{
                click: () => {
                  handleMarkerClick(airport);
                  setIsRegionLocked(true);
                },
              }}
            />
          )}
          <FlightPolyline flights={displayedFlights} airportData={visibleAirports} />
          <MapInteractionController isFlightDetailsVisible={isFlightDetailsVisible} />
        </MapContainer>
      </div>
      {isPanelVisible && 
        <div className="flight-panel-container">
          <FlightPanel
            flights={flights}
            airport={selectedAirport}
            onClose={() => {
              setIsPanelVisible(false);
              setDisplayedFlights([]);
              setSelectedAirport(null);
              restore();
            }}
            setDetailsVisible={setIsFlightDetailsVisible}
            detailsVisible={isFlightDetailsVisible}
            displayedFlights={displayedFlights}
            setDisplayedFlights={setDisplayedFlights}
            restore={restore}
            setIsFilterVisible={setIsFilterVisible}
            loading={loading}
          />
          {isFilterVisible && 
            <div className="filter-popup">
              <FlightPanelFilters
                selectedAirport={selectedAirport}
                filterFlights={handleAirportClick}
                setIsFilterVisible={setIsFilterVisible}
              />
            </div>
          }
        
        </div>
      }
    </div>
  );
}

/**
 * Controls map interactions based on the visibility of flight details.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isFlightDetailsVisible - Whether flight details are visible.
 * @returns {null} Renders no visible elements.
 */
function MapInteractionController({ isFlightDetailsVisible }) {
  const map = useMap();

  useEffect(() => {
    if (isFlightDetailsVisible) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isFlightDetailsVisible, map]);

  return null;
}
