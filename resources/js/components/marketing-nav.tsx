import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketingNavProps {
    canRegister?: boolean;
    currentPath?: string;
}

export function MarketingNav({ currentPath = '/' }: MarketingNavProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation('marketing');

    const navLinks = [
        { href: '/oplossing', label: t('nav.solution') },
        { href: '/functionaliteiten', label: t('nav.features') },
        { href: '/oee', label: 'OEE' },
        { href: '/integraties', label: 'Integraties' },
        { href: '/prijzen', label: t('nav.pricing') },
        { href: '/over-ons', label: t('nav.about') },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-sm font-bold text-primary-foreground">
                                    LC
                                </span>
                            </div>
                            <span className="text-xl font-bold">LineCare</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-1 lg:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                                        currentPath === link.href
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden items-center gap-3 lg:flex">
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button size="sm">{t('nav.dashboard')}</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm">
                                        {t('nav.login')}
                                    </Button>
                                </Link>
                                <Link href="/trial">
                                    <Button size="sm">
                                        {t('nav.try_free', 'Gratis proberen')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px]">
                                <div className="flex flex-col gap-6 pt-6">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                            <span className="text-sm font-bold text-primary-foreground">
                                                LC
                                            </span>
                                        </div>
                                        <span className="text-xl font-bold">
                                            LineCare
                                        </span>
                                    </Link>

                                    <nav className="flex flex-col gap-1">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                                                    currentPath === link.href
                                                        ? 'bg-accent text-accent-foreground'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    <div className="flex flex-col gap-2 border-t pt-6">
                                        {auth.user ? (
                                            <Link href={dashboard()}>
                                                <Button className="w-full">
                                                    {t('nav.dashboard')}
                                                </Button>
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href={login()}>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        {t('nav.login')}
                                                    </Button>
                                                </Link>
                                                <Link href="/trial">
                                                    <Button className="w-full">
                                                        {t(
                                                            'nav.try_free',
                                                            'Gratis proberen',
                                                        )}
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
