import { usePage } from '@inertiajs/react';
import { Clock, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface CompanyData {
    is_trial: boolean;
    trial_ends_at: string | null;
}

interface PageProps {
    company?: CompanyData | null;
}

export function TrialBanner() {
    const { t } = useTranslation('trial');
    const { company } = usePage<PageProps>().props;
    const [dismissed, setDismissed] = useState(false);

    if (!company || !company.is_trial || !company.trial_ends_at || dismissed) {
        return null;
    }

    const endDate = new Date(company.trial_ends_at);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Don't show if expired (middleware handles redirect)
    if (daysLeft <= 0) {
        return null;
    }

    const isUrgent = daysLeft <= 3;

    return (
        <div
            className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-2 text-sm shadow-md ${
                isUrgent ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
        >
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                    {t('banner.trial_remaining', 'Trial: nog')}{' '}
                    <strong>{daysLeft}</strong>{' '}
                    {daysLeft === 1
                        ? t('banner.day', 'dag')
                        : t('banner.days', 'dagen')}{' '}
                    {t('banner.remaining', 'over')}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    className={
                        isUrgent
                            ? 'bg-red-950 text-red-100 hover:bg-red-900'
                            : 'bg-blue-950 text-blue-100 hover:bg-blue-900'
                    }
                    asChild
                >
                    <a href="mailto:sales@linecare.nl">
                        {isUrgent
                            ? t('banner.upgrade_now', 'Upgrade nu')
                            : t('banner.contact', 'Neem contact op')}
                    </a>
                </Button>

                {!isUrgent && (
                    <button
                        onClick={() => setDismissed(true)}
                        className="rounded p-1 hover:bg-blue-600"
                        aria-label={t('banner.dismiss', 'Sluiten')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Hook to check if trial banner should show.
 */
export function useIsTrial(): boolean {
    const { company } = usePage<PageProps>().props;
    if (!company || !company.is_trial || !company.trial_ends_at) {
        return false;
    }
    const daysLeft = Math.ceil(
        (new Date(company.trial_ends_at).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
    );
    return daysLeft > 0;
}
