import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    FileText,
    Filter,
    Image,
    Laptop,
    MapPin,
    MessageSquare,
    Smartphone,
    TrendingUp,
    Upload,
    Users,
    Wrench,
} from 'lucide-react';

export default function Functionaliteiten({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Functionaliteiten - LineCare" />

            {/* Navigation */}
            <nav className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/">
                                <h2 className="text-2xl font-bold text-primary">
                                    LineCare
                                </h2>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button variant="default">Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant="ghost">Inloggen</Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()}>
                                            <Button>Probeer gratis</Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="bg-background">
                {/* Hero Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Functionaliteiten van LineCare
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                                Alles wat je nodig hebt voor onderhoud in een kleine
                                fabriek. Niets meer, niets minder.
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
                                Het hart van LineCare: van melding tot oplossing in één
                                systeem. Geen WhatsApp-berichten die verdwijnen, geen
                                notitiepapiertjes die zoekraken.
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
                                        omschrijving, klaar. Werkt perfect op mobiel,
                                        direct vanaf de werkvloer.
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
                                        Maak een foto van het probleem en voeg toe aan
                                        de melding. Monteur ziet meteen wat er aan de
                                        hand is.
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
                                        Open → In uitvoering → Afgerond. Iedereen ziet
                                        waar het werk staat. Geen vragen meer "Ben je
                                        er al mee bezig?"
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
                                        Iedereen weet wie waarvoor verantwoordelijk is.
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
                                        Monteur noteert wat gedaan is, wat de oorzaak
                                        was, hoelang het duurde. Volgende keer weet je
                                        hoe je het moet aanpakken.
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
                                Voorkom storingen door periodiek onderhoud te plannen.
                                LineCare zorgt dat je niets vergeet.
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
                                        Stel in: elke 3 maanden smeren, elke 6 maanden
                                        inspectie, etc. LineCare genereert automatisch
                                        werkorders.
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
                                        Een paar dagen voor de deadline verschijnt de
                                        taak op de planning. Nooit meer vergeten om
                                        iets te doen.
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
                                        Zie alle periodieke taken in één overzicht.
                                        Welke zijn gepland, welke zijn overdue, welke
                                        zijn klaar.
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
                                        Elke taak is gekoppeld aan een machine. Op de
                                        machine-detail pagina zie je alle geplande en
                                        uitgevoerde taken.
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
                                        Monteur markeert taak als klaar, voegt notitie
                                        toe. Historie blijft bewaard voor volgende
                                        keer.
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
                                        Wijs taak standaard toe aan bepaalde monteur of
                                        team. Iedereen weet wie verantwoordelijk is.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Dashboards & Rapportage */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <BarChart3 className="mb-4 h-12 w-12 text-primary" />
                            <h2 className="mb-4 text-3xl font-bold">
                                Dashboards & Rapportage
                            </h2>
                            <p className="max-w-3xl text-lg text-muted-foreground">
                                Inzicht in één oogopslag. Zie direct welke machines
                                problematisch zijn en hoeveel stilstand je hebt.
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
                                        preventieve taken, storingen deze week/maand.
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
                                        Identificeer probleemmachines in één blik.
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

                {/* Feature 4: Mobiele toegang */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <Smartphone className="mb-4 h-12 w-12 text-primary" />
                            <h2 className="mb-4 text-3xl font-bold">Mobiele toegang</h2>
                            <p className="max-w-3xl text-lg text-muted-foreground">
                                LineCare werkt perfect op telefoon en tablet. Operators
                                en monteurs hoeven niet naar een computer.
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
                                        Werkt op alle schermformaten. Van grote desktop
                                        tot kleine smartphone, alles blijft leesbaar en
                                        bruikbaar.
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

                {/* Feature 5: CSV Import */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <Upload className="mb-4 h-12 w-12 text-primary" />
                            <h2 className="mb-4 text-3xl font-bold">CSV-import</h2>
                            <p className="max-w-3xl text-lg text-muted-foreground">
                                Heb je al een Excel-lijst met machines? Importeer ze in
                                één keer in LineCare.
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
                                        Download template, vul je machines in, upload
                                        CSV. LineCare importeert alles automatisch.
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
                                        Zie preview van wat geïmporteerd wordt.
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
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-3xl font-bold">
                            Alles wat je nodig hebt
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Geen overbodige modules, geen complexe instellingen. Gewoon
                            wat werkt.
                        </p>
                        <Link href="/#demo">
                            <Button size="lg">Plan een demo</Button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-background py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    LineCare
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Eenvoudige onderhoudssoftware voor kleine
                                    fabrieken.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 text-sm font-semibold">
                                    Product
                                </h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <Link href="/#hoe-het-werkt">
                                            Hoe het werkt
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#demo">Demo aanvragen</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 text-sm font-semibold">
                                    Bedrijf
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>
                                        <Link href="/#demo">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 text-sm font-semibold">Legal</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <a href="#">Privacy</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                            © 2025 LineCare. Alle rechten voorbehouden.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
