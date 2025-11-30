import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function MarketingFooter() {
    const { t } = useTranslation('marketing');

    return (
        <footer className="border-t bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-lg font-semibold">LineCare</h3>
                        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                            {t('footer.tagline')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Compleet CMMS voor kleine fabrieken: werkorders,
                            reserveonderdelen, OEE tracking en kostenbeheer.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.product')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/oplossing"
                                    className="hover:text-foreground"
                                >
                                    {t('nav.solution')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/functionaliteiten"
                                    className="hover:text-foreground"
                                >
                                    {t('nav.features')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/oee"
                                    className="hover:text-foreground"
                                >
                                    OEE Tracking
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/integraties"
                                    className="hover:text-foreground"
                                >
                                    Integraties
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/prijzen"
                                    className="hover:text-foreground"
                                >
                                    {t('nav.pricing')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.company')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/voor-wie"
                                    className="hover:text-foreground"
                                >
                                    {t('nav.for_who')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/over-ons"
                                    className="hover:text-foreground"
                                >
                                    {t('nav.about')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="/#demo"
                                    className="hover:text-foreground"
                                >
                                    {t('footer.contact')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#demo"
                                    className="hover:text-foreground"
                                >
                                    {t('footer.request_demo')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.legal')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    {t('footer.privacy')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Algemene voorwaarden
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground">
                                    Cookie beleid
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        {t('footer.copyright')}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Made in the Netherlands</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
