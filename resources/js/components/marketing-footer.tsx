import { Link } from '@inertiajs/react';

export function MarketingFooter() {
    return (
        <footer className="border-t bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">LineCare</h3>
                        <p className="text-sm text-muted-foreground">
                            Eenvoudige onderhoudssoftware voor kleine fabrieken.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/oplossing">Oplossing</Link>
                            </li>
                            <li>
                                <Link href="/functionaliteiten">
                                    Functionaliteiten
                                </Link>
                            </li>
                            <li>
                                <Link href="/prijzen">Prijzen</Link>
                            </li>
                            <li>
                                <a href="/#demo">Demo aanvragen</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Bedrijf</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/voor-wie">Voor wie</Link>
                            </li>
                            <li>
                                <Link href="/over-ons">Over ons</Link>
                            </li>
                            <li>
                                <a href="/#demo">Contact</a>
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
    );
}
