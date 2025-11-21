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
    CheckCircle2,
    Heart,
    Lightbulb,
    Target,
    Users,
    Zap,
} from 'lucide-react';

export default function OverOns({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <MarketingLayout
            title="Over ons - LineCare"
            canRegister={canRegister}
            currentPath="/over-ons"
        >
                {/* Hero Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Over LineCare
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                                Software gemaakt voor de mensen die echt maken. Niet
                                voor multinationals, maar voor de kleine fabrieken die
                                de ruggengraat van de Nederlandse industrie vormen.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-8 text-center text-3xl font-bold">
                            Ons verhaal
                        </h2>
                        <div className="mx-auto max-w-4xl space-y-6 text-lg text-muted-foreground">
                            <p>
                                LineCare ontstond uit frustratie. Frustratie over
                                onderhoudssoftware die te complex is, te duur is, en te
                                lang duurt om te implementeren. Frustratie over systemen
                                die gebouwd zijn voor multinationals met honderden
                                machines en grote IT-afdelingen.
                            </p>
                            <p>
                                Maar wat als je een fabriek hebt met 40 medewerkers? Wat
                                als je TD-manager ook nog eens 10 andere dingen doet? Wat
                                als je geen 6 maanden hebt voor een IT-project?
                            </p>
                            <p>
                                Dan heb je LineCare nodig. Een systeem dat <strong>simpel</strong> is,{' '}
                                <strong>snel</strong> werkt, en <strong>betaalbaar</strong> blijft. Geen
                                overbodige modules. Geen wekenlange training. Gewoon: doen
                                wat het moet doen.
                            </p>
                            <p className="text-xl font-semibold text-foreground">
                                LineCare is gemaakt voor de mensen die écht maken. Voor
                                jou.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Onze missie en visie
                            </h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <Target className="mb-4 h-12 w-12 text-primary" />
                                    <CardTitle className="text-2xl">Onze missie</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-lg font-semibold">
                                        Kleine fabrieken helpen professionaliseren zonder
                                        grote IT-projecten.
                                    </p>
                                    <p className="text-muted-foreground">
                                        We geloven dat onderhoudssoftware niet complex hoeft
                                        te zijn. Dat je geen maanden moet wachten om live te
                                        gaan. Dat software moet werken voor de mensen, niet
                                        andersom.
                                    </p>
                                    <p className="text-muted-foreground">
                                        Onze missie is om elke Nederlandse fabriek met 10-150
                                        medewerkers toegang te geven tot professioneel
                                        onderhoudsbeheer. Simpel, snel, betaalbaar.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Lightbulb className="mb-4 h-12 w-12 text-primary" />
                                    <CardTitle className="text-2xl">Onze visie</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-lg font-semibold">
                                        Een wereld waarin elke fabriek weet welke machines
                                        problematisch zijn.
                                    </p>
                                    <p className="text-muted-foreground">
                                        We zien een toekomst waarin geen enkele storing meer
                                        verdwijnt in WhatsApp. Waarin preventief onderhoud
                                        niet vergeten wordt. Waarin TD-managers data hebben
                                        om beslissingen te onderbouwen.
                                    </p>
                                    <p className="text-muted-foreground">
                                        Niet omdat ze een duur systeem hebben, maar omdat het
                                        gewoon normaal is geworden om onderhoud goed bij te
                                        houden. Zo normaal als email. Zo simpel als WhatsApp.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">Onze waarden</h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Deze principes sturen alles wat we doen bij LineCare.
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <Zap className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Simpel houden</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Elke feature die we toevoegen vraagt om
                                        rechtvaardiging. Als het niet écht nodig is, bouwen
                                        we het niet. Complexiteit is de vijand van gebruik.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Snel waarde leveren</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Geen halfjarige implementaties. Je moet binnen dagen
                                        live kunnen gaan. Begin klein, zie direct resultaat,
                                        bouw verder.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Heart className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Luisteren naar klanten</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        We bouwen niet wat wij denken dat nodig is. We
                                        bouwen wat kleine fabrieken écht nodig hebben. Elke
                                        feature komt uit echte feedback.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Users className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Toegankelijk voor iedereen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Operator, monteur, manager - iedereen moet het
                                        kunnen gebruiken zonder training. Software moet
                                        werken, niet irriteren.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Target className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Focus op kleine fabrieken</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        We zeggen bewust "nee" tegen multinationals. We
                                        bouwen voor 10-150 medewerkers. Dat is onze focus, en
                                        die houden we.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Transparant en eerlijk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Geen verborgen kosten. Geen gedoe. Je weet precies
                                        wat je krijgt en wat het kost. Cancel wanneer je
                                        wilt.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How we work */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Hoe wij werken
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Geen grote consultancy, geen logge processen. Gewoon
                                persoonlijk contact.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        1
                                    </div>
                                    <CardTitle>Start met een gesprek</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        We beginnen niet met een sales pitch. We beginnen
                                        met luisteren. Wat is je situatie? Wat gaat er nu
                                        mis? Wat wil je bereiken?
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        2
                                    </div>
                                    <CardTitle>Demo op jouw situatie</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Geen standaard PowerPoint. We laten LineCare zien
                                        met voorbeelden die passen bij jouw fabriek. Je ziet
                                        direct hoe het zou werken voor jou.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        3
                                    </div>
                                    <CardTitle>Pilot van 3 maanden</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Start klein. Importeer je machines, voeg gebruikers
                                        toe, ga live. We checken maandelijks in: hoe gaat
                                        het, wat kan beter?
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
                            Wil je kennismaken?
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Plan een korte online demo. Geen verplichtingen, gewoon even
                            kijken of we bij elkaar passen.
                        </p>
                        <Link href="/#demo">
                            <Button size="lg">Plan een demo</Button>
                        </Link>
                    </div>
                </section>

        </MarketingLayout>
    );
}
