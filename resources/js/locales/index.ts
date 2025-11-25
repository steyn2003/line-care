// Locale metadata for UI display
export const localeMetadata = {
    en: {
        name: 'English',
        native: 'English',
        flag: '🇬🇧',
        dir: 'ltr' as const,
    },
    nl: {
        name: 'Dutch',
        native: 'Nederlands',
        flag: '🇳🇱',
        dir: 'ltr' as const,
    },
} as const;

export type LocaleCode = keyof typeof localeMetadata;

export const availableLocales = Object.keys(localeMetadata) as LocaleCode[];

export function isValidLocale(locale: string): locale is LocaleCode {
    return locale in localeMetadata;
}

export function getLocaleMetadata(locale: LocaleCode) {
    return localeMetadata[locale];
}
