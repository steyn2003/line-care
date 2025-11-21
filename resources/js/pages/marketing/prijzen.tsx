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
import { Check, HelpCircle } from 'lucide-react';

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
                                Geen verrassingen, geen verborgen kosten. Betaal alleen
                                voor wat je gebruikt.
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
                                    <CardTitle className="text-2xl">Starter</CardTitle>
                                    <CardDescription>
                                        Voor kleine teams die beginnen met gestructureerd
                                        onderhoud
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <div className="mb-2 text-4xl font-bold">
                                            €49
                                            <span className="text-lg font-normal text-muted-foreground">
                                                /maand
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Tot 5 gebruikers
                                        </p>
                                    </div>
                                    <Link href="/#demo">
                                        <Button className="mb-6 w-full" variant="outline">
                                            Start pilot
                                        </Button>
                                    </Link>
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
                                                Periodiek onderhoud
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Dashboard & rapportages
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
                                            <span className="text-sm">CSV import</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Email support
                                            </span>
                                        </li>
                                    </ul>
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
                                        Voor groeiende fabrieken met meer gebruikers
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <div className="mb-2 text-4xl font-bold">
                                            €99
                                            <span className="text-lg font-normal text-muted-foreground">
                                                /maand
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Tot 15 gebruikers
                                        </p>
                                    </div>
                                    <Link href="/#demo">
                                        <Button className="mb-6 w-full">
                                            Start pilot
                                        </Button>
                                    </Link>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-semibold">
                                                Alles van Starter, plus:
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Meer gebruikers (tot 15)
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
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Export naar Excel
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Data backup & archivering
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Enterprise */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                                    <CardDescription>
                                        Voor grote fabrieken met custom behoeften
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
                                        <Button className="mb-6 w-full" variant="outline">
                                            Neem contact op
                                        </Button>
                                    </Link>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm font-semibold">
                                                Alles van Professional, plus:
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Onbeperkte gebruikers
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
                                                Custom integraties (API)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                On-premise optie mogelijk
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">
                                                Training op locatie
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Veelgestelde vragen over prijzen
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <div className="mb-2 flex items-start gap-2">
                                    <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">
                                        Wat telt als een gebruiker?
                                    </h3>
                                </div>
                                <p className="ml-7 text-sm text-muted-foreground">
                                    Elke persoon die inlogt in LineCare telt als
                                    gebruiker. Of dat nu een operator is die storingen
                                    meldt, een monteur die werk uitvoert, of een manager
                                    die rapportages bekijkt.
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
                                    Ja! We raden aan om te starten met een pilot van 3
                                    maanden. Vaak bieden we een voordeeltarief voor de
                                    eerste 3 maanden, zodat je LineCare kunt uitproberen
                                    zonder grote investering.
                                </p>
                            </div>
                            <div>
                                <div className="mb-2 flex items-start gap-2">
                                    <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">
                                        Wat gebeurt er als we meer gebruikers nodig hebben?
                                    </h3>
                                </div>
                                <p className="ml-7 text-sm text-muted-foreground">
                                    Je kunt op elk moment upgraden naar een hoger plan.
                                    We rekenen dan vanaf dat moment het nieuwe tarief. Je
                                    hoeft nooit te wachten tot het einde van de maand.
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
                                    Nee, er zijn geen setup kosten. Je betaalt alleen het
                                    maandelijkse abonnement. Ook het importeren van je
                                    machines via CSV is gratis.
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
                                    blijven omdat LineCare goed werkt, niet omdat je vast
                                    zit.
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
                                    Absoluut. We hosten LineCare op beveiligde servers in
                                    Europa. Alle data is geëncrypteerd en volledig
                                    geïsoleerd per bedrijf. Dagelijkse backups zorgen dat
                                    je nooit data verliest.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-3xl font-bold">
                            Klaar om te starten?
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Plan een demo en zie of LineCare past bij jouw fabriek.
                            Geen verplichtingen.
                        </p>
                        <Link href="/#demo">
                            <Button size="lg">Plan een demo</Button>
                        </Link>
                    </div>
                </section>

        </MarketingLayout>
    );
}
