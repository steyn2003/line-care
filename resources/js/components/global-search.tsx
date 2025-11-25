import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    ClipboardList,
    Package,
    Search,
    ShoppingCart,
    Users,
    Warehouse,
    Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchResult {
    id: number;
    type: string;
    title: string;
    subtitle: string | null;
    url: string;
}

interface SearchResponse {
    results: {
        machines: SearchResult[];
        work_orders: SearchResult[];
        spare_parts: SearchResult[];
        purchase_orders: SearchResult[];
        suppliers: SearchResult[];
        users: SearchResult[];
    };
    query: string;
    total: number;
}

const typeIcons: Record<string, React.ElementType> = {
    machines: Wrench,
    work_orders: ClipboardList,
    spare_parts: Package,
    purchase_orders: ShoppingCart,
    suppliers: Warehouse,
    users: Users,
};

const typeLabels: Record<string, string> = {
    machines: 'Machines',
    work_orders: 'Work Orders',
    spare_parts: 'Spare Parts',
    purchase_orders: 'Purchase Orders',
    suppliers: 'Suppliers',
    users: 'Users',
};

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResponse['results'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Keyboard shortcut to open search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data: SearchResponse = await response.json();
                    setResults(data.results);
                }
            } catch {
                console.error('Search failed');
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = useCallback((url: string) => {
        setOpen(false);
        setQuery('');
        setResults(null);
        router.visit(url);
    }, []);

    const hasResults = results && Object.values(results).some((arr) => arr.length > 0);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Global Search"
                description="Search across machines, work orders, spare parts, and more"
            >
                <CommandInput
                    placeholder="Search machines, work orders, parts..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && !hasResults && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {!isLoading && query.length < 2 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Type at least 2 characters to search
                        </div>
                    )}

                    {!isLoading &&
                        results &&
                        Object.entries(results).map(([type, items]) => {
                            if (items.length === 0) return null;

                            const Icon = typeIcons[type] || AlertTriangle;
                            const label = typeLabels[type] || type;

                            return (
                                <CommandGroup key={type} heading={label}>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={`${type}-${item.id}`}
                                            value={`${type}-${item.id}-${item.title}`}
                                            onSelect={() => handleSelect(item.url)}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{item.title}</span>
                                                {item.subtitle && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.subtitle}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            );
                        })}
                </CommandList>
            </CommandDialog>
        </>
    );
}
