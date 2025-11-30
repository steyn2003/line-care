import { type Features } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

type FeatureKey = keyof Features;

interface FeatureGateProps {
    /**
     * The feature(s) required to render the children.
     * Can be a single feature or an array of features.
     * When array is provided, behavior depends on `requireAll` prop.
     */
    feature: FeatureKey | FeatureKey[];
    /**
     * When true and multiple features are specified, ALL features must be enabled.
     * When false (default), ANY of the features being enabled is sufficient.
     */
    requireAll?: boolean;
    /**
     * Content to render when the feature(s) are enabled.
     */
    children: ReactNode;
    /**
     * Optional content to render when the feature(s) are not available.
     * Defaults to null (renders nothing).
     */
    fallback?: ReactNode;
}

/**
 * FeatureGate component for conditional rendering based on feature flags.
 *
 * @example
 * // Single feature
 * <FeatureGate feature="inventory">
 *   <InventoryDashboard />
 * </FeatureGate>
 *
 * @example
 * // Multiple features (any)
 * <FeatureGate feature={['inventory', 'costs']}>
 *   <CombinedView />
 * </FeatureGate>
 *
 * @example
 * // Multiple features (all required)
 * <FeatureGate feature={['inventory', 'costs']} requireAll>
 *   <AdvancedView />
 * </FeatureGate>
 *
 * @example
 * // With fallback
 * <FeatureGate feature="analytics" fallback={<UpgradePrompt />}>
 *   <AnalyticsDashboard />
 * </FeatureGate>
 */
export function FeatureGate({
    feature,
    requireAll = false,
    children,
    fallback = null,
}: FeatureGateProps) {
    const { features } = usePage<{ features: Features }>().props;

    const featureArray = Array.isArray(feature) ? feature : [feature];

    const hasAccess = requireAll
        ? featureArray.every((f) => features[f])
        : featureArray.some((f) => features[f]);

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}

/**
 * Hook to check if a feature is enabled.
 *
 * @example
 * const hasInventory = useFeature('inventory');
 * if (hasInventory) {
 *   // do something
 * }
 */
export function useFeature(feature: FeatureKey): boolean {
    const { features } = usePage<{ features: Features }>().props;
    return features[feature] ?? false;
}

/**
 * Hook to check multiple features.
 *
 * @example
 * const { inventory, costs, analytics } = useFeatures(['inventory', 'costs', 'analytics']);
 */
export function useFeatures<T extends FeatureKey[]>(
    featureKeys: T
): Record<T[number], boolean> {
    const { features } = usePage<{ features: Features }>().props;

    return featureKeys.reduce(
        (acc, key) => {
            acc[key as T[number]] = features[key] ?? false;
            return acc;
        },
        {} as Record<T[number], boolean>
    );
}

/**
 * Hook to get all features.
 *
 * @example
 * const features = useAllFeatures();
 * if (features.inventory && features.costs) {
 *   // do something
 * }
 */
export function useAllFeatures(): Features {
    const { features } = usePage<{ features: Features }>().props;
    return features;
}
