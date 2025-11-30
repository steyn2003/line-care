import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
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
    const values = [
        {
            icon: Zap,
            title: 'Simpel houden',
            description:
                'Elke feature die we toevoegen vraagt om rechtvaardiging. Als het niet echt nodig is, bouwen we het niet. Complexiteit is de vijand van gebruik.',
        },
        {
            icon: CheckCircle2,
            title: 'Snel waarde leveren',
            description:
                'Geen halfjarige implementaties. Je moet binnen dagen live kunnen gaan. Begin klein, zie direct resultaat, bouw verder.',
        },
        {
            icon: Heart,
            title: 'Luisteren naar klanten',
            description:
                'We bouwen niet wat wij denken dat nodig is. We bouwen wat kleine fabrieken echt nodig hebben. Elke feature komt uit echte feedback.',
        },
        {
            icon: Users,
            title: 'Toegankelijk voor iedereen',
            description:
                'Operator, monteur, manager - iedereen moet het kunnen gebruiken zonder training. Software moet werken, niet irriteren.',
        },
        {
            icon: Target,
            title: 'Focus op kleine fabrieken',
            description:
                'We zeggen bewust "nee" tegen multinationals. We bouwen voor 10-150 medewerkers. Dat is onze focus, en die houden we.',
        },
        {
            icon: CheckCircle2,
            title: 'Transparant en eerlijk',
            description:
                'Geen verborgen kosten. Geen gedoe. Je weet precies wat je krijgt en wat het kost. Cancel wanneer je wilt.',
        },
    ];

    const howWeWork = [
        {
            step: '1',
            title: 'Start met een gesprek',
            description:
                'We beginnen niet met een sales pitch. We beginnen met luisteren. Wat is je situatie? Wat gaat er nu mis? Wat wil je bereiken?',
        },
        {
            step: '2',
            title: 'Demo op jouw situatie',
            description:
                'Geen standaard PowerPoint. We laten LineCare zien met voorbeelden die passen bij jouw fabriek. Je ziet direct hoe het zou werken voor jou.',
        },
        {
            step: '3',
            title: 'Pilot van 3 maanden',
            description:
                'Start klein. Importeer je machines, voeg gebruikers toe, ga live. We checken maandelijks in: hoe gaat het, wat kan beter?',
        },
    ];

    return (
        <MarketingLayout
            title="Over ons - LineCare"
            canRegister={canRegister}
            currentPath="/over-ons"
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
                            <Heart className="mr-2 h-3.5 w-3.5" />
                            Ons verhaal
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Software voor de mensen die{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                echt maken
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Niet voor multinationals, maar voor de kleine
                            fabrieken die de ruggengraat van de Nederlandse
                            industrie vormen.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Ons verhaal
                        </Badge>
                        <h2 className="mb-8 text-3xl font-bold tracking-tight">
                            Waarom we LineCare hebben gebouwd
                        </h2>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <Card className="border-2">
                            <CardContent className="space-y-6 p-8 text-lg text-muted-foreground">
                                <p>
                                    LineCare ontstond uit frustratie. Frustratie
                                    over onderhoudssoftware die te complex is,
                                    te duur is, en te lang duurt om te
                                    implementeren. Frustratie over systemen die
                                    gebouwd zijn voor multinationals met
                                    honderden machines en grote IT-afdelingen.
                                </p>
                                <p>
                                    Maar wat als je een fabriek hebt met 40
                                    medewerkers? Wat als je TD-manager ook nog
                                    eens 10 andere dingen doet? Wat als je geen
                                    6 maanden hebt voor een IT-project?
                                </p>
                                <p>
                                    Dan heb je LineCare nodig. Een systeem dat{' '}
                                    <strong className="text-foreground">
                                        simpel
                                    </strong>{' '}
                                    is,{' '}
                                    <strong className="text-foreground">
                                        snel
                                    </strong>{' '}
                                    werkt, en{' '}
                                    <strong className="text-foreground">
                                        betaalbaar
                                    </strong>{' '}
                                    blijft. Geen overbodige modules. Geen
                                    wekenlange training. Gewoon: doen wat het
                                    moet doen.
                                </p>
                                <p className="text-xl font-semibold text-foreground">
                                    LineCare is gemaakt voor de mensen die echt
                                    maken. Voor jou.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Missie & Visie
                        </Badge>
                        <h2 className="mb-12 text-3xl font-bold tracking-tight">
                            Waar we voor staan
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                            <CardContent className="p-8">
                                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                    <Target className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">
                                    Onze missie
                                </h3>
                                <p className="mb-4 text-lg font-semibold">
                                    Kleine fabrieken helpen professionaliseren
                                    zonder grote IT-projecten.
                                </p>
                                <p className="text-muted-foreground">
                                    We geloven dat onderhoudssoftware niet
                                    complex hoeft te zijn. Dat je geen maanden
                                    moet wachten om live te gaan. Dat software
                                    moet werken voor de mensen, niet andersom.
                                </p>
                                <p className="mt-4 text-muted-foreground">
                                    Onze missie is om elke Nederlandse fabriek
                                    met 10-150 medewerkers toegang te geven tot
                                    professioneel onderhoudsbeheer. Simpel,
                                    snel, betaalbaar.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                            <CardContent className="p-8">
                                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                    <Lightbulb className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">
                                    Onze visie
                                </h3>
                                <p className="mb-4 text-lg font-semibold">
                                    Een wereld waarin elke fabriek weet welke
                                    machines problematisch zijn.
                                </p>
                                <p className="text-muted-foreground">
                                    We zien een toekomst waarin geen enkele
                                    storing meer verdwijnt in WhatsApp. Waarin
                                    preventief onderhoud niet vergeten wordt.
                                    Waarin TD-managers data hebben om
                                    beslissingen te onderbouwen.
                                </p>
                                <p className="mt-4 text-muted-foreground">
                                    Niet omdat ze een duur systeem hebben, maar
                                    omdat het gewoon normaal is geworden om
                                    onderhoud goed bij te houden. Zo normaal als
                                    email. Zo simpel als WhatsApp.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Waarden
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Onze waarden
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Deze principes sturen alles wat we doen bij
                            LineCare.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {values.map((value, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <value.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How we work */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Werkwijze
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Hoe wij werken
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Geen grote consultancy, geen logge processen. Gewoon
                            persoonlijk contact.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {howWeWork.map((step, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        {step.step}
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {step.description}
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
                            Wil je kennismaken?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Plan een korte online demo. Geen verplichtingen,
                            gewoon even kijken of we bij elkaar passen.
                        </p>
                        <div className="mt-10">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Plan een demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
