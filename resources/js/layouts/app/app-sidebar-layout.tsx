import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import {
    ImpersonationBanner,
    useImpersonation,
} from '@/components/impersonation-banner';
import { TrialBanner, useIsTrial } from '@/components/trial-banner';
import { Toaster } from '@/components/ui/sonner';
import { useFlash } from '@/hooks/use-flash';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    // Show flash messages as toast notifications
    useFlash();

    const impersonation = useImpersonation();
    const isImpersonating = impersonation?.is_impersonating ?? false;
    const isTrial = useIsTrial();

    // Calculate top offset based on active banners
    const hasTopBanner = isImpersonating || isTrial;
    const topOffset =
        isImpersonating && isTrial ? 'pt-24' : hasTopBanner ? 'pt-12' : '';

    return (
        <AppShell variant="sidebar">
            {isImpersonating && impersonation && (
                <ImpersonationBanner impersonation={impersonation} />
            )}
            {!isImpersonating && <TrialBanner />}
            <AppSidebar className={topOffset} />
            <AppContent
                variant="sidebar"
                className={`overflow-x-hidden ${topOffset}`}
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="px-4 md:px-6 lg:px-8">{children}</div>
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
