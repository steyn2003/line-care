import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFeatureGuard } from '@/hooks/use-feature-guard';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Package, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface PartCategory {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    location: {
        id: number;
        name: string;
    } | null;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    description: string | null;
    unit_of_measure: string;
    unit_cost: string;
    reorder_point: number;
    reorder_quantity: number;
    is_critical: boolean;
    status: 'active' | 'discontinued';
    category: PartCategory | null;
    supplier: Supplier | null;
    stocks: Stock[];
    total_quantity_on_hand: number;
    total_quantity_available: number;
    is_low_stock: boolean;
}

interface Props {
    spare_parts: {
        data: SparePart[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: PartCategory[];
    suppliers: Supplier[];
    filters: {
        category_id?: number;
        supplier_id?: number;
        status?: string;
        low_stock?: boolean;
        search?: string;
    };
}

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    discontinued:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function SparePartsIndex({
    spare_parts,
    categories,
    suppliers,
    filters,
}: Props) {
    // Feature guard: redirect if inventory feature is not available
    useFeatureGuard({ feature: 'inventory' });

    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState<string>(
        filters.category_id?.toString() || 'all',
    );
    const [supplierFilter, setSupplierFilter] = useState<string>(
        filters.supplier_id?.toString() || 'all',
    );
    const [statusFilter, setStatusFilter] = useState<string>(
        filters.status || 'active',
    );
    const [lowStockOnly, setLowStockOnly] = useState(
        filters.low_stock || false,
    );

    const handleFilterChange = () => {
        router.get(
            '/spare-parts',
            {
                category_id:
                    categoryFilter !== 'all' ? categoryFilter : undefined,
                supplier_id:
                    supplierFilter !== 'all' ? supplierFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                low_stock: lowStockOnly || undefined,
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStockLevelColor = (part: SparePart) => {
        if (part.is_low_stock) {
            return 'text-red-600 dark:text-red-400';
        }
        if (part.total_quantity_available < part.reorder_point * 1.5) {
            return 'text-amber-600 dark:text-amber-400';
        }
        return 'text-green-600 dark:text-green-400';
    };

    return (
        <AppLayout>
            <Head title="Spare Parts" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Spare Parts Inventory
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage spare parts and inventory levels
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a
                                href={`/exports/spare-parts?${new URLSearchParams(
                                    {
                                        ...(filters.category_id && {
                                            category_id:
                                                filters.category_id.toString(),
                                        }),
                                        ...(filters.supplier_id && {
                                            supplier_id:
                                                filters.supplier_id.toString(),
                                        }),
                                        ...(filters.status && {
                                            status: filters.status,
                                        }),
                                        ...(filters.low_stock && {
                                            low_stock: 'true',
                                        }),
                                    },
                                ).toString()}`}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/inventory/low-stock">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Low Stock Alert
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/spare-parts/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Part
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>
                            Filter spare parts by category, supplier, or stock
                            level
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search parts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFilterChange();
                                        }
                                    }}
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={categoryFilter}
                                onValueChange={(value) => {
                                    setCategoryFilter(value);
                                    setTimeout(handleFilterChange, 100);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All categories
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={supplierFilter}
                                onValueChange={(value) => {
                                    setSupplierFilter(value);
                                    setTimeout(handleFilterChange, 100);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All suppliers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All suppliers
                                    </SelectItem>
                                    {suppliers.map((supplier) => (
                                        <SelectItem
                                            key={supplier.id}
                                            value={supplier.id.toString()}
                                        >
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    setTimeout(handleFilterChange, 100);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="discontinued">
                                        Discontinued
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant={lowStockOnly ? 'default' : 'outline'}
                                onClick={() => {
                                    setLowStockOnly(!lowStockOnly);
                                    setTimeout(handleFilterChange, 100);
                                }}
                                className="w-full"
                            >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Low Stock Only
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Parts List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spare Parts ({spare_parts.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {spare_parts.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">
                                    No spare parts found
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Get started by adding your first spare part
                                </p>
                                <Button asChild>
                                    <Link href="/spare-parts/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Spare Part
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left text-sm font-medium">
                                                Part Number
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">
                                                Category
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">
                                                Supplier
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">
                                                On Hand
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">
                                                Available
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">
                                                Unit Cost
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spare_parts.data.map((part) => (
                                            <tr
                                                key={part.id}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm">
                                                            {part.part_number}
                                                        </span>
                                                        {part.is_critical && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                Critical
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/spare-parts/${part.id}`}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {part.name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {part.category?.name || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {part.supplier?.name || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span
                                                        className={getStockLevelColor(
                                                            part,
                                                        )}
                                                    >
                                                        {
                                                            part.total_quantity_on_hand
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span
                                                            className={getStockLevelColor(
                                                                part,
                                                            )}
                                                        >
                                                            {
                                                                part.total_quantity_available
                                                            }
                                                        </span>
                                                        {part.is_low_stock && (
                                                            <span className="text-xs text-muted-foreground">
                                                                Reorder:{' '}
                                                                {
                                                                    part.reorder_point
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-sm">
                                                    ${part.unit_cost}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            statusColors[
                                                                part.status
                                                            ]
                                                        }
                                                    >
                                                        {part.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/spare-parts/${part.id}`}
                                                        >
                                                            View
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
