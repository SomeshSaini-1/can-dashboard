
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Import your custom marker image
import customMarkerImage from '../assets/image.png';
import { useState, useCallback, useEffect } from 'react';

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

const Map = ({ height = 100, device }) => {
  const [defaultCenter, setdef] = useState([26.327573174041746, 94.42290457351207]);

  const [positions, setpositions] = useState([]);

  // const d2 = {
  //   "26.852770, 75.779541",
  //   "25.56910570929897, 75.70904099991213",
  //   "27.416938465491356, 79.00770757274823",
  //   "27.416938465491356, 79.00770757274823",
  //   "26.92940317505087, 76.0721006201059",
  //   "24.09199891617099, 76.96624733350737",
  //   "24.92007196590291, 80.15326467553179",
  //   "23.658365795683363, 72.73749371877999",
  //   "22.78655046574803, 74.11548388297345",
  //   "26.16291732939306, 81.7715848086177",
  //   "24.65240885792152, 79.8118320119511"
  // }

  const getValidCoordinates = (lat, long) => {
    // Check if lat or long are invalid (NA, null, undefined, or empty)
    if (
      lat === "NA" ||
      long === "NA" ||
      lat === null ||
      long === null ||
      lat === undefined ||
      long === undefined ||
      lat === "--" ||
      long === "--"
    ) {
      // Generate random lat/long (example: within India’s approximate range)
      const randomLat = (20 + Math.random() * (30 - 20)).toFixed(6);
      const randomLong = (80 + Math.random() * (90 - 80)).toFixed(6);
      return [parseFloat(randomLat), parseFloat(randomLong)];
    } else {
      return [parseFloat(lat), parseFloat(long)];
    }
  };



  const apiurl = import.meta.env.VITE_API_URL;
  const [telemetry, setTelemetry] = useState(null);
  const [zoom, setzoom] = useState(5);

  // Fetch API Data
  const fetchDeviceData = useCallback(async (device_id) => {
    console.log("data", device_id)
    if (!device_id) return;
    try {
      const response = await fetch(`${apiurl}/get_device_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // setTelemetry(data[0]);
        // setpositions("")
        console.log(data, "Map info");

        data.map(ele => {
          console.log(ele.lat, ele.long, getValidCoordinates(ele.lat, ele.long));

          // setpositions([ele.lat,ele.long])
          // accumulate coordinates instead of overwriting state
          if (device) {
            setdef(pre => [...pre, getValidCoordinates(ele.lat, ele.long)]);
            setzoom(30)
          }
          setpositions(prev => [...prev, getValidCoordinates(ele.lat, ele.long)]);
        });

      }
    } catch (error) {
      console.error("Error fetching map info:", error);
    }
  }, []);

  console.log("positions", "positions", device)


  useEffect(() => {
    fetchDeviceData(device || "all");
    const interval = setInterval(() => {
      fetchDeviceData(device || "all");
    }, 30000);

    return () => clearInterval(interval);
  }, [device]);


  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{
          height: `${height}vh`,
          width: '100%'
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((pos, idx) => (
          <Marker
            position={pos}
            key={idx}
            icon={directionIcon(Math.floor(Math.random() * 90) + 10)}  // Rotate 90° east
          >
            <Popup>{pos[0] + "," + pos[1]}</Popup>
          </Marker>

        ))}
      </MapContainer>
    </div>
  );
};

export default Map;





