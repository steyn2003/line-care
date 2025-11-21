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
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Voor wie - LineCare" />

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
                                Onderhoudssoftware voor kleine fabrieken in
                                Nederland
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                                LineCare is gemaakt voor Nederlandse maakbedrijven met
                                10-150 medewerkers. Geen multinationals, geen logge
                                IT-projecten. Gewoon: simpel, snel, en dat het werkt.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Current Situation */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Herken je deze situatie?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                De meeste kleine fabrieken werken op dezelfde manier:
                                improviseren, brandjes blussen, en hopen dat het goed
                                gaat.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <X className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-xl">
                                        Storingen via WhatsApp
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        "Machine 3 staat stil!" Operator appt naar de TD.
                                        Tien minuten later nog een storing. Over een week
                                        is niemand meer welke machine wat had.
                                    </p>
                                    <p className="text-sm font-medium">
                                        → Informatie verdwijnt in berichtenstroom
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <X className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-xl">
                                        Excel met periodiek onderhoud
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Er is een Excel-lijst met "Wanneer moet wat
                                        gebeuren". Maar die ligt op iemands computer, wordt
                                        nooit bijgewerkt, en niemand kijkt ernaar.
                                    </p>
                                    <p className="text-sm font-medium">
                                        → Preventief werk wordt vergeten
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <X className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-xl">
                                        Whiteboard voor planning
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        TD schrijft op het whiteboard wat deze week moet
                                        gebeuren. Over een maand is die informatie
                                        uitgewist en weet niemand meer wat er is gebeurd.
                                    </p>
                                    <p className="text-sm font-medium">
                                        → Geen geschiedenis, geen leren van fouten
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <X className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-xl">
                                        Kennis in iemands hoofd
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        De hoofd-monteur weet alles: welke machine vaak
                                        uitvalt, wat de oplossing is, wanneer periodiek
                                        onderhoud moet. Maar als hij weg is, is die kennis
                                        ook weg.
                                    </p>
                                    <p className="text-sm font-medium">
                                        → Kwetsbaar, niet schaalbaar
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Mini Cases */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Voor wie is LineCare?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Kleine productiebedrijven die serieus werk doen, maar
                                geen logge IT willen.
                            </p>
                        </div>

                        <div className="mb-16 grid gap-8 lg:grid-cols-2">
                            {/* Case 1 */}
                            <Card>
                                <CardHeader>
                                    <Factory className="mb-4 h-12 w-12 text-primary" />
                                    <CardTitle className="text-2xl">
                                        Fabriek met 40 medewerkers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Situatie:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Metaalbewerking, 2 productielijnen, 15
                                            machines. 1 hoofd TD met 2 monteurs. Operators
                                            melden storingen via WhatsApp, TD houdt Excel
                                            bij.
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Probleem:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            "We weten dat machine 5 vaak uitvalt, maar niet
                                            hoe vaak precies. Geen data voor nieuwe
                                            machine te rechtvaardigen bij directie."
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Met LineCare:
                                        </p>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    Operators melden storing in 30 seconden
                                                    via telefoon
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    TD ziet direct: machine 5 heeft 12
                                                    storingen gehad, totaal 8 uur stilstand
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    Data exporteren voor directie:
                                                    investeringsvoorstel onderbouwd
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Case 2 */}
                            <Card>
                                <CardHeader>
                                    <Building2 className="mb-4 h-12 w-12 text-primary" />
                                    <CardTitle className="text-2xl">
                                        Familiebedrijf met 2 lijnen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Situatie:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Kunststof spuitgieten, 25 medewerkers, 2
                                            productie lijnen. Eigenaar doet zelf veel TD
                                            werk, 1 fulltime monteur. Periodiek onderhoud
                                            wordt vaak vergeten.
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Probleem:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            "Als ik een week weg ben, gebeurt er geen
                                            preventief onderhoud. Alles zit in mijn hoofd.
                                            En als er een storing is, duurt het te lang
                                            voordat ik het hoor."
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-semibold">
                                            Met LineCare:
                                        </p>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    Periodiek onderhoud ingepland: elke 3
                                                    maanden automatisch werkorder
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    Storingen worden direct gemeld in systeem,
                                                    ook als eigenaar er niet is
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                <span>
                                                    Kennis blijft behouden: wat was het
                                                    probleem, hoe is het opgelost
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Why for small factories */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Waarom speciaal voor kleine fabrieken?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                LineCare is bewust niet gebouwd voor multinationals. Het
                                is gemaakt voor jou.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <Users className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Geen overbodige modules</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Grote CMMS-pakketten hebben modules voor
                                        energiemonitoring, spare parts tracking, shift
                                        planning, ERP integraties... die je nooit gebruikt.
                                        LineCare: alleen wat je echt nodig hebt.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Setup in dagen, niet maanden</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Grote systemen kosten 6 maanden implementatie,
                                        consultants, training, aanpassingen. LineCare:
                                        machines importeren, gebruikers toevoegen, klaar.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Wrench className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Betaalbaar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Enterprise CMMS kost €10.000+ per jaar. LineCare
                                        begint bij €49/maand. Geen setup kosten, geen
                                        verborgen prijzen.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Settings className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Geen IT-afdeling nodig</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        LineCare draait in de cloud. Geen servers, geen
                                        updates, geen IT-configuratie. Log in en ga.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Users className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Simpel voor operators</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Geen wekenlange training nodig. Operators kunnen
                                        storing melden in 30 seconden. Werkt op telefoon,
                                        geen computer nodig.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Start klein, groei mee</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Begin met 5 gebruikers, groei naar 15. Begin met 1
                                        locatie, voeg er later meer toe. LineCare groeit
                                        mee.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Who uses it */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Wie gebruikt LineCare?
                            </h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <Wrench className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle className="text-xl">
                                        Hoofd Technische Dienst
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Minder tijd kwijt aan brandjes blussen en zoeken
                                        naar informatie. Meer tijd voor echt preventief
                                        werk.
                                    </p>
                                    <p className="text-sm font-medium">
                                        "Eindelijk overzicht over wat er speelt."
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Settings className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle className="text-xl">
                                        Productie Manager
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Data om te onderbouwen welke machines vervangen
                                        moeten worden. Inzicht in stilstand en kosten.
                                    </p>
                                    <p className="text-sm font-medium">
                                        "Nu kan ik cijfers laten zien aan de directie."
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Building2 className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle className="text-xl">
                                        Eigenaar Maakbedrijf
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Professionaliseer onderhoud zonder grote
                                        investering. Begin klein, zie direct resultaat.
                                    </p>
                                    <p className="text-sm font-medium">
                                        "Simpel, snel, en het werkt gewoon."
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-3xl font-bold">
                            Klinkt dit als jouw fabriek?
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Plan een demo en zie of LineCare past bij jouw situatie.
                            Geen verplichtingen, gewoon kijken.
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
                                <ul className="space-y-2 text-sm text-muted-foreground">
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
