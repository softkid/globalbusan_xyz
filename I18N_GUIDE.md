# i18n Implementation Guide

## Overview
This project now supports internationalization (i18n) with **English as the primary language**, along with Chinese, Japanese, Korean, and Arabic.

## Supported Languages
1. **English (en)** - Default and primary language
2. **Chinese (zh)** - 中文
3. **Japanese (ja)** - 日本語
4. **Korean (ko)** - 한국어
5. **Arabic (ar)** - العربية (with RTL support)

## Implementation Details

### Packages Installed
- `i18next` - Core i18n framework
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Automatic language detection

### File Structure
```
src/
├── i18n/
│   ├── config.js          # i18n configuration
│   └── locales/
│       ├── en.json        # English translations (primary)
│       ├── zh.json        # Chinese translations
│       ├── ja.json        # Japanese translations
│       ├── ko.json        # Korean translations
│       └── ar.json        # Arabic translations
├── components/
│   └── LanguageSwitcher.jsx  # Language selection component
└── main.jsx               # i18n initialization
```

### Configuration
The i18n configuration (`src/i18n/config.js`) is set up with:
- **Default language**: English (`en`)
- **Fallback language**: English (`en`)
- **Language detection**: Browser language and localStorage
- **Supported languages**: en, zh, ja, ko, ar

### Using Translations in Components

#### Basic Usage
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
}
```

#### With Variables
```jsx
const { t } = useTranslation();
<p>{t('welcome', { name: 'John' })}</p>
```

### Language Switcher Component
The `LanguageSwitcher` component is already integrated into the Navbar and provides:
- Beautiful dropdown UI with country flags
- Automatic RTL support for Arabic
- Smooth animations
- Click-outside-to-close functionality

### RTL Support
Arabic language automatically switches the page to RTL (right-to-left) mode:
- HTML `dir` attribute is automatically updated
- All layouts adapt to RTL direction

### Translation Keys Structure
```json
{
  "nav": { ... },           // Navigation items
  "home": { ... },          // Home page content
  "invest": { ... },        // Investment page
  "projects": { ... },      // Projects page
  "statistics": { ... },    // Statistics page
  "donation": { ... },      // Donation page
  "globalBusan": { ... },   // Global Busan page
  "roadmap": { ... },       // Roadmap page
  "admin": { ... },         // Admin dashboard
  "projectApplication": { ... }, // Project application
  "common": { ... }         // Common UI elements
}
```

### Adding New Translations

1. **Add to all language files** (`src/i18n/locales/*.json`):
```json
{
  "newSection": {
    "title": "Your Title",
    "description": "Your Description"
  }
}
```

2. **Use in component**:
```jsx
const { t } = useTranslation();
<h1>{t('newSection.title')}</h1>
```

### Changing Language Programmatically
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToKorean = () => {
    i18n.changeLanguage('ko');
  };
  
  return <button onClick={changeToKorean}>한국어</button>;
}
```

### Current Language
```jsx
const { i18n } = useTranslation();
const currentLanguage = i18n.language; // 'en', 'zh', 'ja', 'ko', or 'ar'
```

## Testing
1. Start the dev server: `npm run dev`
2. Open the application in your browser
3. Click the language switcher in the navbar
4. Select different languages to see the translations
5. For Arabic, verify RTL layout is working correctly

## Best Practices
1. **Always use translation keys** instead of hardcoded text
2. **Keep translation keys organized** by page/section
3. **Maintain consistency** across all language files
4. **Test RTL layout** when adding new UI components
5. **Use descriptive key names** that indicate the content

## Migration Guide for Existing Components
To add i18n to existing components:

1. Import the hook:
```jsx
import { useTranslation } from 'react-i18next';
```

2. Use the hook:
```jsx
const { t } = useTranslation();
```

3. Replace hardcoded text:
```jsx
// Before
<h1>Welcome to Global BUSAN</h1>

// After
<h1>{t('home.title')}</h1>
```

4. Add translations to all language files

## Notes
- Language preference is saved in localStorage
- The page automatically detects browser language on first visit
- English is always used as fallback if a translation is missing
- The LanguageSwitcher component is responsive and works on mobile
