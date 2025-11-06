import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png";
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, MapPinCheck } from "lucide-react";
import Navbar from "../components/Nav"


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: customMarkerImage,
    iconRetinaUrl: customMarkerImage,
    iconSize: [60, 50],
    iconAnchor: [30, 50],
    shadowUrl: null,
});

const directionIcon = (img, angle) =>
    L.divIcon({
        html: `<img src="${img}" style="transform: rotate(${angle}deg); width: 60px; height: 40px;" />`,
        className: "",
        iconSize: [60, 50],
        iconAnchor: [30, 50],
    });

const MapHistory = () => {
    const [defaultCenter, setDefaultCenter] = useState([28.624632933245827, 77.20809144517892]);
    const [positions, setPositions] = useState();
    const [zoom, setZoom] = useState(5);
    const apiurl = import.meta.env.VITE_API_URL;

    const formatDate = (d = new Date()) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const today = formatDate();
    const [startdate, setstartdate] = useState(today);
    const [enddate, setenddate] = useState(today);
    const [deviceData, setDeviceData] = useState([]);
    const [device,setdevice] = useState();

    const getValidCoordinates = (lat, long) => {
        if (
            lat === "NA" ||
            long === "NA" ||
            lat === null ||
            long === null ||
            lat === undefined ||
            long === undefined ||
            lat === "--" ||
            long === "--"
        ) {
            return null;
        }
        return [parseFloat(lat), parseFloat(long)];
    };

    const historydata = useCallback(async (device_id) => {
        if (!device_id) return;
        console.log(device_id,'history data')
        try {

            const jsondata = JSON.stringify({
                        
            "device_id": device_id,
            "startdate": startdate,
            "enddate": enddate,
            // "page": 1,
            // "limit": 50
        
            });

            // console.log(jsondata);

            const response = await fetch(`${apiurl}/DataHistory`, {
                method: "POST",
                body: jsondata,
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log(data.data,"data");

                // setPositions(data.data);

            if (Array.isArray(data.data) && data.data.length > 0) {
                const newPositions = {};
                data.data.forEach((ele) => {
                    const coords = getValidCoordinates(ele.lat, ele.long);
                    if (device_id !== "all") {
                        setDefaultCenter(coords)
                        setZoom(13);
                    }
                    console.log(coords);
                    setPositions(coords)
                    // if (coords) {
                    //     if (!newPositions[ele.device_id]) newPositions[ele.device_id] = [];
                    //     newPositions[ele.device_id].push(coords);
                    // }
                });
                // setPositions(newPositions);

            }
        } catch (error) {
            console.error("Error fetching map info:", error);
        }
    }, [apiurl,startdate,enddate]);



    async function fetchDevices() {

        try {
            const response = await fetch(`${apiurl}/get_device`, {
                method: "POST",
                body: JSON.stringify({ device_id: "all" }),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to fetch devices");
            const res = await response.json();
            // console.log(res, 'device data.');
            setDeviceData(res);
        } catch (error) {
            //   c("Error fetching devices");
            console.error("Error fetching devices:", error);
        } finally {
            console.log(false);
        }
    }

    useEffect(() => {
        historydata(device || "all");
        fetchDevices()
    }, [device]);


    console.log("coords", device, defaultCenter, zoom,positions);

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 300);
    }, []);


    return (
        <div className="flex h-screen">
            <Navbar />
            <section className="flex-1 overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3 text-lg font-semibold mb-6">
                        <ArrowLeft className="cursor-pointer hover:text-gray-600" />
                        <span>History of 08923409890823409</span>
                    </div>

                    <div className="flex flex-wrap gap-6 items-end">
                        <select
                            onChange={(e) => setdevice(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Devices</option>
                            {deviceData.map((device) => (
                                <option key={device.device_id} value={device.device_id}>
                                    {device.device_id}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="startdate" className="text-sm text-gray-600">From</label>
                            <input
                                type="date"
                                value={startdate}
                                id="startdate"
                                onChange={(e) => setstartdate(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="enddate" className="text-sm text-gray-600">To</label>
                            <input
                                type="date"
                                id="enddate"
                                value={enddate}
                                onChange={(e) => setenddate(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1">
                    <div className="rounded-xl overflow-hidden shadow-lg h-[calc(100vh-220px)]">
                        <MapContainer
                            center={defaultCenter}
                            zoom={zoom}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <SetViewOnChange center={defaultCenter} zoom={zoom} />
                            {/* {Object.entries(positions).map(([deviceId, coords]) =>
                                coords.map((pos, idx) => (
                                    <Marker
                                        key={`${deviceId}-${idx}`}
                                        position={pos}
                                        icon={directionIcon(customMarkerImage, Math.floor(2))}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h4 className="font-semibold mb-2">Device: {deviceId}</h4>
                                                <p className="text-sm">Latitude: {pos[0]}</p>
                                                <p className="text-sm">Longitude: {pos[1]}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))
                            )} */}
                        </MapContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MapHistory;


// ✅ Helper: keeps map center and zoom updated
const SetViewOnChange = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};