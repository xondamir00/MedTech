import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  Settings,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

interface SidebarItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    to: '/admin',
    icon: <Users size={20} />,
    label: 'User Management',
    roles: ['admin']
  },
  {
    to: '/doctor',
    icon: <Stethoscope size={20} />,
    label: 'Doctor Panel',
    roles: ['doctor']
  },
  {
    to: '/reception',
    icon: <ClipboardList size={20} />,
    label: 'Reception Panel',
    roles: ['reception']
  }
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};