import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import {
    ImpersonationBanner,
    useImpersonation,
} from '@/components/impersonation-banner';
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

    return (
        <AppShell variant="sidebar">
            {isImpersonating && impersonation && (
                <ImpersonationBanner impersonation={impersonation} />
            )}
            <AppSidebar className={isImpersonating ? 'pt-12' : ''} />
            <AppContent
                variant="sidebar"
                className={`overflow-x-hidden ${isImpersonating ? 'pt-12' : ''}`}
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="px-4 md:px-6 lg:px-8">{children}</div>
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
