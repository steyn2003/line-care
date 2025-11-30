import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UpgradePromptProps {
    /**
     * The name of the feature that requires an upgrade.
     */
    featureName: string;
    /**
     * Optional description of the feature.
     */
    description?: string;
    /**
     * Whether to show a compact version (inline) or full card.
     */
    variant?: 'card' | 'inline' | 'banner';
    /**
     * Custom upgrade URL. Defaults to pricing page.
     */
    upgradeUrl?: string;
    /**
     * Custom class name for styling.
     */
    className?: string;
}

/**
 * UpgradePrompt component to show when a feature is not available.
 *
 * @example
 * <FeatureGate
 *   feature="analytics"
 *   fallback={<UpgradePrompt featureName="Advanced Analytics" />}
 * >
 *   <AnalyticsDashboard />
 * </FeatureGate>
 */
export function UpgradePrompt({
    featureName,
    description,
    variant = 'card',
    upgradeUrl = '/prijzen',
    className = '',
}: UpgradePromptProps) {
    const { t } = useTranslation();

    if (variant === 'inline') {
        return (
            <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
                <Lock className="h-4 w-4" />
                <span className="text-sm">
                    {t('features.upgrade_required', { feature: featureName })}
                </span>
                <Link
                    href={upgradeUrl}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {t('features.upgrade_now')}
                </Link>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div
                className={`flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 ${className}`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">
                            {t('features.unlock_feature', { feature: featureName })}
                        </p>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>
                <Button asChild size="sm">
                    <Link href={upgradeUrl}>{t('features.upgrade_plan')}</Link>
                </Button>
            </div>
        );
    }

    // Default: card variant
    return (
        <Card className={`border-dashed ${className}`}>
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>{featureName}</CardTitle>
                <CardDescription>
                    {description ||
                        t('features.not_available_description', {
                            feature: featureName,
                        })}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                    {t('features.upgrade_to_access')}
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button asChild>
                    <Link href={upgradeUrl}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('features.view_plans')}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
