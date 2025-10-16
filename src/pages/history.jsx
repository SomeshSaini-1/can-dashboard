
// pages/Adddevice.jsx (Main Component)
import { Edit } from "lucide-react";
import Sidebar from "../components/Nav";
import { useEffect, useState, useCallback } from "react";
// import { debounce } from "lodash"; // Ensure lodash is installed: npm install lodash

export default function Adddevice() {
  const apiurl = import.meta.env.VITE_API_URL;

  const [deviceData, setDeviceData] = useState([]);
  const [deviceId, setDeviceId] = useState("all");
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit,setlimit] = useState(10);
  const [collapsed, setCollapsed] = useState(false);


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
    // createdAt: "Datetime",
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
      console.log(res ,'device data.');
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
          device_id: deviceId,
          limit: limit,
          page: page,
        });

        console.log(jsondata);

      const response = await fetch(`${apiurl}/all_data`, {
        method: "POST",
        body: jsondata,
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch sensor data. ");
      const res = await response.json();
      console.log(res ,'device data.');
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

  // // Debounce search input
  // const debouncedSetSearch = useCallback(
  //   debounce((value) => setSearch(value), 300),
  //   []
  // );

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    all_data();
  }, [deviceId, page,limit]);


  function convertUTCtoIST(utcDateString) {
    // utcDateString: e.g., "2025-10-16T12:10:04.573Z"
    const utcDate = new Date(utcDateString);
    const istDateString = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return istDateString;
}
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`flex-1 p-6 bg-gray-50 
        ${collapsed ? "w-20" : "w-64"}
        `} 
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      >
        <div className="mb-8 font-semibold text-2xl flex items-center justify-between">
          Device History
        </div>

        {isLoading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            <select value={limit}
              onChange={(e) => setlimit(e.target.value)}
              className="border-2 border-gray-200 p-2 rounded">
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
            {/* <input
              type="text"
              placeholder="Search by Device ID..."
              className="border-2 border-gray-200 p-2 rounded"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            /> */}
          </div>
          <button
            onClick={exportData}
            className="border-2 border-blue-400 rounded px-4 py-2 text-blue-600 hover:bg-blue-100"
          >
            Export Data
          </button>
        </div>

        <div className="overflow-auto ">
          <table className="w-full text-sm text-center border rounded bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th scope="col" className="border px-3 py-2">
                  Sr.
                </th>
                <th scope="col" className="border px-3 py-2">
                  Device Id
                </th>
                {sensorData[0] &&
                  Object.keys(sensorData[0])
                    .filter((key) => keydata[key])
                    .map((key, index) => (
                      <th scope="col" className="border px-3 py-2" key={index}>
                        {keydata[key]}
                      </th>
                    ))}
                    
                <th scope="col" className="border px-3 py-2">Date-Time</th>
                <th scope="col" className="border px-3 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sensorData
                .filter(
                  (el) =>
                    !search ||
                    el.device_id?.toLowerCase().includes(search.toLowerCase())
                )
                .map((ele, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}.</td>
                    <td className="border px-3 py-2">{ele.device_id}</td>
                    {sensorData[0] &&
                      Object.keys(sensorData[0])
                        .filter((key) => keydata[key])
                        .map((key, idx) => (
                          <td className="border px-3 py-2" key={idx}>
                            {ele[key] ?? "N/A"}
                          </td>
                        ))}
                        <td className="border px-3 py-2" >{convertUTCtoIST(ele.createdAt) ?? "--"}</td>
                    <td className="flex items-center justify-center gap-2 border px-3 py-2">
                      <Edit className="text-green-400 cursor-pointer" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

       {sensorData.length > 9 && <div className="flex items-center justify-center gap-4 mt-4">
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