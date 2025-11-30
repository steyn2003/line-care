import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MarketingLayout } from '@/layouts/marketing-layout';
import {
    ArrowRight,
    BarChart3,
    Box,
    CheckCircle2,
    Clock,
    DollarSign,
    Gauge,
    Play,
    Settings,
    Smartphone,
    Sparkles,
    TrendingDown,
    Upload,
    Wrench,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        employees: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Demo request:', formData);
    };

    return (
        <MarketingLayout
            title="LineCare - Eenvoudige onderhoudssoftware voor kleine fabrieken"
            canRegister={canRegister}
            currentPath="/"
        >
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

                <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge
                            variant="secondary"
                            className="mb-8 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            Compleet CMMS voor kleine fabrieken
                        </Badge>

                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                            Onderhoud beheren{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                zonder gedoe
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            Stop met Excel, WhatsApp en whiteboards. LineCare
                            helpt je storingen registreren, periodiek onderhoud
                            plannen, reserveonderdelen beheren en
                            onderhoudskosten inzichtelijk maken.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a href="/trial">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base font-semibold"
                                >
                                    Start gratis trial
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                            <a href="#demo">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base font-semibold"
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Bekijk demo
                                </Button>
                            </a>
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground">
                            14 dagen gratis. Geen creditcard nodig.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="relative mx-auto mt-16 max-w-6xl">
                        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl" />
                        <div className="relative overflow-hidden rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm">
                            <img
                                src="/images/marketing/line-care-dashbaord.png"
                                alt="LineCare dashboard"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Logos */}
            <section className="border-y bg-muted/30 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-8 text-center text-sm font-medium tracking-wider text-muted-foreground uppercase">
                        Vertrouwd door maakbedrijven in Nederland
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale">
                        {/* Placeholder: Company logos - Replace with actual customer logos */}
                        <div className="h-8 w-32 rounded bg-muted-foreground/20" />
                        <div className="h-8 w-28 rounded bg-muted-foreground/20" />
                        <div className="h-8 w-36 rounded bg-muted-foreground/20" />
                        <div className="h-8 w-32 rounded bg-muted-foreground/20" />
                        <div className="h-8 w-28 rounded bg-muted-foreground/20" />
                    </div>
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        [Placeholder: Voeg hier logo's toe van klanten of
                        bekende Nederlandse maakbedrijven]
                    </p>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Het probleem
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Herkenbaar? Onderhoud versnipperd over Excel,
                            WhatsApp en whiteboards
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Als hoofd TD ben je constant brandjes aan het
                            blussen. Er is geen tijd om alles netjes bij te
                            houden, maar dat gebrek aan overzicht maakt je werk
                            alleen maar drukker.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Smartphone,
                                title: 'WhatsApp chaos',
                                description:
                                    'Storingen verdwijnen in eindeloze chatgroepen. Na 100 berichten weet niemand meer welke machine het was.',
                            },
                            {
                                icon: Clock,
                                title: 'Onderhoud in iemands hoofd',
                                description:
                                    'Wanneer moet die machine weer gesmeerd? Die informatie zit alleen in het hoofd van je TD.',
                            },
                            {
                                icon: Box,
                                title: 'Onderdelen kwijt',
                                description:
                                    'Welke onderdelen hebben we nog? Waar liggen ze? Wanneer bijbestellen? Niemand weet het zeker.',
                            },
                            {
                                icon: Gauge,
                                title: 'Geen OEE inzicht',
                                description:
                                    'Hoeveel produceren we echt vs. wat we zouden kunnen? Zonder data blijft het gissen.',
                            },
                            {
                                icon: TrendingDown,
                                title: 'Stilstand onbekend',
                                description:
                                    'Je weet dat machine 3 vaak uitvalt, maar hoe vaak precies? En wat kost het je?',
                            },
                            {
                                icon: DollarSign,
                                title: 'Kosten onduidelijk',
                                description:
                                    'Zonder data is het lastig om investeringen in nieuwe machines te onderbouwen bij directie.',
                            },
                        ].map((problem, index) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-destructive/20 bg-destructive/5 transition-all hover:border-destructive/40 hover:bg-destructive/10"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-lg bg-destructive/10 p-2.5">
                                        <problem.icon className="h-5 w-5 text-destructive" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {problem.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {problem.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="relative overflow-hidden bg-muted/30 py-24">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 border-primary/30 bg-primary/5"
                        >
                            De oplossing
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Alles rond onderhoud op een plek
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            LineCare is een compleet CMMS speciaal voor kleine
                            fabrieken. Van storingen melden tot OEE meten, van
                            reserveonderdelen tot kostenbeheer.
                        </p>
                    </div>

                    {/* Screenshot */}
                    <div className="relative mx-auto mt-12 max-w-5xl">
                        <div className="overflow-hidden rounded-xl border bg-background shadow-xl">
                            <img
                                src="/images/marketing/work-order-dashboard.png"
                                alt="LineCare werk orders overzicht"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Smartphone,
                                title: 'Storingen melden',
                                description:
                                    'Operator meldt storing in 30 seconden via mobiel. Machine, omschrijving, foto - klaar.',
                            },
                            {
                                icon: Clock,
                                title: 'Periodiek onderhoud',
                                description:
                                    'Stel taken in (elke 3 maanden smeren) en krijg automatisch herinneringen en werkorders.',
                            },
                            {
                                icon: Box,
                                title: 'Reserveonderdelen',
                                description:
                                    'Voorraad bijhouden, automatische herbestelmeldingen, inkooporders en leveranciersbeheer.',
                            },
                            {
                                icon: Gauge,
                                title: 'OEE tracking',
                                description:
                                    'Meet beschikbaarheid, prestatie en kwaliteit. Zie direct waar productieverlies zit.',
                            },
                            {
                                icon: DollarSign,
                                title: 'Kostenbeheer',
                                description:
                                    'Arbeidskosten, onderdeelkosten en stilstandkosten per werkorder. Budget vs. werkelijk.',
                            },
                            {
                                icon: Upload,
                                title: 'Snel starten',
                                description:
                                    'Importeer je Excel-lijst met machines en ga binnen een paar dagen live.',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="group flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="hoe-het-werkt" className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Hoe het werkt
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            In 4 stappen naar gestructureerd onderhoud
                        </h2>
                    </div>

                    <div className="mt-20 space-y-24">
                        {/* Step 1 */}
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        1
                                    </span>
                                    <span className="font-medium text-primary">
                                        Machines importeren
                                    </span>
                                </div>
                                <h3 className="mt-6 text-2xl font-bold">
                                    Start binnen een paar dagen
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    Voeg je machines toe via een simpel
                                    formulier of importeer je bestaande
                                    Excel-lijst. Binnen enkele minuten heb je
                                    alle machines in het systeem staan.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {[
                                        'CSV import voor bulk uploads',
                                        'Locaties en afdelingen structuur',
                                        "Foto's en documenten toevoegen",
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="overflow-hidden rounded-xl border bg-muted/30 shadow-lg">
                                    <img
                                        src="/images/marketing/import-machine-data.png"
                                        alt="Machine import interface"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-lg">
                                    {/* Placeholder: Mobile screenshot of breakdown reporting */}
                                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
                                        <div className="text-center">
                                            <Smartphone className="mx-auto h-16 w-16 text-muted-foreground/30" />
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                [Placeholder: Screenshot van
                                                mobiele storingsmelding
                                                interface]
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        2
                                    </span>
                                    <span className="font-medium text-primary">
                                        Storingen melden
                                    </span>
                                </div>
                                <h3 className="mt-6 text-2xl font-bold">
                                    Operators melden via mobiel
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    Storing? Selecteer machine, beschrijf
                                    probleem, voeg eventueel foto toe. Klaar in
                                    30 seconden. Geen gedoe met WhatsApp of
                                    papieren formulieren meer.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {[
                                        'QR-code scanning voor snelle selectie',
                                        "Foto's direct vanaf de werkvloer",
                                        'Automatische notificaties naar TD',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        3
                                    </span>
                                    <span className="font-medium text-primary">
                                        Werk uitvoeren
                                    </span>
                                </div>
                                <h3 className="mt-6 text-2xl font-bold">
                                    TD plant en voert werk uit
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    Technische dienst ziet alle openstaande
                                    taken in een overzicht, pakt werk op,
                                    registreert gebruikte onderdelen en bestede
                                    tijd. Alle informatie op een plek.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {[
                                        'Prioritering en toewijzing',
                                        'Onderdelen uit voorraad boeken',
                                        'Tijdsregistratie voor kostenanalyse',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-lg">
                                    {/* Placeholder: Work order list screenshot */}
                                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
                                        <div className="text-center">
                                            <Wrench className="mx-auto h-16 w-16 text-muted-foreground/30" />
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                [Placeholder: Screenshot van
                                                werkorder lijst voor technici]
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-lg">
                                    {/* Placeholder: Analytics dashboard screenshot */}
                                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
                                        <div className="text-center">
                                            <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/30" />
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                [Placeholder: Screenshot van
                                                analytics dashboard met OEE en
                                                kosten]
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        4
                                    </span>
                                    <span className="font-medium text-primary">
                                        Inzicht krijgen
                                    </span>
                                </div>
                                <h3 className="mt-6 text-2xl font-bold">
                                    Data voor betere beslissingen
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    Dashboard toont direct welke machines het
                                    vaakst uitvallen, wat de OEE is, en hoeveel
                                    het kost. Eindelijk data om beslissingen op
                                    te baseren.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {[
                                        'OEE per machine en periode',
                                        'Kostenanalyse en budgetbewaking',
                                        'Export naar Excel voor rapportages',
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Who Section */}
            <section className="relative overflow-hidden bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <Badge variant="outline" className="mb-4">
                                Voor wie
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Voor maakbedrijven met serieuze machines, zonder
                                logge IT
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                LineCare is gemaakt voor Nederlandse
                                maakbedrijven met 10-150 medewerkers. Of je nu
                                metaal bewerkt, kunststof spuit, voedsel verpakt
                                of hout zaagt - als je machines hebt die
                                onderhoud nodig hebben, is LineCare voor jou.
                            </p>

                            <div className="mt-10 space-y-6">
                                {[
                                    {
                                        icon: Wrench,
                                        title: 'Hoofd technische dienst',
                                        description:
                                            'Minder tijd kwijt aan zoeken en brandjes blussen. Meer tijd voor preventief werk.',
                                    },
                                    {
                                        icon: Settings,
                                        title: 'Productie- of operations manager',
                                        description:
                                            'Eindelijk data over stilstand, OEE en kosten. Onderbouw investeringen met cijfers.',
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Eigenaar maakbedrijf',
                                        description:
                                            'Professionaliseer zonder grote IT-projecten. Begin klein, zie direct resultaat.',
                                    },
                                ].map((persona, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <persona.icon className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                {persona.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {persona.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            {/* Placeholder: Factory photo */}
                            <div className="overflow-hidden rounded-2xl border bg-muted/30 shadow-xl">
                                <img
                                    src="/images/marketing/small-factory.jpg"
                                    alt="Kleine fabriek met machines"
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                value: '30 sec',
                                label: 'Om een storing te melden',
                            },
                            { value: '< 1 week', label: 'Om live te gaan' },
                            {
                                value: '20%',
                                label: 'Minder ongeplande stilstand',
                            },
                            {
                                value: '100%',
                                label: 'Zicht op onderhoudskosten',
                            },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pilot Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            Aanpak
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Start met een kleine pilot, niet een groot
                            IT-project
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We geloven in klein beginnen en snel waarde leveren.
                            Geen halfjarige implementaties, maar een pilot van 3
                            maanden waar je direct resultaat van ziet.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                title: 'Setup in een paar dagen',
                                description:
                                    'Importeer je machines, voeg gebruikers toe, en je bent klaar. Geen maanden wachten.',
                            },
                            {
                                title: 'Training voor operators en TD',
                                description:
                                    'Simpele training zodat iedereen meteen aan de slag kan. Geen dikke handleidingen.',
                            },
                            {
                                title: 'Maandelijkse check-in',
                                description:
                                    'We kijken samen hoe het gaat en wat beter kan. Persoonlijke begeleiding.',
                            },
                        ].map((step, index) => (
                            <Card
                                key={index}
                                className="relative overflow-hidden border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
                            >
                                <CardContent className="p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a href="/trial">
                            <Button size="lg" className="h-12 px-8">
                                Start gratis trial
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                        <a href="#demo">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 px-8"
                            >
                                Plan een pilot-gesprek
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4">
                            FAQ
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Veelgestelde vragen
                        </h2>
                    </div>

                    <Accordion
                        type="single"
                        collapsible
                        className="mx-auto mt-12 w-full max-w-3xl"
                    >
                        {[
                            {
                                question:
                                    'Wat is het verschil tussen LineCare en een groot CMMS-pakket?',
                                answer: 'Grote CMMS-pakketten zijn gebouwd voor multinationals met honderden machines, complexe workflows en grote IT-afdelingen. LineCare is compleet maar simpel: storingen registreren, periodiek onderhoud plannen, reserveonderdelen beheren, OEE meten en kosten bijhouden. Precies wat een kleine fabriek nodig heeft, zonder overbodige complexiteit.',
                            },
                            {
                                question: 'Hoe snel kunnen we live gaan?',
                                answer: 'Met een CSV-import van je machines en een korte onboarding kun je binnen een paar dagen live. De eerste storingen kunnen operators meteen registreren, en je TD kan direct aan de slag met het afhandelen van werk.',
                            },
                            {
                                question: 'Werkt dit op telefoon en tablet?',
                                answer: 'Ja! LineCare is volledig responsive en werkt perfect op mobiele apparaten. Operators kunnen storingen direct vanaf de werkvloer melden, en technici kunnen werkorders bekijken en updaten op hun telefoon.',
                            },
                            {
                                question:
                                    'Kunnen we onze huidige Excel-lijst met machines importeren?',
                                answer: 'Absoluut. Je kunt een CSV-bestand uploaden met je machines, locaties, en andere basisgegevens. LineCare toont een preview zodat je kunt controleren of alles klopt, en daarna importeer je alles met een klik.',
                            },
                            {
                                question:
                                    'Kan LineCare ons voorraad reserveonderdelen beheren?',
                                answer: 'Ja! LineCare heeft een complete module voor reserveonderdelen: onderdelen catalogus, voorraadniveaus per locatie, automatische herbestelmeldingen, inkooporders en leveranciersbeheer. Je koppelt gebruikte onderdelen aan werkorders voor volledig kosteninsicht.',
                            },
                            {
                                question:
                                    'Wat is OEE en hoe helpt LineCare daarbij?',
                                answer: 'OEE (Overall Equipment Effectiveness) meet hoe effectief je machines draaien: Beschikbaarheid x Prestatie x Kwaliteit. LineCare berekent dit automatisch op basis van productieruns en stilstandregistraties. Je ziet direct waar productieverlies zit en kunt gericht verbeteren.',
                            },
                            {
                                question: 'Hoeveel kost het per maand?',
                                answer: 'LineCare werkt met drie prijsniveaus: Starter vanaf EUR 49/maand voor basisonderhoud, Professional vanaf EUR 149/maand inclusief reserveonderdelen en OEE, en Enterprise met integraties en geavanceerde analytics op maat. Voor een pilot starten we vaak met een voordeeltarief zodat je LineCare eerst kunt uitproberen.',
                            },
                        ].map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-border/50"
                            >
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <span className="font-medium">
                                        {faq.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-primary/10" />
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Klaar om onderhoud simpeler te maken?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Start vandaag nog met een gratis trial van 14 dagen.
                            Geen creditcard nodig, geen verplichtingen. Ontdek
                            zelf hoe LineCare je werk makkelijker maakt.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a href="/trial">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-base font-semibold"
                                >
                                    Start gratis trial
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                            <a href="#demo">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base font-semibold"
                                >
                                    Plan een demo
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact/Demo Section */}
            <section id="demo" className="border-t py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <Badge variant="outline" className="mb-4">
                                Contact
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Plan een korte online demo
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Benieuwd of LineCare past bij jouw fabriek? Vul
                                het formulier in en we nemen binnen 1 werkdag
                                contact op voor een vrijblijvende demo.
                            </p>

                            <div className="mt-10 space-y-6">
                                {[
                                    '30 minuten videocall',
                                    'Live demo van alle functies',
                                    'Beantwoording van al je vragen',
                                    'Geen verkooppraatje, gewoon eerlijk advies',
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Card className="border-2">
                                <CardContent className="p-8">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Naam *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="company">
                                                    Bedrijf *
                                                </Label>
                                                <Input
                                                    id="company"
                                                    required
                                                    value={formData.company}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            company:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="employees">
                                                    Aantal medewerkers
                                                </Label>
                                                <Input
                                                    id="employees"
                                                    placeholder="Bijv. 50"
                                                    value={formData.employees}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            employees:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                Bericht (optioneel)
                                            </Label>
                                            <Textarea
                                                id="message"
                                                rows={4}
                                                placeholder="Vertel ons kort over je situatie..."
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        message: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full"
                                        >
                                            Demo aanvragen
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
