import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  TagIcon, 
  BeakerIcon, 
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'לוח בקרה', href: '/dashboard', icon: HomeIcon },
    { name: 'מועצות ותאגידים', href: '/councils', icon: BuildingOfficeIcon },
    { name: 'סקטורים', href: '/sectors', icon: TagIcon },
    { name: 'רכיבים נבדקים', href: '/components', icon: BeakerIcon },
    { name: 'עסקים', href: '/businesses', icon: BriefcaseIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">מ</span>
              </div>
              <span className="mr-2 text-xl font-bold text-gray-900 hidden sm:block">
                מערכת ניהול
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline space-x-4 space-x-reverse">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 border border-transparent`}
                  >
                    <Icon className="h-4 w-4 ml-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="mr-4 flex items-center md:mr-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center text-sm text-gray-700">
                  <UserIcon className="h-4 w-4 ml-2" />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 ml-2" />
                  יציאה
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200`}
                >
                  <Icon className="h-5 w-5 ml-3" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile user info and logout */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3 mb-3">
                <UserIcon className="h-5 w-5 ml-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-right bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 ml-2" />
                יציאה
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;