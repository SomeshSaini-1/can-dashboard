import { MapContainer, TileLayer, Marker, Popup,useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png";
import { useState, useCallback, useEffect } from "react";
import { MapPinCheck } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

const directionIcon = (img,angle) =>
  L.divIcon({
    html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
    className: "",
    iconSize: [60, 50],
    iconAnchor: [30, 50],
  });

const Map = ({ height = 100, device }) => {
  const [defaultCenter, setDefaultCenter] = useState([26.327573174041746, 94.42290457351207]);
  const [positions, setPositions] = useState({});
  const [zoom, setZoom] = useState(5);
  const apiurl = import.meta.env.VITE_API_URL;

  const getValidCoordinates = (lat, long) => {
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
      return null;
    }
    return [parseFloat(lat), parseFloat(long)];
  };

  const fetchDeviceData = useCallback(async (device_id) => {
    if (!device_id) return;
    console.log(device_id)
    try {
      const response = await fetch(`${apiurl}/get_device_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id:device_id }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const newPositions = {};
        data.forEach((ele) => {
          const coords = getValidCoordinates(ele.lat, ele.long);
            if(device_id !== "all"){
           setDefaultCenter(coords)
           setZoom(13);
        }
          console.log(coords)
          if (coords) {
            if (!newPositions[ele.device_id]) newPositions[ele.device_id] = [];
            newPositions[ele.device_id].push(coords);
          }
        });
        setPositions(newPositions);
      
      }
    } catch (error) {
      console.error("Error fetching map info:", error);
    }
  }, [apiurl]);

  useEffect(() => {
    fetchDeviceData(device || "all");
    const interval = setInterval(() => {
      fetchDeviceData(device || "all");
    }, 5000);
    return () => clearInterval(interval);
  }, [device, fetchDeviceData]);

  
  console.log("coords",device,defaultCenter,zoom);

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: `${height}vh`, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <SetViewOnChange center={defaultCenter} zoom={zoom} />
        {/* {device && <Marker position={defaultCenter} 
        icon={directionIcon('data:image/png;base64,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') }/> } */}
        {Object.entries(positions).map(([deviceId, coords]) =>
          coords.map((pos, idx) => (
            <Marker
              key={`${deviceId}-${idx}`}
              position={pos}
              // icon={directionIcon(Math.floor(Math.random() * 360))}
              icon={directionIcon(customMarkerImage,Math.floor(2))}
            >
              <Popup>
                <div>
                  <h4>Device: {deviceId}</h4>
                  <p>Latitude: {pos[0]}</p>
                  <p>Longitude: {pos[1]}</p>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default Map;


// ✅ Helper: keeps map center and zoom updated
const SetViewOnChange = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};