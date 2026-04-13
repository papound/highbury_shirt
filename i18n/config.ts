import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

export const defaultLocale = "th" as const;
export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];

export const i18nConfig = {
  defaultNS: "common",
  ns: ["common", "product", "checkout", "account", "admin"],
};

export function getI18nInstance() {
  return i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/i18n/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: defaultLocale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      ...i18nConfig,
      interpolation: { escapeValue: false },
    });
}
