import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock,
    Gauge,
    LineChart,
    PieChart,
    Target,
    TrendingUp,
    Users,
    Wrench,
    XCircle,
    Zap,
} from 'lucide-react';

export default function OEE({ canRegister = true }: { canRegister?: boolean }) {
    return (
        <MarketingLayout
            title="OEE Tracking - LineCare"
            canRegister={canRegister}
            currentPath="/oee"
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
                            <Gauge className="mr-2 h-3.5 w-3.5" />
                            Overall Equipment Effectiveness
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            OEE Tracking voor{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                kleine fabrieken
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Meet hoe effectief je machines echt draaien. Begrijp
                            waar productieverlies zit en verbeter gericht.
                            Zonder complexe systemen of dure consultants.
                        </p>
                        <div className="mt-10">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Start met OEE meten
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is OEE */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Uitleg
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Wat is OEE?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            OEE (Overall Equipment Effectiveness) is de
                            standaard om machine-effectiviteit te meten. Het
                            combineert drie factoren tot een percentage.
                        </p>
                    </div>

                    {/* OEE Formula */}
                    <Card className="mx-auto mt-12 max-w-4xl border-2">
                        <CardContent className="p-8">
                            <div className="mb-8 text-center">
                                <p className="mb-4 text-xl font-semibold">
                                    OEE = Beschikbaarheid x Prestatie x
                                    Kwaliteit
                                </p>
                                <p className="text-muted-foreground">
                                    Voorbeeld: 90% x 85% x 98% ={' '}
                                    <span className="font-bold text-primary">
                                        75% OEE
                                    </span>
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                        <Clock className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Beschikbaarheid
                                    </h3>
                                    <p className="mb-2 text-3xl font-bold text-blue-600">
                                        90%
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Hoeveel % van de geplande tijd draait de
                                        machine daadwerkelijk?
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Verlies: storingen, omstellen, wachten
                                    </p>
                                </div>

                                <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Zap className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Prestatie
                                    </h3>
                                    <p className="mb-2 text-3xl font-bold text-green-600">
                                        85%
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Hoeveel % van de theoretische snelheid
                                        haalt de machine?
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Verlies: korte stops, langzamer draaien
                                    </p>
                                </div>

                                <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                        <Target className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Kwaliteit
                                    </h3>
                                    <p className="mb-2 text-3xl font-bold text-purple-600">
                                        98%
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Hoeveel % van de output is direct goed
                                        (geen uitval/herwerk)?
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Verlies: defecten, herwerk,
                                        opstartverlies
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benchmarks */}
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <Card className="border-2 border-red-200 bg-red-50/50">
                            <CardContent className="p-6 text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {'<'} 60%
                                </p>
                                <p className="mt-2 font-semibold text-red-700">
                                    Veel ruimte voor verbetering
                                </p>
                                <p className="mt-1 text-sm text-red-600">
                                    Significante verliezen, urgente actie nodig
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-yellow-200 bg-yellow-50/50">
                            <CardContent className="p-6 text-center">
                                <p className="text-3xl font-bold text-yellow-600">
                                    60-85%
                                </p>
                                <p className="mt-2 font-semibold text-yellow-700">
                                    Typisch voor veel fabrieken
                                </p>
                                <p className="mt-1 text-sm text-yellow-600">
                                    Goede basis, gerichte verbeteringen mogelijk
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-green-200 bg-green-50/50">
                            <CardContent className="p-6 text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {'>'} 85%
                                </p>
                                <p className="mt-2 font-semibold text-green-700">
                                    World-class performance
                                </p>
                                <p className="mt-1 text-sm text-green-600">
                                    Excellente prestaties, fijntunen
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How LineCare calculates OEE */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Werkwijze
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Hoe LineCare OEE berekent
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Geen complexe sensoren nodig. LineCare berekent OEE
                            op basis van productieruns en stilstandregistraties.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-4">
                        {[
                            {
                                step: '1',
                                icon: Activity,
                                title: 'Start productierun',
                                description:
                                    'Operator start run: selecteer machine, product, ploeg. LineCare berekent theoretische output op basis van cyclustijd.',
                            },
                            {
                                step: '2',
                                icon: XCircle,
                                title: 'Registreer stilstand',
                                description:
                                    'Bij stilstand: log start/eind en categorie (storing, omstellen, wachten, pauze). LineCare telt ongeplande stilstand mee.',
                            },
                            {
                                step: '3',
                                icon: CheckCircle2,
                                title: 'Einde run: output invoeren',
                                description:
                                    'Bij einde run: voer werkelijke output in, plus aantal goede stuks vs. defecten. LineCare berekent de drie OEE-factoren.',
                            },
                            {
                                step: '4',
                                icon: Gauge,
                                title: 'OEE automatisch berekend',
                                description:
                                    'LineCare berekent: Beschikbaarheid (tijd), Prestatie (snelheid), Kwaliteit (uitval). Resultaat: OEE percentage per run.',
                            },
                        ].map((item, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        {item.step}
                                    </div>
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* OEE Features */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Functies
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            OEE functionaliteiten
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Alles wat je nodig hebt om OEE te meten, analyseren
                            en verbeteren.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Gauge,
                                title: 'Real-time OEE dashboard',
                                description:
                                    'Live OEE-weergave tijdens productie. Gauges voor beschikbaarheid, prestatie, kwaliteit. Ideaal voor schermen op de werkvloer.',
                            },
                            {
                                icon: LineChart,
                                title: 'OEE trends over tijd',
                                description:
                                    'Bekijk OEE per dag, week, maand. Spot verbeteringen of achteruitgang. Filter op machine, product of ploeg.',
                            },
                            {
                                icon: BarChart3,
                                title: 'Machine vergelijking',
                                description:
                                    'Vergelijk OEE tussen machines. Identificeer top-performers en achterblijvers. Leer van de beste.',
                            },
                            {
                                icon: PieChart,
                                title: 'Verlies analyse',
                                description:
                                    'Pareto van verliesoorzaken. Zie direct wat de grootste impact heeft: storingen, omstellen, snelheidsverlies of defecten.',
                            },
                            {
                                icon: Users,
                                title: 'Ploegen vergelijken',
                                description:
                                    'Definieer ploegen (dag/avond/nacht). Koppel productieruns aan shifts. Vergelijk OEE tussen teams.',
                            },
                            {
                                icon: Wrench,
                                title: 'Link met werkorders',
                                description:
                                    'Stilstand door storing? Klik door naar de werkorder. Zie wat de oorzaak was en hoe het is opgelost.',
                            },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Voordelen
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Waarom OEE meten?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            OEE geeft je de data om slimmer te investeren in
                            verbeteringen.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        {[
                            {
                                title: 'Identificeer verborgen capaciteit',
                                description:
                                    'Veel fabrieken hebben 20-30% verborgen capaciteit. OEE maakt dit zichtbaar zodat je kunt verbeteren zonder nieuwe machines.',
                            },
                            {
                                title: 'Prioriteer verbeteringen',
                                description:
                                    'Is het beschikbaarheid, prestatie of kwaliteit? OEE laat zien waar de grootste winst zit zodat je niet in het duister tast.',
                            },
                            {
                                title: 'Meet het effect van acties',
                                description:
                                    'Nieuwe procedure ingevoerd? Machine gereviseerd? OEE laat zien of het echt werkt met harde cijfers.',
                            },
                            {
                                title: 'Onderbouw investeringen',
                                description:
                                    '"Machine X heeft 65% OEE door storingen, vervanging levert EUR 50K/jaar op." Data die de directie begrijpt.',
                            },
                            {
                                title: 'Gemeenschappelijke taal',
                                description:
                                    'OEE is een wereldwijde standaard. Productie, TD en management spreken dezelfde taal over machine-effectiviteit.',
                            },
                            {
                                title: 'Continue verbetering',
                                description:
                                    'OEE is de basis voor Lean Manufacturing. Kleine verbeteringen stapelen op tot grote resultaten.',
                            },
                        ].map((benefit, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Results */}
            <section className="border-y py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Resultaten
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Typische resultaten
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Wat fabrieken bereiken na 6 maanden OEE meten met
                            LineCare.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: TrendingUp,
                                value: '+15%',
                                label: 'OEE verbetering',
                                description:
                                    'Gemiddelde stijging door gerichte acties op basis van OEE-data',
                            },
                            {
                                icon: Clock,
                                value: '-30%',
                                label: 'Minder ongeplande stilstand',
                                description:
                                    'Door inzicht in storingsoorzaken en preventieve acties',
                            },
                            {
                                icon: Target,
                                value: '-20%',
                                label: 'Minder uitval',
                                description:
                                    'Door focus op kwaliteitsverliezen en rootcause analyse',
                            },
                        ].map((stat, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-8">
                                    <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <stat.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="mb-2 text-4xl font-bold text-primary">
                                        {stat.value}
                                    </p>
                                    <p className="font-semibold">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {stat.description}
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
                            Klaar om OEE te meten?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Start met een demo en zie hoe LineCare OEE tracking
                            simpel maakt. Geen complexe implementatie, binnen
                            dagen operationeel.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Plan een demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/functionaliteiten">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8"
                                >
                                    Alle functionaliteiten
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
