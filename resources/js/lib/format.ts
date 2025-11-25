import type { LocaleCode } from '@/locales';
import {
    format,
    formatDistance,
    formatRelative,
    isValid,
    parseISO,
    type Locale,
} from 'date-fns';
import { enUS, nl } from 'date-fns/locale';

// Locale mapping for date-fns
const dateLocales: Record<LocaleCode, Locale> = {
    en: enUS,
    nl: nl,
};

/**
 * Get the date-fns locale object for a given locale code
 */
export function getDateLocale(locale: LocaleCode): Locale {
    return dateLocales[locale] || enUS;
}

/**
 * Parse a date string or Date object
 */
function parseDate(date: string | Date | null | undefined): Date | null {
    if (!date) return null;

    if (date instanceof Date) {
        return isValid(date) ? date : null;
    }

    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
}

/**
 * Format a date with locale support
 */
export function formatDate(
    date: string | Date | null | undefined,
    formatStr: string,
    locale: LocaleCode = 'en',
): string {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '-';

    return format(parsedDate, formatStr, { locale: getDateLocale(locale) });
}

/**
 * Format a date as a short date (e.g., "Jan 15, 2024")
 */
export function formatShortDate(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, 'MMM d, yyyy', locale);
}

/**
 * Format a date as a long date (e.g., "January 15, 2024")
 */
export function formatLongDate(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, 'MMMM d, yyyy', locale);
}

/**
 * Format a date with time (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export function formatDateTime(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, "MMM d, yyyy 'at' h:mm a", locale);
}

/**
 * Format a date with full time including seconds
 */
export function formatDateTimeFull(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, "MMM d, yyyy 'at' h:mm:ss a", locale);
}

/**
 * Format time only (e.g., "2:30 PM")
 */
export function formatTime(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, 'h:mm a', locale);
}

/**
 * Format time with seconds (e.g., "2:30:45 PM")
 */
export function formatTimeFull(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
): string {
    return formatDate(date, 'h:mm:ss a', locale);
}

/**
 * Format as relative time (e.g., "3 days ago", "in 2 hours")
 */
export function formatRelativeTime(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
    baseDate: Date = new Date(),
): string {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '-';

    return formatDistance(parsedDate, baseDate, {
        addSuffix: true,
        locale: getDateLocale(locale),
    });
}

/**
 * Format as relative date (e.g., "yesterday at 2:30 PM", "next Monday")
 */
export function formatRelativeDate(
    date: string | Date | null | undefined,
    locale: LocaleCode = 'en',
    baseDate: Date = new Date(),
): string {
    const parsedDate = parseDate(date);
    if (!parsedDate) return '-';

    return formatRelative(parsedDate, baseDate, {
        locale: getDateLocale(locale),
    });
}

/**
 * Format a number with locale support
 */
export function formatNumber(
    num: number | null | undefined,
    locale: LocaleCode = 'en',
    options?: Intl.NumberFormatOptions,
): string {
    if (num === null || num === undefined) return '-';

    const localeString = locale === 'nl' ? 'nl-NL' : 'en-US';
    return new Intl.NumberFormat(localeString, options).format(num);
}

/**
 * Format a number as currency
 */
export function formatCurrency(
    amount: number | null | undefined,
    locale: LocaleCode = 'en',
    currency: string = 'EUR',
): string {
    if (amount === null || amount === undefined) return '-';

    const localeString = locale === 'nl' ? 'nl-NL' : 'en-US';
    return new Intl.NumberFormat(localeString, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(
    value: number | null | undefined,
    locale: LocaleCode = 'en',
    decimals: number = 0,
): string {
    if (value === null || value === undefined) return '-';

    const localeString = locale === 'nl' ? 'nl-NL' : 'en-US';
    return new Intl.NumberFormat(localeString, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
}

/**
 * Format a number with compact notation (e.g., "1.2K", "3.5M")
 */
export function formatCompact(
    num: number | null | undefined,
    locale: LocaleCode = 'en',
): string {
    if (num === null || num === undefined) return '-';

    const localeString = locale === 'nl' ? 'nl-NL' : 'en-US';
    return new Intl.NumberFormat(localeString, {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(num);
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(
    minutes: number | null | undefined,
    locale: LocaleCode = 'en',
): string {
    if (minutes === null || minutes === undefined) return '-';

    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (locale === 'nl') {
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} uur`;
        return `${hours} uur ${mins} min`;
    }

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(
    bytes: number | null | undefined,
    locale: LocaleCode = 'en',
): string {
    if (bytes === null || bytes === undefined) return '-';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${formatNumber(size, locale, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
}
