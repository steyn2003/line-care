import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Check, HelpCircle, Sparkles, X } from 'lucide-react';

export default function Prijzen({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const plans = [
        {
            name: 'Starter',
            description:
                'Voor kleine teams die beginnen met gestructureerd onderhoud',
            price: 'EUR 49',
            period: '/maand',
            users: 'Tot 5 gebruikers',
            featured: false,
            cta: 'Start gratis trial',
            ctaVariant: 'outline' as const,
            includes: [
                'Onbeperkte machines & locaties',
                'Storingsregistratie & werkorders',
                'Periodiek onderhoud met automatische werkorders',
                'Dashboard & basisrapportages',
                'Mobiele toegang',
                'CSV import',
                'Email support',
            ],
            excludes: [
                'Reserveonderdelen beheer',
                'OEE tracking',
                'Kostenbeheer',
            ],
        },
        {
            name: 'Professional',
            description: 'Compleet pakket met voorraad, OEE en kosten',
            price: 'EUR 149',
            period: '/maand',
            users: 'Tot 15 gebruikers',
            featured: true,
            cta: 'Start gratis trial',
            ctaVariant: 'default' as const,
            includes: [
                'Alles van Starter, plus:',
                'Reserveonderdelen & voorraad',
                'Onderdelen catalogus met categorieen',
                'Automatische herbestelmeldingen',
                'Inkooporders & leveranciersbeheer',
                'OEE tracking',
                'Productieruns & stilstandregistratie',
                'OEE dashboard & trends',
                'Kostenbeheer',
                'Arbeids-, onderdeel- & stilstandkosten',
                'Budget tracking',
                'Prioriteit support',
                'Maandelijkse check-in call',
            ],
            excludes: [],
        },
        {
            name: 'Enterprise',
            description: 'Met integraties, analytics en aangepaste dashboards',
            price: 'Op maat',
            period: '',
            users: 'Vanaf 16 gebruikers',
            featured: false,
            cta: 'Neem contact op',
            ctaVariant: 'outline' as const,
            includes: [
                'Alles van Professional, plus:',
                'Onbeperkte gebruikers',
                'ERP integraties',
                'SAP, Oracle, NetSuite, Dynamics, Odoo',
                'IoT sensor integratie',
                'Real-time machine monitoring',
                'Automatische alerts bij afwijkingen',
                'Geavanceerde analytics',
                'MTBF, MTTR, Pareto analyse',
                'Storingsvoorspellingen',
                'Aangepaste dashboards',
                'Leveranciersportaal',
                'Dedicated support',
                'Training op locatie',
            ],
            excludes: [],
        },
    ];

    const comparisonFeatures = [
        {
            name: 'Gebruikers',
            starter: 'Tot 5',
            professional: 'Tot 15',
            enterprise: 'Onbeperkt',
        },
        {
            name: 'Machines & locaties',
            starter: true,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Werkorders & storingen',
            starter: true,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Periodiek onderhoud',
            starter: true,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Dashboard & rapportages',
            starter: 'Basis',
            professional: 'Uitgebreid',
            enterprise: 'Aangepast',
        },
        {
            name: 'Reserveonderdelen beheer',
            starter: false,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Inkooporders & leveranciers',
            starter: false,
            professional: true,
            enterprise: true,
        },
        {
            name: 'OEE tracking',
            starter: false,
            professional: true,
            enterprise: true,
        },
        {
            name: 'Kostenbeheer & budget',
            starter: false,
            professional: true,
            enterprise: true,
        },
        {
            name: 'ERP integraties',
            starter: false,
            professional: false,
            enterprise: true,
        },
        {
            name: 'IoT sensor integratie',
            starter: false,
            professional: false,
            enterprise: true,
        },
        {
            name: 'MTBF, MTTR, Pareto',
            starter: false,
            professional: false,
            enterprise: true,
        },
        {
            name: 'Storingsvoorspellingen',
            starter: false,
            professional: false,
            enterprise: true,
        },
        {
            name: 'Leveranciersportaal',
            starter: false,
            professional: false,
            enterprise: true,
        },
        {
            name: 'Support',
            starter: 'Email',
            professional: 'Prioriteit',
            enterprise: 'Dedicated',
        },
    ];

    const faqs = [
        {
            question: 'Wat telt als een gebruiker?',
            answer: 'Elke persoon die inlogt in LineCare telt als gebruiker. Of dat nu een operator is die storingen meldt, een monteur die werk uitvoert, of een manager die rapportages bekijkt.',
        },
        {
            question: 'Kan ik beginnen met een pilot?',
            answer: 'Ja! We raden aan om te starten met een pilot van 3 maanden. Vaak bieden we een voordeeltarief voor de eerste 3 maanden, zodat je LineCare kunt uitproberen zonder grote investering.',
        },
        {
            question: 'Kan ik later upgraden naar een hoger pakket?',
            answer: 'Absoluut. Je kunt op elk moment upgraden naar een hoger pakket. Alle data blijft behouden en je krijgt direct toegang tot de extra functies. We rekenen vanaf dat moment het nieuwe tarief.',
        },
        {
            question: 'Zijn er setup kosten?',
            answer: 'Nee, er zijn geen setup kosten voor Starter en Professional. Je betaalt alleen het maandelijkse abonnement. Voor Enterprise kan een eenmalige implementatiefee van toepassing zijn voor complexe integraties.',
        },
        {
            question: 'Kan ik opzeggen wanneer ik wil?',
            answer: 'Ja, je kunt op elk moment opzeggen. Er zit geen minimum contractduur aan. We geloven dat je moet blijven omdat LineCare goed werkt, niet omdat je vast zit.',
        },
        {
            question:
                'Welk pakket raden jullie aan voor een fabriek met 40 medewerkers?',
            answer: 'Voor een fabriek met 40 medewerkers raden we Professional aan. Je hebt waarschijnlijk 8-12 gebruikers (operators, monteurs, managers) en wilt grip op voorraad, OEE en kosten. Als je ook ERP/IoT integraties nodig hebt, kijk naar Enterprise.',
        },
        {
            question: 'Is mijn data veilig?',
            answer: 'Absoluut. We hosten LineCare op beveiligde servers in Europa. Alle data is geencrypteerd en volledig geisoleerd per bedrijf. Dagelijkse backups zorgen dat je nooit data verliest.',
        },
    ];

    return (
        <MarketingLayout
            title="Prijzen - LineCare"
            canRegister={canRegister}
            currentPath="/prijzen"
        >
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge
                            variant="secondary"
                            className="mb-6 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 backdrop-blur-sm"
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            Transparante prijzen
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Eenvoudige,{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                eerlijke prijzen
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Geen verrassingen, geen verborgen kosten. Kies het
                            pakket dat past bij jouw fabriek en groei mee als je
                            meer nodig hebt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`relative flex flex-col ${
                                    plan.featured
                                        ? 'border-2 border-primary shadow-xl'
                                        : 'border-border/50'
                                }`}
                            >
                                {plan.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="px-4 py-1">
                                            Meest gekozen
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col">
                                    <div className="mb-6">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold">
                                                {plan.price}
                                            </span>
                                            <span className="ml-1 text-muted-foreground">
                                                {plan.period}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {plan.users}
                                        </p>
                                    </div>

                                    <Link
                                        href={
                                            plan.name === 'Enterprise'
                                                ? '/#demo'
                                                : '/trial'
                                        }
                                        className="mb-6"
                                    >
                                        <Button
                                            className="w-full"
                                            variant={plan.ctaVariant}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>

                                    <div className="flex-1 space-y-4">
                                        <ul className="space-y-3">
                                            {plan.includes.map((feature, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                                    <span
                                                        className={`text-sm ${i === 0 && index > 0 ? 'font-semibold' : ''}`}
                                                    >
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {plan.excludes.length > 0 && (
                                            <>
                                                <p className="pt-2 text-sm font-semibold text-muted-foreground">
                                                    Niet inbegrepen:
                                                </p>
                                                <ul className="space-y-2">
                                                    {plan.excludes.map(
                                                        (feature, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-2 text-muted-foreground"
                                                            >
                                                                <X className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                                                <span className="text-sm">
                                                                    {feature}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Vergelijking
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Vergelijk pakketten
                        </h2>
                    </div>

                    <div className="mt-12 overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-4 text-left font-medium">
                                        Functie
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Starter
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Professional
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Enterprise
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {comparisonFeatures.map((feature, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {feature.name}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {typeof feature.starter ===
                                            'boolean' ? (
                                                feature.starter ? (
                                                    <Check className="mx-auto h-5 w-5 text-primary" />
                                                ) : (
                                                    <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                                )
                                            ) : (
                                                <span className="text-sm">
                                                    {feature.starter}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {typeof feature.professional ===
                                            'boolean' ? (
                                                feature.professional ? (
                                                    <Check className="mx-auto h-5 w-5 text-primary" />
                                                ) : (
                                                    <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                                )
                                            ) : (
                                                <span className="text-sm">
                                                    {feature.professional}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {typeof feature.enterprise ===
                                            'boolean' ? (
                                                feature.enterprise ? (
                                                    <Check className="mx-auto h-5 w-5 text-primary" />
                                                ) : (
                                                    <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                                )
                                            ) : (
                                                <span className="text-sm">
                                                    {feature.enterprise}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            FAQ
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Veelgestelde vragen over prijzen
                        </h2>
                    </div>

                    <div className="mx-auto mt-12 max-w-3xl space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index}>
                                <div className="mb-2 flex items-start gap-3">
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <HelpCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">
                                        {faq.question}
                                    </h3>
                                </div>
                                <p className="ml-9 text-sm text-muted-foreground">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-primary/10" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Klaar om te starten?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Start vandaag nog met een gratis trial van 14 dagen.
                            Geen creditcard nodig.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/trial">
                                <Button size="lg" className="h-12 px-8">
                                    Start gratis trial
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/#demo">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8"
                                >
                                    Plan een demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
