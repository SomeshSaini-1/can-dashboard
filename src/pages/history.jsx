import { CircleX, Delete, DeleteIcon, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import Sidebar from "../components/Nav";
import { useEffect, useState } from "react";

export default function Adddevice() {
  
  
const apiurl = import.meta.env.VITE_API_URL;

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



  async function fetchDrivers() {
    const url = await fetch(`${apiurl}/all_data`, {
      method: "POST",
      body: JSON.stringify({ 
        device_id : sensorValue || "08F9E03D1D08",
        limit: 300,
        page: 1
      }),
      headers: { "Content-Type": "application/json" }
    });
    const res = await url.json();
    console.log(Driver_data);
  }

  useEffect(() => {
    fetchDrivers();
  }, [sensorValue]);



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

    

      <div className="flex-1 p-6">
        <div className="mb-8 font-semibold flex items-center justify-between">
          Device History
        </div>

        <div className="overflow-auto">
          <div className="flex items-center justify-between">
            <span className="flex gap-2 m-2 items-center">
              <ul>
                <li>98768769987987</li>
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
