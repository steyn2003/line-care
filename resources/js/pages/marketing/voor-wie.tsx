import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Factory,
    Settings,
    Users,
    Wrench,
    X,
} from 'lucide-react';

export default function VoorWie({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const problems = [
        {
            icon: X,
            title: 'Storingen via WhatsApp',
            problem:
                '"Machine 3 staat stil!" Operator appt naar de TD. Tien minuten later nog een storing. Over een week is niemand meer welke machine wat had.',
            result: 'Informatie verdwijnt in berichtenstroom',
        },
        {
            icon: X,
            title: 'Excel met periodiek onderhoud',
            problem:
                'Er is een Excel-lijst met "Wanneer moet wat gebeuren". Maar die ligt op iemands computer, wordt nooit bijgewerkt, en niemand kijkt ernaar.',
            result: 'Preventief werk wordt vergeten',
        },
        {
            icon: X,
            title: 'Whiteboard voor planning',
            problem:
                'TD schrijft op het whiteboard wat deze week moet gebeuren. Over een maand is die informatie uitgewist en weet niemand meer wat er is gebeurd.',
            result: 'Geen geschiedenis, geen leren van fouten',
        },
        {
            icon: X,
            title: 'Kennis in iemands hoofd',
            problem:
                'De hoofd-monteur weet alles: welke machine vaak uitvalt, wat de oplossing is, wanneer periodiek onderhoud moet. Maar als hij weg is, is die kennis ook weg.',
            result: 'Kwetsbaar, niet schaalbaar',
        },
    ];

    const cases = [
        {
            icon: Factory,
            title: 'Fabriek met 40 medewerkers',
            situation:
                'Metaalbewerking, 2 productielijnen, 15 machines. 1 hoofd TD met 2 monteurs. Operators melden storingen via WhatsApp, TD houdt Excel bij.',
            problem:
                '"We weten dat machine 5 vaak uitvalt, maar niet hoe vaak precies. Geen data voor nieuwe machine te rechtvaardigen bij directie."',
            benefits: [
                'Operators melden storing in 30 seconden via telefoon',
                'TD ziet direct: machine 5 heeft 12 storingen gehad, totaal 8 uur stilstand',
                'Data exporteren voor directie: investeringsvoorstel onderbouwd',
            ],
        },
        {
            icon: Building2,
            title: 'Familiebedrijf met 2 lijnen',
            situation:
                'Kunststof spuitgieten, 25 medewerkers, 2 productie lijnen. Eigenaar doet zelf veel TD werk, 1 fulltime monteur. Periodiek onderhoud wordt vaak vergeten.',
            problem:
                '"Als ik een week weg ben, gebeurt er geen preventief onderhoud. Alles zit in mijn hoofd. En als er een storing is, duurt het te lang voordat ik het hoor."',
            benefits: [
                'Periodiek onderhoud ingepland: elke 3 maanden automatisch werkorder',
                'Storingen worden direct gemeld in systeem, ook als eigenaar er niet is',
                'Kennis blijft behouden: wat was het probleem, hoe is het opgelost',
            ],
        },
    ];

    const reasons = [
        {
            icon: Users,
            title: 'Geen overbodige modules',
            description:
                'Grote CMMS-pakketten hebben modules voor energiemonitoring, spare parts tracking, shift planning, ERP integraties... die je nooit gebruikt. LineCare: alleen wat je echt nodig hebt.',
        },
        {
            icon: CheckCircle2,
            title: 'Setup in dagen, niet maanden',
            description:
                'Grote systemen kosten 6 maanden implementatie, consultants, training, aanpassingen. LineCare: machines importeren, gebruikers toevoegen, klaar.',
        },
        {
            icon: Wrench,
            title: 'Betaalbaar',
            description:
                'Enterprise CMMS kost EUR 10.000+ per jaar. LineCare begint bij EUR 49/maand. Geen setup kosten, geen verborgen prijzen.',
        },
        {
            icon: Settings,
            title: 'Geen IT-afdeling nodig',
            description:
                'LineCare draait in de cloud. Geen servers, geen updates, geen IT-configuratie. Log in en ga.',
        },
        {
            icon: Users,
            title: 'Simpel voor operators',
            description:
                'Geen wekenlange training nodig. Operators kunnen storing melden in 30 seconden. Werkt op telefoon, geen computer nodig.',
        },
        {
            icon: CheckCircle2,
            title: 'Start klein, groei mee',
            description:
                'Begin met 5 gebruikers, groei naar 15. Begin met 1 locatie, voeg er later meer toe. LineCare groeit mee.',
        },
    ];

    const personas = [
        {
            icon: Wrench,
            title: 'Hoofd Technische Dienst',
            description:
                'Minder tijd kwijt aan brandjes blussen en zoeken naar informatie. Meer tijd voor echt preventief werk.',
            quote: '"Eindelijk overzicht over wat er speelt."',
        },
        {
            icon: Settings,
            title: 'Productie Manager',
            description:
                'Data om te onderbouwen welke machines vervangen moeten worden. Inzicht in stilstand en kosten.',
            quote: '"Nu kan ik cijfers laten zien aan de directie."',
        },
        {
            icon: Building2,
            title: 'Eigenaar Maakbedrijf',
            description:
                'Professionaliseer onderhoud zonder grote investering. Begin klein, zie direct resultaat.',
            quote: '"Simpel, snel, en het werkt gewoon."',
        },
    ];

    return (
        <MarketingLayout
            title="Voor wie - LineCare"
            canRegister={canRegister}
            currentPath="/voor-wie"
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
                            <Factory className="mr-2 h-3.5 w-3.5" />
                            Voor kleine fabrieken
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Onderhoudssoftware voor{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Nederlandse maakbedrijven
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            LineCare is gemaakt voor Nederlandse maakbedrijven
                            met 10-150 medewerkers. Geen multinationals, geen
                            logge IT-projecten. Gewoon: simpel, snel, en dat het
                            werkt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Current Situation */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Herkenbaar?
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Herken je deze situatie?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            De meeste kleine fabrieken werken op dezelfde
                            manier: improviseren, brandjes blussen, en hopen dat
                            het goed gaat.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {problems.map((problem, index) => (
                            <Card
                                key={index}
                                className="border-destructive/20 bg-destructive/5 transition-all hover:border-destructive/40"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-lg bg-destructive/10 p-2.5">
                                        <problem.icon className="h-5 w-5 text-destructive" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        {problem.title}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {problem.problem}
                                    </p>
                                    <p className="text-sm font-medium">
                                        → {problem.result}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mini Cases */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Voorbeelden
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Voor wie is LineCare?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Kleine productiebedrijven die serieus werk doen,
                            maar geen logge IT willen.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 lg:grid-cols-2">
                        {cases.map((caseItem, index) => (
                            <Card key={index} className="border-2">
                                <CardContent className="p-8">
                                    <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                        <caseItem.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold">
                                        {caseItem.title}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-2 text-sm font-semibold">
                                                Situatie:
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {caseItem.situation}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm font-semibold">
                                                Probleem:
                                            </p>
                                            <p className="text-sm text-muted-foreground italic">
                                                {caseItem.problem}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm font-semibold">
                                                Met LineCare:
                                            </p>
                                            <ul className="space-y-2">
                                                {caseItem.benefits.map(
                                                    (benefit, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                            <span>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why for small factories */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Waarom LineCare
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Waarom speciaal voor kleine fabrieken?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            LineCare is bewust niet gebouwd voor multinationals.
                            Het is gemaakt voor jou.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reasons.map((reason, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <reason.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {reason.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {reason.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who uses it */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Gebruikers
                        </Badge>
                        <h2 className="mb-12 text-3xl font-bold tracking-tight">
                            Wie gebruikt LineCare?
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {personas.map((persona, index) => (
                            <Card
                                key={index}
                                className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
                            >
                                <CardContent className="p-8">
                                    <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                        <persona.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold">
                                        {persona.title}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {persona.description}
                                    </p>
                                    <p className="text-sm font-medium italic">
                                        {persona.quote}
                                    </p>
                                </CardContent>
                            </Card>
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
                            Klinkt dit als jouw fabriek?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Plan een demo en zie of LineCare past bij jouw
                            situatie. Geen verplichtingen, gewoon kijken.
                        </p>
                        <div className="mt-10">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Plan een demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
