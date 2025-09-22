import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Users, Menu, Key, Stethoscope, ClipboardList, User } from "lucide-react";

interface SidebarItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  let sidebarItems: SidebarItem[] = [];

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user") 
  ) {
    sidebarItems = [
      { to: "/admin/users", icon: <Users size={20} />, label: "User Management" },
      { to: "/user", icon: <Key size={20} />, label: "Login Management" },
    ];
  } else if (location.pathname.startsWith("/reception")||location.pathname.startsWith("/patients")) {
    sidebarItems = [
      { to: "/reception", icon: <ClipboardList size={20} />, label: "Reception Panel" },
      { to: "/patients", icon: <User size={20} />, label: "Patients Panel" },
    ];
  } else if (location.pathname.startsWith("/doctor")   ) {
    sidebarItems = [
      { to: "/doctor", icon: <Stethoscope size={20} />, label: "Doctor Panel" },
    ];
  }

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  return (
    <div
      className={`
        ${collapsed ? "w-16" : "w-64"} 
        bg-white shadow-lg border-r border-gray-200 min-h-screen 
        transition-all duration-300
      `}
    >
      <div className="mt-14 flex justify-center items-center px-4">
        {!collapsed && <span className="font-bold flex-1">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="space-y-2 mt-6">
        {sidebarItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 mx-[4%] px-4 py-2 border border-gray-400 rounded 
              bg-white text-gray-700 shadow-sm hover:bg-gray-200 transition-colors
              ${location.pathname === item.to ? "bg-gray-300 font-bold" : ""}`}
          >
            {item.icon}
            <span className={`${collapsed ? "hidden" : "inline font-medium"}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
