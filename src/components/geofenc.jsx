
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
// import { EditControl } from "react-leaflet-draw";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import * as L from "leaflet";

// const DrawMap = ( sendDataToParent) => {
//   const [point, setPoint] = useState([]);
//   const [mark, setmark] = useState();


//   useEffect(() => {
//     console.log(point,typeof sendDataToParent);
// if (point?.Data && typeof sendDataToParent === "function") {
//       sendDataToParent(point);
//     }
    
//     //  console.log(mark,point.center,point.radius);
//     if (mark) {


//       // const inside = isPointInsidePolygon(mark, point);
//       // console.log("Point inside:", inside);

//     }
//   }, [point, mark])

//   // function handleClick() {
//   //   sendDataToParent(data);
//   // }

//   // Handle shape creation
//   const handleCreated = (e) => {
//     const { layerType, layer } = e;

//     if (layerType === "polygon" || layerType === "rectangle") {
//       const latlngs = layer.getLatLngs()[0];
//       console.log("Polygon boundary coordinates:", latlngs);

//       const bounds = layer.getBounds();
//       console.log("Bounding Box:", {
//         north: bounds.getNorth(),
//         south: bounds.getSouth(),
//         east: bounds.getEast(),
//         west: bounds.getWest(),
//       });
//       // setPoint(latlngs);
//       setPoint({ Data: latlngs, type: "Polygon" })
//     }

//     if (layerType === "circle") {
//       console.log("Circle Center:", layer.getLatLng());
//       console.log("Circle Radius:", layer.getRadius());
//       // setPoint({
//       //   center: layer.getLatLng(),
//       //   radius: layer.getRadius()
//       // });
//       setPoint({
//         Data: {
//           center: layer.getLatLng(),
//           radius: layer.getRadius()
//         },
//         type: "Circle"
//       });
//     }

//     if (layerType === "marker") {
//       console.log("Marker Position:", layer.getLatLng());
//       setmark(layer.getLatLng());
//     }
//   };

//   return (
//     <div style={{ height: `60vh`, width: "100%" }}>
//       <MapContainer
//         center={[26.9124, 75.7873]}
//         zoom={6}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <FeatureGroup>
//           <EditControl
//             position="topright"
//             onCreated={handleCreated}
//             draw={{
//               polygon: {
//                 shapeOptions: { color: "blue" },
//                 showArea: true,
//               },
//               rectangle: false,
//               // rectangle: {
//               //   shapeOptions: { color: "green" },
//               // },
//               circle: {
//                 shapeOptions: { color: "red" },
//               },
//               marker: true,
//               polyline: false,
//               circlemarker: false,
//             }}
//           />
//         </FeatureGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default DrawMap;




import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";

const Geofenc = ({ height = 100, sendDataToParent }) => {
  const [point, setPoint] = useState(null);
  const [mark, setMark] = useState(null);

  console.log("Props received:", { height, sendDataToParent }); // ✅ check here


//   // Utility: Check if a point is inside a polygon
//   function isPointInsidePolygon(point, polygonLatLngs) {
//     const polygon = L.polygon(polygonLatLngs);
//     return polygon.getBounds().contains(point);
//   }


//   // const inside = isPointInsidePolygon({ lat: 26.913, lng: 75.790 }, latlngs);
//   // console.log("Point inside:", inside);

//   // Utility: Check if a point is inside a circle
//   function isPointInsideCircle(point, center, radius) {
//     console.log(point, center, radius, "cheker")
//     const distance = L.latLng(center).distanceTo(L.latLng(point)); // meters
//     return distance <= radius;
//   }
//       // const p = isPointInsideCircle(mark,point.center,point.radius);
//       // console.log(p)


  useEffect(() => {
    console.log("Point changed:", point);
    if (point?.Data && typeof sendDataToParent === "function") {
      sendDataToParent(point);
    }
  }, [point, sendDataToParent]);

  const handleCreated = (e) => {
    const { layerType, layer } = e;

    if (layerType === "polygon" || layerType === "rectangle") {
      const latlngs = layer.getLatLngs()[0];
      setPoint({ Data: latlngs, type: "Polygon" });
    }

    if (layerType === "circle") {
      setPoint({
        Data: {
          center: layer.getLatLng(),
          radius: layer.getRadius(),
        },
        type: "Circle",
      });
    }

    if (layerType === "marker") {
      setMark(layer.getLatLng());
    }
  };

  useEffect(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);
}, []);

  return (
    <div style={{ height: `${height}vh`, width: "100%" }}>
      <MapContainer
        center={[26.9124, 75.7873]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              polygon: { shapeOptions: { color: "blue" }, showArea: true },
              rectangle: false,
              circle: { shapeOptions: { color: "red" } },
              marker: false,
              polyline: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Geofenc;

