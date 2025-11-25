import type { LocaleCode } from '@/locales';
import { router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LocaleMetadataItem {
    name: string;
    native: string;
    flag: string;
    dir: 'ltr' | 'rtl';
}

export function useLocale() {
    const { i18n } = useTranslation();
    const page = usePage();
    const locale = page.props.locale as string | undefined;
    const availableLocales = page.props.availableLocales as
        | string[]
        | undefined;
    const localeMetadata = page.props.localeMetadata as
        | Record<string, LocaleMetadataItem>
        | undefined;
    const auth = page.props.auth as { user: { id: number } | null } | undefined;
    const isAuthenticated = !!auth?.user;

    const setLocale = useCallback(
        async (newLocale: LocaleCode) => {
            if (newLocale === locale) return;

            // Update i18next immediately for instant UI feedback
            await i18n.changeLanguage(newLocale);

            // Persist to server - use different routes for auth vs guest
            const route = isAuthenticated ? '/locale' : '/locale/guest';
            router.post(
                route,
                { locale: newLocale },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },
        [locale, i18n, isAuthenticated],
    );

    const currentLocale = (locale || i18n.language || 'en') as LocaleCode;
    const currentMetadata = localeMetadata?.[currentLocale];

    return {
        locale: currentLocale,
        availableLocales: (availableLocales || ['en', 'nl']) as LocaleCode[],
        localeMetadata: localeMetadata || {},
        setLocale,
        currentMetadata,
        isRTL: currentMetadata?.dir === 'rtl',
    };
}
