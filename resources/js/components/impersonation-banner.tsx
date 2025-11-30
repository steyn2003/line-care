import { Button } from '@/components/ui/button';
import { ImpersonationData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Building2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
    impersonation: ImpersonationData;
}

export function ImpersonationBanner({ impersonation }: Props) {
    const { t } = useTranslation();

    const handleStopImpersonating = () => {
        router.post('/stop-impersonating', undefined, {
            onSuccess: () => {
                toast.success(t('admin.impersonation.stopped'));
            },
            onError: () => {
                toast.error(t('admin.impersonation.stop_error'));
            },
        });
    };

    return (
        <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-amber-500 px-4 py-2 text-amber-950 shadow-md">
            <div className="flex items-center gap-4">
                <AlertTriangle className="h-5 w-5" />
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{t('admin.impersonation.banner_prefix')}</span>
                    <div className="flex items-center gap-1 rounded bg-amber-600/30 px-2 py-0.5">
                        <User className="h-3 w-3" />
                        <span>{impersonation.impersonated_user.name}</span>
                    </div>
                    {impersonation.impersonated_user.company && (
                        <>
                            <span>{t('admin.impersonation.at')}</span>
                            <div className="flex items-center gap-1 rounded bg-amber-600/30 px-2 py-0.5">
                                <Building2 className="h-3 w-3" />
                                <span>
                                    {impersonation.impersonated_user.company.name}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Button
                size="sm"
                variant="secondary"
                onClick={handleStopImpersonating}
                className="bg-amber-950 text-amber-100 hover:bg-amber-900"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('admin.impersonation.stop')}
            </Button>
        </div>
    );
}

/**
 * Hook to check if currently impersonating.
 */
export function useImpersonation(): ImpersonationData | null {
    const { impersonation } = usePage().props as { impersonation: ImpersonationData | null };
    return impersonation;
}

/**
 * Hook to check if impersonation banner should show.
 */
export function useIsImpersonating(): boolean {
    const impersonation = useImpersonation();
    return impersonation?.is_impersonating ?? false;
}
