import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { ArrowRight, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MarketingFooter() {
    const { t } = useTranslation('marketing');

    const productLinks = [
        { href: '/oplossing', label: t('nav.solution') },
        { href: '/functionaliteiten', label: t('nav.features') },
        { href: '/oee', label: 'OEE Tracking' },
        { href: '/integraties', label: 'Integraties' },
        { href: '/prijzen', label: t('nav.pricing') },
    ];

    const companyLinks = [
        { href: '/voor-wie', label: t('nav.for_who') },
        { href: '/over-ons', label: t('nav.about') },
        { href: '/#demo', label: t('footer.contact') },
        { href: '/#demo', label: t('footer.request_demo') },
    ];

    const legalLinks = [
        { href: '#', label: t('footer.privacy') },
        { href: '#', label: 'Algemene voorwaarden' },
        { href: '#', label: 'Cookie beleid' },
    ];

    return (
        <footer className="border-t bg-muted/30">
            {/* Newsletter Section */}
            <div className="border-b">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Blijf op de hoogte
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Ontvang tips over onderhoudsbeheer en
                                productupdates.
                            </p>
                        </div>
                        <form className="flex w-full max-w-md gap-2">
                            <Input
                                type="email"
                                placeholder="jouw@email.nl"
                                className="bg-background"
                            />
                            <Button type="submit">
                                Aanmelden
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-6">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-sm font-bold text-primary-foreground">
                                    LC
                                </span>
                            </div>
                            <span className="text-xl font-bold">LineCare</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                            {t('footer.tagline')}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Compleet CMMS voor kleine fabrieken: werkorders,
                            reserveonderdelen, OEE tracking en kostenbeheer.
                        </p>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Nederland</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <a
                                    href="mailto:info@linecare.nl"
                                    className="hover:text-foreground"
                                >
                                    info@linecare.nl
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <a
                                    href="tel:+31612345678"
                                    className="hover:text-foreground"
                                >
                                    +31 6 12345678
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-semibold">
                            {t('footer.product')}
                        </h4>
                        <ul className="mt-4 space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold">
                            {t('footer.company')}
                        </h4>
                        <ul className="mt-4 space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-sm font-semibold">
                            {t('footer.legal')}
                        </h4>
                        <ul className="mt-4 space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA Column */}
                    <div>
                        <h4 className="text-sm font-semibold">Aan de slag</h4>
                        <div className="mt-4 space-y-3">
                            <Link href="/trial">
                                <Button className="w-full" size="sm">
                                    Gratis proberen
                                </Button>
                            </Link>
                            <Link href="/#demo">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    size="sm"
                                >
                                    Demo aanvragen
                                </Button>
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold">Volg ons</h4>
                            <div className="mt-3 flex gap-2">
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span className="sr-only">LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-muted-foreground">
                            {t('footer.copyright')}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                                Alle systemen operationeel
                            </span>
                            <span>Made in the Netherlands</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
