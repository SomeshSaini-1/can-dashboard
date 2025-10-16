


// import React, { useState, createContext, useEffect } from "react";
// import Navbar from "../components/Nav.jsx";
// import MapComponent from "../components/mapcomponent.jsx";
// import { BusFront, Gauge, MapPin, X } from "lucide-react";
// import io from "socket.io-client";

// export const VehicleContext = createContext();

// const vehicles = [
//   {
//     device_id: "*860560068942988",
//     id: "NL 01 AF 9122",
//     status: "PARKED",
//     location: "Hyundai plant, Chennai",
//     lastUpdated: "10 Sep, 4:53 AM",
//     address: "Hyundai plant, Chennai, India",
//     model: "Tata - SIGNA 4025 Tractor Trailer",
//     health: "GOOD",
//     details: {
//       speed: "--",
//       since: "11 hr",
//       odometer: "98,452 km",
//       sootLoad: 65,
//       fule: 90,
//       adblue: 33,
//       EnginePercentLoad: "",
//       EngineSpeed_rpm: "",
//       WheelBasedSpeed_kph: "",
//       CruiseSetSpeed_kph: "",
//       EngineCoolantTemp: "",
//       IntakeTemp: "",
//       Engine_Turbocharger_Boost_Pressure: "",
//       Engine_AirIntakeManifold1Temperature: "",
//       Engine_AirInlet_Pressure: "",
//       Net_Battery_Current: "",
//       Battery_Potential_s: "",
//       BatteryVoltage_V: "",
//       EngineOilPressure_kPa: "",
//       Engine_Crankcase_Pressure: "",
//       Engine_Throttle_Position: "",
//       Engine_Fuel_Rate: "",
//       Pedal_Position: "",
//       Engine_Load: "",
//       Actual_Max_Available_EngineTorque: "",
//       Engine_TripFuel: "",
//       Engine_Total_FuelUsed: "",
//       Engine_TotalHours: "",
//       Engine_Total_Revolutions: "",
//       ExhaustGasTemp_C: "",
//       TurboInletTemp_C: "",
//       Transmission_Current_Gear: "",
//       Engine_TripFuel_Used: "",
//       Engine_TotalFuel_Used: "",
//     },
//   },
//   {
//     device_id: "*860560061081743",
//     id: "NL 01 AH 9334",
//     status: "MOVING",
//     location: "Greenland Mahindra Warehouse",
//     lastUpdated: "10 Sep, 4:37 PM",
//     health: "GOOD",
//     address: "Greenland Mahindra Warehouse, Nashik",
//     model: "Tata - SIGNA 4025 Tractor Trailer",
//     details: {
//       speed: "25 km",
//       since: "5 min",
//       odometer: "1,05,320 km",
//       sootLoad: 55,
//       fule: 50,
//       adblue: 70,
//       EnginePercentLoad: "",
//       EngineSpeed_rpm: "",
//       WheelBasedSpeed_kph: "",
//       CruiseSetSpeed_kph: "",
//       EngineCoolantTemp: "",
//       IntakeTemp: "",
//       Engine_Turbocharger_Boost_Pressure: "",
//       Engine_AirIntakeManifold1Temperature: "",
//       Engine_AirInlet_Pressure: "",
//       Net_Battery_Current: "",
//       Battery_Potential_s: "",
//       BatteryVoltage_V: "",
//       EngineOilPressure_kPa: "",
//       Engine_Crankcase_Pressure: "",
//       Engine_Throttle_Position: "",
//       Engine_Fuel_Rate: "",
//       Pedal_Position: "",
//       Engine_Load: "",
//       Actual_Max_Available_EngineTorque: "",
//       Engine_TripFuel: "",
//       Engine_Total_FuelUsed: "",
//       Engine_TotalHours: "",
//       Engine_Total_Revolutions: "",
//       ExhaustGasTemp_C: "",
//       TurboInletTemp_C: "",
//       Transmission_Current_Gear: "",
//       Engine_TripFuel_Used: "",
//       Engine_TotalFuel_Used: "",
//     },
//   },
// ];

