
// // import { Edit } from "lucide-react";
// import Sidebar from "../components/Nav";
// import * as XLSX from 'xlsx';
// import { useEffect, useState } from "react";

// export default function Adddevice() {
//   const apiurl = import.meta.env.VITE_API_URL;

//   const [deviceData, setDeviceData] = useState([]);
//   const [deviceId, setDeviceId] = useState();
//   const [sensorData, setSensorData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [limit, setlimit] = useState(10);
//   const [collapsed, setCollapsed] = useState(false);

//   const Alert_type = {
//     "over_speed": "Over Speed",
//     "HarshAcceleration": "Harsh Acceleration",
//     "Idling": "Idling",
//     "HardBrake": "Hard Brake",
//     "Stoppage": "Stoppage",
//     "Freerun": "Freerun",
//     "Geofence": "Geofence"
//   }

//   const [Alert, setAlert] = useState("over_speed");
//   console.log(Alert)

//   const keydata = {
//     Total_VehicleDistance: "TotVehDist",
//     EngineSpeed_rpm: "EngSpd",
//     WheelBasedSpeed_kph: "WhlSpd",
//     EngineCoolantTemp: "CoolantTemp",
//     BatteryVoltage_V: "BattVolt",
//     CruiseSetSpeed_kph: "CruiseSpd",
//     IntakeTemp: "IntkTemp",
//     Engine_Turbocharger_Boost_Pressure: "TurboBoost",
//     Engine_AirIntakeManifold1_Temperature: "ManifTemp",
//     Engine_AirInlet_Pressure: "AirInPres",
//     Net_Battery_Current: "BattCurr",
//     Battery_Potential_s: "BattPot",
//     FuelLevel_Percent: "FuelLvl",
//     EngineOilPressure_kPa: "OilPres",
//     Engine_Crankcase_Pressure: "CrnkPres",
//     Engine_Throttle_Position: "ThrottlePos",
//     Engine_Fuel_Rate: "FuelRate",
//     Pedal_Position: "PedalPos",
//     Engine_Load: "EngLoad",
//     Engine_TripFuel: "TripFuel",
//     Engine_Total_FuelUsed: "TotFuel",
//     Engine_TotalHours: "EngHrs",
//     Engine_Total_Revolutions: "EngRev",
//     ExhaustGasTemp_C: "ExhGasTemp",
//     TurboInletTemp_C: "TurboInTemp",
//     Transmission_Current_Gear: "CurrGear",
//     Catalyst_Level: "CatLvl",
//     createdAt: "Datetime",
//   };

