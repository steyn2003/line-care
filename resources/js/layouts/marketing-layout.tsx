import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { Head } from '@inertiajs/react';

interface MarketingLayoutProps {
    children: React.ReactNode;
    title: string;
    canRegister?: boolean;
    currentPath?: string;
}

export function MarketingLayout({
    children,
    title,
    canRegister = true,
    currentPath = '/',
}: MarketingLayoutProps) {
    return (
        <>
            <Head title={title} />
            <MarketingNav canRegister={canRegister} currentPath={currentPath} />
            <div className="bg-background">{children}</div>
            <MarketingFooter />
        </>
    );
}