// const Dashboard = () => {
//   const [selected, setSelected] = useState(null);

//   // useEffect(() => {
//   //   const socket = io("http://localhost:27033", {
//   //     transports: ["websocket"],
//   //     reconnection: true,
//   //     reconnectionAttempts: 5,
//   //     reconnectionDelay: 1000,
//   //   });

//   //   socket.on("connect", () => {
//   //     console.log("Socket connected:", socket.id);
//   //   });

//   //   socket.on("mqtt_message", (data) => {
//   //     console.log("Received MQTT data:", data);

//   //   });

//   //   socket.on("disconnect", () => {
//   //     console.log("Socket disconnected");
//   //   });

//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, [selected]);



//   async function info_data(device_id) {
//     try {
//       console.log(device_id)
//       const response = await fetch("http://localhost:4010/api/device/get_device_info", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ device_id: device_id })
//       });

//       const data = await response.json();
//       // console.log(data[0]?.BatteryVoltage_V);
//       console.log(data)
//       //    setMqttData((prevData) => ({
//       //   ...prevData,
//       //   [data.id]: data.decoded, // Store data by device ID
//       // }));


//       setSelected((prev) =>
//         prev
//           ? {
//             ...prev,
//             ...data,
//             details: {
//               ...prev.details,
//               speed: data[0]?.EngineThrottlePosition ?? prev.details.speed,
//               odometer: data[0]?.Total_VehicleDistance ?? prev.details.odometer,
//               fule: data[0]?.FuelLevel_Percent ?? prev.details.fule,
//               adblue: data[0]?.Catalyst_Level ?? prev.details.adblue,
//               EnginePercentLoad: data[0]?.EnginePercentLoad ?? "",
//               EngineSpeed_rpm: data[0]?.EngineSpeed_rpm ?? "",
//               WheelBasedSpeed_kph: data[0]?.WheelBasedSpeed_kph ?? "",
//               EngineCoolantTemp: data[0]?.EngineCoolantTemp ?? "",
//               BatteryVoltage_V: data[0]?.BatteryVoltage_V ?? "",
//               Engine_Fuel_Rate: data[0]?.Engine_Fuel_Rate ?? "",
//             },
//           }
//           : prev
//       );


//     } catch (error) {
//       console.error("Error fetching device info:", error);
//     }
//   }

//   useEffect(()=>{
//     selected && info_data(selected.device_id)
//   },[selected])


//   return (
//     <div className="flex">
//       <Navbar />

//       {/* Sidebar */}
//       <div className="w-1/4 h-screen border-r bg-white shadow p-2">
//         <input
//           type="text"
//           placeholder="Search Vehicle..."
//           className="w-full rounded border px-2 py-1 mb-2"
//         />
//         {vehicles.map((v) => (
//           <div
//             key={v.id}
//             onClick={() => setSelected(v)}
//             className={`relative p-3 border mb-2 cursor-pointer rounded ${selected?.id === v.id ? "bg-blue-100" : "hover:bg-gray-50"
//               }`}
//           >
//             <div
//               className={`absolute top-0 left-0 h-full w-5 flex items-center justify-center rounded-l ${v.health === "GOOD" ? "bg-green-500" : "bg-red-500"
//                 }`}
//             >
//               <span className="text-white text-[10px] font-bold -rotate-90">
//                 {v.health}
//               </span>
//             </div>
//             <div className="pl-6">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold">{v.id}</span>
//                 <span
//                   className={`text-xs px-2 py-1 rounded ${v.status === "MOVING"
//                       ? "bg-green-100 text-green-600"
//                       : v.status === "STOPPED"
//                         ? "bg-red-100 text-red-600"
//                         : "bg-yellow-100 text-yellow-600"
//                     }`}
//                 >
//                   {v.status}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-600 truncate">{v.location}</div>
//               <div className="text-xs text-gray-400">{v.lastUpdated}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Map + Details */}
//       <div className="flex-1 relative">
//         <MapComponent />

