import React from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const DrawMap = () => {
  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "marker") {
      console.log("Marker added at:", layer.getLatLng());
    } else if (layerType === "circle") {
      console.log("Circle center:", layer.getLatLng(), "Radius:", layer.getRadius());
    } else if (layerType === "polyline" || layerType === "polygon") {
      console.log("Shape coordinates:", layer.getLatLngs());
    }
  };

  const handleEdited = (e) => {
    console.log("Edited layers:", e.layers);
  };

  const handleDeleted = (e) => {
    console.log("Deleted layers:", e.layers);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[26.9124, 75.7873]} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
            draw={{
              rectangle: true,
              polyline: true,
              polygon: true,
              circle: true,
              marker: true,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default DrawMap;
