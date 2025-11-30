import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    ShoppingCart,
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
    return (
        <MarketingLayout
            title="Integraties - LineCare"
            canRegister={canRegister}
            currentPath="/integraties"
        >
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            LineCare koppelt met uw bestaande systemen
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                            Verbind LineCare met je ERP, IoT-sensoren en andere
                            systemen. Automatiseer datastromen en krijg
                            real-time inzicht in je machines.
                        </p>
                    </div>
                </div>
            </section>

            {/* ERP Integrations */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Server className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            ERP Integraties
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Synchroniseer voorraad, kosten en inkooporders met
                            je ERP-systeem. Geen dubbele invoer, altijd actuele
                            data.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                                        SAP
                                    </div>
                                    SAP
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Koppel met SAP Business One, S/4HANA of ECC.
                                    Synchroniseer materialen, inkooporders en
                                    kostencentra.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Voorraadsynchronisatie
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Inkooporder export
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Kosten export naar FI/CO
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 font-bold text-red-600">
                                        O
                                    </div>
                                    Oracle
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Integreer met Oracle NetSuite, E-Business
                                    Suite of Cloud ERP. Bidirectionele sync
                                    voor naadloze samenwerking.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Items & voorraadniveaus
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Leveranciers & PO's
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Kostenregistratie
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
                                        D
                                    </div>
                                    Microsoft Dynamics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Verbind met Dynamics 365 Business Central,
                                    Finance & Operations of NAV. Volledige
                                    ERP-integratie.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Artikelen & voorraad
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Inkoopfacturen
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Projectkosten
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-600">
                                        O
                                    </div>
                                    Odoo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Native integratie met Odoo ERP. Ideaal voor
                                    groeiende bedrijven die al Odoo gebruiken.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Producten sync
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Inkoop module
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Boekhouding export
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 font-bold text-green-600">
                                        E
                                    </div>
                                    Exact Online
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Populair in de Benelux. Synchroniseer
                                    artikelen, leveranciers en boekingen met
                                    Exact Online.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Artikelbeheer
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Inkooporders
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Grootboekboekingen
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cog className="h-10 w-10 text-primary" />
                                    Custom API
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Eigen ERP of maatwerk systeem? Bouw je eigen
                                    integratie met onze REST API. Volledige
                                    documentatie beschikbaar.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        REST API endpoints
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        Webhooks
                                    </li>
                                    <li className="flex items-center gap-2">
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
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Wifi className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            IoT Sensor Integratie
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Sluit sensoren aan op je machines en ontvang
                            real-time data. Detecteer problemen voordat ze
                            storingen worden.
                        </p>
                    </div>

                    <div className="mb-12 grid gap-8 md:grid-cols-2">
                        <div>
                            <h3 className="mb-6 text-xl font-semibold">
                                Ondersteunde sensortypen
                            </h3>
                            <div className="grid gap-4">
                                <Card>
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <Activity className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-semibold">
                                                Trilling / Vibratie
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Detecteer slijtage aan lagers,
                                                onbalans of losse onderdelen
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <Thermometer className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-semibold">
                                                Temperatuur
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Monitor oververhitting van
                                                motoren, lagers of hydrauliek
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <Gauge className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-semibold">
                                                Druk
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Bewaal hydraulische en
                                                pneumatische systemen, detecteer
                                                lekkages
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <Zap className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-semibold">
                                                Stroom / Energie
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Meet stroomverbruik, detecteer
                                                overbelasting of afwijkingen
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-6 text-xl font-semibold">
                                Ondersteunde protocollen
                            </h3>
                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="mb-2 font-semibold">
                                            MQTT
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Standaard voor industriele IoT.
                                            Lichtgewicht, betrouwbaar, real-time
                                            berichten.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="mb-2 font-semibold">
                                            OPC UA
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Industriele standaard voor
                                            fabrieksautomatisering. Directe
                                            koppeling met PLC's en SCADA.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="mb-2 font-semibold">
                                            REST Webhooks
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Eenvoudige HTTP integratie voor
                                            sensoren met eigen gateway of cloud
                                            platform.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="mb-2 font-semibold">
                                            Modbus TCP
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Klassiek industrieel protocol.
                                            Ondersteund voor legacy apparatuur.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="rounded-xl bg-muted/50 p-8">
                        <h3 className="mb-8 text-center text-xl font-semibold">
                            Hoe werkt IoT integratie?
                        </h3>
                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    1
                                </div>
                                <h4 className="mb-2 font-semibold">
                                    Sensor meet data
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Trillingssensor op lager meet 8.5 mm/s
                                    (normaal: 2-3 mm/s)
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    2
                                </div>
                                <h4 className="mb-2 font-semibold">
                                    LineCare ontvangt
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Real-time data binnenkomst via MQTT of
                                    webhook, opslag in database
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    3
                                </div>
                                <h4 className="mb-2 font-semibold">
                                    Alert getriggerd
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Drempel overschreden, alert aangemaakt,
                                    notificatie naar TD
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    4
                                </div>
                                <h4 className="mb-2 font-semibold">
                                    Werkorder aangemaakt
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Automatisch werkorder: "Hoge trilling op
                                    machine X - lager controleren"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor Portal */}
            <section className="bg-muted/50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Truck className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Leveranciersportaal
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Geef je leveranciers toegang tot hun inkooporders.
                            Snellere communicatie, minder e-mails, betere
                            service.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <FileText className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Inkooporders bekijken</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Leveranciers zien hun openstaande orders,
                                    artikelen, hoeveelheden en gewenste
                                    leverdatum.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Status updaten</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Bevestigen, verwerken, verzenden - leverancier
                                    update status direct. Jij ziet het meteen in
                                    LineCare.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Box className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Tracking toevoegen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Leverancier voegt track & trace nummer toe.
                                    Jij kunt de zending volgen zonder te
                                    bellen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <ShoppingCart className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Documenten uploaden</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Pakbon, factuur, certificaat - leverancier
                                    upload documenten direct bij de order.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Bell className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Automatische notificaties</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Leverancier krijgt e-mail bij nieuwe order.
                                    Jij krijgt melding bij statusupdate.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Link2 className="mb-2 h-8 w-8 text-primary" />
                                <CardTitle>Veilige toegang</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Leveranciers krijgen eigen API key. Ze zien
                                    alleen hun eigen orders, niets anders.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <Bell className="mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-4 text-3xl font-bold">
                            Notificaties & Alerts
                        </h2>
                        <p className="max-w-3xl text-lg text-muted-foreground">
                            Blijf op de hoogte via e-mail of push. Configureer
                            per gebruiker welke meldingen ze ontvangen.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        Werkorder toegewezen
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Technicus krijgt melding bij nieuwe
                                    toewijzing met alle details.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        Werkorder overdue
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Escalatie naar TD en manager als deadline
                                    verstreken is.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                        <Box className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        Lage voorraad
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Manager krijgt alert als onderdeel onder
                                    herbestelpunt komt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                        <Activity className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        Sensor alert
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Kritieke sensor overschrijdt drempel,
                                    direct notificatie naar TD.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                        <Gauge className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        OEE onder target
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Productiemanager krijgt melding als OEE
                                    onder drempelwaarde daalt.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                        <Truck className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold">
                                        Levering onderweg
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Inkoper krijgt update wanneer leverancier
                                    order verzonden heeft.
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
                        Klaar om te integreren?
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Bespreek je integratiewensen in een demo. We kijken
                        samen wat mogelijk is voor jouw situatie.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/#demo">
                            <Button size="lg" className="w-full sm:w-auto">
                                Plan een demo
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/prijzen">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Bekijk prijzen
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
