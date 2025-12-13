import { Link } from 'react-router-dom';
import { FaGlobe, FaCog, FaTimes, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'ko', name: '한국어', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

const MobileHeader = () => {
    const { i18n } = useTranslation();
    const [showSettings, setShowSettings] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('i18nextLng', lng);
        setShowLanguageModal(false);
        setShowSettings(false);
    };

    useEffect(() => {
        document.body.style.overflow = showLanguageModal ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showLanguageModal]);

    return (
        <>
            {/* Mobile Header - Only visible on mobile */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-lg border-b border-blue-700 md:hidden shadow-md">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-1">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <FaGlobe className="text-white text-lg" />
                        </div>
                        <span className="text-lg font-bold text-white hidden sm:block">Global BUSAN</span>
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                            BETA
                        </span>
                    </Link>

                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2.5 rounded-lg transition-all duration-300 ${
                            showSettings 
                                ? 'bg-white/30 text-white' 
                                : 'hover:bg-white/20 text-white/80 hover:text-white'
                        }`}
                        aria-label="Settings"
                    >
                        <FaCog className={`text-xl transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* Settings Dropdown */}
                {showSettings && (
                    <div className="absolute top-full right-0 left-0 bg-white border-t-2 border-blue-600 shadow-xl animate-fadeIn">
                        <div className="p-4 space-y-2">
                            <button
                                onClick={() => {
                                    setShowLanguageModal(true);
                                    setShowSettings(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <FaGlobe className="text-blue-600 text-lg group-hover:scale-110 transition-transform" />
                                    <div>
                                        <div className="font-semibold text-gray-900">언어 선택</div>
                                        <div className="text-xs text-gray-500">Select Language</div>
                                    </div>
                                </div>
                                <span className="text-2xl">{languages.find(l => l.code === i18n.language)?.flag || '🌐'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Full-screen Language Selection Modal */}
            {showLanguageModal && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                    <div className="min-h-screen flex flex-col">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-md">
                            <div>
                                <h2 className="text-xl font-bold">언어 선택</h2>
                                <p className="text-sm text-blue-100">Select Language</p>
                            </div>
                            <button
                                onClick={() => setShowLanguageModal(false)}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <FaTimes className="text-white text-xl" />
                            </button>
                        </div>

                        {/* Language List with Radio Buttons */}
                        <div className="flex-1 p-4 space-y-2">
                            {languages.map((lang) => (
                                <div
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        i18n.language === lang.code
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4 w-full">
                                        <span className="text-3xl">{lang.flag}</span>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{lang.name}</div>
                                            <div className="text-sm text-gray-500">{lang.nativeName}</div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                            i18n.language === lang.code 
                                                ? 'border-blue-500 bg-blue-500' 
                                                : 'border-gray-300'
                                        }`}>
                                            {i18n.language === lang.code && (
                                                <FaCheck className="text-white text-xs" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Info */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
                            <p className="text-xs text-gray-500 text-center">
                                현재 선택: {languages.find(l => l.code === i18n.language)?.name} / Current: {languages.find(l => l.code === i18n.language)?.nativeName}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer for fixed header */}
            <div className="h-16 md:hidden" />
        </>
    );
};

export default MobileHeader;
