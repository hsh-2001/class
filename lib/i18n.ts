import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import km from "@/locales/km.json";

export const supportedLanguages = ["en", "km"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageOptions: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "km", label: "ខ្មែរ" },
];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        km: { translation: km },
      },
      fallbackLng: "en",
      supportedLngs: supportedLanguages,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
