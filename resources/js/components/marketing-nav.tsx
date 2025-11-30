import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface MarketingNavProps {
    canRegister?: boolean;
    currentPath?: string;
}

export function MarketingNav({
    canRegister = true,
    currentPath = '/',
}: MarketingNavProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation('marketing');

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: '/oplossing', label: t('nav.solution') },
        { href: '/functionaliteiten', label: t('nav.features') },
        { href: '/oee', label: 'OEE' },
        { href: '/integraties', label: 'Integraties' },
        { href: '/prijzen', label: t('nav.pricing') },
        { href: '/over-ons', label: t('nav.about') },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/">
                            <h2 className="text-2xl font-bold text-primary">
                                LineCare
                            </h2>
                        </Link>
                        <div className="hidden items-center gap-6 md:flex">
                            {navLinks.slice(1).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${
                                        currentPath === link.href
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button variant="default" size="sm">
                                    {t('nav.dashboard')}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm">
                                        {t('nav.login')}
                                    </Button>
                                </Link>
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button size="sm">
                                            {t('nav.try_free')}
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
