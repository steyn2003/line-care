import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Bell,
    Box,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Gauge,
    Package,
    ShoppingCart,
    Smartphone,
    TrendingUp,
    Wrench,
} from 'lucide-react';

interface ScenarioStepProps {
    step: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

function ScenarioStep({
    step,
    icon: Icon,
    title,
    description,
}: ScenarioStepProps) {
    return (
        <Card className="border-border/50 bg-background/50 transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {step}
                </div>
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function Oplossing({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const scenarios = [
        {
            badge: 'Scenario 1',
            title: 'Machine valt stil',
            description:
                'Zie hoe LineCare een storing afhandelt, van melding tot oplossing, inclusief onderdelenregistratie.',
            steps: [
                {
                    step: '1',
                    icon: Smartphone,
                    title: 'Operator meldt storing',
                    description:
                        'Operator opent LineCare op zijn telefoon, selecteert de machine, beschrijft het probleem kort ("Snijmes loopt vast"), voegt optioneel een foto toe. Klaar in 30 seconden.',
                },
                {
                    step: '2',
                    icon: FileText,
                    title: 'Werkorder aangemaakt',
                    description:
                        'LineCare maakt automatisch een werkorder aan. Type: "Storing". Status: "Open". Machine: Snijmachine 3. De TD ziet deze direct verschijnen in zijn overzicht.',
                },
                {
                    step: '3',
                    icon: Wrench,
                    title: 'TD lost op & registreert',
                    description:
                        'Monteur zet status op "In uitvoering", lost probleem op. Registreert: oorzaak, bestede tijd, en welke onderdelen gebruikt. Voorraad wordt automatisch afgeboekt.',
                },
                {
                    step: '4',
                    icon: DollarSign,
                    title: 'Kosten & data opgeslagen',
                    description:
                        'Werkorder afgesloten. LineCare berekent automatisch: arbeidskosten, onderdeelkosten en stilstandkosten. Alles zichtbaar in rapportages.',
                },
            ],
        },
        {
            badge: 'Scenario 2',
            title: 'Periodiek onderhoud komt eraan',
            description:
                'Zie hoe LineCare zorgt dat preventief onderhoud nooit meer vergeten wordt.',
            steps: [
                {
                    step: '1',
                    icon: Clock,
                    title: 'Manager stelt taak in',
                    description:
                        'Manager of TD maakt een periodieke taak aan: "Kwartaal smering snijmachine". Interval: elke 3 maanden. Assigneer aan monteur.',
                },
                {
                    step: '2',
                    icon: FileText,
                    title: 'LineCare genereert werkorder',
                    description:
                        'Automatisch, een paar dagen voor de deadline, maakt LineCare een werkorder aan. Type: "Preventief". Status: "Gepland".',
                },
                {
                    step: '3',
                    icon: AlertCircle,
                    title: 'Monteur ziet taak',
                    description:
                        'In het werkorder-overzicht verschijnt de taak. Monteur plant het in, voert het uit, en meldt "Klaar" met korte notitie.',
                },
                {
                    step: '4',
                    icon: CheckCircle2,
                    title: 'Volgende keer automatisch',
                    description:
                        'Over 3 maanden genereert LineCare weer een werkorder. Geen Excel, geen herinneringen in je hoofd - het gebeurt vanzelf.',
                },
            ],
        },
        {
            badge: 'Scenario 3',
            title: 'Reserveonderdeel bijna op',
            description:
                'Zie hoe LineCare voorkomt dat je zonder kritieke onderdelen komt te zitten.',
            steps: [
                {
                    step: '1',
                    icon: AlertTriangle,
                    title: 'Voorraad onder minimum',
                    description:
                        'Na het afsluiten van een werkorder is de voorraad lagers onder het herbestelpunt gekomen. LineCare detecteert dit automatisch.',
                },
                {
                    step: '2',
                    icon: Bell,
                    title: 'Melding naar manager',
                    description:
                        'Manager ontvangt notificatie: "Lager SKF 6205: nog 2 op voorraad (minimum: 5)". Direct actie ondernemen mogelijk.',
                },
                {
                    step: '3',
                    icon: ShoppingCart,
                    title: 'Inkooporder aanmaken',
                    description:
                        'Met een klik maakt manager een inkooporder aan. Leverancier, prijs en levertijd worden automatisch ingevuld op basis van eerdere orders.',
                },
                {
                    step: '4',
                    icon: Package,
                    title: 'Ontvangst & voorraad bij',
                    description:
                        'Bij ontvangst boekt LineCare de voorraad automatisch bij. Leverancier kan status updaten via het leveranciersportaal.',
                },
            ],
        },
        {
            badge: 'Scenario 4',
            title: 'OEE daalt onder target',
            description:
                'Zie hoe LineCare je helpt productieverlies te identificeren en aan te pakken.',
            steps: [
                {
                    step: '1',
                    icon: Gauge,
                    title: 'OEE dashboard toont daling',
                    description:
                        'Manager opent OEE dashboard en ziet: Verpaklijkmachine 2 is gedaald van 78% naar 62% OEE deze week.',
                },
                {
                    step: '2',
                    icon: BarChart3,
                    title: 'Analyse van verliezen',
                    description:
                        'Klik door naar details: Beschikbaarheid is gedaald door 3 ongeplande stops. Oorzaak: steeds dezelfde foutmelding.',
                },
                {
                    step: '3',
                    icon: FileText,
                    title: 'Link naar werkorders',
                    description:
                        'LineCare toont gekoppelde werkorders. Patroon duidelijk: sensor moet vervangen worden in plaats van steeds gereset.',
                },
                {
                    step: '4',
                    icon: TrendingUp,
                    title: 'Structurele oplossing',
                    description:
                        'Manager plant preventieve vervanging. Na uitvoering stijgt OEE weer naar 80%. Data bewijst de investering.',
                },
            ],
        },
    ];

    const benefits = [
        {
            icon: Smartphone,
            title: 'Mobiel-vriendelijk',
            description:
                'Operators en monteurs werken vanaf de werkvloer. LineCare werkt perfect op telefoon en tablet, zodat niemand naar een computer hoeft te lopen.',
        },
        {
            icon: TrendingUp,
            title: 'Inzicht in een oogopslag',
            description:
                'Dashboard toont direct: open orders, OEE per machine, kosten deze maand, lage voorraad. Geen Excel-analyse meer nodig.',
        },
        {
            icon: Clock,
            title: 'Automatische planning',
            description:
                'Stel periodieke taken een keer in, en LineCare zorgt dat ze op tijd op de planning komen. Nooit meer iets vergeten.',
        },
        {
            icon: Box,
            title: 'Voorraad onder controle',
            description:
                'Weet altijd wat je op voorraad hebt. Automatische meldingen bij lage voorraad. Nooit meer zonder kritiek onderdeel zitten.',
        },
        {
            icon: Gauge,
            title: 'OEE meten',
            description:
                'Meet hoe effectief je machines draaien. Identificeer verliezen en verbeter gericht. Onderbouw investeringen met data.',
        },
        {
            icon: DollarSign,
            title: 'Kosten inzichtelijk',
            description:
                'Arbeidskosten, onderdeelkosten, stilstandkosten - alles automatisch berekend. Toon de directie wat onderhoud echt kost.',
        },
    ];

    return (
        <MarketingLayout
            title="De oplossing - LineCare"
            canRegister={canRegister}
            currentPath="/oplossing"
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
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                            De oplossing
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Een plek voor{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                al je onderhoud
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            LineCare brengt orde in de chaos. Van storing tot
                            oplossing, van reserveonderdeel tot inkooporder, van
                            OEE-meting tot kostenrapport - alles in een systeem.
                        </p>
                    </div>
                </div>
            </section>

            {/* Scenarios */}
            {scenarios.map((scenario, index) => (
                <section
                    key={index}
                    className={index % 2 === 0 ? 'bg-muted/30 py-24' : 'py-24'}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <Badge variant="outline" className="mb-4">
                                {scenario.badge}
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold tracking-tight">
                                {scenario.title}
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                {scenario.description}
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-4">
                            {scenario.steps.map((step, stepIndex) => (
                                <ScenarioStep key={stepIndex} {...step} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Key Benefits */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Voordelen
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Waarom LineCare werkt
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            De kracht zit in de combinatie. Alles hangt samen:
                            werkorders, onderdelen, kosten, OEE. Geen losse
                            systemen meer.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <benefit.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {benefit.description}
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
                            Klaar om LineCare te proberen?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Plan een demo en zie hoe LineCare werkt in jouw
                            fabriek. Geen verplichtingen, gewoon kijken of het
                            past.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Plan een demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8"
                                >
                                    Terug naar home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
