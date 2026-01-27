import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ar from './locales/ar.json'

// Temporary German translations
const de = {
  nav: {
    home: 'Startseite',
    invest: 'Investieren',
    projects: 'Projekte',
    statistics: 'Statistiken',
    donation: 'Spende',
    globalBusan: 'Globales BUSAN',
    roadmap: 'Fahrplan',
    admin: 'Admin',
    apply: 'Bewerben',
    settings: 'Einstellungen'
  },
  home: {
    title: 'Globales BUSAN',
    subtitle: 'Verwandeln Sie Busan in ein globales Wirtschaftszentrum',
    description: 'Werden Sie Teil unserer transparenten, blockchain-basierten Plattform, die internationale Unternehmer mit Koreas Wirtschaftsökosystem verbindet.',
    getStarted: 'Jetzt starten',
    learnMore: 'Mehr erfahren',
    investNow: 'Jetzt investieren',
    totalInvestment: 'Gesamtinvestition',
    globalPartners: 'Globale Partner',
    activeProjects: 'Aktive Projekte'
  },
  common: {
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    save: 'Speichern',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherig',
    close: 'Schließen',
    language: 'Sprache',
    connectWallet: 'Brieftasche verbinden',
    disconnect: 'Trennen',
    profile: 'Profil',
    logout: 'Abmelden',
    login: 'Anmelden',
    viewAll: 'Alle anzeigen',
    noData: 'Keine Daten verfügbar',
    viewDetails: 'Details anzeigen',
    invest: 'Investieren',
    loginWithGoogle: 'Mit Google anmelden',
    done: 'Fertig'
  }
}

// Temporary Hindi translations
const hi = {
  nav: {
    home: 'होम',
    invest: 'निवेश करें',
    projects: 'परियोजनाएं',
    statistics: 'आँकड़े',
    donation: 'दान',
    globalBusan: 'ग्लोबल बुसान',
    roadmap: 'रोडमैप',
    admin: 'व्यवस्थापक',
    apply: 'आवेदन करें',
    settings: 'सेटिंग्स'
  },
  home: {
    title: 'ग्लोबल बुसान',
    subtitle: 'बुसान को वैश्विक व्यापार केंद्र बनाएं',
    description: 'हमारे पारदर्शी, ब्लॉकचेन-आधारित प्लेटफॉर्म का हिस्सा बनें जो अंतरराष्ट्रीय उद्यमियों को कोरियाई व्यापार पारिस्थितिकी तंत्र से जोड़ता है।',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    investNow: 'अभी निवेश करें',
    totalInvestment: 'कुल निवेश',
    globalPartners: 'वैश्विक भागीदार',
    activeProjects: 'सक्रिय परियोजनाएं'
  },
  common: {
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    close: 'बंद करें',
    language: 'भाषा',
    connectWallet: 'वॉलेट कनेक्ट करें',
    disconnect: 'डिस्कनेक्ट करें',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    viewAll: 'सभी देखें',
    noData: 'कोई डेटा उपलब्ध नहीं है',
    viewDetails: 'विवरण देखें',
    invest: 'निवेश करें',
    loginWithGoogle: 'Google से लॉगिन करें',
    done: 'हो गया'
  }
}

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ar: { translation: ar },
  de: { translation: de },
  hi: { translation: hi }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // English as fallback
    lng: 'en', // English as default language
    supportedLngs: ['en', 'zh', 'ja', 'ko', 'ar', 'de', 'hi'],
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
