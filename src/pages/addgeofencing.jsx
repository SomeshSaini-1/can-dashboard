
import Map from '../components/geofencemap'
import Navbar from '../components/Nav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CircleX, Edit, Plus, ScanSearch, Trash, View } from 'lucide-react'
import Geofenc from '../components/geofenc';

  import { ToastContainer, toast } from 'react-toastify';

const Addgeofance = () => {
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL;
  const [device, setDevice] = useState({
    Name: "",
    Type: "",
    Tag: "",
    Comment: "",
    Data: ""
  });

    const notify = (data) => toast(data);

  const [geoData, setgeoData] = useState([])
  async function fetchData() {
    const url = await fetch(`${apiurl}/Get_geofance`, {
      method: "POST",
      body: JSON.stringify({ name: "all" }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await url.json();
    console.log(res);

    setgeoData(res);
  }



  useEffect(() => {
    fetchData();
  }, []);

  const [Geo, setGeo] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  const [pointdata,setpointdata] = useState(null);

  function handledatatoChild(data) {
    console.log("Parent received data:", data);
    setpointdata(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!pointdata) {
      notify("Please select a point on the map.");
      return;
    }
    let data = JSON.stringify({
        Name: device.Name,
        Type: device.Type,
        Tag: device.Tag,
        Comment: device.Comment,
        Data: pointdata
      });
      console.log(data,"res")

    const response = await fetch(`${apiurl}/Add_geofance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
      redirect: "follow"
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error adding geofence:", error);
      notify("Failed to add geofence. Please try again.");
      return;
    }

    const result = await response.json();
    console.log(result);
    setGeo(false);
    notify("Data inserted.");
    fetchData();
    setDevice({
      Name: "",
      Type: "",
      Tag: "",
      Comment: "",
      Data: null
    });
  }

  
  const Delete_geofance = async (id) => {
  try {
    const confirmed = confirm("Are you sure you want to delete this geofence?");
    if (!confirmed) return;

    console.log("Deleting geofence with ID:", id);

    const response = await fetch(`${apiurl}/Delete_geofance`, {
      method: "POST", // Ensure method is specified
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    notify(result.message);
    fetchData();
  } catch (error) {
    console.error("Error deleting geofence:", error);
    notify({ success: false, message: "Failed to delete geofence." });
  }
};

 const [selected,setselected] = useState();

 

  return (
    <div className='flex'>
      <Navbar />
      <ToastContainer />


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
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto text-black"
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col gap-6'>

                {[
                  { label: "Geogance Name", name: "Name" },
                  {
                    label: "Type",
                    name: "Type",
                    type: "select",
                    options: ["Circle", "Polygon"]
                  },
                  {
                    label: "Tag",
                    name: "Tag",
                    type: "select",
                    options: ["Parking", "Pickup Drop Point", "Restaurant", "Rest area", "Loading/Unloading", "Loading", "Unloading", "Hotal", "Maintainance Work Shop", "Toll Plauza", "Other"]
                  }
                  // { label: "Assing To", name: "Assing_to"},
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
                        placeholder={label}
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
              </div>

              <div>
                <Geofenc height={60} sendDataToParent={handledatatoChild}/>
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

                {geoData.map((ele, index) => (

                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>{ele.Name}</td>
                  <td>{ele.Type}</td>
                  <td className='flex gap-2 justify-center p-2'>
                    {/* <View /> */}
                    <ScanSearch onClick={() => setselected(ele.Name)} />
                    {/* <Edit /> */}
                    <Trash onClick={() => Delete_geofance(ele._id)}/>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mb-6'>
            <div className=' font-semibold flex items-center justify-between mb-4'>
              MAP
            </div>
            <Map height={70}  device={selected}/>

          </div>

        </section>

      </div>
    </div>
  )
}

export default Addgeofance
