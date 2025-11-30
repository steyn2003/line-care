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
import { Check, HelpCircle, X } from 'lucide-react';

export default function Prijzen({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <MarketingLayout
            title="Prijzen - LineCare"
            canRegister={canRegister}
            currentPath="/prijzen"
        >
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Eenvoudige, transparante prijzen
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                            Geen verrassingen, geen verborgen kosten. Kies het
                            pakket dat past bij jouw fabriek en groei mee als je
                            meer nodig hebt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Starter */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Starter
                                </CardTitle>
                                <CardDescription>
                                    Voor kleine teams die beginnen met
                                    gestructureerd onderhoud
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <div className="mb-2 text-4xl font-bold">
                                        EUR 49
                                        <span className="text-lg font-normal text-muted-foreground">
                                            /maand
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Tot 5 gebruikers
                                    </p>
                                </div>
                                <Link href="/trial">
                                    <Button
                                        className="mb-6 w-full"
                                        variant="outline"
                                    >
                                        Start gratis trial
                                    </Button>
                                </Link>
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold">
                                        Basis onderhoudsbeheer:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Onbeperkte machines & locaties
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Storingsregistratie & werkorders
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Periodiek onderhoud met
                                                automatische werkorders
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Dashboard & basisrapportages
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Mobiele toegang
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                CSV import
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Email support
                                            </span>
                                        </li>
                                    </ul>
                                    <p className="pt-2 text-sm font-semibold text-muted-foreground">
                                        Niet inbegrepen:
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-muted-foreground">
                                            <X className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                Reserveonderdelen beheer
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-muted-foreground">
                                            <X className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                OEE tracking
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-muted-foreground">
                                            <X className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                Kostenbeheer
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional (Featured) */}
                        <Card className="border-primary shadow-lg">
                            <div className="rounded-t-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                                Meest gekozen
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Professional
                                </CardTitle>
                                <CardDescription>
                                    Compleet pakket met voorraad, OEE en kosten
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <div className="mb-2 text-4xl font-bold">
                                        EUR 149
                                        <span className="text-lg font-normal text-muted-foreground">
                                            /maand
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Tot 15 gebruikers
                                    </p>
                                </div>
                                <Link href="/trial">
                                    <Button className="mb-6 w-full">
                                        Start gratis trial
                                    </Button>
                                </Link>
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold">
                                        Alles van Starter, plus:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                Reserveonderdelen & voorraad
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Onderdelen catalogus met
                                                categorieen
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Automatische herbestelmeldingen
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Inkooporders &
                                                leveranciersbeheer
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                OEE tracking
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Productieruns &
                                                stilstandregistratie
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                OEE dashboard & trends
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                Kostenbeheer
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Arbeids-, onderdeel- &
                                                stilstandkosten
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Budget tracking
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Prioriteit support
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Maandelijkse check-in call
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Enterprise */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Enterprise
                                </CardTitle>
                                <CardDescription>
                                    Met integraties, analytics en aangepaste
                                    dashboards
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <div className="mb-2 text-4xl font-bold">
                                        Op maat
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Vanaf 16 gebruikers
                                    </p>
                                </div>
                                <Link href="/#demo">
                                    <Button
                                        className="mb-6 w-full"
                                        variant="outline"
                                    >
                                        Neem contact op
                                    </Button>
                                </Link>
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold">
                                        Alles van Professional, plus:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Onbeperkte gebruikers
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                ERP integraties
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                SAP, Oracle, NetSuite, Dynamics,
                                                Odoo
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                IoT sensor integratie
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Real-time machine monitoring
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Automatische alerts bij
                                                afwijkingen
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                Geavanceerde analytics
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                MTBF, MTTR, Pareto analyse
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Storingsvoorspellingen
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-medium">
                                                Aangepaste dashboards
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Leveranciersportaal
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Dedicated support
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Training op locatie
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-center text-3xl font-bold">
                        Vergelijk pakketten
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Functie
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Starter
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Professional
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Enterprise
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Gebruikers
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Tot 5
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Tot 15
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Onbeperkt
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Machines & locaties
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Werkorders & storingen
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Periodiek onderhoud
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Dashboard & rapportages
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Basis
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Uitgebreid
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Aangepast
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Reserveonderdelen beheer
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Inkooporders & leveranciers
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        OEE tracking
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Kostenbeheer & budget
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        ERP integraties
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        IoT sensor integratie
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        MTBF, MTTR, Pareto
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Storingsvoorspellingen
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Leveranciersportaal
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Check className="mx-auto h-5 w-5 text-primary" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">
                                        Support
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Email
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Prioriteit
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Dedicated
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-center text-3xl font-bold">
                        Veelgestelde vragen over prijzen
                    </h2>
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Wat telt als een gebruiker?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Elke persoon die inlogt in LineCare telt als
                                gebruiker. Of dat nu een operator is die
                                storingen meldt, een monteur die werk uitvoert,
                                of een manager die rapportages bekijkt.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Kan ik beginnen met een pilot?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Ja! We raden aan om te starten met een pilot van
                                3 maanden. Vaak bieden we een voordeeltarief
                                voor de eerste 3 maanden, zodat je LineCare kunt
                                uitproberen zonder grote investering.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Kan ik later upgraden naar een hoger pakket?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Absoluut. Je kunt op elk moment upgraden naar
                                een hoger pakket. Alle data blijft behouden en
                                je krijgt direct toegang tot de extra functies.
                                We rekenen vanaf dat moment het nieuwe tarief.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Zijn er setup kosten?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Nee, er zijn geen setup kosten voor Starter en
                                Professional. Je betaalt alleen het maandelijkse
                                abonnement. Voor Enterprise kan een eenmalige
                                implementatiefee van toepassing zijn voor
                                complexe integraties.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Kan ik opzeggen wanneer ik wil?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Ja, je kunt op elk moment opzeggen. Er zit geen
                                minimum contractduur aan. We geloven dat je moet
                                blijven omdat LineCare goed werkt, niet omdat je
                                vast zit.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Welk pakket raden jullie aan voor een
                                    fabriek met 40 medewerkers?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Voor een fabriek met 40 medewerkers raden we
                                Professional aan. Je hebt waarschijnlijk 8-12
                                gebruikers (operators, monteurs, managers) en
                                wilt grip op voorraad, OEE en kosten. Als je ook
                                ERP/IoT integraties nodig hebt, kijk naar
                                Enterprise.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 flex items-start gap-2">
                                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Is mijn data veilig?
                                </h3>
                            </div>
                            <p className="ml-7 text-sm text-muted-foreground">
                                Absoluut. We hosten LineCare op beveiligde
                                servers in Europa. Alle data is geencrypteerd en
                                volledig geisoleerd per bedrijf. Dagelijkse
                                backups zorgen dat je nooit data verliest.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold">
                        Klaar om te starten?
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Start vandaag nog met een gratis trial van 14 dagen.
                        Geen creditcard nodig.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/trial">
                            <Button size="lg">Start gratis trial</Button>
                        </Link>
                        <Link href="/#demo">
                            <Button size="lg" variant="outline">
                                Plan een demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
