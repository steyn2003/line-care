import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
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
    Laptop,
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
    Upload,
    Users,
    Wifi,
    Wrench,
    Zap,
} from 'lucide-react';

export default function Functionaliteiten({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <MarketingLayout
            title="Functionaliteiten - LineCare"
            canRegister={canRegister}
            currentPath="/functionaliteiten"
        >
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Functionaliteiten van LineCare
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                            Van storingen melden tot OEE meten, van
                            reserveonderdelen tot kostenbeheer. Alles wat je
                            nodig hebt voor onderhoud in een kleine fabriek.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature 1: Storingsregistratie / Werkorders */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <FileText className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Storingsregistratie & Werkorders
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Het hart van LineCare: van melding tot oplossing in
                            een systeem. Geen WhatsApp-berichten die verdwijnen,
                            geen notitiepapiertjes die zoekraken.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Smartphone className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Melden in 30 seconden
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Operator selecteert machine, typt korte
                                    omschrijving, klaar. Werkt perfect op
                                    mobiel, direct vanaf de werkvloer.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Image className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Foto's toevoegen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Maak een foto van het probleem en voeg toe
                                    aan de melding. Monteur ziet meteen wat er
                                    aan de hand is.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Status tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Open, In uitvoering, Afgerond. Iedereen ziet
                                    waar het werk staat. Geen vragen meer "Ben
                                    je er al mee bezig?"
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Toewijzen aan monteur
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Wijs werkorder toe aan specifieke monteur.
                                    Iedereen weet wie waarvoor verantwoordelijk
                                    is.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <MessageSquare className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Notities & oplossing
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Monteur noteert wat gedaan is, wat de
                                    oorzaak was, hoelang het duurde. Volgende
                                    keer weet je hoe je het moet aanpakken.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Filter className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Filteren & zoeken
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Filter op status, machine, locatie, datum.
                                    Zoek snel die ene werkorder terug van vorige
                                    maand.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 2: Periodiek onderhoud */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Calendar className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Periodiek onderhoud
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Voorkom storingen door periodiek onderhoud te
                            plannen. LineCare zorgt dat je niets vergeet.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Terugkerende taken
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Stel in: elke 3 maanden smeren, elke 6
                                    maanden inspectie, etc. LineCare genereert
                                    automatisch werkorders.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Bell className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Automatische herinneringen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Een paar dagen voor de deadline verschijnt
                                    de taak op de planning. Nooit meer vergeten
                                    om iets te doen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <FileText className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Overzicht van taken
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Zie alle periodieke taken in een overzicht.
                                    Welke zijn gepland, welke zijn overdue,
                                    welke zijn klaar.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Koppeling met machines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Elke taak is gekoppeld aan een machine. Op
                                    de machine-detail pagina zie je alle
                                    geplande en uitgevoerde taken.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Registreer uitvoering
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Monteur markeert taak als klaar, voegt
                                    notitie toe. Historie blijft bewaard voor
                                    volgende keer.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Toewijzen aan team
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Wijs taak standaard toe aan bepaalde monteur
                                    of team. Iedereen weet wie verantwoordelijk
                                    is.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 3: Spare Parts & Inventory (NEW V2) */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Box className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Reserveonderdelen & Voorraad
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Volledige controle over je reserveonderdelen. Van
                            catalogus tot inkooporder, van voorraadniveau tot
                            automatische herbestelling.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Package className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Onderdelen catalogus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Alle onderdelen in een overzichtelijke
                                    catalogus met categorieen, prijzen,
                                    leveranciers en foto's.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <MapPin className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Voorraad per locatie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Meerdere magazijnen? Houd voorraad bij per
                                    locatie. Weet altijd waar onderdelen liggen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <AlertTriangle className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Automatische herbestelmeldingen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Stel herbestelpunten in per onderdeel.
                                    LineCare waarschuwt automatisch als voorraad
                                    onder minimum komt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <ShoppingCart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Inkooporders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Maak inkooporders direct vanuit LineCare.
                                    Van concept tot ontvangst, alles in een
                                    systeem.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Truck className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Leveranciersbeheer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Beheer je leveranciers, contactgegevens en
                                    levertijden. Koppel onderdelen aan
                                    voorkeursleveranciers.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Link2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Koppeling met werkorders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Registreer welke onderdelen gebruikt zijn
                                    per werkorder. Automatische
                                    voorraadafboeking en kostenregistratie.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 4: OEE & Production Tracking (NEW V2) */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Gauge className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            OEE & Productie Tracking
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Meet hoe effectief je machines draaien met OEE
                            (Overall Equipment Effectiveness). Begrijp waar
                            productieverlies zit en verbeter gericht.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Activity className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Productieruns registreren
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Start en stop productieruns per machine.
                                    Registreer geplande en werkelijke output.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <PieChart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Beschikbaarheid, Prestatie, Kwaliteit
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    LineCare berekent automatisch de drie
                                    OEE-componenten. Zie direct waar het verlies
                                    zit.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Stilstandregistratie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Registreer stilstand met categorieen:
                                    storingen, omstellen, wachten op materiaal,
                                    pauzes. Analyseer patronen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <LineChart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    OEE trends en vergelijkingen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bekijk OEE over tijd. Vergelijk machines,
                                    ploegen of periodes. Spot verbeteringen en
                                    achteruitgang.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Ploegendienst ondersteuning
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Definieer ploegen en koppel productieruns
                                    aan shifts. Vergelijk prestaties tussen
                                    ploegen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    OEE Dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Real-time OEE dashboard met gauges, trends
                                    en top-verliezen. Deel met het team op een
                                    groot scherm.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 5: Cost Management (NEW V2) */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <DollarSign className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Kostenbeheer
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Krijg grip op je onderhoudskosten. Arbeidskosten,
                            onderdeelkosten en stilstandkosten - alles
                            inzichtelijk per werkorder, machine en periode.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Arbeidskosten tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Registreer bestede tijd per werkorder.
                                    LineCare berekent kosten op basis van
                                    uurtarieven per medewerker of rol.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Box className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Onderdeelkosten per werkorder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Gebruikte onderdelen worden automatisch
                                    doorgerekend. Zie exact wat een reparatie
                                    aan materiaal kost.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Stilstandkosten berekening
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bereken de business impact van stilstand op
                                    basis van machine-productiewaarde per uur.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <FileText className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Externe diensten registratie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Registreer kosten van externe partijen en
                                    contractors. Koppel facturen aan werkorders.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Budget vs. werkelijk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Stel onderhoudsbudgetten in per maand of
                                    jaar. Vergelijk werkelijke kosten met budget
                                    en spot overschrijdingen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Kosten per machine
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bekijk totale onderhoudskosten per machine.
                                    Identificeer dure machines en onderbouw
                                    vervangingsbeslissingen.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 6: Integrations (NEW V2) */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Link2 className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">Integraties</h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Verbind LineCare met je bestaande systemen. ERP,
                            IoT-sensoren, notificaties en een
                            leveranciersportaal - alles werkt samen.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Server className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    ERP koppelingen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Koppel met SAP, Oracle, NetSuite, Microsoft
                                    Dynamics of Odoo. Synchroniseer voorraad,
                                    kosten en inkooporders.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wifi className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    IoT sensor integratie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Sluit trillings-, temperatuur- of
                                    druksensoren aan. Ontvang automatisch alerts
                                    en creeer werkorders bij afwijkingen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Bell className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    E-mail & push notificaties
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Ontvang meldingen per e-mail of push bij
                                    nieuwe werkorders, alerts of deadlines.
                                    Configureer per gebruiker.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Truck className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Leveranciersportaal
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Geef leveranciers toegang tot hun
                                    inkooporders. Ze kunnen status updaten,
                                    tracking info toevoegen en documenten
                                    uploaden.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Cog className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    API toegang
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bouw eigen integraties met de LineCare API.
                                    REST endpoints voor alle kernfuncties.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Zap className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Webhooks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Ontvang real-time events via webhooks.
                                    Trigger acties in andere systemen bij nieuwe
                                    werkorders of alerts.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 7: Advanced Analytics (NEW V2) */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <BarChart3 className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Geavanceerde Analytics
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Van MTBF tot Pareto analyse, van
                            storingsvoorspellingen tot aangepaste dashboards.
                            Data-gedreven beslissingen voor je onderhoud.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    MTBF & MTTR berekeningen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Mean Time Between Failures en Mean Time To
                                    Repair per machine. Meet betrouwbaarheid en
                                    reparatie-efficientie.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <PieChart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Pareto analyse (80/20)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Identificeer de 20% oorzaken die 80% van de
                                    problemen veroorzaken. Focus je
                                    verbeteringen waar het ertoe doet.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Activity className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Storingsvoorspellingen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Op basis van historische data en
                                    sensormetingen. Voorspel wanneer onderdelen
                                    waarschijnlijk falen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Aangepaste dashboards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bouw je eigen dashboards met drag-and-drop
                                    widgets. KPI's, grafieken en tabellen naar
                                    jouw wens.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Search className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Globaal zoeken
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Zoek door alles met Ctrl+K: werkorders,
                                    machines, onderdelen, leveranciers. Vind
                                    direct wat je nodig hebt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Filter className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Opgeslagen filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Sla veelgebruikte filters op en deel met
                                    collega's. Een klik en je ziet precies wat
                                    je nodig hebt.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 8: Dashboards & Rapportage */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <BarChart3 className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Dashboards & Rapportage
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Inzicht in een oogopslag. Zie direct welke machines
                            problematisch zijn, wat de OEE is, en hoeveel het
                            kost.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Real-time dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Zie direct: hoeveel open werkorders, overdue
                                    preventieve taken, storingen deze
                                    week/maand.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Top machines met storingen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Ranking van machines met meeste storingen.
                                    Identificeer probleemmachines in een blik.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Stilstand per machine
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Totale stilstand per machine (uren/dagen).
                                    Onderbouw investeringen met harde cijfers.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Calendar className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Datum filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bekijk data over laatste 7, 30, 90 dagen of
                                    kies custom periode. Vergelijk periodes met
                                    elkaar.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <MapPin className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Filter per locatie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Meerdere productielocaties? Filter dashboard
                                    per locatie om specifiek inzicht te krijgen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <FileSpreadsheet className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Export naar Excel
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Download rapporten als CSV voor verdere
                                    analyse of presentatie aan directie.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 9: Mobiele toegang */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Smartphone className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Mobiele toegang
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            LineCare werkt perfect op telefoon en tablet.
                            Operators en monteurs hoeven niet naar een computer.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Smartphone className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Responsive design
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Werkt op alle schermformaten. Van grote
                                    desktop tot kleine smartphone, alles blijft
                                    leesbaar en bruikbaar.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Vanaf de werkvloer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Operator staat bij machine, ziet probleem,
                                    pakt telefoon, meldt storing. Direct, zonder
                                    omwegen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Laptop className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Ook op desktop
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Manager of TD werkt liever op computer? Geen
                                    probleem, LineCare werkt overal.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature 10: CSV Import */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Upload className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">CSV-import</h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Heb je al een Excel-lijst met machines? Importeer ze
                            in een keer in LineCare.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <FileSpreadsheet className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Importeer machines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Download template, vul je machines in,
                                    upload CSV. LineCare importeert alles
                                    automatisch.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Preview & validatie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Zie preview van wat geimporteerd wordt.
                                    LineCare checkt of alles klopt voordat je
                                    bevestigt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Clock className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle className="text-lg">
                                    Snel live gaan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Geen data handmatig overtypen. Import in 5
                                    minuten, en je bent klaar om te starten.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold">
                        Alles wat je nodig hebt
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Van storingen melden tot OEE meten, van
                        reserveonderdelen tot kostenbeheer. Compleet maar
                        simpel.
                    </p>
                    <Link href="/#demo">
                        <Button size="lg">Plan een demo</Button>
                    </Link>
                </div>
            </section>
        </MarketingLayout>
    );
}
