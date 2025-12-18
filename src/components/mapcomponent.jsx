import { MapContainer, TileLayer, Marker, Popup, useMap, Pane, Circle, Polygon } from "react-leaflet";
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

const directionIcon = (img, angle) =>
  L.divIcon({
    html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
    className: "",
    iconSize: [60, 50],
    iconAnchor: [30, 50],
  });

const Map = ({ height = 100, device, data_seletected }) => {
  // console.log(data_seletected, "map component");

  const [defaultCenter, setDefaultCenter] = useState([26.327573174041746, 94.42290457351207]);
  const [positions, setPositions] = useState({});
  const [zoom, setZoom] = useState(5);

  const apiurl = import.meta.env.VITE_API_URL;

  const getValidCoordinates = (lat, long) => {
    if (!lat || !long || lat === "NA" || long === "NA" || lat === "--" || long === "--") return null;
    return [parseFloat(lat), parseFloat(long)];
  };

  const fetchDeviceData = useCallback(async (device_id) => {
    if (!device_id) return;

    try {
      const response = await fetch(`${apiurl}/get_device_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const newPositions = {};
        let updatedCenter = null;

        data.forEach((ele, idx) => {
          const coords = getValidCoordinates(ele.lat, ele.long);

          if (coords) {
            if (!newPositions[ele.device_id]) newPositions[ele.device_id] = [];
            newPositions[ele.device_id].push(coords);

            if (device_id !== "all" && idx === 0) {
              updatedCenter = coords;
            }
          }
        });

        setPositions(newPositions);

        if (device_id !== "all" && updatedCenter) {
          console.log(updatedCenter,"map center",newPositions);
          setDefaultCenter(updatedCenter);
          setZoom(15);
        } else if (device_id === "all") {
          const allCoords = Object.values(newPositions).flat();
          if (allCoords.length > 0) {
            // console.log(allCoords,"all coords");
            setDefaultCenter(allCoords[0]);
            setZoom(8);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching map info:", error);
    }
  }, [apiurl]);

  useEffect(() => {
    fetchDeviceData(device || "all");
    const interval = setInterval(() => fetchDeviceData(device || "all"), 5000);
    return () => clearInterval(interval);
  }, [device, fetchDeviceData]);

  // GEO FENCE
  const [geoData, setGeoData] = useState([]);

  async function geofetchData(id) {
    try {
      const url = await fetch(`${apiurl}/Get_geofance`, {
        method: "POST",
        body: JSON.stringify({ name: id || "all" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await url.json();
      setGeoData(res.map((ele) => ele.Data));
    } catch (error) {
      console.error("Error fetching geo:", error);
    }
  }

  useEffect(() => {
    geofetchData(device);
  }, [device]);

  return (
    <div style={{ borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: `${height}vh`, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* LIVE ZOOM + CENTER UPDATE */}
        <SetViewOnChange center={defaultCenter} zoom={zoom} setZoom={setZoom} />

        {/* DEVICE MARKERS */}
        {Object.entries(positions).map(([deviceId, coords]) =>
          coords.map((pos, idx) => (
            <Marker
              key={`${deviceId}-${idx}`}
              position={pos}
              icon={directionIcon(customMarkerImage, 20)}
              eventHandlers={{
                click: () => {
                  console.log(deviceId, "device selected.");
                }
              }}
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

        {/* GEO FENCE */}
        <Pane name="somesh" style={{ zIndex: 9999 }}>
          {geoData.map((geo, index) => {
            if (geo[0].Data?.center && geo[0].Data?.radius && geo[0].type === "Circle") {
              return (
                <Circle
                  key={index}
                  center={[geo[0].Data.center.lat, geo[0].Data.center.lng]}
                  radius={geo[0].Data.radius}
                  pathOptions={{
                    color: "red",
                    fillColor: "crimson",
                    fillOpacity: 0.4,
                  }}
                />
              );
            } else {
              return (
                <Polygon
                  key={index}
                  positions={geo[0].Data}
                  pathOptions={{ color: "blue", fillOpacity: 0.3 }}
                />
              );
            }
          })}
        </Pane>
      </MapContainer>
    </div>
  );
};

export default Map;


const SetViewOnChange = ({ center, zoom, setZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }

    const onZoom = () => {
      const currentZoom = map.getZoom();
      console.log("Zoom changed:", currentZoom);
      setZoom(currentZoom); // update parent zoom
    };

    map.on("zoomend", onZoom);

    return () => {
      map.off("zoomend", onZoom);
    };
  }, [center, zoom, map, setZoom]);

  return null;
};
