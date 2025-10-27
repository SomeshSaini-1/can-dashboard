
import Map from '../components/mapcomponent'
import Navbar from '../components/Nav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CircleX, Edit, Plus, Trash, View } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL;
   const [device, setDevice] = useState({
    device_id: "",
    device_name: "",
    device_mode: "",
    date: "",
    Assing_to: "",
    comment: "",
  });
  

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

  const [Geo, setGeo] = useState(false); 
  function handleChange(e) {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: value
    }));
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(`${apiurl}/add_device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: device.device_id,
        device_name: device.device_name,
        device_mode: device.device_mode,
        date: device.date,
        Assing_to: device.Assing_to,
        comment: device.comment
      }),
      redirect: "follow"
    });
    const result = await response.json();
    console.log(result);
    fetchDevices()
    setShow(false);
    setDevice({
      device_id: "",
      device_name: "",
      device_mode: "",
      date: "",
      Assing_to: "",
      comment: "",
    });
  }

  return (
    <div className='flex'>
      <Navbar />

      {Geo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999] overflow-y-auto p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl h-auto max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center px-2 mb-6 text-black">
              <h4 className="font-bold text-xl">Add Geofenceing</h4>
              <CircleX onClick={() => setGeo(false)} className="cursor-pointer" />
            </div>

            

            <form
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mx-auto text-black"
              onSubmit={handleSubmit}
            >
              {[
                { label: "Name", name: "device_name" },
                {
                  label: "Type",
                  name: "device_mode",
                  type: "select",
                  options: ["Circle","Polygon"]
                },
                { label: "Assing To", name: "Assing_to"},
                ].map(({ label, name, type, options }) => (
                <div className="flex flex-col" key={name}>
                  <label className="text-sm font-medium text-gray-700 text-left">{label}</label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={device[name]}
                      onChange={handleChange}
                      className="p-2 border rounded"
                      required
                    >
                      <option hidden value="">
                        Select an option
                      </option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || "text"}
                      name={name}
                      value={device[name]}
                      onChange={handleChange}
                      className="p-2 border rounded"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="sm:col-span-2 md:col-span-3 flex flex-col">
                <label className="text-sm font-medium text-gray-700 text-left">Comment</label>
                <textarea
                  name="comment"
                  value={device.comment}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <button
                  type="submit"
                  className="w-full max-w-[10rem] bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 h-[100vh] overflow-y-auto">
        <div className='mb-8 font-semibold flex items-center justify-between'>
          Geofencing
          <span className='flex gap-4'>
            <button className='border-2 border-blue-400 rounded px-2 py-1 ' onClick={() => { navigate("/Dashboard") }}>Live Data</button>
            <button className='border-2 border-blue-400 rounded px-2 py-1 flex' onClick={() => setGeo(!Geo)}><Plus /> Geofence Add</button>
          </span>
        </div>


        <section className='mb-6 grid gap-4 grid-cols-[1fr,2fr]'>

          <div className='flex-1 overflow-auto border'>
            {/* <div className='text-xl text-gray-500 p-2 '>Total Devices ({Device_data.length}) </div> */}
            <table className='min-w-full text-sm text-center border rounded'>
              <thead>
                <tr>
                  <th className="border px-3 py-2">Sr.</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                
                  <tr key={1}>
                    <td>{ 1}</td>
                    <td>{"jaipur"}</td>
                    <td>{"circal"}</td>
                    <td className='flex gap-2 justify-center p-2'>
                      <View />
                      <Edit />
                      <Trash /> 
                    </td>
                  </tr>
                {/* {Device_data.map((ele, index) => (

                ))} */}
              </tbody>
            </table>
          </div>

          <div className='mb-6'>
            <div className=' font-semibold flex items-center justify-between mb-4'>
              MAP
            </div>
            <Map height={70} />
          </div>

        </section>

      </div>
    </div>
  )
}

export default Home
