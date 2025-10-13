import { ChartBar, ChartColumn, Plus, SlidersHorizontal, TableProperties } from 'lucide-react'
import Chart from '../components/chart'
import Navbar from '../components/Nav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Home = () => {
  const navigate = useNavigate();
 



  const sensor = [
    "Total_VehicleDistance",
    "EngineSpeed_rpm",
    "WheelBasedSpeed_kph",
    "EngineCoolantTemp",
    "BatteryVoltage_V",
    "CruiseSetSpeed_kph",
    "IntakeTemp",
    "Engine_Turbocharger_Boost_Pressure",
    "Engine_AirIntakeManifold1_Temperature",
    "Engine_AirInlet_Pressure",
    "Net_Battery_Current",
    "Battery_Potential_s",
    "FuelLevel_Percent",
    "EngineOilPressure_kPa",
    "Engine_Crankcase_Pressure",
    "Engine_Throttle_Position",
    "Engine_Fuel_Rate",
    "Pedal_Position",
    "Engine_Load",
    "Engine_TripFuel",
    "Engine_Total_FuelUsed",
    "Engine_TotalHours",
    "Engine_Total_Revolutions",
    "ExhaustGasTemp_C",
    "TurboInletTemp_C",
    "Transmission_Current_Gear",
    "Catalyst_Level"
  ];

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

  const [sensor1, setsensor1] = useState("");
  const [showChart, setShowChart] = useState(true); // toggle state
  const [id,setid] = useState("");

  const [data, setdata] = useState([]);

  useEffect(()=>{
    setdata([
    {
      label: "TOTAL DEVICES",
      value: Device_data.length
    },
    {
      label: "TOTAL FUEL FILLING",
      value: "200KM"
    },
    {
      label: "TOTAL FUEL CONSUMPTION",
      value: "200KM"
    },
    {
      label: "TOTAL ENGINE HOURS",
      value: "200KM"
    }
  ]);
  
  },[Device_data])

  return (
    <div className='flex'>
      <Navbar />

      <div className="flex-1 p-6">
        <div className='mb-8 font-semibold flex items-center justify-between'>
          Home
          <span className='flex gap-4'>
            <button className='border-2 border-blue-400 rounded px-2 py-1 ' onClick={() => { navigate("/Dashboard") }}>Live Data</button>
            <button className='border-2 border-blue-400 rounded px-2 py-1 flex'><Plus /> Report Add</button>
          </span>
        </div>
        <section className='w-full flex flex-warp gap-4 mb-8'>
          {data.map((ele, index) => (
            <div key={index} className='w-auto flex items-center gap-4  border-2 rounded shadow p-6'>
              <h2 className='text-2xl text-gray-500 font-bold'>{ele.label}</h2>
              <p className='text-xl text-gray-500'>{ele.value}</p>
            </div>
          ))}
        </section>

        <section className='mb-6 flex gap-4 w'>
          <div className='w-1/2'>
            <div className=' font-semibold flex items-center justify-between mb-6'>
              Chart
              <span className='flex gap-2 border flex items-center rounded p-2'>
                {/* <SlidersHorizontal className='h-5' /> */}
                <select name="data" id="data" onChange={(e) => setid(e.target.value)}>
                    <option value={""}>Select the option</option>
                  {Device_data.map((ele,index) => (
                    <option key={index} value={ele.device_id}>{ele.device_name}</option>
                  ))}
                </select>
                <select name="data" id="data" onChange={(e) => setsensor1(e.target.value)}>
                    <option value={""}>Select the option</option>
                  {sensor.map((ele,index) => (
                    <option key={index} value={ele}>{ele}</option>
                  ))}
                </select>
                <span onClick={() => setShowChart(!showChart)}>
                  {!showChart ? <TableProperties /> : <ChartColumn />}
                </span>
                
              </span>
            </div>
            {/* Pass the value as a prop to the child */}
            <Chart sensorValue={sensor1} showChart={showChart} deviceid={id}/>
          </div>

          <div className='flex-1 overflow-auto'>
            <table className='min-w-full text-sm text-center border rounded'>
              <thead>
                <tr>
                  <th className="border px-3 py-2">Sr.</th>
                  <th className="border px-3 py-2">Device Name</th>
                  <th className="border px-3 py-2">Device Id</th>
                  <th className="border px-3 py-2">Device Mode</th>
                  <th className="border px-3 py-2">Assing To</th>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Device_data.map((ele, index) => (

                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ele.device_name}</td>
                    <td>{ele.device_id}</td>
                    <td>{ele.device_mode}</td>
                    <td>{ele.Assing_to}</td>
                    <td>{ele.date}</td>
                    <td>
                      <button className='bg-blue-400 rounded px-4 py-2 m-1' onClick={() => navigate("/Dashboard")}>More</button>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home
