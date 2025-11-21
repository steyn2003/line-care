import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { MarketingLayout } from '@/layouts/marketing-layout';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    MessageSquare,
    PlayCircle,
    Settings,
    Smartphone,
    TrendingUp,
    Upload,
    Wrench,
    X,
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
        // TODO: Handle form submission
        console.log('Demo request:', formData);
    };

    return (
        <MarketingLayout
            title="LineCare - Eenvoudige onderhoudssoftware voor kleine fabrieken"
            canRegister={canRegister}
            currentPath="/"
        >
                {/* Hero Section */}
                <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 px-6 py-16">
                    <div className="max-w-3xl text-center">
                        <Badge
                            variant="secondary"
                            className="rounded-full border-border py-1"
                        >
                            Speciaal voor kleine fabrieken 🏭
                        </Badge>
                        <h1 className="mt-6 text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
                            Eenvoudige onderhoudssoftware voor kleine fabrieken
                        </h1>
                        <p className="mt-6 text-foreground/80 md:text-lg">
                            Stop met Excel, WhatsApp en whiteboards. LineCare helpt je
                            storingen registreren, periodiek onderhoud plannen, en
                            inzicht krijgen in welke machines de meeste stilstand
                            veroorzaken.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <a href="#demo">
                                <Button size="lg" className="rounded-full text-base">
                                    Plan een demo{' '}
                                    <ArrowUpRight className="ml-1 h-5 w-5" />
                                </Button>
                            </a>
                            <a href="#hoe-het-werkt">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full text-base shadow-none"
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" /> Bekijk hoe
                                    het werkt
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="mx-auto aspect-video w-full max-w-7xl rounded-xl bg-accent" />
                </section>

                {/* Problem Section */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Herkenbaar? Onderhoud versnipperd in Excel, WhatsApp en
                            op het whiteboard
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <MessageSquare className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-lg">
                                        Storingen via WhatsApp verdwijnen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Operator appt een storing, maar na 100
                                        berichten is het weer zoeken welke machine
                                        het was.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <FileSpreadsheet className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-lg">
                                        Periodiek onderhoud in Excel of iemands hoofd
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Wanneer moet die machine weer gesmeerd? Die
                                        vraag leeft alleen in het hoofd van je TD.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <X className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-lg">
                                        Geen overzicht welke machines meeste stilstand
                                        veroorzaken
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Je weet dat machine 3 vaak uitvalt, maar hoe
                                        vaak precies? En wat kost dat?
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <TrendingUp className="mb-2 h-8 w-8 text-destructive" />
                                    <CardTitle className="text-lg">
                                        Moeilijk kosten te tonen aan directie
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Zonder data is het lastig om investeringen in
                                        nieuwe machines te onderbouwen.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-12 text-center">
                            <p className="text-lg text-muted-foreground">
                                Als hoofd TD ben je constant brandjes aan het
                                blussen. Er is geen tijd om alles netjes bij te
                                houden, maar dat gebrek aan overzicht maakt je werk
                                alleen maar drukker.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Alles rond onderhoud op één plek
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                LineCare is een eenvoudig CMMS (Computerized
                                Maintenance Management System) speciaal voor kleine
                                fabrieken. Geen ingewikkelde modules die je nooit
                                gebruikt, maar precies wat je nodig hebt.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <Smartphone className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Storingen melden</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Operator meldt storing in 30 seconden via
                                        mobiel. Machine, korte omschrijving, foto -
                                        klaar.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Clock className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Periodiek onderhoud</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Stel taken in (elke 3 maanden smeren) en krijg
                                        automatisch herinneringen.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Overzicht per machine</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Zie direct: hoeveel storingen, totale
                                        stilstand, laatste onderhoud.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Upload className="mb-2 h-10 w-10 text-primary" />
                                    <CardTitle>Snel starten</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Importeer je Excel-lijst met machines en ga
                                        binnen een paar dagen live.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="hoe-het-werkt" className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Hoe LineCare werkt in jouw fabriek
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                        1
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Machines aanmaken/importeren
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Voeg je machines toe via een simpel formulier of
                                    importeer je bestaande Excel-lijst.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                        2
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Operators melden storingen via mobiel
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Storing? Selecteer machine, beschrijf probleem,
                                    voeg eventueel foto toe. Klaar in 30 seconden.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                        3
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    TD plant en voert werk uit
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Technische dienst ziet alle openstaande taken,
                                    pakt werk op en registreert wat gedaan is.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                        4
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Inzicht in stilstand per machine
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Dashboard toont direct welke machines het vaakst
                                    uitvallen en hoeveel stilstand ze veroorzaken.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Who Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-center text-3xl font-bold">
                            Voor kleine productiebedrijven met serieuze machines,
                            maar geen logge IT
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground">
                            LineCare is gemaakt voor Nederlandse maakbedrijven met
                            10-150 medewerkers. Of je nu metaal bewerkt, kunststof
                            spuit, voedsel verpakt of hout zaagt - als je machines
                            hebt die onderhoud nodig hebben, is LineCare voor jou.
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <Wrench className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Hoofd technische dienst / TD</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Minder tijd kwijt aan zoeken en brandjes
                                        blussen. Meer tijd voor preventief werk en
                                        echte verbeteringen.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Settings className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Productie- of operations manager</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Eindelijk data over stilstand en
                                        onderhoudskosten. Onderbouw investeringen met
                                        harde cijfers.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle>Eigenaar maakbedrijf</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Professionaliseer zonder grote IT-projecten.
                                        Begin klein, zie direct resultaat.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pilot Section */}
                <section className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-center text-3xl font-bold">
                            Start met een kleine pilot, niet met een groot IT-project
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground">
                            We geloven in klein beginnen en snel waarde leveren. Geen
                            halfjarige implementaties, maar een pilot van 3 maanden
                            waar je direct resultaat van ziet.
                        </p>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Setup in een paar dagen
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Importeer je machines, voeg gebruikers toe, en je
                                    bent klaar. Geen maanden wachten.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Training voor operators en TD
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Simpele training zodat iedereen meteen aan de slag
                                    kan. Geen dikke handleidingen.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Maandelijkse check-in en rapportje
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    We kijken samen hoe het gaat en wat beter kan.
                                    Persoonlijke begeleiding, geen grote consultancy.
                                </p>
                            </div>
                        </div>
                        <div className="mt-12 text-center">
                            <a href="#demo">
                                <Button size="lg">Plan een pilot-gesprek</Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Veelgestelde vragen over onderhoudssoftware (CMMS)
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left">
                                    Wat is het verschil tussen LineCare en een groot
                                    CMMS-pakket?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Grote CMMS-pakketten zijn gebouwd voor
                                    multinationals met honderden machines, complexe
                                    workflows en grote IT-afdelingen. LineCare is
                                    simpel: storingen registreren, periodiek onderhoud
                                    plannen, en inzicht in stilstand. Precies wat een
                                    kleine fabriek nodig heeft, zonder overbodige
                                    complexiteit.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left">
                                    Hoe snel kunnen we live gaan?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Met een CSV-import van je machines en een korte
                                    onboarding kun je binnen een paar dagen live. De
                                    eerste storingen kunnen operators meteen
                                    registreren, en je TD kan direct aan de slag met
                                    het afhandelen van werk.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left">
                                    Werkt dit op telefoon en tablet?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Ja! LineCare is volledig responsive en werkt
                                    perfect op mobiele apparaten. Operators kunnen
                                    storingen direct vanaf de werkvloer melden, en
                                    technici kunnen werkorders bekijken en updaten op
                                    hun telefoon.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left">
                                    Kunnen we onze huidige Excel-lijst met machines
                                    importeren?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Absoluut. Je kunt een CSV-bestand uploaden met je
                                    machines, locaties, en andere basisgegevens.
                                    LineCare toont een preview zodat je kunt
                                    controleren of alles klopt, en daarna importeer je
                                    alles met één klik.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left">
                                    Hoeveel kost het per maand?
                                </AccordionTrigger>
                                <AccordionContent>
                                    We werken met transparante prijzen op basis van het
                                    aantal gebruikers. Voor een pilot starten we vaak
                                    met een voordeeltarief zodat je LineCare eerst kunt
                                    uitproberen. Neem contact op voor een persoonlijke
                                    offerte.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                {/* Contact/Demo Section */}
                <section id="demo" className="bg-muted/50 py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Plan een korte online demo
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Benieuwd of LineCare past bij jouw fabriek? Vul het
                                formulier in en we nemen binnen 1 werkdag contact op
                                voor een vrijblijvende demo.
                            </p>
                        </div>
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Naam *</Label>
                                            <Input
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Bedrijf *</Label>
                                            <Input
                                                id="company"
                                                required
                                                value={formData.company}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        company: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
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
                                                        employees: e.target.value,
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
                                    <Button type="submit" size="lg" className="w-full">
                                        Aanvragen
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

        </MarketingLayout>
    );
}