//         {selected && (
//           <div className="absolute top-20 left-8  w-[24rem] bg-gray-100 p-4 rounded shadow z-[999] h-[90vh] overflow-y-auto">
//             <div
//               className="flex justify-end mb-2 cursor-pointer"
//               onClick={() => setSelected(null)}
//             >
//               <X />
//             </div>
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold">{selected.id}</h2>
//               <span className="px-3 py-1 bg-green-100 text-green-600 rounded">
//                 {selected.health}
//               </span>
//             </div>
//             <p className="text-sm text-gray-500 mb-2">
//               Status: {selected.status} (Since {selected.details.since})
//             </p>

//             <h3 className="text-lg text-gray-400 mb-2">VEHICLE DETAILS</h3>
//             <div className="space-y-1 text-gray-700 text-sm">
//               <p className="flex gap-2">
//                 <MapPin /> {selected.address}
//               </p>
//               <p className="flex gap-2 my-2">
//                 <BusFront /> {selected.model}
//               </p>
//               <p className="flex gap-2 ">
//                 <Gauge /> {selected.details.odometer}
//               </p>
//               <p className="text-gray-500 my-2">
//                 Last Updated On: {selected.lastUpdated}
//               </p>
//             </div>

//             {/* Fuel */}
//             <div className="mt-4 shadow rounded px-3 py-6">
//               <p className="font-semibold">Fuel</p>
//               <div className="w-full bg-green-200 rounded h-2 mt-1">
//                 <div
//                   className="h-2 rounded bg-green-500"
//                   style={{ width: `${selected.details.fule}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selected.details.fule}% . 236 L . Capacity 400 L
//               </p>
//             </div>

//             {/* Soot */}
//             <div className="mt-4 shadow rounded px-3 py-6">
//               <p className="font-semibold">Current Soot Load</p>
//               <div className="w-full bg-blue-200 rounded h-2 mt-1">
//                 <div
//                   className="h-2 rounded bg-blue-500"
//                   style={{ width: `${selected.details.sootLoad}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selected.details.sootLoad}% (Threshold 100%)
//               </p>
//             </div>

//             {/* Adblue */}
//             <div className="mt-4 shadow rounded px-3 py-6">
//               <p className="font-semibold">Adblue</p>
//               <div className="w-full bg-yellow-200 rounded h-2 mt-1">
//                 <div
//                   className="h-2 rounded bg-yellow-500"
//                   style={{ width: `${selected.details.adblue}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selected.details.adblue}% (Threshold 100%)
//               </p>
//             </div>

//             {/* Live Telemetry */}
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold text-gray-600 mb-3">
//                 Live Telemetry
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Speed</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.WheelBasedSpeed_kph || "--"} km/h
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Engine RPM</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.EngineSpeed_rpm || "--"}
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Engine Load</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.EnginePercentLoad || "--"} %
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Coolant Temp</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.EngineCoolantTemp || "--"} °C
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Battery Voltage</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.BatteryVoltage_V || "--"} V
//                   </p>
//                 </div>

//                 <div className="bg-white shadow rounded p-3">
//                   <p className="text-sm text-gray-500">Fuel Rate</p>
//                   <p className="text-lg font-bold">
//                     {selected.details.Engine_Fuel_Rate || "--"} L/h
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, createContext, useEffect, useCallback } from "react";
import Navbar from "../components/Nav.jsx";
import MapComponent from "../components/mapcomponent.jsx";
import { BusFront, Gauge, MapPin, Phone, PhoneCall, User, X } from "lucide-react";

export const VehicleContext = createContext();

const vehicles = [
  {
    device_id: "08F9E03D1D08",
    id: "NL 01 AF 9122",
    status: "PARKED",
    location: "Hyundai plant, Chennai",
    lastUpdated: "10 Sep, 4:53 AM",
    address: "Hyundai plant, Chennai, India",
    model: "Tata - SIGNA 4025 Tractor Trailer",
    health: "GOOD",
  },
  {
    device_id: "*860560061081743",
    id: "NL 01 AH 9334",
    status: "MOVING",
    location: "Greenland Mahindra Warehouse",
    lastUpdated: "10 Sep, 4:37 PM",
    address: "Greenland Mahindra Warehouse, Nashik",
    model: "Tata - SIGNA 4025 Tractor Trailer",
    health: "GOOD",
  },
];

