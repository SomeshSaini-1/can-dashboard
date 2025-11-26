import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerImage from "../assets/image.png";
import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, FastForward, LoaderCircle, MapPinCheck, Pause, Play, RotateCcw } from "lucide-react";
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
    const [positions, setPositions] = useState([]);
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
    const [device, setdevice] = useState();
    const [Marker1, setMarker1] = useState();
    const [loading,setloading] = useState(false);

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
            return;
        }
        return `${parseFloat(lat)}, ${parseFloat(long)}`;
    };

    const historydata = useCallback(async (device_id) => {
        if (!device_id) return;
        console.log(device_id, 'history data');
        setloading(true);
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
            console.log(data.data, "data");

            // setPositions(data.data);

            if (Array.isArray(data.data) && data.data.length > 0) {
                // const newPositions = {};
                const newPositions = [];

                data.data.forEach((ele) => {
                    const coords = getValidCoordinates(ele.lat, ele.long);

                    // Create and use a Promise properly
                    const promise = new Promise((resolve, reject) => {
                        if (coords) {
                            newPositions.push(coords);
                            resolve(coords); // success
                            // setDefaultCenter(coords.split(","))
                            setZoom(11);

                        } else {
                            reject("Invalid coordinates");
                        }
                    });

                    // Handle the Promise
                    promise
                        .then((result) => {
                            // console.log("✅ Valid coords:", result);
                        })
                        .catch((err) => {
                            // console.error("❌", err);
                        });
                });
                console.log(newPositions, "newPositions")
                newPositions.reverse().map(ele => {
                    setPositions(pre => [...pre, ele.split(",")])
                    // console.log(ele.split(","))
                })
                if (newPositions.length > 0) {
                    setDefaultCenter(newPositions[0]?.split(","));
                    setMarker1(newPositions[0]?.split(","));
                }
                setloading(false);
            }
        } catch (error) {
            console.error("Error fetching map info:", error);
        }
    }, [apiurl, startdate, enddate]);



    async function fetchDevices() {

        try {
            const response = await fetch(`${apiurl}/get_device`, {
                method: "POST",
                body: JSON.stringify({ device_id: device || "all" }),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to fetch devices");
            const res = await response.json();
            // console.log(res, 'device data.');
            setDeviceData(res);
        } catch (error) {
            console.error("Error fetching devices:", error);
        }
    }

    useEffect(() => {
        device && historydata(device);
        fetchDevices()
    }, [device]);


    // console.log("coords", device, defaultCenter, zoom,positions);

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 300);
    }, []);


    const [pause, setpause] = useState(false);
    const playInterval = useRef(null);
    const [Time, setTime] = useState(10);


    const playdata = () => {
        if (pause) {
            clearInterval(playInterval.current)
            playInterval.current = null;
            setpause(false)
            console.log('pause');
            return;
        }

        setpause(true);
        console.log("playing")
        let index = 0; // start from first position
        setMarker1(positions[index]);
        playInterval.current = setInterval(() => {
            if (index < positions.length) {
                setMarker1(positions[index]); // update marker position
                console.log(positions[index], index); // update marker position
                index++;
            } else {
                clearInterval(interval); // stop when done
            }
        }, 100 * Time); // update every 5 seconds
    };


    return (
        <div className="flex h-screen">
            <Navbar />
            <section className="flex-1 overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3 text-lg font-semibold mb-6">
                        <ArrowLeft className="cursor-pointer hover:text-gray-600" />
                        <span>History of {device}</span>
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

                <div className="p-6 flex gap-2">

                    {positions.length > 10 && (
                        <div className="flex flex-col justify-between items-start gap-4 bg-gray-800 text-white p-4 rounded-2xl shadow-md my-3">
                            {/* Controls Section */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => playdata()}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
                                    title="Play"
                                >
                                    {pause ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </button>

                                <button
                                    className="p-2 bg-gray-600 hover:bg-gray-700 rounded-full transition"
                                    title="fastforward"
                                    onClick={() => setTime(5)}
                                >
                                    {/* <RotateCcw  /> */}
                                    <FastForward className="w-5 h-5" />
                                </button>

                                <input
                                    type="range"
                                    min={0}
                                    max={positions.length - 1}
                                    onChange={(e) => setMarker1(positions[e.target.value])}
                                    name="play"
                                    id="play"
                                    className="w-40 accent-blue-500 cursor-pointer"
                                />
                            </div>

                            {/* Device Info Section */}
                            <ul className="text-sm space-y-1">
                                <li><span className="font-semibold">Device Name:</span> {deviceData[0].device_name}</li>
                                <li><span className="font-semibold">Device ID:</span> {deviceData[0].device_id}</li>
                                <li><span className="font-semibold">Mode:</span> {deviceData[0].device_mode}</li>
                                <li><span className="font-semibold">Assigned to:</span> {deviceData[0].Assing_to}</li>
                            </ul>
                        </div>
                    )}

                    {!loading  ? <div className="flex-1 rounded-xl overflow-hidden shadow-lg h-[calc(100vh-220px)]">
                        <MapContainer
                            center={defaultCenter}
                            zoom={zoom}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Polyline
                                positions={positions}
                                pathOptions={{ color: "red", weight: 4 }} // customize color and thickness
                            />

                            <SetViewOnChange center={defaultCenter} zoom={zoom} />
                            {Marker1 && <Marker
                                position={Marker1}
                                icon={directionIcon(customMarkerImage, Math.floor(2))}
                            >

                            </Marker>
                            }
                        </MapContainer>
                    </div> : <> <LoaderCircle size={32} strokeWidth={1.75} absoluteStrokeWidth className="animate-spin slow-spin"/></>}

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