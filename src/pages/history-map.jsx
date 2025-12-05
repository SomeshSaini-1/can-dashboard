import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png";
import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, FastForward, LoaderCircle, Pause, Play } from "lucide-react";
import Navbar from "../components/Nav";
import { ToastContainer, toast } from 'react-toastify';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

const directionIcon = (img, angle = 0) =>
  L.divIcon({
    html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
    className: "",
    iconSize: [60, 50],
    iconAnchor: [30, 50],
  });

const MapHistory = () => {
  const apiurl = import.meta.env.VITE_API_URL;

  // const [defaultCenter, setDefaultCenter] = useState([28.6246, 77.2080]);
  // const [zoom, setZoom] = useState(6);
  
    const notify = (data) => toast(data);
    const [defaultCenter, setDefaultCenter] = useState([28.624632933245827, 77.20809144517892]);
    const [zoom, setZoom] = useState(5);
  const [positions, setPositions] = useState({}); 
  const [liveMarkers, setLiveMarkers] = useState({});
  const [deviceData, setDeviceData] = useState([]);
  const [device, setdevice] = useState([]);
  const [loading, setloading] = useState(false);
  const [pause, setpause] = useState(false);
  const playInterval = useRef(null);
  const [Time, setTime] = useState(10);

  const formatDate = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = formatDate();
  const [startdate, setstartdate] = useState(today);
  const [enddate, setenddate] = useState(today);

  const getValidCoordinates = (lat, long) => {
    if (!lat || !long || lat == 0 || long == 0 || lat === "NA" || long === "NA") return null;
    return [parseFloat(lat), parseFloat(long)];
  };


  async function fetchDevices() {
    try {
      const response = await fetch(`${apiurl}/get_device`, {
        method: "POST",
        body: JSON.stringify({ device_id: "all" }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await response.json();
      setDeviceData(res);
    } catch (error) {
      console.error(error);
    }
  }

  const historydata = useCallback(async (device_id) => {
    if (!device_id?.length) return;

    setloading(true);

    const response = await fetch(`${apiurl}/MultipleDeviceHistory`, {
      method: "POST",
      body: JSON.stringify({ device_id, startdate, enddate }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!data?.data?.length) return setloading(false);

    const grouped = {};

    data.data.forEach((ele) => {
      const coords = getValidCoordinates(ele.lat, ele.long);
      if (!coords) return;

      if (!grouped[ele.device_id]) grouped[ele.device_id] = [];
      grouped[ele.device_id].push(coords);
    });

    console.log(grouped);
    setPositions(grouped);

    const firstKey = Object.keys(grouped)[0];
    if (firstKey) {
      setDefaultCenter(grouped[firstKey][0]);
      setZoom(12);
    }

    setloading(false);
  }, [apiurl, startdate, enddate]);


  useEffect(() => {
    console.log(positions,"positions",device)
  // if (!positions?.length || !device?.length) return;
  const firstPoints = {};

  // positions.forEach((ele) => {
  //   if (device.includes(ele.device_id) && !firstPoints[ele.device_id]) {
  //     firstPoints[ele.device_id] = ele.coords.split(",").map(Number);
  //   }
  // });

    Object.keys(positions).forEach((devId) => {
        if (positions[devId][0]) {
          firstPoints[devId] = positions[devId][0];
        }
      });

  console.log(firstPoints,"first point");
  setLiveMarkers(firstPoints);
}, [positions, device]);


  // ✅ PLAY MULTIPLE DEVICE ANIMATION
  const playdata = () => {
    if (pause) {
      clearInterval(playInterval.current);
      playInterval.current = null;
      setpause(false);
      return;
    }

    setpause(true);
    let index = 0;
    console.log(positions);
    playInterval.current = setInterval(() => {
      const updated = {};

      Object.keys(positions).forEach((devId) => {
        if (positions[devId][index]) {
          updated[devId] = positions[devId][index];
        }
      });

      if (Object.keys(updated).length === 0) {
        clearInterval(playInterval.current);
        return;
      }

      console.log(updated);
      setLiveMarkers(updated);
      index++;
    }, 100 * Time);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const [show ,setshow] = useState();

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, []);

  return (
    <div className="flex h-screen">
      <Navbar />

    <ToastContainer />

      <section className="flex-1 overflow-auto">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 text-lg font-semibold mb-6">
            <ArrowLeft />
            <span>History of Devices</span>
          </div>

          

                    <div className="flex flex-wrap gap-6 items-end">
                        {/* <select
                            onChange={(e) => setdevice(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Devices</option>
                            {deviceData.map((device) => (
                                <option key={device.device_id} value={device.device_id}>
                                    {device.device_id}
                                </option> 
                            ))}
                        </select> */}

                        <div
                            onClick={() => setshow(!show)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
                            <input type="text" value={device} readOnly placeholder="All Devices" className="outline-white cursor-pointer" />
                            {show && <ul onClick={(e) => e.stopPropagation()}
                                className="absolute top-14 z-[9999] bg-white w-[13rem] h-[60vh] overflow-auto rounded">
                                {/* <li>All Devices</li> */}

                                {deviceData.map((w) => (
                                    <li key={w.device_id} value={w.device_id} >
                                        <label htmlFor={w.device_id} className="flex justify-between items-center px-4 py-1  cursor-pointer">
                                            <input type="checkbox"
                                                // onChange={e => setdevice(pre => [...pre, e.target.value])}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setdevice((prev) =>
                                                        e.target.checked
                                                            ? [...prev, value]
                                                            : prev.filter((id) => id !== value)
                                                    );
                                                }}
                                                value={w.device_id} id={w.device_id}
                                            />
                                            {/* <p className="w-[85%]" >{w.device_id}</p> */}
                                            {w.device_id}
                                        </label>
                                    </li>
                                ))}

                            </ul>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="startdate" className="text-sm text-gray-600">From</label>
                            <input
                                type="date"
                                value={startdate}
                                id="startdate"
                                onChange={(e) => setstartdate(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="enddate" className="text-sm text-gray-600">To</label>
                            <input
                                type="date"
                                id="enddate"
                                value={enddate}
                                onChange={(e) => setenddate(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition" 
                        onClick={() => {
                          console.log(device.length )
                            if(device.length == 0) notify("Select the device.");
                            device && historydata(device);
                            setshow(false);
                        }}>Filter</button>
                    </div>

          {/* <div className="flex gap-4">
            <div>
              {deviceData.map((w) => (
                <label key={w.device_id} className="flex gap-2">
                  <input
                    type="checkbox"
                    value={w.device_id}
                    onChange={(e) =>
                      setdevice((prev) =>
                        e.target.checked
                          ? [...prev, e.target.value]
                          : prev.filter((id) => id !== e.target.value)
                      )
                    }
                  />
                  {w.device_id}
                </label>
              ))}
            </div>

            <input type="date" value={startdate} onChange={(e) => setstartdate(e.target.value)} />
            <input type="date" value={enddate} onChange={(e) => setenddate(e.target.value)} />

            <button onClick={() => historydata(device)} className="bg-blue-600 text-white px-4 rounded">
              Filter
            </button>
          </div> */}
        </div>

        {!loading ? (
          <div className="p-6 flex gap-4">
            <div className="bg-gray-800 p-4 rounded text-white space-y-4">
              <button onClick={playdata}>
                {pause ? <Pause /> : <Play />}
              </button>

              <button onClick={() => setTime(5)}>
                <FastForward />
              </button>
            </div>

                 {/* {positions.length > 10 && (
                            <div className="flex flex-col justify-between items-start gap-4 bg-gray-800 text-white p-4 rounded-2xl shadow-md my-3">
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => playdata()}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
                                        title="Play"
                                    >
                                        {pause ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>

                                    <button
                                        className="p-2 bg-gray-600 hover:bg-gray-700 rounded-full transition"
                                        title="fastforward"
                                        onClick={() => setTime(5)}
                                    >
                                    
                                        <FastForward className="w-5 h-5" />
                                    </button>

                                    <input
                                        type="range"
                                        min={0}
                                        max={positions.length - 1}
                                        onChange={(e) => setMarker1(positions[e.target.value])}
                                        name="play"
                                        id="play"
                                        className="w-40 accent-blue-500 cursor-pointer"
                                    />
                                </div>

                                
                                <ul className="text-sm space-y-1">
                                    <li><span className="font-semibold">Device Name:</span> {deviceData[0].device_name}</li>
                                    <li><span className="font-semibold">Device ID:</span> {deviceData[0].device_id}</li>
                                    <li><span className="font-semibold">Mode:</span> {deviceData[0].device_mode}</li>
                                    <li><span className="font-semibold">Assigned to:</span> {deviceData[0].Assing_to}</li>
                                </ul>
                            </div>
                        )} */}

            <div className="flex-1 rounded-xl overflow-hidden shadow-lg h-[calc(100vh-220px)]">
              <MapContainer center={defaultCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <SetViewOnChange center={defaultCenter} zoom={zoom} />

                
                {positions &&
                  Object.keys(positions).map((devId) => (
                    <Polyline key={devId} positions={positions[devId]} pathOptions={{ color: "red", weight: 4 }}/>
                  ))}


                {liveMarkers &&
                  Object.entries(liveMarkers).map(([devId, pos]) => (
                    <Marker key={devId} position={pos} icon={directionIcon(customMarkerImage, 0)}>
                      <Popup>
                        <p>Device: {devId}</p>
                        <p>Lat: {pos[0]}</p>
                        <p>Lng: {pos[1]}</p>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>
        ) : (
          <LoaderCircle className="animate-spin" />
        )}
      </section>
    </div>
  );
};

export default MapHistory;

// ✅ Helper: keeps map center and zoom updated
const SetViewOnChange = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};





// import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import customMarkerImage from "../assets/image.png";
// import { useState, useCallback, useEffect, useRef } from "react";
// import { ArrowLeft, FastForward, LoaderCircle, MapPinCheck, Pause, Play, RotateCcw } from "lucide-react";
// import Navbar from "../components/Nav"


// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconUrl: customMarkerImage,
//     iconRetinaUrl: customMarkerImage,
//     iconSize: [60, 50],
//     iconAnchor: [30, 50],
//     shadowUrl: null,
// });

// const directionIcon = (img, angle) =>
//     L.divIcon({
//         html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
//         className: "",
//         iconSize: [60, 50],
//         iconAnchor: [30, 50],
//     });

// const MapHistory = () => {
//     const [defaultCenter, setDefaultCenter] = useState([28.624632933245827, 77.20809144517892]);
//     const [zoom, setZoom] = useState(5);
//     const [positions, setPositions] = useState([]);
//     const apiurl = import.meta.env.VITE_API_URL;

//     const formatDate = (d = new Date()) => {
//         const y = d.getFullYear();
//         const m = String(d.getMonth() + 1).padStart(2, "0");
//         const day = String(d.getDate()).padStart(2, "0");
//         return `${y}-${m}-${day}`;
//     };

//     const today = formatDate();
//     const [startdate, setstartdate] = useState(today);
//     const [enddate, setenddate] = useState(today);
//     const [deviceData, setDeviceData] = useState([]);
//     const [device, setdevice] = useState([]);
//     const [Marker1, setMarker1] = useState();
//     const [loading, setloading] = useState(false);

//     const getValidCoordinates = (lat, long) => {
//         if (
//             lat === "NA" ||
//             long === "NA" ||
//             lat === null ||
//             long === null ||
//             lat === undefined ||
//             long === undefined ||
//             lat === "--" ||
//             long === "--" ||
//             lat === "0" ||
//             long === "0" ||
//             lat == 0 ||
//             long == 0
//         ) {
//             return;
//         }
//         return `${parseFloat(lat)}, ${parseFloat(long)}`;
//     };

//     const historydata = useCallback(async (device_id) => {
//         if (!device_id) return;
//         console.log(device_id, 'history data');
//         setloading(true);
//         try {

//             const jsondata = JSON.stringify({
//                 "device_id": device_id,
//                 "startdate": startdate,
//                 "enddate": enddate,
//                 // "page": 1,
//                 // "limit": 50
//             });

//             console.log(jsondata);
//             // DataHistory
//             const response = await fetch(`${apiurl}/MultipleDeviceHistory`, {
//                 method: "POST",
//                 body: jsondata,
//                 headers: { "Content-Type": "application/json" },
//             });

//             const data = await response.json();
//             console.log(data.data, "data");

//             if (data.data.length === 0) return setloading(false);

//             // setPositions(data.data);

//             if (Array.isArray(data.data) && data.data.length > 0) {
//                 // const newPositions = {};
//                 const newPositions = [];
//                 let uniquecoord ;
//                 data.data.forEach((ele) => {

//                     const coords = getValidCoordinates(ele.lat, ele.long);

//                     // Create and use a Promise properly
//                     const promise = new Promise((resolve, reject) => {
//                         if (coords) {
                            
//                          if (uniquecoord !== coords) {
//                             newPositions.push({"device_id":ele.device_id,"coords":coords});
//                             resolve(coords); // success
//                             // setDefaultCenter(coords.split(","))
//                             setZoom(11);
//                           }

//                           uniquecoord = coords;
//                         } else {
//                             reject("Invalid coordinates");
//                         }
//                     });

//                     // Handle the Promise
//                     promise.then((result) => {
//                             // console.log("✅ Valid coords:", result);
//                         })
//                         .catch((err) => {
//                             // console.error("❌", err);
//                         });
//                 });

//                 const uniqueArray = [...new Set(newPositions)];

//                 console.log(uniqueArray, "newPositions");
//                 // uniqueArray.reverse().map(ele => {
//                 //     if (ele.split(',')[0] === "0") return;
//                 //     // console.log(ele);
//                 //     setPositions(pre => [...pre, ele.split(",")]);
//                 //     // console.log(ele.split(","))
//                 // });

//                 setPositions(uniqueArray.reverse());
//                 if (uniqueArray.length > 0) {
//                     if (uniqueArray[0]?.coords.split(",")[0] !== "0") {

//                         setDefaultCenter(uniqueArray[0]?.coords.split(","));
//                         // setMarker1(uniqueArray[0]?.coords.split(","));
//                     }
//                 }
                
//                 setloading(false);

//             }
//         } catch (error) {
//             console.error("Error fetching map info:", error);
//         }
//     }, [apiurl, startdate, enddate]);


//     //     const historydata = useCallback(async (device_id) => {
//     //     if (!device_id) return;
//     //     console.log(device_id, 'history data');
//     //     setloading(true);
//     //     try {

//     //         const jsondata = JSON.stringify({
//     //             "device_id": device_id,
//     //             "startdate": startdate,
//     //             "enddate": enddate,
//     //             // "page": 1,
//     //             // "limit": 50
//     //         });

//     //         console.log(jsondata);
//     //         // DataHistory
//     //         const response = await fetch(`${apiurl}/MultipleDeviceHistory`, {
//     //             method: "POST",
//     //             body: jsondata,
//     //             headers: { "Content-Type": "application/json" },
//     //         });

//     //         const data = await response.json();
//     //         console.log(data.data, "data");

//     //         if (data.data.length === 0) return setloading(false);

//     //         // setPositions(data.data);

//     //         if (Array.isArray(data.data) && data.data.length > 0) {
//     //             const newPositions = {};
//     //             // const newPositions = [];

//     //             data.data.forEach((ele) => {

//     //                 const coords = getValidCoordinates(ele.lat, ele.long);

//     //                 // Create and use a Promise properly
//     //                 const promise = new Promise((resolve, reject) => {
//     //                     if (coords) {
//     //                         // newPositions.push(coords);
                            
                                                        
//     //                         if (coords) {
//     //                             // If device_id not exists, create array
//     //                             if (!newPositions[ele.device_id]) {
//     //                             newPositions[ele.device_id] = [];
//     //                             }

//     //                             // Push coords into that device_id array
//     //                             // newPositions[ele.device_id].push(coords);
//     //                             if (!newPositions[ele.device_id].includes(coords)) {
//     //                                  newPositions[ele.device_id].push(coords);
//     //                             }
//     //                         }

//     //                         resolve(coords); // success
//     //                         // setDefaultCenter(coords.split(","))
//     //                         setZoom(11);

//     //                     } else {
//     //                         reject("Invalid coordinates");
//     //                     }
//     //                 });

//     //                 // // Handle the Promise 
//     //                 promise
//     //                     .then((result) => {
//     //                         // console.log("✅ Valid coords:", result);
//     //                     })
//     //                     .catch((err) => {
//     //                         // console.error("❌", err);
//     //                     });

//     //             });

//     //             console.log(newPositions, "newPositions");

//     //             setPositions(newPositions);
//     //             // const uniqueArray = [...new Set(newPositions)];

//     //             // uniqueArray.reverse().map(ele => {
//     //             //     if (ele.split(',')[0] === "0") return;
//     //             //     // console.log(ele);
//     //             //     setPositions(pre => [...pre, ele.split(",")]);
//     //             //     // console.log(ele.split(","))
//     //             // });


//     //             // console.log(uniqueArray[0]?.split(","));
//     //             // if (uniqueArray.length > 0) {
//     //             //     if (uniqueArray[0]?.split(",")[0] !== "0") {

//     //             //         setDefaultCenter(uniqueArray[0]?.split(","));
//     //             //         setMarker1(uniqueArray[0]?.split(","));
//     //             //     }
//     //             // }
//     //             setloading(false);
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching map info:", error);
//     //     }
//     // }, [apiurl, startdate, enddate]);



//     async function fetchDevices() {

//         try {
//             const response = await fetch(`${apiurl}/get_device`, {
//                 method: "POST",
//                 body: JSON.stringify({ device_id: "all" }),
//                 headers: { "Content-Type": "application/json" },
//             });
//             if (!response.ok) throw new Error("Failed to fetch devices");
//             const res = await response.json();
//             console.log(res, 'device data.');
//             setDeviceData(res);
//         } catch (error) {
//             console.error("Error fetching devices:", error);
//         }
//     }

//     // useEffect(() => {
//     //     device && historydata(device);
//     // }, [device, startdate, enddate]);


//     // console.log("coords", device, defaultCenter, zoom,positions);

//     useEffect(() => {
//         setTimeout(() => {
//             window.dispatchEvent(new Event("resize"));
//         }, 300);
//         fetchDevices();
//     }, []);


//     const [pause, setpause] = useState(false);
//     const playInterval = useRef(null);
//     const [Time, setTime] = useState(10);
//     const [markerele,setmarkerele] = useState({});

// useEffect(() => {
//   if (!positions?.length || !device?.length) return;

//   const firstPoints = {};

//   positions.forEach((ele) => {
//     if (device.includes(ele.device_id) && !firstPoints[ele.device_id]) {
//       firstPoints[ele.device_id] = ele.coords.split(",");
//     }
//   });

//   setmarkerele(firstPoints);

// }, [positions, device]);

// // console.log(markerele);

//     const playdata = () => {
//         if (pause) {
//             clearInterval(playInterval.current)
//             playInterval.current = null;
//             setpause(false)
//             console.log('pause');
//             return;
//         }
//         setPositions([])
//         setpause(true);
//         console.log("playing")
//         let index = 0; // start from first position
//         setMarker1(positions[index]);

//         playInterval.current = setInterval(() => {
//             if (index < positions.length) {
//                 console.log(positions[index][0])
//                 if (positions[index][0] !== "0") {
//                     setMarker1((positions[index])); // update marker position
//                     // setPositions(pre => [...pre, ele.split(",")]);
//                     setPositions(pre => [...pre, positions[index]])
//                     console.log(positions[index], index); // update marker position
//                 }
//                 index++;
//             } else {
//                 clearInterval(playInterval.current); // stop when done
//             }
//         }, 100 * Time); // update every 5 seconds
//     };

//     const [show, setshow] = useState();

//     return (
//         <div className="flex h-screen">
//             <Navbar />
//             <section className="flex-1 overflow-hidden">
//                 <div className="p-6 border-b">
//                     <div className="flex items-center gap-3 text-lg font-semibold mb-6">
//                         <ArrowLeft className="cursor-pointer hover:text-gray-600" />
//                         <span>History of Devices</span>
//                     </div>

//                     <div className="flex flex-wrap gap-6 items-end">
//                         {/* <select
//                             onChange={(e) => setdevice(e.target.value)}
//                             className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="all">All Devices</option>
//                             {deviceData.map((device) => (
//                                 <option key={device.device_id} value={device.device_id}>
//                                     {device.device_id}
//                                 </option> 
//                             ))}
//                         </select> */}

//                         <div
//                             onClick={() => setshow(!show)}
//                             className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
//                             <input type="text" value={device} readOnly placeholder="All Devices" className="outline-white cursor-pointer" />
//                             {show && <ul onClick={(e) => e.stopPropagation()}
//                                 className="absolute top-14 z-[9999] bg-white w-[13rem] h-[60vh] overflow-auto rounded">
//                                 {/* <li>All Devices</li> */}

//                                 {deviceData.map((w) => (
//                                     <li key={w.device_id} value={w.device_id} >
//                                         <label htmlFor={w.device_id} className="flex justify-between items-center px-4 py-1  cursor-pointer">
//                                             <input type="checkbox"
//                                                 // onChange={e => setdevice(pre => [...pre, e.target.value])}
//                                                 onChange={(e) => {
//                                                     const value = e.target.value;
//                                                     setdevice((prev) =>
//                                                         e.target.checked
//                                                             ? [...prev, value]
//                                                             : prev.filter((id) => id !== value)
//                                                     );
//                                                 }}
//                                                 value={w.device_id} id={w.device_id}
//                                             />
//                                             {/* <p className="w-[85%]" >{w.device_id}</p> */}
//                                             {w.device_id}
//                                         </label>
//                                     </li>
//                                 ))}

//                             </ul>}
//                         </div>

//                         <div className="flex flex-col gap-1">
//                             <label htmlFor="startdate" className="text-sm text-gray-600">From</label>
//                             <input
//                                 type="date"
//                                 value={startdate}
//                                 id="startdate"
//                                 onChange={(e) => setstartdate(e.target.value)}
//                                 className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div className="flex flex-col gap-1">
//                             <label htmlFor="enddate" className="text-sm text-gray-600">To</label>
//                             <input
//                                 type="date"
//                                 id="enddate"
//                                 value={enddate}
//                                 onChange={(e) => setenddate(e.target.value)}
//                                 className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition" 
//                         onClick={() => {
//                             if(device.length < 0) alert("Select the device.");
//                             device && historydata(device);
//                             setshow(false);
//                         }}>Filter</button>
//                     </div>
//                 </div>

//                 {!loading ?

//                     <div className="p-6 flex gap-2">

//                         {positions.length > 10 && (
//                             <div className="flex flex-col justify-between items-start gap-4 bg-gray-800 text-white p-4 rounded-2xl shadow-md my-3">
//                                 {/* Controls Section */}
//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         onClick={() => playdata()}
//                                         className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
//                                         title="Play"
//                                     >
//                                         {pause ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
//                                     </button>

//                                     <button
//                                         className="p-2 bg-gray-600 hover:bg-gray-700 rounded-full transition"
//                                         title="fastforward"
//                                         onClick={() => setTime(5)}
//                                     >
//                                         {/* <RotateCcw  /> */}
//                                         <FastForward className="w-5 h-5" />
//                                     </button>

//                                     <input
//                                         type="range"
//                                         min={0}
//                                         max={positions.length - 1}
//                                         onChange={(e) => setMarker1(positions[e.target.value])}
//                                         name="play"
//                                         id="play"
//                                         className="w-40 accent-blue-500 cursor-pointer"
//                                     />
//                                 </div>

//                                 {/* Device Info Section */}
//                                 <ul className="text-sm space-y-1">
//                                     <li><span className="font-semibold">Device Name:</span> {deviceData[0].device_name}</li>
//                                     <li><span className="font-semibold">Device ID:</span> {deviceData[0].device_id}</li>
//                                     <li><span className="font-semibold">Mode:</span> {deviceData[0].device_mode}</li>
//                                     <li><span className="font-semibold">Assigned to:</span> {deviceData[0].Assing_to}</li>
//                                 </ul>
//                             </div>
//                         )}

//                         <div className="flex-1 rounded-xl overflow-hidden shadow-lg h-[calc(100vh-220px)]">
//                             <MapContainer
//                                 center={defaultCenter}
//                                 zoom={zoom}
//                                 style={{ height: "100%", width: "100%" }}
//                             >
//                                 <TileLayer
//                                     attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//                                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                 />

//                                 {/* <Polyline
//                                     positions={positions}
//                                     pathOptions={{ color: "red", weight: 4 }} // customize color and thickness
//                                 /> */}

//                                 <SetViewOnChange center={defaultCenter} zoom={zoom} />
//                                 {markerele &&
//                                     <Marker position={Marker1}
//                                         icon={directionIcon(customMarkerImage, Math.floor(2))}>
//                                         <Popup>
//                                             <div>
//                                                 <h4>Device: {"deviceId"}</h4>
//                                                 <p>Latitude: {Marker1[0]}</p>
//                                                 <p>Longitude: {Marker1[1]}</p>
//                                             </div>
//                                         </Popup>
//                                     </Marker>
//                                 }
//                             </MapContainer>
//                         </div>

//                     </div>

//                     : <> <LoaderCircle size={32} strokeWidth={1.75} absoluteStrokeWidth className="animate-spin slow-spin" /></>}

//             </section>
//         </div>
//     );
// };

// export default MapHistory;


// // ✅ Helper: keeps map center and zoom updated
// const SetViewOnChange = ({ center, zoom }) => {
//     const map = useMap();
//     useEffect(() => {
//         if (center && zoom) map.setView(center, zoom);
//     }, [center, zoom, map]);
//     return null;
// };