import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import English translation files
import enAuth from '@/locales/en/auth.json';
import enCommon from '@/locales/en/common.json';
import enCosts from '@/locales/en/costs.json';
import enDashboard from '@/locales/en/dashboard.json';
import enMachines from '@/locales/en/machines.json';
import enMarketing from '@/locales/en/marketing.json';
import enNav from '@/locales/en/nav.json';
import enOee from '@/locales/en/oee.json';
import enParts from '@/locales/en/parts.json';
import enSettings from '@/locales/en/settings.json';
import enWorkorders from '@/locales/en/workorders.json';

// Import Dutch translation files
import nlAuth from '@/locales/nl/auth.json';
import nlCommon from '@/locales/nl/common.json';
import nlCosts from '@/locales/nl/costs.json';
import nlDashboard from '@/locales/nl/dashboard.json';
import nlMachines from '@/locales/nl/machines.json';
import nlMarketing from '@/locales/nl/marketing.json';
import nlNav from '@/locales/nl/nav.json';
import nlOee from '@/locales/nl/oee.json';
import nlParts from '@/locales/nl/parts.json';
import nlSettings from '@/locales/nl/settings.json';
import nlWorkorders from '@/locales/nl/workorders.json';

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
        marketing: enMarketing,
        admin: enAdmin,
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
        marketing: nlMarketing,
        admin: nlAdmin,
    },
} as const;

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: undefined, // Will be set from Inertia shared props
        fallbackLng: 'en',
        defaultNS,
        ns: [
            'common',
            'auth',
            'dashboard',
            'workorders',
            'machines',
            'parts',
            'oee',
            'costs',
            'settings',
            'nav',
            'marketing',
        ],
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
        resources: (typeof resources)['en'];
    }
}
