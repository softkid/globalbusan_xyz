import { Link } from 'react-router-dom';
import { FaGlobe, FaCog } from 'react-icons/fa';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const MobileHeader = () => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {/* Mobile Header - Only visible on mobile */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 md:hidden">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <FaGlobe className="text-white text-sm" />
                        </div>
                        <span className="text-lg font-bold text-gray-800">Global BUSAN</span>
                    </Link>

                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Settings"
                    >
                        <FaCog className={`text-xl text-gray-600 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* Settings Dropdown */}
                {showSettings && (
                    <div className="absolute top-full right-0 left-0 bg-white border-b border-gray-200 shadow-lg animate-fadeIn">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Language / 언어</span>
                            </div>
                            <div className="flex justify-center">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className="h-14 md:hidden" />
        </>
    );
};

export default MobileHeader;
