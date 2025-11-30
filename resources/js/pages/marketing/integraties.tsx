import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Bell,
    Box,
    CheckCircle2,
    Cog,
    FileText,
    Gauge,
    Link2,
    Server,
    Thermometer,
    Truck,
    Wifi,
    Zap,
} from 'lucide-react';

export default function Integraties({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const erpIntegrations = [
        {
            name: 'SAP',
            color: 'bg-blue-100 text-blue-600',
            description:
                'Koppel met SAP Business One, S/4HANA of ECC. Synchroniseer materialen, inkooporders en kostencentra.',
            features: [
                'Voorraadsynchronisatie',
                'Inkooporder export',
                'Kosten export naar FI/CO',
            ],
        },
        {
            name: 'Oracle',
            color: 'bg-red-100 text-red-600',
            description:
                'Integreer met Oracle NetSuite, E-Business Suite of Cloud ERP. Bidirectionele sync voor naadloze samenwerking.',
            features: [
                'Items & voorraadniveaus',
                "Leveranciers & PO's",
                'Kostenregistratie',
            ],
        },
        {
            name: 'Dynamics',
            color: 'bg-blue-100 text-blue-700',
            description:
                'Verbind met Dynamics 365 Business Central, Finance & Operations of NAV. Volledige ERP-integratie.',
            features: [
                'Artikelen & voorraad',
                'Inkoopfacturen',
                'Projectkosten',
            ],
        },
        {
            name: 'Odoo',
            color: 'bg-purple-100 text-purple-600',
            description:
                'Native integratie met Odoo ERP. Ideaal voor groeiende bedrijven die al Odoo gebruiken.',
            features: ['Producten sync', 'Inkoop module', 'Boekhouding export'],
        },
        {
            name: 'Exact',
            color: 'bg-green-100 text-green-600',
            description:
                'Populair in de Benelux. Synchroniseer artikelen, leveranciers en boekingen met Exact Online.',
            features: ['Artikelbeheer', 'Inkooporders', 'Grootboekboekingen'],
        },
    ];

    const sensorTypes = [
        {
            icon: Activity,
            name: 'Trilling / Vibratie',
            description:
                'Detecteer slijtage aan lagers, onbalans of losse onderdelen',
        },
        {
            icon: Thermometer,
            name: 'Temperatuur',
            description:
                'Monitor oververhitting van motoren, lagers of hydrauliek',
        },
        {
            icon: Gauge,
            name: 'Druk',
            description:
                'Bewaak hydraulische en pneumatische systemen, detecteer lekkages',
        },
        {
            icon: Zap,
            name: 'Stroom / Energie',
            description:
                'Meet stroomverbruik, detecteer overbelasting of afwijkingen',
        },
    ];

    const protocols = [
        {
            name: 'MQTT',
            description:
                'Standaard voor industriele IoT. Lichtgewicht, betrouwbaar, real-time berichten.',
        },
        {
            name: 'OPC UA',
            description:
                "Industriele standaard voor fabrieksautomatisering. Directe koppeling met PLC's en SCADA.",
        },
        {
            name: 'REST Webhooks',
            description:
                'Eenvoudige HTTP integratie voor sensoren met eigen gateway of cloud platform.',
        },
        {
            name: 'Modbus TCP',
            description:
                'Klassiek industrieel protocol. Ondersteund voor legacy apparatuur.',
        },
    ];

    const notifications = [
        {
            icon: FileText,
            color: 'bg-blue-100 text-blue-600',
            title: 'Werkorder toegewezen',
            description:
                'Technicus krijgt melding bij nieuwe toewijzing met alle details.',
        },
        {
            icon: AlertTriangle,
            color: 'bg-red-100 text-red-600',
            title: 'Werkorder overdue',
            description:
                'Escalatie naar TD en manager als deadline verstreken is.',
        },
        {
            icon: Box,
            color: 'bg-orange-100 text-orange-600',
            title: 'Lage voorraad',
            description:
                'Manager krijgt alert als onderdeel onder herbestelpunt komt.',
        },
        {
            icon: Activity,
            color: 'bg-red-100 text-red-600',
            title: 'Sensor alert',
            description:
                'Kritieke sensor overschrijdt drempel, direct notificatie naar TD.',
        },
        {
            icon: Gauge,
            color: 'bg-yellow-100 text-yellow-600',
            title: 'OEE onder target',
            description:
                'Productiemanager krijgt melding als OEE onder drempelwaarde daalt.',
        },
        {
            icon: Truck,
            color: 'bg-purple-100 text-purple-600',
            title: 'Levering onderweg',
            description:
                'Inkoper krijgt update wanneer leverancier order verzonden heeft.',
        },
    ];

    return (
        <MarketingLayout
            title="Integraties - LineCare"
            canRegister={canRegister}
            currentPath="/integraties"
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
                            <Link2 className="mr-2 h-3.5 w-3.5" />
                            Koppelingen
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            LineCare koppelt met{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                uw bestaande systemen
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Verbind LineCare met je ERP, IoT-sensoren en andere
                            systemen. Automatiseer datastromen en krijg
                            real-time inzicht in je machines.
                        </p>
                    </div>
                </div>
            </section>

            {/* ERP Integrations */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                            <Server className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                ERP Systemen
                            </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            ERP Integraties
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Synchroniseer voorraad, kosten en inkooporders met
                            je ERP-systeem. Geen dubbele invoer, altijd actuele
                            data.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {erpIntegrations.map((erp, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold ${erp.color}`}
                                        >
                                            {erp.name.charAt(0)}
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {erp.name}
                                        </h3>
                                    </div>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {erp.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {erp.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                        <Cog className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Custom API
                                    </h3>
                                </div>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Eigen ERP of maatwerk systeem? Bouw je eigen
                                    integratie met onze REST API. Volledige
                                    documentatie beschikbaar.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        REST API endpoints
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Webhooks
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        API documentatie
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* IoT Sensor Integration */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                            <Wifi className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                IoT
                            </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            IoT Sensor Integratie
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Sluit sensoren aan op je machines en ontvang
                            real-time data. Detecteer problemen voordat ze
                            storingen worden.
                        </p>
                    </div>

                    <div className="mb-12 grid gap-8 lg:grid-cols-2">
                        <div>
                            <h3 className="mb-6 text-xl font-semibold">
                                Ondersteunde sensortypen
                            </h3>
                            <div className="grid gap-4">
                                {sensorTypes.map((sensor, index) => (
                                    <Card
                                        key={index}
                                        className="border-border/50 bg-background/50"
                                    >
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                                <sensor.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">
                                                    {sensor.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {sensor.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-6 text-xl font-semibold">
                                Ondersteunde protocollen
                            </h3>
                            <div className="space-y-4">
                                {protocols.map((protocol, index) => (
                                    <Card
                                        key={index}
                                        className="border-border/50 bg-background/50"
                                    >
                                        <CardContent className="p-4">
                                            <h4 className="mb-2 font-semibold">
                                                {protocol.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {protocol.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* How it works */}
                    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                        <CardContent className="p-8">
                            <h3 className="mb-8 text-center text-xl font-semibold">
                                Hoe werkt IoT integratie?
                            </h3>
                            <div className="grid gap-8 md:grid-cols-4">
                                {[
                                    {
                                        step: '1',
                                        title: 'Sensor meet data',
                                        description:
                                            'Trillingssensor op lager meet 8.5 mm/s (normaal: 2-3 mm/s)',
                                    },
                                    {
                                        step: '2',
                                        title: 'LineCare ontvangt',
                                        description:
                                            'Real-time data binnenkomst via MQTT of webhook, opslag in database',
                                    },
                                    {
                                        step: '3',
                                        title: 'Alert getriggerd',
                                        description:
                                            'Drempel overschreden, alert aangemaakt, notificatie naar TD',
                                    },
                                    {
                                        step: '4',
                                        title: 'Werkorder aangemaakt',
                                        description:
                                            '"Hoge trilling op machine X - lager controleren"',
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                            {item.step}
                                        </div>
                                        <h4 className="mb-2 font-semibold">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Vendor Portal */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                            <Truck className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Leveranciers
                            </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Leveranciersportaal
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Geef je leveranciers toegang tot hun inkooporders.
                            Snellere communicatie, minder e-mails, betere
                            service.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: FileText,
                                title: 'Inkooporders bekijken',
                                description:
                                    'Leveranciers zien hun openstaande orders, artikelen, hoeveelheden en gewenste leverdatum.',
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Status updaten',
                                description:
                                    'Bevestigen, verwerken, verzenden - leverancier update status direct. Jij ziet het meteen in LineCare.',
                            },
                            {
                                icon: Box,
                                title: 'Tracking toevoegen',
                                description:
                                    'Leverancier voegt track & trace nummer toe. Jij kunt de zending volgen zonder te bellen.',
                            },
                            {
                                icon: FileText,
                                title: 'Documenten uploaden',
                                description:
                                    'Pakbon, factuur, certificaat - leverancier upload documenten direct bij de order.',
                            },
                            {
                                icon: Bell,
                                title: 'Automatische notificaties',
                                description:
                                    'Leverancier krijgt e-mail bij nieuwe order. Jij krijgt melding bij statusupdate.',
                            },
                            {
                                icon: Link2,
                                title: 'Veilige toegang',
                                description:
                                    'Leveranciers krijgen eigen API key. Ze zien alleen hun eigen orders, niets anders.',
                            },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Meldingen
                            </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight">
                            Notificaties & Alerts
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Blijf op de hoogte via e-mail of push. Configureer
                            per gebruiker welke meldingen ze ontvangen.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notifications.map((notification, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-background/50 transition-all hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${notification.color}`}
                                        >
                                            <notification.icon className="h-5 w-5" />
                                        </div>
                                        <h4 className="font-semibold">
                                            {notification.title}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.description}
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
                            Klaar om te integreren?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Bespreek je integratiewensen in een demo. We kijken
                            samen wat mogelijk is voor jouw situatie.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/#demo">
                                <Button size="lg" className="h-12 px-8">
                                    Plan een demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/prijzen">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8"
                                >
                                    Bekijk prijzen
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
