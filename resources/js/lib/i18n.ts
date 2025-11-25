import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translation files
import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enDashboard from '@/locales/en/dashboard.json';
import enWorkorders from '@/locales/en/workorders.json';
import enMachines from '@/locales/en/machines.json';
import enParts from '@/locales/en/parts.json';
import enOee from '@/locales/en/oee.json';
import enCosts from '@/locales/en/costs.json';
import enSettings from '@/locales/en/settings.json';
import enNav from '@/locales/en/nav.json';

// Import Dutch translation files
import nlCommon from '@/locales/nl/common.json';
import nlAuth from '@/locales/nl/auth.json';
import nlDashboard from '@/locales/nl/dashboard.json';
import nlWorkorders from '@/locales/nl/workorders.json';
import nlMachines from '@/locales/nl/machines.json';
import nlParts from '@/locales/nl/parts.json';
import nlOee from '@/locales/nl/oee.json';
import nlCosts from '@/locales/nl/costs.json';
import nlSettings from '@/locales/nl/settings.json';
import nlNav from '@/locales/nl/nav.json';

export const defaultNS = 'common';
export const resources = {
    en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        workorders: enWorkorders,
        machines: enMachines,
        parts: enParts,
        oee: enOee,
        costs: enCosts,
        settings: enSettings,
        nav: enNav,
    },
    nl: {
        common: nlCommon,
        auth: nlAuth,
        dashboard: nlDashboard,
        workorders: nlWorkorders,
        machines: nlMachines,
        parts: nlParts,
        oee: nlOee,
        costs: nlCosts,
        settings: nlSettings,
        nav: nlNav,
    },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: undefined, // Will be set from Inertia shared props
        fallbackLng: 'en',
        defaultNS,
        ns: ['common', 'auth', 'dashboard', 'workorders', 'machines', 'parts', 'oee', 'costs', 'settings', 'nav'],
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        detection: {
            // Disable automatic detection - we'll sync from server
            order: [],
            caches: [],
        },
    });

export default i18n;

// Type-safe translation keys
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources['en'];
    }
}
