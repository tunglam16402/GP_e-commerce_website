import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vi from './locales/vi.json';

// Cấu hình i18n
i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next)  // Tích hợp với React
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en', // Ngôn ngữ mặc định khi không tìm thấy ngôn ngữ hiện tại
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'], // Ưu tiên lấy từ localStorage, sau đó đến trình duyệt
      caches: ['localStorage'], // Lưu ngôn ngữ vào localStorage
    },
  });

export default i18n;
