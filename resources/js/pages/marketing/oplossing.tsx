import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
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

export default function Oplossing({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <MarketingLayout
            title="De oplossing - LineCare"
            canRegister={canRegister}
            currentPath="/oplossing"
        >
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            De oplossing: een plek voor al je onderhoud
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                            LineCare brengt orde in de chaos. Van storing tot
                            oplossing, van reserveonderdeel tot inkooporder, van
                            OEE-meting tot kostenrapport - alles in een systeem.
                        </p>
                    </div>
                </div>
            </section>

            {/* Scenario 1: Machine valt stil */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Scenario 1: Machine valt stil
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Zie hoe LineCare een storing afhandelt, van melding
                            tot oplossing, inclusief onderdelenregistratie.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <CardTitle>Operator meldt storing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Smartphone className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Operator opent LineCare op zijn telefoon,
                                    selecteert de machine, beschrijft het
                                    probleem kort ("Snijmes loopt vast"), voegt
                                    optioneel een foto toe. Klaar in 30
                                    seconden.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <CardTitle>Werkorder aangemaakt</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileText className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    LineCare maakt automatisch een werkorder
                                    aan. Type: "Storing". Status: "Open".
                                    Machine: Snijmachine 3. De TD ziet deze
                                    direct verschijnen in zijn overzicht.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <CardTitle>TD lost op & registreert</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Wrench className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Monteur zet status op "In uitvoering", lost
                                    probleem op. Registreert: oorzaak, bestede
                                    tijd, en welke onderdelen gebruikt. Voorraad
                                    wordt automatisch afgeboekt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <CardTitle>Kosten & data opgeslagen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DollarSign className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Werkorder afgesloten. LineCare berekent
                                    automatisch: arbeidskosten, onderdeelkosten
                                    en stilstandkosten. Alles zichtbaar in
                                    rapportages.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Scenario 2: Periodiek onderhoud */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Scenario 2: Periodiek onderhoud komt eraan
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Zie hoe LineCare zorgt dat preventief onderhoud
                            nooit meer vergeten wordt.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <CardTitle>Manager stelt taak in</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Clock className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Manager of TD maakt een periodieke taak aan:
                                    "Kwartaal smering snijmachine". Interval:
                                    elke 3 maanden. Assigneer aan monteur.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <CardTitle>
                                    LineCare genereert werkorder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileText className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Automatisch, een paar dagen voor de
                                    deadline, maakt LineCare een werkorder aan.
                                    Type: "Preventief". Status: "Gepland".
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <CardTitle>Monteur ziet taak</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AlertCircle className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    In het werkorder-overzicht verschijnt de
                                    taak. Monteur plant het in, voert het uit,
                                    en meldt "Klaar" met korte notitie.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <CardTitle>Volgende keer automatisch</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CheckCircle2 className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Over 3 maanden genereert LineCare weer een
                                    werkorder. Geen Excel, geen herinneringen in
                                    je hoofd - het gebeurt vanzelf.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Scenario 3: Reserveonderdeel bijna op (NEW V2) */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Scenario 3: Reserveonderdeel bijna op
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Zie hoe LineCare voorkomt dat je zonder kritieke
                            onderdelen komt te zitten.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <CardTitle>Voorraad onder minimum</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AlertTriangle className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Na het afsluiten van een werkorder is de
                                    voorraad lagers onder het herbestelpunt
                                    gekomen. LineCare detecteert dit
                                    automatisch.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <CardTitle>Melding naar manager</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bell className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Manager ontvangt notificatie: "Lager SKF
                                    6205: nog 2 op voorraad (minimum: 5)".
                                    Direct actie ondernemen mogelijk.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <CardTitle>Inkooporder aanmaken</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ShoppingCart className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Met een klik maakt manager een inkooporder
                                    aan. Leverancier, prijs en levertijd worden
                                    automatisch ingevuld op basis van eerdere
                                    orders.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <CardTitle>Ontvangst & voorraad bij</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Package className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Bij ontvangst boekt LineCare de voorraad
                                    automatisch bij. Leverancier kan status
                                    updaten via het leveranciersportaal.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Scenario 4: OEE daalt (NEW V2) */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Scenario 4: OEE daalt onder target
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Zie hoe LineCare je helpt productieverlies te
                            identificeren en aan te pakken.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <CardTitle>
                                    OEE dashboard toont daling
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Gauge className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Manager opent OEE dashboard en ziet:
                                    Verpaklijkmachine 2 is gedaald van 78% naar
                                    62% OEE deze week.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <CardTitle>Analyse van verliezen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart3 className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Klik door naar details: Beschikbaarheid is
                                    gedaald door 3 ongeplande stops. Oorzaak:
                                    steeds dezelfde foutmelding.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <CardTitle>Link naar werkorders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileText className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    LineCare toont gekoppelde werkorders.
                                    Patroon duidelijk: sensor moet vervangen
                                    worden in plaats van steeds gereset.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <CardTitle>Structurele oplossing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Manager plant preventieve vervanging. Na
                                    uitvoering stijgt OEE weer naar 80%. Data
                                    bewijst de investering.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Waarom LineCare werkt
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            De kracht zit in de combinatie. Alles hangt samen:
                            werkorders, onderdelen, kosten, OEE. Geen losse
                            systemen meer.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Smartphone className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Mobiel-vriendelijk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Operators en monteurs werken vanaf de
                                    werkvloer. LineCare werkt perfect op
                                    telefoon en tablet, zodat niemand naar een
                                    computer hoeft te lopen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Inzicht in een oogopslag</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Dashboard toont direct: open orders, OEE per
                                    machine, kosten deze maand, lage voorraad.
                                    Geen Excel-analyse meer nodig.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Automatische planning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Stel periodieke taken een keer in, en
                                    LineCare zorgt dat ze op tijd op de planning
                                    komen. Nooit meer iets vergeten.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Box className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Voorraad onder controle</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Weet altijd wat je op voorraad hebt.
                                    Automatische meldingen bij lage voorraad.
                                    Nooit meer zonder kritiek onderdeel zitten.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Gauge className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>OEE meten</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Meet hoe effectief je machines draaien.
                                    Identificeer verliezen en verbeter gericht.
                                    Onderbouw investeringen met data.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <DollarSign className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Kosten inzichtelijk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Arbeidskosten, onderdeelkosten,
                                    stilstandkosten - alles automatisch
                                    berekend. Toon de directie wat onderhoud
                                    echt kost.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold">
                        Klaar om LineCare te proberen?
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Plan een demo en zie hoe LineCare werkt in jouw fabriek.
                        Geen verplichtingen, gewoon kijken of het past.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/#demo">
                            <Button size="lg" className="w-full sm:w-auto">
                                Plan een demo
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Terug naar home
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
