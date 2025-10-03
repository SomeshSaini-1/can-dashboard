import { CircleX, Delete, DeleteIcon, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import Sidebar from "../components/Nav";
import { useEffect, useState } from "react";

export default function Adddevice() {
  const [show, setShow] = useState(false);
  const [device, setDevice] = useState({
    device_id: "",
    device_name: "",
    device_mode: "",
    date: "",
    Assing_to: "",
    comment: "",
  });

  
const apiurl = import.meta.env.VITE_API_URL;

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

  const [Device_data,setDevice_data] = useState([]);
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

const [Search,setSearch] = useState();


  const delete_ele = async (id) =>{
    try {
      console.log(id);
      let confirm_ = confirm("you are shur to delete the data.")

      if(confirm_ === false) return;
      
      const url = await fetch(`${apiurl}/delete_device`,{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({device_id : id})
      });

      const res = await url.json();
      console.log(res);
      fetchDevices();

    } catch (error) {
      console.error("error : ",error);
      
    }
  }


  return (
    <div className="flex">
      <Sidebar />

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999] overflow-y-auto p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl h-auto max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center px-2 mb-6 text-black">
              <h4 className="font-bold text-xl">Add Device</h4>
              <CircleX onClick={() => setShow(false)} className="cursor-pointer" />
            </div>

            <div className="text-center text-black">
              <h4 className="font-bold text-xl">Add New Device</h4>
              <p className="font-semibold mb-4 text-gray-500">Enter details to tag a new device</p>
            </div>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mx-auto text-black"
              onSubmit={handleSubmit}
            >
              {[
                { label: "Device Name", name: "device_name" },
                { label: "Device ID", name: "device_id" },
                {
                  label: "Mode",
                  name: "device_mode",
                  type: "select",
                  options: ["Test", "Deployed"]
                },
                { label: "Assing To", name: "Assing_to" },
                { label: "Date", name: "date", type: "date" }
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
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="mb-8 font-semibold flex items-center justify-between">
          Device
          <span className="flex gap-4">
            <button
              className="border-2 border-blue-400 rounded px-2 py-1 flex"
              onClick={() => setShow(true)}
            >
              <Plus />
              Add Device
            </button>
          </span>
        </div>

        <div className="overflow-auto">
          <div className="flex items-center justify-between">
            <span className="flex gap-2 m-2 items-center">
              <ul>
                <li>Device List ({Device_data?.length})</li>
                <li>Track and manage all devices in real time</li>
              </ul>
              <input
                type="text"
                placeholder="Search ..."
                className="border-2 border-gray-200 p-2 rounded"
                onChange={e => setSearch(e.target.value)}
                value={Search || ""}
              />
            </span>
            <button className="border-2 border-blue-400 rounded px-2 py-1 ">Export Data</button>
          </div>
          <table className="min-w-full text-sm text-center border rounded">
            <thead>
              <tr>
                <th className="border px-3 py-2">Sr.</th>
                <th className="border px-3 py-2">Device Name</th>
                <th className="border px-3 py-2">Device Id</th>
                <th className="border px-3 py-2">Device Mode</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Assing To</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Device_data?.filter(el =>
                !Search ||
                el.device_id?.toLowerCase().includes(Search?.toLowerCase()) ||
                el.device_name?.toLowerCase().includes(Search?.toLowerCase())
              ).map((ele, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{ele.device_name}</td>
                  <td>{ele.device_id}</td>
                  <td>{ele.device_mode}</td>
                  <td>{ele.date}</td>
                  <td>{ele.Assing_to}</td>
                  <td className="flex items-center justify-center gap-2">
                    <Edit className="text-green-400 m-1" />
                    <Trash2 className="text-red-400 m-1" onClick={() => delete_ele(ele.device_id)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
