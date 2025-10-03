import { CircleX, Edit, Plus, Trash2 } from "lucide-react";
import Sidebar from "../components/Nav";
import { useEffect, useState } from "react";

export default function AddDriver() {
  const [show, setShow] = useState(false);
  const [Driver, setDriver] = useState({
    driver_name: "",
    driver_num: "",
    driver_vhical_num: "",
    vhical_company: "",
    date: "",
    status: "",
    comment: ""
  });

  const apiurl = import.meta.env.VITE_API_URL;

  function handleChange(e) {
    const { name, value } = e.target;
    setDriver((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(`${apiurl}/add_driver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Driver),
      redirect: "follow"
    });
    const result = await response.json();
    fetchDrivers();
    console.log(result);
    setShow(false);
    setDriver({
      driver_name: "",
      driver_num: "",
      driver_vhical_num: "",
      vhical_company: "",
      date: "",
      status: "",
      comment: ""
    });
  }

  const [Driver_data, setDriver_data] = useState([]);
    async function fetchDrivers() {
      const url = await fetch(`${apiurl}/get_driver`, {
        method: "POST",
        body: JSON.stringify({ driver_name: "all" }),
        headers: { "Content-Type": "application/json" }
      });
      const res = await url.json();
      console.log(res);
      setDriver_data(res);
    }

  useEffect(() => {
    fetchDrivers();
  }, [apiurl]);

  const [Search, setSearch] = useState("");


  const delete_ele = async (id) =>{
    try {
      console.log(id);
      let confirm_ = confirm("you are shur to delete the data.")

      if(confirm_ === false) return;
      
      const url = await fetch(`${apiurl}/delete_driver`,{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({driver_name : id})
      });

      const res = await url.json();
      console.log(res);
      fetchDrivers();

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
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-5xl h-auto max-h-[95vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center px-2 mb-6 text-black">
              <h4 className="font-bold text-xl">Add Driver</h4>
              <CircleX onClick={() => setShow(false)} className="cursor-pointer" />
            </div>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mx-auto text-black"
              onSubmit={handleSubmit}
            >
              {[
                { label: "Driver Name", name: "driver_name" },
                { label: "Driver Number", name: "driver_num" },
                {
                  label: "Status",
                  name: "status",
                  type: "select",
                  options: ["Active", "Deactive"]
                },
                { label: "Vehicle Name", name: "vhical_company" },
                { label: "Driver Vehicle Number", name: "driver_vhical_num" },
                { label: "Date", name: "date", type: "date" }
              ].map(({ label, name, type, options }) => (
                <div className="flex flex-col" key={name}>
                  <label className="text-sm font-medium text-gray-700 text-left">{label}</label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={Driver[name]}
                      onChange={handleChange}
                      className="p-2 border rounded"
                      required
                    >
                      <option hidden value="">
                        Select an option
                      </option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || "text"}
                      name={name}
                      value={Driver[name]}
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
                  value={Driver.comment}
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
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="mb-8 font-semibold flex items-center justify-between">
          Driver
          <span className="flex gap-4">
            <button
              className="border-2 border-blue-400 rounded px-2 py-1 flex"
              onClick={() => setShow(true)}
            >
              <Plus />
              Add Driver
            </button>
          </span>
        </div>

        <div className="overflow-auto">
          <div className="flex items-center justify-between">
            <span className="flex gap-2 m-2 items-center">
              <ul>
                <li>Driver List ({Driver_data?.length})</li>
                <li>Track and manage all Drivers in real time</li>
              </ul>
              <input
                type="text"
                placeholder="Search ..."
                className="border-2 border-gray-200 p-2 rounded"
                onChange={(e) => setSearch(e.target.value)}
                value={Search}
              />
            </span>
            <button className="border-2 border-blue-400 rounded px-2 py-1">Export Data</button>
          </div>
          <table className="min-w-full text-sm text-center border rounded">
            <thead>
              <tr>
                <th className="border px-3 py-2">Sr.</th>
                <th className="border px-3 py-2">Driver Name</th>
                <th className="border px-3 py-2">Driver Number</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Vehicle Number</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Driver_data.filter((ele) =>
                Object.values(ele)
                  .join(" ")
                  .toLowerCase()
                  .includes(Search.toLowerCase())
              ).map((ele, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{ele.driver_name}</td>
                  <td>{ele.driver_num}</td>
                  <td>{ele.status}</td>
                  <td>{ele.date}</td>
                  <td>{ele.driver_vhical_num}</td>
                  <td className="flex items-center justify-center gap-2">
                    <Edit className="text-green-400 m-1 cursor-pointer" />
                    <Trash2 className="text-red-400 m-1 cursor-pointer"  onClick={() => delete_ele(ele.driver_name)}/>
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