const Dashboard = () => {
  const [selected, setSelected] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [vehical, setvehical] = useState(null)
  const apiurl = import.meta.env.VITE_API_URL;


  const [Device_data, setDevice_data] = useState([]);
  async function fetchDevices() {
    const url = await fetch(`${apiurl}/get_device`, {
      method: "POST",
      body: JSON.stringify({ device_id: "all" }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await url.json();
    console.log(res);
    setDevice_data(res);


  }


  useEffect(() => {
    fetchDevices();
  }, []);

  const vehical_data = useCallback(async (id) => {
    try {
      console.log(selected, selected.Assing_to)
      const url = await fetch(`${apiurl}/get_driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_name: id }),
      });

      const data = await url.json();

      console.log(data);
      setvehical(data);

    } catch (error) {
      console.error("db error : ", error);

    }
  }, [selected]);

  // Fetch API Data
  const fetchDeviceData = useCallback(async (device_id) => {
    console.log("data")
    if (!device_id) return;
    try {
      const response = await fetch(`${apiurl}/get_device_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTelemetry(data[0]);
        console.log(data[0])
      }
    } catch (error) {
      console.error("Error fetching device info:", error);
    }
  }, []);




  // Poll every 2 minutes
  useEffect(() => {
    if (!selected) return;

    fetchDeviceData(selected.device_id);
    vehical_data(selected.Assing_to)
    const interval = setInterval(() => {

      fetchDeviceData(selected.device_id);
    }, 30000);

    return () => clearInterval(interval);
  }, [selected, fetchDeviceData]);

  const [search,setsearch] = useState('');

  
  function convertUTCtoIST(utcDateString) {
    // utcDateString: e.g., "2025-10-16T12:10:04.573Z"
    const utcDate = new Date(utcDateString);
    const istDateString = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return istDateString;
}

  return (
    <div className="flex">
      <Navbar />

      {/* Sidebar */}
      <div className="w-1/4 h-screen border-r bg-white shadow p-2 overflow-auto">
        <input
          type="text"
          placeholder="Search Vehicle..."
          className="w-full rounded border px-2 py-1 mb-2"
          onChange={(e) => {setsearch(e.target.value)}}
        />
        {
        Device_data.filter(el => {
        return (
          !search ||
          el.device_id?.toLowerCase().includes(search.toLowerCase()) ||
          el.device_name?.toLowerCase().includes(search.toLowerCase())
        );
      }).map((v) => (
          <div
            key={v._id}
            onClick={() => {
              setSelected(v);
              setTelemetry(null);
            }}
            className={`relative p-3 border mb-2 cursor-pointer rounded ${selected?.device_id === v.device_id ? "bg-blue-100" : "hover:bg-gray-50"
              }`}
          >
            <div
              className={`absolute top-0 left-0 h-full w-5 flex items-center justify-center rounded-l ${v.status === "Connected" ? "bg-green-500" : "bg-red-500"
                }`}
            >
              <span className="text-white text-[10px] font-bold -rotate-90">
                {v.status || "Disconnect"}
              </span>
            </div>
            <div className="pl-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {v.device_id}

                  <div className="text-sm text-gray-600 truncate">{v.device_name}</div>
                  <div className="text-xs text-gray-400">{v.date}</div>
                </span>

                <SpeedBox device_id={v.device_id} />


              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Details */}
      <div className="flex-1 relative">
        <MapComponent />

        {selected && (
          <div className="absolute top-20 left-8 w-[24rem] bg-gray-100 p-4 rounded shadow z-[999] h-[90vh] overflow-y-auto">
            <div
              className="flex justify-end mb-2 cursor-pointer"
              onClick={() => setSelected(null)}
            >
              <X />
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selected.device_id}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded">
                {selected.device_mode || "Test"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Status: {selected.status || "GOOD"}
            </p>

            <h3 className="text-lg text-gray-400 mb-2">VEHICLE DETAILS</h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <p className="flex gap-2">
                <User /> {vehical && vehical[0].driver_name}
              </p>
              <p className="flex gap-2 my-2">
                <Phone /> {vehical && vehical[0]?.driver_num}
              </p>
              <p className="flex gap-2 my-2">
                <BusFront /> {vehical && vehical[0]?.driver_vhical_num}
              </p>
              <p className="flex gap-2 ">
                <Gauge /> {telemetry?.Total_VehicleDistance || "--"} km
              </p>
              <p className="text-gray-500 my-2">
                Last Updated On: {convertUTCtoIST(telemetry?.updatedAt) || selected.lastUpdated}
              </p>
            </div>

            {/* Sensor Values */ console.log(telemetry, 'telemetry')}
            {telemetry ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-3">
                  Sensor Values
                </h3>
                
            {/* Fuel */}
            <div className="mt-4 shadow rounded px-3 py-6">
              <p className="font-semibold">Fuel</p>
              <div className="w-full bg-green-200 rounded h-2 mt-1">
                <div
                  className="h-2 rounded bg-green-500"
                  style={{ width: `${telemetry.FuelLevel_Percent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {telemetry.FuelLevel_Percent}% . 236 L . Capacity 400 L
              </p>
            </div>

            {/* Soot */}
            {/* <div className="mt-4 shadow rounded px-3 py-6">
              <p className="font-semibold">Current Soot Load</p>
              <div className="w-full bg-blue-200 rounded h-2 mt-1">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${selected.details.sootLoad}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {selected.details.sootLoad}% (Threshold 100%)
              </p>
            </div> */}

            {/* Adblue */}
            <div className="mt-4 shadow rounded px-3 py-6">
              <p className="font-semibold">Adblue</p>
              <div className="w-full bg-yellow-200 rounded h-2 mt-1">
                <div
                  className="h-2 rounded bg-yellow-500"
                  style={{ width: `${telemetry.Catalyst_Level || '0'}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {telemetry.Catalyst_Level ||'0'}% (Threshold 100%)
              </p>
            </div>
                <div className="grid grid-cols-2 gap-3">
                  <SensorCard label="Engine RPM" value={telemetry.EngineSpeed_rpm || "--"} />
                  <SensorCard label="Engine Load (Alt)" value={`${telemetry.Engine_Load || "--"} %`} />
                  <SensorCard label="Throttle" value={`${telemetry.Engine_Throttle_Position || "--"} %`} />
                  <SensorCard label="Coolant Temp" value={`${telemetry.EngineCoolantTemp || "--"} °C`} />
                  <SensorCard label="Fuel Rate" value={`${telemetry.Engine_Fuel_Rate || "--"} L/h`} />
                  <SensorCard label="Battery Voltage" value={`${telemetry.BatteryVoltage_V || "--"} V`} />
                  <SensorCard label="Exhaust Ges Temp" value={`${telemetry.ExhaustGasTemp_C || "--"} °C`} />
                  <SensorCard label="Cruise Set Speed" value={`${telemetry.CruiseSetSpeed_kph || "--"} km/h`} />
                  <SensorCard label="Intake Temp" value={`${telemetry.IntakeTemp || "--"} °C`} />
                  <SensorCard label="Air Inlet Pressure" value={`${telemetry.Engine_AirInlet_Pressure || "--"} kPa`} />
                  <SensorCard label="Engine Oil Pressure" value={`${telemetry.EngineOilPressure_kPa || "--"} kPa`} />
                  <SensorCard label="Crankcase Pressure" value={`${telemetry.Engine_Crankcase_Pressure || "--"} kPa`} />
                  <SensorCard label="Pedal Position" value={`${telemetry.Pedal_Position || "--"} %`} />
                  <SensorCard label="Trip Fuel" value={`${telemetry.Engine_TripFuel || "--"} L`} />
                  <SensorCard label="Total Fuel Used" value={`${telemetry.Engine_Total_FuelUsed || "--"} L`} />
                  <SensorCard label="Total Hours" value={`${telemetry.Engine_TotalHours || "--"} h`} />
                  <SensorCard label="Total Revolutions" value={`${telemetry.Engine_Total_Revolutions || "--"}`} />
                  <SensorCard label="Turbo Boost" value={`${telemetry.Engine_Turbocharger_Boost_Pressure || "--"} kPa`} />
                  <SensorCard label="Air Manifold Temp" value={`${telemetry.Engine_AirIntakeManifold1_Temperature || "--"} °C`} />
                  <SensorCard label="Transmission Gear" value={`${telemetry.Transmission_Current_Gear || "--"}`} />


                  {/* <SensorCard label="Turbo Inlet Temp" value={`${telemetry.TurboInletTemp_C || "--"} °C`} /> */}
                  {/* <SensorCard label="Speed" value={`${telemetry.WheelBasedSpeed_kph || "--"} km/h`} /> */}
                  {/* <SensorCard label="Engine Load" value={`${telemetry.EnginePercentLoad || "--"} %`} /> */}
                  {/* <SensorCard label="Fuel Level" value={`${telemetry.FuelLevel_Percent || "--"} %`} /> */}
                  {/* <SensorCard label="Adblue" value={`${telemetry.Catalyst_Level || "--"} %`} /> */}
                  {/* <SensorCard label="Battery Potential" value={`${telemetry.Battery_Potential_s || "--"} V`} /> */}
                  {/* <SensorCard label="Odometer" value={`${telemetry.Total_VehicleDistance || "--"} km`} /> */}
                  {/* <SensorCard label="Net Battery Current" value={`${telemetry.Net_Battery_Current || "--"} A`} /> */}

                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-4">No Data</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const SensorCard = ({ label, value }) => (
  <div className="bg-white shadow rounded p-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-bold">{value || "--"}</p>
  </div>
);

export default Dashboard;




function SpeedBox({ device_id }) {
  const [speed, setSpeed] = useState(0);

  const apiurl = import.meta.env.VITE_API_URL;
  // ✅ Function to fetch speed data
  const speed_data = useCallback(async (device_id) => {
    if (!device_id) return;
    try {
      const response = await fetch(`${apiurl}/get_device_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id }),
      });

      const data = await response.json();
      console.log("speed_data")
      if (Array.isArray(data) && data.length > 0) {
        return data[0].WheelBasedSpeed_kph;
      }
    } catch (error) {
      console.error("Error fetching device info:", error);
    }
    return 0;
  }, [apiurl]);

  // // ✅ Load speed when device_id changes
  // useEffect(() => {
  //   (async () => {
  //     const result = await speed_data(device_id);
  //     if (result) setSpeed(Number(result));
  //      const interval = setInterval(() => {
  //     speed_data(device_id);
  //   }, 10000);
  //   })();
  // }, [device_id, speed_data]);

  useEffect(() => {
  let interval;
  let isMounted = true; // prevent state update on unmounted

  const updateSpeed = async () => {
    const result = await speed_data(device_id);
    if (result && isMounted) setSpeed(Number(result));
  };

  updateSpeed(); // initial fetch

  interval = setInterval(updateSpeed, 30000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [device_id, speed_data]);


  return (
    <div className="w-[8rem] h-[5rem] flex flex-col items-center justify-center bg-gray-200 py-4 shadow-md rounded-2xl">
      <span
        className={`px-2 text-sm font-semibold border rounded-full mb-2 ${
          speed > 0
            ? "text-teal-600 border-teal-600 bg-teal-50"
            : "text-red-600 border-red-600 bg-red-50"
        }`}
      >
        {speed > 0 ? "MOVING" : "STOP"}
      </span>
      <div className="text-xl font-semibold text-gray-700">
        {speed} <span className="text-sm font-normal text-gray-500">km/h</span>
      </div>
    </div>
  );
}