//   async function fetchDevices() {
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${apiurl}/get_device`, {
//         method: "POST",
//         body: JSON.stringify({ device_id: "all" }),
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) throw new Error("Failed to fetch devices");
//       const res = await response.json();
//       console.log(res, 'device data.');
//       setDeviceData(res);
//     } catch (error) {
//       setError("Error fetching devices");
//       console.error("Error fetching devices:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function all_data() {
//     setIsLoading(true);
//     console.log("all data ...");
//     try {
//       const jsondata = JSON.stringify({
//         "alert_type": Alert,
//         limit: limit,
//         page: page,
//       });
//       console.log(jsondata);
//       const response = await fetch(`${apiurl}/get_alert`, {
//         method: "POST",
//         body: jsondata,
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) throw new Error("Failed to fetch sensor data. ");
//       const res = await response.json();
//       console.log(res, 'device data.');
//       setSensorData(res.data || []);
//     } catch (error) {
//       setError("Error fetching sensor data");
//       console.error("Error fetching sensor data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }


//   const exportData = () => {
//     if (sensorData.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     // Get current timestamp for filename
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const filename = `alerts_${Alert}_${timestamp}.xlsx`;

//     // Get table element
//     const table = document.getElementById('datatable');
//     if (!table) {
//       alert('Table not found');
//       return;
//     }

//     try {
//       const wb = XLSX.utils.table_to_book(table, { sheet: 'Alerts' });
//       XLSX.writeFile(wb, filename);
//     } catch (error) {
//       console.error('Export failed:', error);
//       alert('Failed to export data');
//     }
//   };

//   // const exportData = () => {
//   //   const headers = Object.keys(keydata).filter((key) => sensorData[0]?.[key]);
//   //   const csvContent = [
//   //     ["Device ID", ...headers.map((key) => keydata[key])].join(","),
//   //     ...sensorData.map((row) =>
//   //       [row.device_id, ...headers.map((key) => row[key] ?? "N/A")].join(",")
//   //     ),
//   //   ].join("\n");

//   //   const blob = new Blob([csvContent], { type: "text/csv" });
//   //   const url = window.URL.createObjectURL(blob);
//   //   const a = document.createElement("a");
//   //   a.href = url;
//   //   a.download = "sensor_data.csv";
//   //   a.click();
//   //   window.URL.revokeObjectURL(url);
//   // };

//   useEffect(() => {
//     fetchDevices();
//   }, []);


//   useEffect(() => {
//     all_data();
//   }, [deviceId, Alert, page, limit]);


//   const table = {
//     "over_speed": {
//       "overSpeed": "over Speed",
//       "duration": "Duration",
//       "distanceTravelled": "Distance Travlled",
//       "dateTime": "Date-Time",
//       "location": "Location"
//     },
//     "HarshAcceleration": {

//       "dateTime": "Date-Time",
//       "location": "Location"
//     },
//     "HardBrake": {

//       "dateTime": "Date-Time",
//       "location": "Location"
//     },
//     "Stoppage": {
//       "Stoppagetime": "Stoppage Time",
//       "dateTime": "Date-Time",
//       "location": "Location"
//     },
//     "Freerun": {
//       "Free_running": "Free running",
//       "speed": "Speed",
//       "distanceTravelled": "Distance Travlled",
//       "dateTime": "Date-Time",
//       "location": "Location"
//     },
//     "Geofence": {

//       "location": "Motion",
//       "dateTime": "Date-Time",
//       // "location": "Location"
//     },
//     "Idling": {
//       "idlingDuration": "Idling Time",
//       // "Fuel_consumed": "Fuel Consumed",
//       "Ambient_Temperature": "Ambient Temperature",
//       "startTime": "From",
//       "endTime": "To",
//       "location": "Location"
//     }
//   }



//   function convertUTCtoIST(utcDateString) {
//     // utcDateString: e.g., "2025-10-16T12:10:04.573Z"
//     const utcDate = new Date(utcDateString);
//     const istDateString = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//     return istDateString;
//   }


//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <div
//         className={`flex-1 p-6 bg-gray-50 ${collapsed ? "w-20" : "w-64"}`}
//         onMouseEnter={() => setCollapsed(false)}
//         onMouseLeave={() => setCollapsed(true)}
//       >
//         <div className="mb-8 font-semibold text-2xl flex items-center justify-between">
//           Alerts
//         </div>

//         {isLoading && <p className="text-blue-500">Loading...</p>}
//         {error && <p className="tepmxt-red-500">{error}</p>}

//         <div className="grid grid-cols-[1fr,1fr,6fr,1fr] gap-4 items-center mb-6">
//           <select
//             value={limit}
//             onChange={(e) => setlimit(e.target.value)}
//             className="border-2 border-gray-200 p-2 rounded"
//           >
//             <option value="10">10</option>
//             <option value="20">20</option>
//             <option value="30">30</option>
//           </select>
//           <select
//             value={deviceId}
//             onChange={(e) => setDeviceId(e.target.value)}
//             className="border-2 border-gray-200 p-2 rounded"
//           >
//             <option value="all">All Devices</option>
//             {deviceData.map((device) => (
//               <option key={device.device_id} value={device.device_id}>
//                 {device.device_id}
//               </option>
//             ))}
//           </select>
//           <div className="flex flex-1 flex-wrap gap-2 items-center">
//             {Object.entries(Alert_type).map(([key, value], index) => (
//               <label htmlFor={key} key={index}>
//                 <input
//                   type="radio"
//                   name="alertType"
//                   id={key}
//                   value={key}
//                   checked={Alert === key}
//                   className="mx-2 "
//                   onChange={(e) => setAlert(e.target.value)}
//                 />
//                 {value}
//               </label>
//             ))}
//           </div>
//           <button
//             onClick={exportData}
//             className="border-2 w-[10rem] border-blue-400 rounded px-4 py-2 text-blue-600 hover:bg-blue-100"
//           >
//             Export Data
//           </button>
//         </div>


//         <div className="overflow-auto h-[26rem]">
//           <table className="w-full text-sm text-center border rounded bg-white" id='datatable'>
//             <thead>
//               <tr className="bg-gray-200">
//                 <th scope="col" className="border px-3 py-2">Sr.</th>
//                 {console.log(Alert)}
//                 {Alert !== "Geofence" ? <th scope="col" className="border px-3 py-2">Device Id</th> : ""}
//                 {Object.entries(table[Alert]).map(([key, label]) => (
//                   <th key={key} scope="col" className="border px-3 py-2">{label}</th>
//                 ))}

//                 {/* <th scope="col" className="border px-3 py-2">Date-Time</th>    */}
//               </tr>
//             </thead>
//             <tbody>

//               {sensorData
//                 .filter(ele => !deviceId || ele.data?.vehicle === deviceId || ele.data?.location.includes(deviceId))
//                 .map((ele, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="border px-3 py-2">{index + 1}.</td>
//                     {Alert !== "Geofence" ? <td className="border px-3 py-2">{ele.data?.vehicle || "N/A"}</td> : ""}
//                     {Object.keys(table[Alert]).map((key) => (
//                       <td key={key} className="border px-3 py-2">
//                         {(key === "startTime" || key === "endTime" || key === "dateTime")
//                           ? (ele.data?.[key] ? convertUTCtoIST(ele.data?.[key]) : "N/A")
//                           : (ele.data?.[key] ?? "N/A")}
//                       </td>
//                     ))}
//                     {/* {Alert !== "idling" && (
//                         <td className="border px-3 py-2">
//                           {convertUTCtoIST(ele.data?.dateTime) ?? "N/A"}
//                         </td>
//                       )} */}
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>


//         {
//           // sensorData.length > 9 &&
//           <div className="flex items-center justify-center gap-4 mt-4">
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//             >
//               Previous
//             </button>
//             {page}
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Next
//             </button>
//           </div>}
//       </div>
//     </div>
//   );
// }

























import Sidebar from "../components/Nav";
import * as XLSX from 'xlsx';
import { useEffect, useState } from "react";

export default function Adddevice() {
  const apiurl = import.meta.env.VITE_API_URL;

  const [deviceData, setDeviceData] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [sensorData, setSensorData] = useState([]);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setlimit] = useState(40);
  const [collapsed, setCollapsed] = useState(false);

  const [geofenceCount, setGeofenceCount] = useState(0); // NEW STATE

  const Alert_type = {
    "over_speed": "Over Speed",
    "HarshAcceleration": "Harsh Acceleration",
    "Idling": "Idling",
    "HardBrake": "Hard Brake",
    "Stoppage": "Stoppage",
    "Freerun": "Freerun",
    "Geofence": "Geofence"
  };

  const [Alert, setAlert] = useState("over_speed");

  const table = {
    "over_speed": {
      "overSpeed": "over Speed",
      "duration": "Duration",
      "distanceTravelled": "Distance Travlled",
      "dateTime": "Date-Time",
      "location": "Location"
    },
    "HarshAcceleration": {
      "dateTime": "Date-Time",
      "location": "Location"
    },
    "HardBrake": {
      "dateTime": "Date-Time",
      "location": "Location"
    },
    "Stoppage": {
      "Stoppagetime": "Stoppage Time",
      "dateTime": "Date-Time",
      "location": "Location"
    },
    "Freerun": {
      "Free_running": "Free running",
      "speed": "Speed",
      "distanceTravelled": "Distance Travlled",
      "dateTime": "Date-Time",
      "location": "Location"
    },
    "Geofence": {
      "location": "Motion",
      "dateTime": "Date-Time",
    },
    "Idling": {
      "idlingDuration": "Idling Time",
      "Ambient_Temperature": "Ambient Temperature",
      "startTime": "From",
      "endTime": "To",
      "location": "Location"
    }
  };

  // Convert UTC → IST
  function convertUTCtoIST(utcDateString) {
    const utcDate = new Date(utcDateString);
    return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  // // ⭐⭐⭐ KEY FUNCTION — CLEAN GEOFENCE LOGIC ⭐⭐⭐
  // function processGeofenceData(data) {
  //   const cleaned = [];
  //   const seenTimes = new Set();
  //   let count = 0;
  //   let waitingEntry = null;

  //   data.forEach((item) => {
  //     const motion = item.data?.location || "";
  //     const time = item.data?.dateTime;

  //     if (!time || seenTimes.has(time)) return;
  //     seenTimes.add(time);

  //     cleaned.push(item);

  //     if (motion.includes("outside entry")) {
  //       waitingEntry = item;
  //     }

  //     if (motion.includes("inside exit")) {
  //       if (waitingEntry) {
  //         count++;
  //         waitingEntry = null;
  //       }
  //     }
  //   });

  //   return { cleaned, count };
  // }

  
 function processGeofenceData(data) {
  // Sort data by datetime ascending
  data = [...data].sort((a, b) => new Date(a.data.dateTime) - new Date(b.data.dateTime));

  const cleaned = [];
  const seenTimes = new Set();
  let count = 0;
  let lastProcessedTime = null;

  const entryStack = []; // store pending entries

  data.forEach((item) => {
    const motion = item.data?.location || "";
    const time = item.data?.dateTime;

    if (!time || seenTimes.has(time)) return;
    
    const currentTime = new Date(time);
    
    // Check if time interval is less than 1 minute from last processed time
    // if (lastProcessedTime) {
    //   const timeDiffMs = currentTime - lastProcessedTime;
    //   const timeDiffMinutes = timeDiffMs / (1000 * 60);
    //   console.log(timeDiffMinutes,timeDiffMs)
    //   if (timeDiffMinutes < 1) {
    //     return; // Skip this event if less than 1 minute from last event
    //   }
    // }
    
    seenTimes.add(time);
    lastProcessedTime = currentTime;

    // // ---------- ENTRY ----------
    if (motion.includes("outside entry") ) {
      // entryStack.push(1); // push to stack, waiting for exit
      console.log(1,"entry"); // push to stack, waiting for exit
      return;
    }

    // ---------- EXIT ----------
    if (motion.includes("outside exit")) {
      // entryStack.push(2); // push to stack, waiting for exit
      console.log(0,"exit"); // push to stack, waiting for exit
      return;
    }

    console.log(motion)
    // ---------- ENTRY ----------
    if (motion.includes("inside entry")) {
      entryStack.push(0); // push to stack, waiting for exit
      
    }

    // ---------- EXIT ----------
    if ( motion.includes("inside exit")) {
      entryStack.push(1); // push to stack, waiting for exit
    }

    
    cleaned.push(item);
  });

  console.log(entryStack);
  
// const uniqueArray = [...new Set(entryStack)]; 
// console.log(uniqueArray); 
  
  var num = entryStack.length; 
    console.log((num - 1),num,num % 2 );

  if(num % 2 === 0){
    count = num / 2;
  }else{
    console.log("odd" , (num - 1) / 2)
    count = (num - 1) / 2;
  }

  console.log(cleaned, count);
  return { cleaned, count };
}


  async function fetchDevices() {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiurl}/get_device`, {
        method: "POST",
        body: JSON.stringify({ device_id: "all" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      setDeviceData(res);
    } catch (error) {
      setError("Error fetching devices");
    } finally {
      setIsLoading(false);
    }
  }

  async function all_data() {
    setIsLoading(true);

    try {
      const jsondata = JSON.stringify({
        "alert_type": Alert,
        limit: limit,
        page: page,
      });

      const response = await fetch(`${apiurl}/get_alert`, {
        method: "POST",
        body: jsondata,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch sensor data.");

      const res = await response.json();

      // ⭐ APPLY GEOFENCE PROCESS ⭐
      if (Alert === "Geofence") {
        const result = processGeofenceData(res.data || []);
        setSensorData(result.cleaned);
        setGeofenceCount(result.count);
      } else {
        setSensorData(res.data || []);
      }
    } catch (error) {
      setError("Error fetching sensor data");
    } finally {
      setIsLoading(false);
    }
  }

  const exportData = () => {
    if (sensorData.length === 0) {
      alert('No data to export');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `alerts_${Alert}_${timestamp}.xlsx`;

    const table = document.getElementById('datatable');
    if (!table) return alert('Table not found');

    const wb = XLSX.utils.table_to_book(table, { sheet: 'Alerts' });
    XLSX.writeFile(wb, filename);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    all_data();
  }, [deviceId, Alert, page, limit]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div
        className={`flex-1 p-6 bg-gray-50 ${collapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="mb-8 font-semibold text-2xl">Alerts</div>

        {/* ⭐ SHOW TOTAL GEOFENCE CYCLES ⭐ */}
        {Alert === "Geofence" && (
          <div className="text-lg font-semibold mb-4 text-blue-600">
            Total Geofence Cycles (Entry → Exit): {geofenceCount}
          </div>
        )}

        {isLoading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-[1fr,6fr,1fr] gap-4 items-center mb-6">
          {/* <select
            value={limit}
            onChange={(e) => setlimit(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select> */}

          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded"
          >
            <option value="all">All Devices</option>
            {deviceData.map((device) => (
              <option key={device.device_id} value={device.device_id}>
                {device.device_id}
              </option>
            ))}
          </select>

          <div className="flex flex-1 flex-wrap gap-2 items-center">
            {Object.entries(Alert_type).map(([key, value], index) => (
              <label htmlFor={key} key={index}>
                <input
                  type="radio"
                  name="alertType"
                  id={key}
                  value={key}
                  checked={Alert === key}
                  className="mx-2"
                  onChange={(e) => setAlert(e.target.value)}
                />
                {value}
              </label>
            ))}
          </div>

          <button
            onClick={exportData}
            className="border-2 w-[10rem] border-blue-400 rounded px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            Export Data
          </button>
        </div>

        <div className="overflow-auto h-[26rem]">
          <table className="w-full text-sm text-center border rounded bg-white" id="datatable">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Sr.</th>
                {Alert !== "Geofence" && (
                  <th className="border px-3 py-2">Device ID</th>
                )}
                {Object.entries(table[Alert]).map(([key, label]) => (
                  <th key={key} className="border px-3 py-2">{label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sensorData
                .filter(ele => !deviceId || ele.data?.vehicle === deviceId)
                .map((ele, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>

                    {Alert !== "Geofence" && (
                      <td className="border px-3 py-2">{ele.data?.vehicle || "N/A"}</td>
                    )}

                    {Object.keys(table[Alert]).map((key) => (
                      <td key={key} className="border px-3 py-2">
                        {(key === "startTime" || key === "endTime" || key === "dateTime")
                          ? (ele.data?.[key] ? convertUTCtoIST(ele.data?.[key]) : "N/A")
                          : (ele.data?.[key] ?? "N/A")}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>

          {page}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={sensorData.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


