import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Bell,
    Box,
    Calendar,
    CheckCircle2,
    Clock,
    Cog,
    DollarSign,
    FileSpreadsheet,
    FileText,
    Filter,
    Gauge,
    Image,
    LineChart,
    Link2,
    MapPin,
    MessageSquare,
    Package,
    PieChart,
    Search,
    Server,
    ShoppingCart,
    Smartphone,
    TrendingUp,
    Truck,
    Users,
    Wifi,
    Wrench,
    Zap,
} from 'lucide-react';

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <Card className="group border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

interface FeatureSectionProps {
    icon: React.ElementType;
    badge: string;
    title: string;
    description: string;
    features: { icon: React.ElementType; title: string; description: string }[];
    reversed?: boolean;
}

function FeatureSection({
    icon: Icon,
    badge,
    title,
    description,
    features,
    reversed,
}: FeatureSectionProps) {
    return (
        <section className={reversed ? 'bg-muted/30 py-24' : 'py-24'}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            {badge}
                        </span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <p className="max-w-3xl text-lg text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Functionaliteiten({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const featureSections = [
        {
            icon: FileText,
            badge: 'Werkorders',
            title: 'Storingsregistratie & Werkorders',
            description:
                'Het hart van LineCare: van melding tot oplossing in een systeem. Geen WhatsApp-berichten die verdwijnen, geen notitiepapiertjes die zoekraken.',
            features: [
                {
                    icon: Smartphone,
                    title: 'Melden in 30 seconden',
                    description:
                        'Operator selecteert machine, typt korte omschrijving, klaar. Werkt perfect op mobiel, direct vanaf de werkvloer.',
                },
                {
                    icon: Image,
                    title: "Foto's toevoegen",
                    description:
                        'Maak een foto van het probleem en voeg toe aan de melding. Monteur ziet meteen wat er aan de hand is.',
                },
                {
                    icon: CheckCircle2,
                    title: 'Status tracking',
                    description:
                        'Open, In uitvoering, Afgerond. Iedereen ziet waar het werk staat. Geen vragen meer "Ben je er al mee bezig?"',
                },
                {
                    icon: Users,
                    title: 'Toewijzen aan monteur',
                    description:
                        'Wijs werkorder toe aan specifieke monteur. Iedereen weet wie waarvoor verantwoordelijk is.',
                },
                {
                    icon: MessageSquare,
                    title: 'Notities & oplossing',
                    description:
                        'Monteur noteert wat gedaan is, wat de oorzaak was, hoelang het duurde. Volgende keer weet je hoe je het moet aanpakken.',
                },
                {
                    icon: Filter,
                    title: 'Filteren & zoeken',
                    description:
                        'Filter op status, machine, locatie, datum. Zoek snel die ene werkorder terug van vorige maand.',
                },
            ],
        },
        {
            icon: Calendar,
            badge: 'Preventief',
            title: 'Periodiek onderhoud',
            description:
                'Voorkom storingen door periodiek onderhoud te plannen. LineCare zorgt dat je niets vergeet.',
            features: [
                {
                    icon: Clock,
                    title: 'Terugkerende taken',
                    description:
                        'Stel in: elke 3 maanden smeren, elke 6 maanden inspectie, etc. LineCare genereert automatisch werkorders.',
                },
                {
                    icon: Bell,
                    title: 'Automatische herinneringen',
                    description:
                        'Een paar dagen voor de deadline verschijnt de taak op de planning. Nooit meer vergeten om iets te doen.',
                },
                {
                    icon: FileText,
                    title: 'Overzicht van taken',
                    description:
                        'Zie alle periodieke taken in een overzicht. Welke zijn gepland, welke zijn overdue, welke zijn klaar.',
                },
                {
                    icon: Wrench,
                    title: 'Koppeling met machines',
                    description:
                        'Elke taak is gekoppeld aan een machine. Op de machine-detail pagina zie je alle geplande en uitgevoerde taken.',
                },
                {
                    icon: CheckCircle2,
                    title: 'Registreer uitvoering',
                    description:
                        'Monteur markeert taak als klaar, voegt notitie toe. Historie blijft bewaard voor volgende keer.',
                },
                {
                    icon: Users,
                    title: 'Toewijzen aan team',
                    description:
                        'Wijs taak standaard toe aan bepaalde monteur of team. Iedereen weet wie verantwoordelijk is.',
                },
            ],
        },
        {
            icon: Box,
            badge: 'Voorraad',
            title: 'Reserveonderdelen & Voorraad',
            description:
                'Volledige controle over je reserveonderdelen. Van catalogus tot inkooporder, van voorraadniveau tot automatische herbestelling.',
            features: [
                {
                    icon: Package,
                    title: 'Onderdelen catalogus',
                    description:
                        "Alle onderdelen in een overzichtelijke catalogus met categorieen, prijzen, leveranciers en foto's.",
                },
                {
                    icon: MapPin,
                    title: 'Voorraad per locatie',
                    description:
                        'Meerdere magazijnen? Houd voorraad bij per locatie. Weet altijd waar onderdelen liggen.',
                },
                {
                    icon: AlertTriangle,
                    title: 'Automatische herbestelmeldingen',
                    description:
                        'Stel herbestelpunten in per onderdeel. LineCare waarschuwt automatisch als voorraad onder minimum komt.',
                },
                {
                    icon: ShoppingCart,
                    title: 'Inkooporders',
                    description:
                        'Maak inkooporders direct vanuit LineCare. Van concept tot ontvangst, alles in een systeem.',
                },
                {
                    icon: Truck,
                    title: 'Leveranciersbeheer',
                    description:
                        'Beheer je leveranciers, contactgegevens en levertijden. Koppel onderdelen aan voorkeursleveranciers.',
                },
                {
                    icon: Link2,
                    title: 'Koppeling met werkorders',
                    description:
                        'Registreer welke onderdelen gebruikt zijn per werkorder. Automatische voorraadafboeking en kostenregistratie.',
                },
            ],
        },
        {
            icon: Gauge,
            badge: 'OEE',
            title: 'OEE & Productie Tracking',
            description:
                'Meet hoe effectief je machines draaien met OEE (Overall Equipment Effectiveness). Begrijp waar productieverlies zit en verbeter gericht.',
            features: [
                {
                    icon: Activity,
                    title: 'Productieruns registreren',
                    description:
                        'Start en stop productieruns per machine. Registreer geplande en werkelijke output.',
                },
                {
                    icon: PieChart,
                    title: 'Beschikbaarheid, Prestatie, Kwaliteit',
                    description:
                        'LineCare berekent automatisch de drie OEE-componenten. Zie direct waar het verlies zit.',
                },
                {
                    icon: Clock,
                    title: 'Stilstandregistratie',
                    description:
                        'Registreer stilstand met categorieen: storingen, omstellen, wachten op materiaal, pauzes. Analyseer patronen.',
                },
                {
                    icon: LineChart,
                    title: 'OEE trends en vergelijkingen',
                    description:
                        'Bekijk OEE over tijd. Vergelijk machines, ploegen of periodes. Spot verbeteringen en achteruitgang.',
                },
                {
                    icon: Users,
                    title: 'Ploegendienst ondersteuning',
                    description:
                        'Definieer ploegen en koppel productieruns aan shifts. Vergelijk prestaties tussen ploegen.',
                },
                {
                    icon: BarChart3,
                    title: 'OEE Dashboard',
                    description:
                        'Real-time OEE dashboard met gauges, trends en top-verliezen. Deel met het team op een groot scherm.',
                },
            ],
        },
        {
            icon: DollarSign,
            badge: 'Kosten',
            title: 'Kostenbeheer',
            description:
                'Krijg grip op je onderhoudskosten. Arbeidskosten, onderdeelkosten en stilstandkosten - alles inzichtelijk per werkorder, machine en periode.',
            features: [
                {
                    icon: Clock,
                    title: 'Arbeidskosten tracking',
                    description:
                        'Registreer bestede tijd per werkorder. LineCare berekent kosten op basis van uurtarieven per medewerker of rol.',
                },
                {
                    icon: Box,
                    title: 'Onderdeelkosten per werkorder',
                    description:
                        'Gebruikte onderdelen worden automatisch doorgerekend. Zie exact wat een reparatie aan materiaal kost.',
                },
                {
                    icon: TrendingUp,
                    title: 'Stilstandkosten berekening',
                    description:
                        'Bereken de business impact van stilstand op basis van machine-productiewaarde per uur.',
                },
                {
                    icon: FileText,
                    title: 'Externe diensten registratie',
                    description:
                        'Registreer kosten van externe partijen en contractors. Koppel facturen aan werkorders.',
                },
                {
                    icon: BarChart3,
                    title: 'Budget vs. werkelijk',
                    description:
                        'Stel onderhoudsbudgetten in per maand of jaar. Vergelijk werkelijke kosten met budget en spot overschrijdingen.',
                },
                {
                    icon: Wrench,
                    title: 'Kosten per machine',
                    description:
                        'Bekijk totale onderhoudskosten per machine. Identificeer dure machines en onderbouw vervangingsbeslissingen.',
                },
            ],
        },
        {
            icon: Link2,
            badge: 'Integraties',
            title: 'Integraties',
            description:
                'Verbind LineCare met je bestaande systemen. ERP, IoT-sensoren, notificaties en een leveranciersportaal - alles werkt samen.',
            features: [
                {
                    icon: Server,
                    title: 'ERP koppelingen',
                    description:
                        'Koppel met SAP, Oracle, NetSuite, Microsoft Dynamics of Odoo. Synchroniseer voorraad, kosten en inkooporders.',
                },
                {
                    icon: Wifi,
                    title: 'IoT sensor integratie',
                    description:
                        'Sluit trillings-, temperatuur- of druksensoren aan. Ontvang automatisch alerts en creeer werkorders bij afwijkingen.',
                },
                {
                    icon: Bell,
                    title: 'E-mail & push notificaties',
                    description:
                        'Ontvang meldingen per e-mail of push bij nieuwe werkorders, alerts of deadlines. Configureer per gebruiker.',
                },
                {
                    icon: Truck,
                    title: 'Leveranciersportaal',
                    description:
                        'Geef leveranciers toegang tot hun inkooporders. Ze kunnen status updaten, tracking info toevoegen en documenten uploaden.',
                },
                {
                    icon: Cog,
                    title: 'API toegang',
                    description:
                        'Bouw eigen integraties met de LineCare API. REST endpoints voor alle kernfuncties.',
                },
                {
                    icon: Zap,
                    title: 'Webhooks',
                    description:
                        'Ontvang real-time events via webhooks. Trigger acties in andere systemen bij nieuwe werkorders of alerts.',
                },
            ],
        },
        {
            icon: BarChart3,
            badge: 'Analytics',
            title: 'Geavanceerde Analytics',
            description:
                'Van MTBF tot Pareto analyse, van storingsvoorspellingen tot aangepaste dashboards. Data-gedreven beslissingen voor je onderhoud.',
            features: [
                {
                    icon: TrendingUp,
                    title: 'MTBF & MTTR berekeningen',
                    description:
                        'Mean Time Between Failures en Mean Time To Repair per machine. Meet betrouwbaarheid en reparatie-efficientie.',
                },
                {
                    icon: PieChart,
                    title: 'Pareto analyse (80/20)',
                    description:
                        'Identificeer de 20% oorzaken die 80% van de problemen veroorzaken. Focus je verbeteringen waar het ertoe doet.',
                },
                {
                    icon: Activity,
                    title: 'Storingsvoorspellingen',
                    description:
                        'Op basis van historische data en sensormetingen. Voorspel wanneer onderdelen waarschijnlijk falen.',
                },
                {
                    icon: BarChart3,
                    title: 'Aangepaste dashboards',
                    description:
                        "Bouw je eigen dashboards met drag-and-drop widgets. KPI's, grafieken en tabellen naar jouw wens.",
                },
                {
                    icon: Search,
                    title: 'Globaal zoeken',
                    description:
                        'Zoek door alles met Ctrl+K: werkorders, machines, onderdelen, leveranciers. Vind direct wat je nodig hebt.',
                },
                {
                    icon: Filter,
                    title: 'Opgeslagen filters',
                    description:
                        "Sla veelgebruikte filters op en deel met collega's. Een klik en je ziet precies wat je nodig hebt.",
                },
            ],
        },
        {
            icon: BarChart3,
            badge: 'Rapportage',
            title: 'Dashboards & Rapportage',
            description:
                'Inzicht in een oogopslag. Zie direct welke machines problematisch zijn, wat de OEE is, en hoeveel het kost.',
            features: [
                {
                    icon: TrendingUp,
                    title: 'Real-time dashboard',
                    description:
                        'Zie direct: hoeveel open werkorders, overdue preventieve taken, storingen deze week/maand.',
                },
                {
                    icon: Wrench,
                    title: 'Top machines met storingen',
                    description:
                        'Ranking van machines met meeste storingen. Identificeer probleemmachines in een blik.',
                },
                {
                    icon: Clock,
                    title: 'Stilstand per machine',
                    description:
                        'Totale stilstand per machine (uren/dagen). Onderbouw investeringen met harde cijfers.',
                },
                {
                    icon: Calendar,
                    title: 'Datum filters',
                    description:
                        'Bekijk data over laatste 7, 30, 90 dagen of kies custom periode. Vergelijk periodes met elkaar.',
                },
                {
                    icon: MapPin,
                    title: 'Filter per locatie',
                    description:
                        'Meerdere productielocaties? Filter dashboard per locatie om specifiek inzicht te krijgen.',
                },
                {
                    icon: FileSpreadsheet,
                    title: 'Export naar Excel',
                    description:
                        'Download rapporten als CSV voor verdere analyse of presentatie aan directie.',
                },
            ],
        },
        {
            icon: Smartphone,
            badge: 'Mobiel',
            title: 'Mobiele toegang',
            description:
                'LineCare werkt perfect op telefoon en tablet. Operators en monteurs hoeven niet naar een computer.',
            features: [
                {
                    icon: Smartphone,
                    title: 'Responsive design',
                    description:
                        'Werkt op alle schermformaten. Van grote desktop tot kleine smartphone, alles blijft leesbaar en bruikbaar.',
                },
                {
                    icon: Wrench,
                    title: 'Vanaf de werkvloer',
                    description:
                        'Operator staat bij machine, ziet probleem, pakt telefoon, meldt storing. Direct, zonder omwegen.',
                },
                {
                    icon: CheckCircle2,
                    title: 'Werkorders bekijken',
                    description:
                        'Monteur bekijkt en update werkorders op mobiel. Geen computer nodig.',
                },
            ],
        },
    ];

    return (
        <MarketingLayout
            title="Functionaliteiten - LineCare"
            canRegister={canRegister}
            currentPath="/functionaliteiten"
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
                            Alle mogelijkheden
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Alles wat je nodig hebt voor{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                professioneel onderhoud
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Van storingen melden tot OEE meten, van
                            reserveonderdelen tot kostenbeheer. Alles wat je
                            nodig hebt voor onderhoud in een kleine fabriek.
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
                                    Bekijk demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="border-y bg-muted/30 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {featureSections.slice(0, 7).map((section, index) => (
                            <a
                                key={index}
                                href={`#${section.badge.toLowerCase()}`}
                                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                            >
                                <section.icon className="h-4 w-4 text-primary" />
                                {section.badge}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Sections */}
            {featureSections.map((section, index) => (
                <div key={index} id={section.badge.toLowerCase()}>
                    <FeatureSection {...section} reversed={index % 2 === 0} />
                </div>
            ))}

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
                            Geen creditcard nodig, geen verplichtingen.
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
