import { Button } from '@/components/ui/button';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
import { useTranslation } from 'react-i18next';

interface SearchResult {
    id: number;
    type: string;
    title: string;
    subtitle: string | null;
    url: string;
}

interface SearchResponse {
    results: {
        pages: SearchResult[];
        machines: SearchResult[];
        work_orders: SearchResult[];
        preventive_tasks: SearchResult[];
        spare_parts: SearchResult[];
        purchase_orders: SearchResult[];
        suppliers: SearchResult[];
        users: SearchResult[];
    };
    query: string;
    total: number;
}

const typeIcons: Record<string, React.ElementType> = {
    pages: Search,
    machines: Wrench,
    work_orders: ClipboardList,
    preventive_tasks: AlertTriangle,
    spare_parts: Package,
    purchase_orders: ShoppingCart,
    suppliers: Warehouse,
    users: Users,
};

export function GlobalSearch() {
    const { t } = useTranslation('common');
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResponse['results'] | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);

    const typeLabels: Record<string, string> = {
        pages: t('search.types.pages'),
        machines: t('search.types.machines'),
        work_orders: t('search.types.work_orders'),
        preventive_tasks: t('search.types.preventive_tasks'),
        spare_parts: t('search.types.spare_parts'),
        purchase_orders: t('search.types.purchase_orders'),
        suppliers: t('search.types.suppliers'),
        users: t('search.types.users'),
    };

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
                const response = await fetch(
                    `/search?q=${encodeURIComponent(query)}`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );
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

    const hasResults =
        results && Object.values(results).some((arr) => arr.length > 0);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">
                    {t('search.placeholder')}...
                </span>
                <kbd className="pointer-events-none absolute top-1.5 right-1.5 hidden h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none xl:flex">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title={t('search.title')}
                description={t('search.description')}
            >
                <CommandInput
                    placeholder={t('search.input_placeholder')}
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {t('search.searching')}
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && !hasResults && (
                        <CommandEmpty>{t('search.no_results')}</CommandEmpty>
                    )}

                    {!isLoading && query.length < 2 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {t('search.min_characters')}
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
                                            onSelect={() =>
                                                handleSelect(item.url)
                                            }
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
