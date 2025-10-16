
// pages/Adddevice.jsx (Main Component)
import { Edit } from "lucide-react";
import Sidebar from "../components/Nav";
import { useEffect, useState } from "react";

export default function Adddevice() {
  const apiurl = import.meta.env.VITE_API_URL;

  const [deviceData, setDeviceData] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setlimit] = useState(10);
  const [collapsed, setCollapsed] = useState(false);

  const alart_type = {
    "over_speed": "Over Speed",
    "HarshAcceleration": "Harsh Acceleration",
    "Idling": "Idling",
    "HardBrake": "Hard Brake",
    "Stoppage": "Stoppage",
    "Freerun": "Freerun",
    "Geofence": "Geofence"
  }

  const [Alart, setAlart] = useState("over_speed");
  console.log(Alart)

  const keydata = {
    Total_VehicleDistance: "TotVehDist",
    EngineSpeed_rpm: "EngSpd",
    WheelBasedSpeed_kph: "WhlSpd",
    EngineCoolantTemp: "CoolantTemp",
    BatteryVoltage_V: "BattVolt",
    CruiseSetSpeed_kph: "CruiseSpd",
    IntakeTemp: "IntkTemp",
    Engine_Turbocharger_Boost_Pressure: "TurboBoost",
    Engine_AirIntakeManifold1_Temperature: "ManifTemp",
    Engine_AirInlet_Pressure: "AirInPres",
    Net_Battery_Current: "BattCurr",
    Battery_Potential_s: "BattPot",
    FuelLevel_Percent: "FuelLvl",
    EngineOilPressure_kPa: "OilPres",
    Engine_Crankcase_Pressure: "CrnkPres",
    Engine_Throttle_Position: "ThrottlePos",
    Engine_Fuel_Rate: "FuelRate",
    Pedal_Position: "PedalPos",
    Engine_Load: "EngLoad",
    Engine_TripFuel: "TripFuel",
    Engine_Total_FuelUsed: "TotFuel",
    Engine_TotalHours: "EngHrs",
    Engine_Total_Revolutions: "EngRev",
    ExhaustGasTemp_C: "ExhGasTemp",
    TurboInletTemp_C: "TurboInTemp",
    Transmission_Current_Gear: "CurrGear",
    Catalyst_Level: "CatLvl",
    createdAt: "Datetime",
  };

  async function fetchDevices() {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiurl}/get_device`, {
        method: "POST",
        body: JSON.stringify({ device_id: "all" }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch devices");
      const res = await response.json();
      console.log(res, 'device data.');
      setDeviceData(res);
    } catch (error) {
      setError("Error fetching devices");
      console.error("Error fetching devices:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function all_data() {
    setIsLoading(true);
    console.log("all data ...");
    try {
      const jsondata = JSON.stringify({
          "alert_type": Alart,
          limit: limit,
          page: page,
        });
      console.log(jsondata);
      const response = await fetch(`${apiurl}/get_alert`, {
        method: "POST",
        body: jsondata,
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch sensor data. ");
      const res = await response.json();
      console.log(res, 'device data.');
      setSensorData(res.data || []);
    } catch (error) {
      setError("Error fetching sensor data");
      console.error("Error fetching sensor data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const exportData = () => {
    const headers = Object.keys(keydata).filter((key) => sensorData[0]?.[key]);
    const csvContent = [
      ["Device ID", ...headers.map((key) => keydata[key])].join(","),
      ...sensorData.map((row) =>
        [row.device_id, ...headers.map((key) => row[key] ?? "N/A")].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sensor_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };


  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    all_data();
  }, [deviceId, page, limit]);


  const table = {
    "over_speed" : {
      "overSpeed" :"over Speed",
      "duration" :"Duration",
      "distanceTravelled" :"Distance Travlled",

      "location":"Location"
    },
    "HarshAcceleration" : {

      "location":"Location"
    },
    "HardBrake":{

      "location":"Location"
    },
    "Stoppage":{
      "Stoppagetime":"Stoppage Time",
      "location":"Location"
    },
    "Freerun": {
      "Free_running" :"Free running",
      "speed":"Speed",
      "distanceTravelled" :"Distance Travlled",
      "dateTime":"Date-Time",
      "location":"Location"
    },
    "Geofence":{
      "motion":"Motion",
      "dateTime":"Date-Time",
      "location":"Location"
    },
    "Idling": {
      "Idling_time" :"Idling Time",
      "Fuel_consumed" : "Fuel Consumed",
      "Ambient_Temperature" :"Ambient Temperature",
      "dateTime":"Date-Time",
      "location":"Location"
    }
  }
  
 
  
  function convertUTCtoIST(utcDateString) {
    // utcDateString: e.g., "2025-10-16T12:10:04.573Z"
    const utcDate = new Date(utcDateString);
    const istDateString = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return istDateString;
}


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 p-6 bg-gray-50 ${collapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="mb-8 font-semibold text-2xl flex items-center justify-between">
          Alerts
        </div>

        {isLoading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-[1fr,1fr,6fr,1fr] gap-4 items-center mb-6">
            <select
              value={limit}
              onChange={(e) => setlimit(e.target.value)}
              className="border-2 border-gray-200 p-2 rounded"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
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
              {Object.entries(alart_type).map(([key, value], index) => (
                <label htmlFor={key} key={index}>
                  <input
                    type="radio"
                    name="alertType"
                    id={key}
                    value={key}
                    checked={Alart === key}
                    className="mx-2 "
                    onChange={(e) => setAlart(e.target.value)}
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

        <div className="overflow-auto">

<div className="overflow-auto">
  <table className="w-full text-sm text-center border rounded bg-white">
    <thead>
      <tr className="bg-gray-200">
        <th scope="col" className="border px-3 py-2">Sr.</th>
        <th scope="col" className="border px-3 py-2">Device Id</th>
        {Object.entries(table[Alart]).map(([key, label]) => (
          <th key={key} scope="col" className="border px-3 py-2">{label}</th>
        ))}
        
          <th  scope="col" className="border px-3 py-2">Date-Time</th>
      </tr>
    </thead>
    <tbody>
      {/* {sensorData.filter(ele => {!deviceId || ele.data?.vehicle === deviceId}).map((ele, index) => ( */}
      {sensorData
  .filter(ele => !deviceId || ele.data?.vehicle === deviceId)
  .map((ele, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="border px-3 py-2">{index + 1}.</td>
          <td className="border px-3 py-2">{ele.data?.vehicle || "N/A"}</td>
          {Object.keys(table[Alart]).map((key) => (
            <td key={key} className="border px-3 py-2">
              {ele.data?.[key] ?? "N/A"}
            </td>
          ))}
          
            <td className="border px-3 py-2">{convertUTCtoIST(ele.data?.dateTime) ?? "N/A"}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* <table className="w-full text-sm text-center border rounded bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th scope="col" className="border px-3 py-2">
                  Sr.
                </th>
                <th scope="col" className="border px-3 py-2">
                  Device Id
                </th>
          

                <th scope="col" className="border px-3 py-2">
                  Over Speed
                </th>
                <th scope="col" className="border px-3 py-2">
                  Duration
                </th>
                <th scope="col" className="border px-3 py-2">
                  Distance Travlled
                </th>
                <th scope="col" className="border px-3 py-2">
                  Date-Time
                </th>
                <th scope="col" className="border px-3 py-2">
                  location
                </th>
              </tr>
            </thead>
            <tbody>
              {sensorData
                // .filter(
                //   (el) =>
                //   (!search ||
                //     el.device_id?.toLowerCase().includes(search.toLowerCase())) &&
                //   (!Alart || el.alert_type === Alart)
                // )
                .map((ele, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}.</td>
                    <td className="border px-3 py-2">{ele.data.vehicle}</td>
                    <td className="border px-3 py-2">{ele.data.overSpeed}</td>
                    <td className="border px-3 py-2">{ele.data.duration}</td>
                    <td className="border px-3 py-2">{ele.data.distanceTravelled}</td>
                    <td className="border px-3 py-2">{ele.data.dateTime}</td>
                    <td className="border px-3 py-2">{ele.data?.location || "--"}</td>
                    
                  </tr>
                ))}
            </tbody>
          </table> */}
        </div>

        { sensorData.length > 10 && <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          {page}
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>}
      </div>
    </div>
  );
}