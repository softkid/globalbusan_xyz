import { FaGlobe, FaBars, FaTimes, FaCog, FaChartLine, FaUsers, FaProjectDiagram } from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const adminNavItems = [
    { name: "Dashboard", path: "/admin", icon: FaChartLine },
    { name: "Projects", path: "/projects", icon: FaProjectDiagram },
    { name: "Statistics", path: "/statistics", icon: FaChartLine },
    { name: "Invest", path: "/invest", icon: FaUsers }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-16 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700">
      <header className="h-full">
        <nav className="flex h-full items-center justify-between px-5 sm:px-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <FaCog className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">Admin Panel</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex h-full items-center">
            <div className="hidden md:flex items-center space-x-1">
              {adminNavItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="text-sm" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white transition-colors duration-300 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-lg">
            <div className="px-5 py-4 space-y-2">
              {adminNavItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="text-lg" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default AdminNavbar;
