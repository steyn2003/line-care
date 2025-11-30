import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Mail, MessageCircle, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Props {
    company: {
        name: string;
        trial_ends_at: string | null;
    };
}

export default function TrialExpired({ company }: Props) {
    const { t } = useTranslation('trial');

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title={t('expired.head_title', 'Trial verlopen')} />

            <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6">
                <div className="mb-8">
                    <AppLogoIcon className="size-12 fill-current text-foreground" />
                </div>

                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-xl">
                            {t('expired.title', 'Je proefperiode is verlopen')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'expired.description',
                                'Je trial van LineCare is op {{date}} geëindigd.',
                                { date: formatDate(company.trial_ends_at) },
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-center text-sm text-muted-foreground">
                            {t(
                                'expired.data_safe',
                                'Je data blijft veilig bewaard. Neem contact met ons op om je account te activeren en verder te gaan waar je gebleven was.',
                            )}
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button asChild>
                                <a href="mailto:sales@linecare.nl">
                                    <Mail className="mr-2 h-4 w-4" />
                                    {t('expired.contact_email', 'Neem contact op')}
                                </a>
                            </Button>

                            <Button variant="outline" asChild>
                                <a
                                    href="https://wa.me/31612345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    {t('expired.contact_whatsapp', 'WhatsApp')}
                                </a>
                            </Button>

                            <Button variant="ghost" asChild>
                                <Link href="/logout" method="post" as="button">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('expired.logout', 'Uitloggen')}
                                </Link>
                            </Button>
                        </div>

                        <div className="rounded-lg bg-muted p-4">
                            <h4 className="mb-2 text-sm font-medium">
                                {t('expired.what_you_get', 'Wat je krijgt met een abonnement:')}
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>
                                    {t('expired.benefit_1', 'Volledige toegang tot alle functies')}
                                </li>
                                <li>
                                    {t('expired.benefit_2', 'Onbeperkt aantal gebruikers')}
                                </li>
                                <li>
                                    {t('expired.benefit_3', 'Prioriteit support')}
                                </li>
                                <li>
                                    {t('expired.benefit_4', 'Automatische updates')}
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    {company.name}
                </p>
            </div>
        </>
    );
}
