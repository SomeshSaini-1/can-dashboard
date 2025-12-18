// MapHistory.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png"; // Your directional vehicle/bus icon
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Home,
  LoaderCircle,
  Pause,
  Play,
  PlayCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // if you're using React Router

// Fix default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: customMarkerImage,
  iconRetinaUrl: customMarkerImage,
  iconSize: [60, 50],
  iconAnchor: [30, 50],
  shadowUrl: null,
});

// Bearing calculation (direction from point A to point B)
function getBearing(lat1, lon1, lat2, lon2) {
  const toR = (deg) => deg * Math.PI / 180;
  const toD = (rad) => rad * 180 / Math.PI;

  lat1 = toR(lat1);
  lon1 = toR(lon1);
  lat2 = toR(lat2);
  lon2 = toR(lon2);

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = toD(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0–360
}

// Directional icon with rotation
const directionIcon = (img, angle = 0) =>
  L.divIcon({
    html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
    className: "",
    iconSize: [60, 50],
    iconAnchor: [30, 50],
  });

const MapHistory = () => {
  const apiurl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // optional, remove if not using router

  const [defaultCenter, setDefaultCenter] = useState([26.869917092482577, 75.78310450859449]);
  const [zoom, setZoom] = useState(10);
  const [positions, setPositions] = useState({}); // { device_id: [[lat, lng], ...] }
  const [liveMarkers, setLiveMarkers] = useState({}); // { device_id: [lat, lng] }
  const [direction1, setDirection1] = useState({}); // { device_id: bearing }
  const [deviceData, setDeviceData] = useState([
  {
    _id: "693fa5ad1305638dded01b96",
    Assing_to: "oxmo",
    comment: "test",
    date: "2025-12-15",
    device_id: "0357803372115515",
    device_mode: "Test",
    device_name: "Test2",
    createdAt: "2025-12-15T06:07:41.429Z",
    updatedAt: "2025-12-15T06:07:41.429Z"
  },
  {
    _id: "6940f4881305638dded477a2",
    Assing_to: "oxmo",
    comment: "ttt",
    date: "2025-12-16",
    device_id: "0357803372115481",
    device_mode: "Test",
    device_name: "gsp1",
    createdAt: "2025-12-16T05:56:24.827Z",
    updatedAt: "2025-12-16T05:56:24.827Z"
  },
  {
    _id: "6940f4aa1305638dded4782b",
    Assing_to: "oxmo",
    comment: "dd",
    date: "2025-12-16",
    device_id: "0357803372159844",
    device_mode: "Test",
    device_name: "gsp2",
    createdAt: "2025-12-16T05:56:58.658Z",
    updatedAt: "2025-12-16T05:56:58.658Z"
  },
  {
    _id: "6940f4c11305638dded47890",
    Assing_to: "oxmo",
    comment: "fff",
    date: "2025-12-16",
    device_id: "0357803372115382",
    device_mode: "Test",
    device_name: "gsp3",
    createdAt: "2025-12-16T05:57:21.267Z",
    updatedAt: "2025-12-16T05:57:21.267Z"
  },
  {
    _id: "6940f4d91305638dded47900",
    Assing_to: "oxmo",
    comment: "aaa",
    date: "2025-12-16",
    device_id: "0357803372159976",
    device_mode: "Test",
    device_name: "gsp4",
    createdAt: "2025-12-16T05:57:45.480Z",
    updatedAt: "2025-12-16T05:57:45.480Z"
  },
  {
    _id: "6940f4f91305638dded47993",
    Assing_to: "oxmo",
    comment: "aaaads",
    date: "2025-12-16",
    device_id: "0357803372157525",
    device_mode: "Test",
    device_name: "gsp5",
    createdAt: "2025-12-16T05:58:17.914Z",
    updatedAt: "2025-12-16T05:58:17.914Z"
  }]);
  const [device, setDevice] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [pause, setPause] = useState(false);
  const [Time, setTime] = useState(10); // speed multiplier
  const [showPanel, setShowPanel] = useState(true);

  const playInterval = useRef(null);

  const formatDate = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = formatDate();
  const [startdate, setStartdate] = useState(today);
  const [enddate, setEnddate] = useState(today);

  const getValidCoordinates = (lat, long) => {
    if (!lat || !long || lat == 0 || long == 0 || lat === "NA" || long === "NA")
      return null;
    return [parseFloat(lat), parseFloat(long)];
  };

  // Fetch all devices
  async function fetchDevices() {
    try {
      const response = await fetch(`${apiurl}/get_device`, {
        method: "POST",
        body: JSON.stringify({ device_id: "all" }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await response.json();
      setDeviceData(res);
      console.log(res,'res');
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch devices");
    }
  }

  useEffect(() => {
    // fetchDevices();
  }, []);

  // Load history for selected devices
  const historydata = useCallback(
    async (device_id) => {
      if (!device_id?.length) {
        toast.warn("Please select at least one device");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/MultipleDeviceHistory`, {
          method: "POST",
          body: JSON.stringify({ device_id, startdate, enddate }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!data?.data?.length) {
          toast.info("No history data found");
          setLoading(false);
          return;
        }

        const grouped = {};

        // Reverse to play chronologically (oldest first)
        data.data.reverse().forEach((ele) => {
          const coords = getValidCoordinates(ele.lat, ele.long);
          if (!coords) return;

          if (!grouped[ele.device_id]) grouped[ele.device_id] = [];
          grouped[ele.device_id].push(coords);
        });

        setPositions(grouped);

        // Set map center to first point of first device
        const firstKey = Object.keys(grouped)[0];
        if (firstKey && grouped[firstKey].length > 0) {
          setDefaultCenter(grouped[firstKey][0]);
          setZoom(12);
        }

        // Set initial live markers to last known position + initial bearing
        const lastPoints = {};
        const initialBearings = {};
        
        setLiveMarkers(lastPoints);
        setDirection1(initialBearings);
      } catch (error) {
        console.error("historydata error:", error);
        toast.error("Failed to load history");
      }
      setLoading(false);
    },
    [apiurl, startdate, enddate]
  );

  
    useEffect(() => {
  
      console.log(positions , "positions", device);
   
  
      const firstPoints = {};
      Object.keys(positions).forEach((devId) => {
      
      if (positions[devId] && positions[devId].length >= 2) {
        
          const endLat = positions[devId][positions[devId].length - 1]; 
          const startLat = positions[devId][positions[devId].length - 2]; 
          console.log(endLat,startLat);
  
          firstPoints[devId] = getBearing(startLat[0], startLat[1], endLat[0], endLat[1]); 
        }
      });
  
      console.log(firstPoints);
      setDirection1(firstPoints);
    }, [positions, device]);
  
  
  
  const playdata = () => {
    if (pause) {
      clearInterval(playInterval.current);
      playInterval.current = null;
      setPause(false);
      return;
    }

    setPositions({}); // reset to empty object instead of array
    setPause(true);
    let index = 0;

    playInterval.current = setInterval(() => {
      const updated = {};

      Object.keys(positions).forEach((devId) => {
        const point = positions[devId][index];
        if (point) {
          // console.log(point,"my point");
          setPositions((prev) => ({
            ...prev,
            [devId]: [...(prev[devId] || []), point],
          }));
          updated[devId] = point;
        }
      });

      if (Object.keys(updated).length === 0) {
        clearInterval(playInterval.current);
        playInterval.current = null; // reset reference
        setPause(false); // optional: auto-unpause when finished
        return;
      }
        
      setLiveMarkers(updated);
      console.log(updated,'live marker');
      index++;
    }, 100 * Time);

  };



  // Trigger map resize after mount
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, []);

  // console.log(Object.values(positions).length ,"sdsdf")

  return (
    <div className="flex h-screen bg-[#050B14] text-white">
      <ToastContainer />

      <section className="flex-1 p-4 space-y-4">
        <header className="flex justify-between items-center">
          <div className="flex gap-2 items-center text-lg">
            <ArrowLeft className="cursor-pointer" 
            // onClick={() => navigate(-1)}
             />
            History Playback
          </div>

          <div className="flex gap-2">
            {/* <button
              onClick={() => navigate("/Home")}
              className="flex gap-1 items-center border-2 rounded px-4 py-2 hover:bg-white/10"
            >
              Home <Home size={18} />
            </button> */}

            {/* <button
              onClick={() => setShowPanel(!showPanel)}
              className="flex gap-1 items-center border-2 rounded px-4 py-2 hover:bg-white/10"
            >
              {showPanel ? "Hide" : "Show"} Panel <PlayCircle size={18} />
            </button> */}
          </div>
        </header>

        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {showPanel && (
            <aside className="w-[320px] bg-[#0D1624] rounded-xl p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="flex justify-between items-center mb-2">
                  <span>Devices ({device.length})</span>
                  <button
                    className="border-2 rounded px-2 py-1 text-xs"
                    onClick={() => {
                      if (device.length === deviceData.length) {
                        setDevice([]);
                      } else {
                        setDevice(deviceData.map((d) => d.device_id));
                      }
                    }}
                  >
                    {device.length === deviceData.length ? "Deselect" : "Select"} All
                  </button>
                </label>
                <div className="max-h-40 overflow-auto">
                  {deviceData.map((d) => (
                    <label key={d.device_id} className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={d.device_id}
                        checked={device.includes(d.device_id)}
                        onChange={(e) =>
                          setDevice((p) =>
                            e.target.checked
                              ? [...p, e.target.value]
                              : p.filter((x) => x !== e.target.value)
                          )
                        }
                      />
                      {d.device_id}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="date"
                  className="w-full p-2 rounded text-black"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full p-2 rounded text-black"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button
                onClick={() => historydata(device)}
                className="w-full bg-blue-600 rounded p-2 hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 rounded p-2 hover:bg-blue-700"
              >
                Refresh
              </button>
              </div>

              {Object.values(positions).length != 0  && <div className="flex gap-2 items-center">
                <button
                  onClick={playdata}
                  className="bg-green-600 p-3 rounded hover:bg-green-700"
                >
                  {pause ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <select
                  className="p-2 rounded text-black flex-1"
                  value={Time}
                  onChange={(e) => setTime(+e.target.value)}
                >
                  <option value={5}>Very Fast</option>
                  <option value={10}>Fast</option>
                  <option value={20}>Medium</option>
                  <option value={40}>Slow</option>
                </select>
              </div>}
            </aside>
          )}

          <div className="flex-1 rounded-xl overflow-hidden relative">
            {loading ? 
              <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
                <LoaderCircle className="animate-spin w-16 h-16" />
              </div>
           
              :

            <MapContainer center={defaultCenter} zoom={zoom} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <SetViewOnChange center={defaultCenter} zoom={zoom} />

              {/* Full history polylines (always visible) */}
              {positions && Object.keys(positions).map((id) => (
                <Polyline
                  key={id}
                  positions={positions[id]}
                  pathOptions={{ color: "red", weight: 4 }}
                />
              ))}

              {/* Animated live markers with correct rotation */}
              {Object.entries(liveMarkers).map(([id, pos]) => (
                <Marker
                  key={id}
                  position={pos}
                  icon={directionIcon(customMarkerImage, direction1[id] || 0)}
                >
                  <Popup>{id}</Popup>
                </Marker>
              ))}
            </MapContainer>

             }
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper to update map view when center/zoom changes
const SetViewOnChange = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export default MapHistory;