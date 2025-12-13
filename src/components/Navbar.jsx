import { FaGlobe, FaBuilding, FaBars, FaTimes, FaHome, FaChartLine, FaProjectDiagram, FaHandHoldingHeart, FaUser, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // 로그인 정보 확인
    const savedUser = localStorage.getItem('googleUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('googleUser');
      }
    }

    // 외부 클릭 시 사용자 메뉴 닫기
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('googleUser');
    setShowUserMenu(false);
    navigate('/');
  };

  // 메인 네비게이션 메뉴 (모든 페이지에서 동일하게 사용)
  const mainMenuItems = [
    { name: t('nav.home'), path: "/", icon: FaHome, key: 'home' },
    { name: t('nav.projects'), path: "/projects", icon: FaProjectDiagram, key: 'projects' },
    { name: t('nav.statistics'), path: "/statistics", icon: FaChartLine, key: 'statistics' },
    { name: t('nav.invest'), path: "/invest", icon: FaBuilding, key: 'invest' }
  ];

  // Roadmap 메뉴 아이템
  const roadmapMenuItem = { name: t('nav.roadmap'), path: "/global-busan", icon: FaInfoCircle, key: 'roadmap' };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="hidden md:block fixed inset-x-0 top-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <header className="h-full">
        <nav className="flex h-full items-center justify-between px-5 sm:px-10">
          {/* Logo */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaGlobe className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Global BUSAN</span>
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full hidden sm:inline-block">
                BETA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex h-full items-center">
            <div className="hidden md:flex items-center space-x-1">
              {mainMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key || index}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                  >
                    <Icon className="text-sm" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 우측 메뉴: 언어 선택, 로그인, Roadmap */}
          <div className="flex items-center gap-3">
            {/* 언어 전환 컴포넌트 */}
            <LanguageSwitcher />

            {/* 로그인 정보 */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUser className="text-gray-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-700 hidden md:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* 사용자 메뉴 드롭다운 */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                    >
                      <FaSignOutAlt />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/invest"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                로그인
              </Link>
            )}

            {/* Roadmap 메뉴 */}
            {(() => {
              const Icon = roadmapMenuItem.icon;
              return (
                <Link
                  to={roadmapMenuItem.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${isActive(roadmapMenuItem.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                >
                  <Icon className="text-sm" />
                  {roadmapMenuItem.name}
                </Link>
              );
            })()}
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
              {mainMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key || index}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300 ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="text-lg" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {/* 모바일 언어 전환 */}
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>

                {/* 모바일 로그인 정보 */}
                {user ? (
                  <div className="px-4 py-3 bg-gray-100 rounded-lg mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <FaUser className="text-gray-600 text-xl" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt />
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/invest"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold text-center transition-colors duration-300"
                  >
                    로그인
                  </Link>
                )}

                {/* 모바일 Roadmap 메뉴 */}
                {(() => {
                  const Icon = roadmapMenuItem.icon;
                  return (
                    <Link
                      to={roadmapMenuItem.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300 ${isActive(roadmapMenuItem.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        }`}
                    >
                      <Icon className="text-lg" />
                      {roadmapMenuItem.name}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;