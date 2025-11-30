import { type Features } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type FeatureKey = keyof Features;

interface UseFeatureGuardOptions {
    /**
     * The feature(s) required for this page.
     * Can be a single feature or an array of features.
     */
    feature: FeatureKey | FeatureKey[];
    /**
     * When true and multiple features are specified, ALL features must be enabled.
     * When false (default), ANY of the features being enabled is sufficient.
     */
    requireAll?: boolean;
    /**
     * The URL to redirect to if the feature is not available.
     * Defaults to '/dashboard'.
     */
    redirectTo?: string;
    /**
     * Whether to show a toast message when redirecting.
     * Defaults to true.
     */
    showToast?: boolean;
    /**
     * Custom toast message. If not provided, a default message is used.
     */
    toastMessage?: string;
}

/**
 * Hook to guard a page based on feature availability.
 * Redirects the user if they don't have access to the required feature(s).
 *
 * @example
 * // In a page component
 * export default function InventoryPage() {
 *   useFeatureGuard({ feature: 'inventory' });
 *   // ... rest of component
 * }
 *
 * @example
 * // Multiple features (any)
 * useFeatureGuard({ feature: ['inventory', 'costs'] });
 *
 * @example
 * // Multiple features (all required)
 * useFeatureGuard({ feature: ['inventory', 'costs'], requireAll: true });
 *
 * @example
 * // Custom redirect and message
 * useFeatureGuard({
 *   feature: 'analytics',
 *   redirectTo: '/upgrade',
 *   toastMessage: 'Please upgrade to access Analytics'
 * });
 */
export function useFeatureGuard({
    feature,
    requireAll = false,
    redirectTo = '/dashboard',
    showToast = true,
    toastMessage,
}: UseFeatureGuardOptions): void {
    const { features } = usePage<{ features: Features }>().props;
    const { t } = useTranslation();

    useEffect(() => {
        const featureArray = Array.isArray(feature) ? feature : [feature];

        const hasAccess = requireAll
            ? featureArray.every((f) => features[f])
            : featureArray.some((f) => features[f]);

        if (!hasAccess) {
            if (showToast) {
                const featureName = Array.isArray(feature)
                    ? feature.map((f) => t(`features.feature_names.${f}`, f)).join(', ')
                    : t(`features.feature_names.${feature}`, feature);

                toast.error(
                    toastMessage ||
                        t('features.upgrade_required', { feature: featureName })
                );
            }

            router.visit(redirectTo, { replace: true });
        }
    }, [feature, requireAll, redirectTo, showToast, toastMessage, features, t]);
}

/**
 * Hook to check feature access without redirecting.
 * Returns whether the user has access and the feature status.
 *
 * @example
 * const { hasAccess, isLoading } = useFeatureAccess('inventory');
 * if (!hasAccess) {
 *   return <UpgradePrompt featureName="Inventory" />;
 * }
 */
export function useFeatureAccess(
    feature: FeatureKey | FeatureKey[],
    requireAll = false
): { hasAccess: boolean } {
    const { features } = usePage<{ features: Features }>().props;

    const featureArray = Array.isArray(feature) ? feature : [feature];

    const hasAccess = requireAll
        ? featureArray.every((f) => features[f])
        : featureArray.some((f) => features[f]);

    return { hasAccess };
}
