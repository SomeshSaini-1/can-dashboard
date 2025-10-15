import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Import your custom marker image
import customMarkerImage from '../assets/image.png';

delete L.Icon.Default.prototype._getIconUrl;

// Merge new options for the default marker icon
L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

const directionIcon = angle => L.divIcon({
  html: `<img src="${customMarkerImage}" style="transform: rotate(${angle}deg); width: 60px; hight: 40px;" />`,
  className: "",
  iconSize: [60, 50],
  iconAnchor: [30, 50],
});

const Map = ({ height = 500 }) => {
  const defaultCenter = [26.327573174041746, 94.42290457351207];

  const positions = [
    [26.852770, 75.779541],
    [25.56910570929897, 75.70904099991213],
    [27.416938465491356, 79.00770757274823],
    [27.416938465491356, 79.00770757274823],
    [26.92940317505087, 76.0721006201059],
    [24.09199891617099, 76.96624733350737],
    [24.92007196590291, 80.15326467553179],
    [23.658365795683363, 72.73749371877999],
    [22.78655046574803, 74.11548388297345],
    [26.16291732939306, 81.7715848086177],
    [24.65240885792152, 79.8118320119511],
    // [`26°27'07.2"N `,`74°37'21.6"E`]
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
          // <Marker key={idx} position={pos}>
          //   <Popup>Marker {idx + 1}</Popup>
          // </Marker>
          <Marker
            position={pos}
            icon={directionIcon(Math.floor(Math.random() * 90) + 10)}  // Rotate 90° east
          >
            <Popup>Marker {idx + 1}</Popup>
          </Marker>

        ))}
      </MapContainer>
    </div>
  );
};

export default Map;





