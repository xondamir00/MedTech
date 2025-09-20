import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 

  Stethoscope,
  ClipboardList
} from 'lucide-react';

interface SidebarItem {
  to: string;
  icon: React.ReactNode;
  label: string;

}

const sidebarItems: SidebarItem[] = [
  {
    to: '/admin',
    icon: <Users size={20} />,
    label: 'User Management',
  
  },
  {
    to: '/user',
    icon: <Stethoscope size={20} />,
    label: 'User Panel',

  },
  {
    to: '/reception',
    icon: <ClipboardList size={20} />,
    label: 'Reception Panel',
    
  }
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;



  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
             className='flex items-center justify-start'
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};