import { MapContainer, TileLayer, Pane, Circle, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png";
import { useState, useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

// ✅ Helper: keeps map center and zoom updated
const SetViewOnChange = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const Map = ({ height = 100, device }) => {
  const [defaultCenter, setDefaultCenter] = useState([26.327573174041746, 94.42290457351207]);
  
  const [zoom, setZoom] = useState(5);
  const apiurl = import.meta.env.VITE_API_URL;
  const [geoData, setGeoData] = useState([]);
  async function geofetchData(id) {
    const url = await fetch(`${apiurl}/Get_geofance`, {
      method: "POST",
      body: JSON.stringify({ name: id || "all" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await url.json();
    setGeoData(res.map((ele) => ele.Data));

    if (id && res[0].Data[0].type === "Polygon") {
      setDefaultCenter([res[0].Data[0].Data[0].lat, res[0].Data[0].Data[0].lng]);
      setZoom(8);
    } else if (id && res[0].Data[0].Data.center) {
      setDefaultCenter([
        res[0].Data[0].Data.center.lat,
        res[0].Data[0].Data.center.lng,
      ]);
      setZoom(8);
    }
  }

  useEffect(() => {
    geofetchData(device);
  }, [device]);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: `${height}vh`, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Add this inside the MapContainer */}
        <SetViewOnChange center={defaultCenter} zoom={zoom} />

        <Pane name="somesh" style={{ zIndex: 9999 }}>
          {geoData.map((geo, index) => {
            if (
              geo[0].Data?.center &&
              geo[0].Data?.radius &&
              geo[0].type === "Circle"
            ) {
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
