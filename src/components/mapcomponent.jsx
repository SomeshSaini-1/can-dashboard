import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Leaflet default icon images as ES Modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const Map = ({ height = 500 }) => {
  const defaultCenter = [26.327573174041746, 94.42290457351207];

  const positions = [
    [26.852770, 75.779541],
    [26.852770, 75.779541]
  ];

  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ 
          height: `100vh`,
           width: '100%'
         }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((pos, idx) => (
          <Marker key={idx} position={pos}>
            <Popup>Marker {idx + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;





