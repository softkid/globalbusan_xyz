import { TiLocationArrow } from "react-icons/ti";
import { FaGlobe, FaBuilding, FaBars, FaTimes, FaHome, FaChartLine, FaProjectDiagram, FaFileAlt, FaRoad, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Button from "./Button";

const Navbar = ({ isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 사용자용 메뉴 아이템
  const userNavItems = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Projects", path: "/projects", icon: FaProjectDiagram },
    { name: "Statistics", path: "/statistics", icon: FaChartLine },
    { name: "Invest", path: "/invest", icon: FaBuilding }
  ];

  // 홈페이지용 앵커 링크 (스크롤)
  const homeNavItems = ["Equity", "Reports", "Roadmap", "Contact"];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <header className="h-full">
        <nav className="flex h-full items-center justify-between px-5 sm:px-10">
          {/* Logo and Invest button */}
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaGlobe className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Global BUSAN</span>
            </div>

                  <Link to="/invest">
                    <Button
                      id="invest-button"
                      title="Invest Now"
                      rightIcon={<TiLocationArrow />}
                      containerClass="bg-gradient-to-r from-green-500 to-blue-500 text-white md:flex hidden items-center justify-center gap-2 px-6 py-3 text-lg font-semibold hover:from-green-600 hover:to-blue-600"
                    />
                  </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex h-full items-center">
            <div className="hidden md:flex items-center space-x-1">
              {location.pathname === '/' ? (
                // 홈페이지에서는 앵커 링크 사용
                homeNavItems.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="nav-hover-btn"
                  >
                    {item}
                  </a>
                ))
              ) : (
                // 다른 페이지에서는 라우터 링크 사용
                userNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="text-sm" />
                      {item.name}
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2"
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
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <div className="px-5 py-4 space-y-2">
              {location.pathname === '/' ? (
                // 홈페이지에서는 앵커 링크 사용
                homeNavItems.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="block text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))
              ) : (
                // 다른 페이지에서는 라우터 링크 사용
                userNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300 ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="text-lg" />
                      {item.name}
                    </Link>
                  );
                })
              )}
              <div className="pt-4 border-t border-gray-200">
                <Link to="/invest" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    id="mobile-invest-button"
                    title="Invest Now"
                    rightIcon={<TiLocationArrow />}
                    containerClass="bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold hover:from-green-600 hover:to-blue-600 w-full"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;