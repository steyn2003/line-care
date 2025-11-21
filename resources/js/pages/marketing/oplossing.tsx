import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
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
                                De oplossing: één plek voor al je onderhoud in de
                                fabriek
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                                LineCare brengt orde in de chaos. Van het moment dat
                                een operator een storing meldt tot het dashboard dat
                                laat zien welke machine het vaakst uitvalt - alles in
                                één systeem.
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
                                tot oplossing.
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
                                        selecteert de machine, beschrijft het probleem
                                        kort ("Snijmes loopt vast"), voegt optioneel
                                        een foto toe. Klaar in 30 seconden.
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
                                        LineCare maakt automatisch een werkorder aan.
                                        Type: "Storing". Status: "Open". Machine:
                                        Snijmachine 3. De TD ziet deze direct
                                        verschijnen in zijn overzicht.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        3
                                    </div>
                                    <CardTitle>TD pakt werk op</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Wrench className="mb-4 h-8 w-8 text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Monteur opent de werkorder, zet status op "In
                                        uitvoering". Lost probleem op (mes
                                        gereinigd). Vult in: wat gedaan, hoelang bezig
                                        geweest, oorzaak (vervuiling).
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        4
                                    </div>
                                    <CardTitle>Klaar & data opgeslagen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CheckCircle2 className="mb-4 h-8 w-8 text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Werkorder afgesloten. LineCare slaat alles op:
                                        welke machine, hoelang stil, wat de oorzaak
                                        was. Manager ziet dit later terug in
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
                                Zie hoe LineCare zorgt dat preventief onderhoud nooit
                                meer vergeten wordt.
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
                                    <CardTitle>LineCare genereert werkorder</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FileText className="mb-4 h-8 w-8 text-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Automatisch, een paar dagen voor de deadline,
                                        maakt LineCare een werkorder aan. Type:
                                        "Preventief". Status: "Gepland".
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
                                        In het werkorder-overzicht verschijnt de taak.
                                        Monteur plant het in, voert het uit, en meldt
                                        "Klaar" met korte notitie.
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

                {/* Key Benefits */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Waarom LineCare werkt
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                De kracht zit in de eenvoud. Geen overbodige modules,
                                geen wekenlange training. Gewoon doen wat het moet
                                doen.
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
                                        werkvloer. LineCare werkt perfect op telefoon
                                        en tablet, zodat niemand naar een computer
                                        hoeft te lopen.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Inzicht in één oogopslag</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Dashboard toont direct: hoeveel open orders,
                                        welke machines vallen het vaakst uit, hoeveel
                                        stilstand deze week. Geen Excel-analyse meer
                                        nodig.
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
                                        Stel periodieke taken één keer in, en LineCare
                                        zorgt dat ze op tijd op de planning komen.
                                        Nooit meer iets vergeten.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <FileText className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Volledige geschiedenis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Elke werkorder, elke storing, elk onderhoud -
                                        alles wordt opgeslagen. Klik op een machine en
                                        zie direct wat er de afgelopen maanden is
                                        gebeurd.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Wrench className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Simpel voor iedereen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Operator hoeft alleen machine en probleem te
                                        selecteren. Monteur ziet meteen wat er moet
                                        gebeuren. Geen complexe formulieren.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Snel live</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Importeer je machines via CSV, voeg je
                                        gebruikers toe, en je bent klaar. Binnen een
                                        paar dagen operationeel, geen maanden
                                        implementatie.
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
