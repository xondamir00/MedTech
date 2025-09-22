import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { LogOut, User, Menu } from 'lucide-react';
import { getRoleDisplayName } from '../../utils/helpers';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-5 sm:px-6 lg:px-9">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
            MedTech
          </h1>

          {/* Desktop */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User size={20} />
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-500">
                  ({getRoleDisplayName(user.role)})
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}

          {/* Mobile */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>

              {menuOpen && (
                <div className="absolute right-4 top-16 w-48 bg-white border border-gray-200 shadow-lg rounded-md p-3 space-y-2 z-50">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User size={18} />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
