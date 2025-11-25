import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function MarketingFooter() {
    const { t } = useTranslation('marketing');

    return (
        <footer className="border-t bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">LineCare</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('footer.tagline')}
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.product')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/oplossing">
                                    {t('nav.solution')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/functionaliteiten">
                                    {t('nav.features')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/prijzen">{t('nav.pricing')}</Link>
                            </li>
                            <li>
                                <a href="/#demo">{t('footer.request_demo')}</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.company')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/voor-wie">{t('nav.for_who')}</Link>
                            </li>
                            <li>
                                <Link href="/over-ons">{t('nav.about')}</Link>
                            </li>
                            <li>
                                <a href="/#demo">{t('footer.contact')}</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">
                            {t('footer.legal')}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#">{t('footer.privacy')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    {t('footer.copyright')}
                </div>
            </div>
        </footer>
    );
}
