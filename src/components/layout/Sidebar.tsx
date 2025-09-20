import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Users, Stethoscope, ClipboardList, Menu } from "lucide-react";

interface SidebarItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  {
    to: "/admin",
    icon: <Users size={20} />,
    label: "User Management",
  },
  {
    to: "/user",
    icon: <Stethoscope size={20} />,
    label: "User Panel",
  },
  {
    to: "/reception",
    icon: <ClipboardList size={20} />,
    label: "Reception Panel",
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-64"} 
        bg-white shadow-lg border-r border-gray-200 min-h-screen 
        transition-all duration-300
      `}
    >
    
      <div className="p-4 my-[8.5%] flex justify-end md:justify-between items-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hidden  hover:bg-gray-100 md:block"
        >
          <Menu size={20} />
        </button>
        {!collapsed && <span className="hidden md:inline font-bold">Menu</span>}
      </div>

      {/* Nav items */}
      <nav className="space-y-2 mt-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center border-t py-3 last:border-b border-gray-500 gap-3 px-4  hover:bg-gray-100 transition-colors"
          >
            {item.icon}
            <span
              className={`
                font-medium 
                ${collapsed ? "hidden" : "hidden md:inline"}
              `}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
