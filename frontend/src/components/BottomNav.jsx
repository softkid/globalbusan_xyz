import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaChartLine, FaProjectDiagram, FaBuilding, FaInfoCircle } from 'react-icons/fa';

const BottomNav = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { name: t('nav.home'), path: '/', icon: FaHome },
        { name: t('nav.projects'), path: '/projects', icon: FaProjectDiagram },
        { name: t('nav.invest'), path: '/invest', icon: FaBuilding },
        { name: t('nav.statistics'), path: '/statistics', icon: FaChartLine },
        { name: t('nav.roadmap'), path: '/global-busan', icon: FaInfoCircle }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${active
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-blue-500'
                                }`}
                        >
                            <Icon className={`text-xl mb-1 ${active ? 'scale-110' : ''} transition-transform duration-300`} />
                            <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.name}
                            </span>
                            {active && (
                                <div className="absolute bottom-0 w-12 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
