import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function OEE({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <MarketingLayout
            title="OEE Tracking - LineCare"
            canRegister={canRegister}
            currentPath="/oee"
        >
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            OEE Tracking voor kleine fabrieken
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                            Meet hoe effectief je machines echt draaien.
                            Begrijp waar productieverlies zit en verbeter
                            gericht. Zonder complexe systemen of dure consultants.
                        </p>
                        <Link href="/#demo">
                            <Button size="lg">
                                Start met OEE meten
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* What is OEE */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Wat is OEE?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            OEE (Overall Equipment Effectiveness) is de
                            standaard om machine-effectiviteit te meten. Het
                            combineert drie factoren tot een percentage.
                        </p>
                    </div>

                    {/* OEE Formula */}
                    <div className="mx-auto mb-12 max-w-4xl rounded-xl bg-white p-8 shadow-lg">
                        <div className="mb-8 text-center">
                            <p className="mb-4 text-lg font-semibold">
                                OEE = Beschikbaarheid x Prestatie x Kwaliteit
                            </p>
                            <p className="text-muted-foreground">
                                Voorbeeld: 90% x 85% x 98% = 75% OEE
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-lg border p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">
                                    Beschikbaarheid
                                </h3>
                                <p className="mb-2 text-2xl font-bold text-blue-600">
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
                            <div className="rounded-lg border p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Zap className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">
                                    Prestatie
                                </h3>
                                <p className="mb-2 text-2xl font-bold text-green-600">
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
                            <div className="rounded-lg border p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                    <Target className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">
                                    Kwaliteit
                                </h3>
                                <p className="mb-2 text-2xl font-bold text-purple-600">
                                    98%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Hoeveel % van de output is direct goed
                                    (geen uitval/herwerk)?
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Verlies: defecten, herwerk, opstartverlies
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benchmarks */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {"<"} 60%
                                </p>
                                <p className="mt-2 font-semibold text-red-700">
                                    Veel ruimte voor verbetering
                                </p>
                                <p className="mt-1 text-sm text-red-600">
                                    Significante verliezen, urgente actie nodig
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="pt-6 text-center">
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
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {">"} 85%
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
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Hoe LineCare OEE berekent
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Geen complexe sensoren nodig. LineCare berekent OEE
                            op basis van productieruns en stilstandregistraties.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <CardTitle>Start productierun</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Activity className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Operator start run: selecteer machine,
                                    product, ploeg. LineCare berekent
                                    theoretische output op basis van cyclustijd.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <CardTitle>Registreer stilstand</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <XCircle className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Bij stilstand: log start/eind en categorie
                                    (storing, omstellen, wachten, pauze).
                                    LineCare telt ongeplande stilstand mee.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <CardTitle>Einde run: output invoeren</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CheckCircle2 className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Bij einde run: voer werkelijke output in,
                                    plus aantal goede stuks vs. defecten.
                                    LineCare berekent de drie OEE-factoren.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <CardTitle>OEE automatisch berekend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Gauge className="mb-4 h-8 w-8 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    LineCare berekent: Beschikbaarheid (tijd),
                                    Prestatie (snelheid), Kwaliteit (uitval).
                                    Resultaat: OEE percentage per run.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* OEE Features */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            OEE functionaliteiten
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Alles wat je nodig hebt om OEE te meten, analyseren
                            en verbeteren.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Gauge className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Real-time OEE dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Live OEE-weergave tijdens productie.
                                    Gauges voor beschikbaarheid, prestatie,
                                    kwaliteit. Ideaal voor schermen op de
                                    werkvloer.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <LineChart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>OEE trends over tijd</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bekijk OEE per dag, week, maand. Spot
                                    verbeteringen of achteruitgang. Filter op
                                    machine, product of ploeg.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Machine vergelijking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Vergelijk OEE tussen machines. Identificeer
                                    top-performers en achterblijvers. Leer van
                                    de beste.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <PieChart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Verlies analyse</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Pareto van verliesoorzaken. Zie direct wat
                                    de grootste impact heeft: storingen,
                                    omstellen, snelheidsverlies of defecten.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Ploegen vergelijken</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Definieer ploegen (dag/avond/nacht). Koppel
                                    productieruns aan shifts. Vergelijk OEE
                                    tussen teams.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Link met werkorders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Stilstand door storing? Klik door naar de
                                    werkorder. Zie wat de oorzaak was en hoe het
                                    is opgelost.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Waarom OEE meten?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            OEE geeft je de data om slimmer te investeren in
                            verbeteringen.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Identificeer verborgen capaciteit
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Veel fabrieken hebben 20-30% verborgen
                                        capaciteit. OEE maakt dit zichtbaar
                                        zodat je kunt verbeteren zonder nieuwe
                                        machines.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Prioriteer verbeteringen
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Is het beschikbaarheid, prestatie of
                                        kwaliteit? OEE laat zien waar de
                                        grootste winst zit zodat je niet in het
                                        duister tast.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Meet het effect van acties
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Nieuwe procedure ingevoerd? Machine
                                        gereviseerd? OEE laat zien of het echt
                                        werkt met harde cijfers.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Onderbouw investeringen
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        "Machine X heeft 65% OEE door storingen,
                                        vervanging levert EUR 50K/jaar op." Data
                                        die de directie begrijpt.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Gemeenschappelijke taal
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        OEE is een wereldwijde standaard.
                                        Productie, TD en management spreken
                                        dezelfde taal over machine-effectiviteit.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Continue verbetering
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        OEE is de basis voor Lean Manufacturing.
                                        Kleine verbeteringen stapelen op tot
                                        grote resultaten.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Results */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Typische resultaten
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Wat fabrieken bereiken na 6 maanden OEE meten met
                            LineCare.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-primary" />
                                <p className="mb-2 text-4xl font-bold text-primary">
                                    +15%
                                </p>
                                <p className="font-semibold">
                                    OEE verbetering
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Gemiddelde stijging door gerichte acties op
                                    basis van OEE-data
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <Clock className="mx-auto mb-4 h-12 w-12 text-primary" />
                                <p className="mb-2 text-4xl font-bold text-primary">
                                    -30%
                                </p>
                                <p className="font-semibold">
                                    Minder ongeplande stilstand
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Door inzicht in storingsoorzaken en
                                    preventieve acties
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="pt-8">
                                <Target className="mx-auto mb-4 h-12 w-12 text-primary" />
                                <p className="mb-2 text-4xl font-bold text-primary">
                                    -20%
                                </p>
                                <p className="font-semibold">
                                    Minder uitval
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Door focus op kwaliteitsverliezen en
                                    rootcause analyse
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
                        Klaar om OEE te meten?
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Start met een demo en zie hoe LineCare OEE tracking
                        simpel maakt. Geen complexe implementatie, binnen dagen
                        operationeel.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/#demo">
                            <Button size="lg" className="w-full sm:w-auto">
                                Plan een demo
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/functionaliteiten">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Alle functionaliteiten
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
