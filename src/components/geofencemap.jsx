import { MapContainer, TileLayer, Pane, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerImage from '../assets/image.png';
import { useState, useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

const Map = ({ height = 100, device }) => {
  const [defaultCenter, setDefaultCenter] = useState([26.327573174041746, 94.42290457351207]);

  const [geoData, setGeoData] = useState([]);
  const apiurl = import.meta.env.VITE_API_URL;
const [zoom,setzoom] = useState(5)


  async function fetchData(id) {
    console.log(id,"device id")
    const url = await fetch(`${apiurl}/Get_geofance`, {
      method: "POST",
      body: JSON.stringify({ name: id || "all" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await url.json();
    console.log("API Data:", res);
    setGeoData(res.map(ele => ele.Data)); // ✅ fixed

  }
  useEffect(() => {
    fetchData(device);
    // device && setzoom(15)
  }, [device]);


console.log(device,"devide")


  useEffect(() => {
    if (device && geoData.length > 0) {
      const firstGeo = geoData[0][0];
      setzoom(10)
      if (firstGeo.type === "Circle" && firstGeo.Data?.center) {
        setDefaultCenter([firstGeo.Data.center.lat, firstGeo.Data.center.lng]);
      } else if (firstGeo.Data && firstGeo.Data.length > 0) {
        setDefaultCenter(firstGeo.Data[0]);
      }
    }
  }, [device, geoData]);
  
  return (
    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: `${height}vh`, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Pane name="somesh" style={{ zIndex: 9999 }}>
          
          {geoData.map((geo, index) => {
            console.log(geo[0].type, geo)
            if (geo[0].Data?.center && geo[0].Data?.radius && geo[0].type === "Circle") {
              return (

                <Circle key={index}
                  center={[geo[0].Data.center?.lat, geo[0].Data.center?.lng]}
                  radius={geo[0].Data.radius}
                  pathOptions={{ color: "red", fillColor: "crimson", fillOpacity: .4 }}
                >
                </Circle>
              );
            }else {
              return (
                <Polygon
                  key={index}
                  positions={geo[0].Data}
                  pathOptions={{ color: "blue", fillOpacity: 0.3 }}
                />
              );
            }

            return null;
          })}
        </Pane>
      </MapContainer>
    </div>
  );
};

export default Map;
