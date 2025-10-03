import { TiLocationArrow } from "react-icons/ti";
import { FaGlobe, FaBuilding, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

import Button from "./Button";

const navItems = ["Equity", "Reports", "Roadmap", "Contact"];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

            <Button
              id="invest-button"
              title="Invest Now"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-gradient-to-r from-green-500 to-blue-500 text-white md:flex hidden items-center justify-center gap-2 px-6 py-3 text-lg font-semibold hover:from-green-600 hover:to-blue-600"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
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
            <div className="px-5 py-4 space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="block text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  id="mobile-invest-button"
                  title="Invest Now"
                  rightIcon={<TiLocationArrow />}
                  containerClass="bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold hover:from-green-600 hover:to-blue-600 w-full"
                />
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;