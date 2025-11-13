import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Map,
  Settings,
  HelpCircle,
  LogOut,
  TriangleAlert,
  ClipboardClock,
  Radius
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(true);

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, link:"/Home" },
    { name: "Devices", icon: <Package size={20} />, link:"/AddDevice" },
    { name: "Drivers", icon: <Users size={20} />, link:"/User" },
    { name: "AddGeofencing", icon: <Radius size={20} />, link:"/AddGeofencing" }
  ];

  const deploy = [
    { name: "Map", icon: <Map size={20} />, link:"/Dashboard" },
    { name: "Alert", icon: <TriangleAlert size={20} />, link:"/Alert" },
    { name: "History", icon: <ClipboardClock size={20} />, link:"/History" }
  ];

  const others = [
    { name: "Setting", icon: <Settings size={20} />, link:"/Setting" },
    { name: "Help & Support", icon: <HelpCircle size={20} />, link:"/Help" },
  ];

  return (
    <div
      className={`h-screen bg-white border-r shadow-sm flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold" >O</div>
        {!collapsed && <span className="text-lg font-semibold"> <img src="/logo1.png" className="w-40"/> </span>}
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-4">
          <p className={`px-5 text-gray-400 text-xs uppercase ${collapsed && "hidden"}`}>Menu</p>
          {menu.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className={`px-5 text-gray-400 text-xs uppercase ${collapsed && "hidden"}`}>Deployment Sites</p>
          {deploy.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className={`px-5 text-gray-400 text-xs uppercase ${collapsed && "hidden"}`}>Others</p>
          {others.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </div>
      </div>


      <div className="p-4 border-t">      
        <div className="mt-3 flex items-center gap-2 text-red-500 cursor-pointer hover:text-red-600"
         onClick={()=> {
          dispatch(logout());
          navigate('/');
        }}
          >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
}
