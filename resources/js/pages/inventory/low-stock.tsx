import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ExternalLink,
    Package,
    ShoppingCart,
} from 'lucide-react';

interface Stock {
    location_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    location?: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    category?: Category;
    supplier?: Supplier;
    unit_cost: number;
    reorder_point: number;
    reorder_quantity: number;
    is_critical: boolean;
    total_quantity_on_hand: number;
    total_quantity_reserved: number;
    total_quantity_available: number;
    shortage: number;
    recommended_order: number;
    stocks: Stock[];
}

interface Props {
    low_stock_parts: SparePart[];
    suppliers: Supplier[];
}

export default function LowStock({ low_stock_parts }: Props) {
    const getTotalValue = () => {
        return low_stock_parts.reduce(
            (total, part) => total + part.recommended_order * part.unit_cost,
            0,
        );
    };

    const getPartsByCriticality = () => {
        const critical = low_stock_parts.filter(
            (part) => part.is_critical,
        ).length;
        const nonCritical = low_stock_parts.length - critical;
        return { critical, nonCritical };
    };

    const { critical, nonCritical } = getPartsByCriticality();
    const totalValue = getTotalValue();

    const handleCreatePO = (supplierId: number) => {
        const supplierParts = low_stock_parts.filter(
            (part) => part.supplier?.id === supplierId,
        );

        // Navigate to create PO with pre-filled parts
        router.visit('/purchase-orders/create', {
            data: {
                supplier_id: supplierId,
                parts: supplierParts.map((part) => ({
                    spare_part_id: part.id,
                    quantity: part.recommended_order,
                    unit_cost: part.unit_cost,
                })),
            },
        });
    };

    const groupBySupplier = () => {
        const grouped = new Map<number | null, SparePart[]>();

        low_stock_parts.forEach((part) => {
            const supplierId = part.supplier?.id || null;
            if (!grouped.has(supplierId)) {
                grouped.set(supplierId, []);
            }
            grouped.get(supplierId)!.push(part);
        });

        return grouped;
    };

    const supplierGroups = groupBySupplier();

    return (
        <AppLayout>
            <Head title="Low Stock Alerts" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Low Stock Alerts
                    </h1>
                    <p className="text-muted-foreground">
                        Parts that are below their reorder point and need
                        attention
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Low Stock Parts
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {low_stock_parts.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {critical} critical, {nonCritical} non-critical
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recommended Order Value
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {totalValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Based on recommended quantities
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Suppliers Affected
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {supplierGroups.size}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                May require multiple purchase orders
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock Parts by Supplier */}
                {low_stock_parts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No Low Stock Alerts
                            </h3>
                            <p className="text-center text-sm text-muted-foreground">
                                All spare parts are currently at or above their
                                reorder points.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    Array.from(supplierGroups.entries()).map(
                        ([supplierId, parts]) => {
                            const supplier = parts[0].supplier;
                            const groupTotal = parts.reduce(
                                (sum, part) =>
                                    sum +
                                    part.recommended_order * part.unit_cost,
                                0,
                            );

                            return (
                                <Card key={supplierId || 'no-supplier'}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    {supplier?.name ||
                                                        'No Supplier Assigned'}
                                                </CardTitle>
                                                <CardDescription>
                                                    {parts.length} part
                                                    {parts.length !== 1
                                                        ? 's'
                                                        : ''}{' '}
                                                    below reorder point •
                                                    Estimated value: $
                                                    {groupTotal.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </CardDescription>
                                            </div>
                                            {supplier && (
                                                <Button
                                                    onClick={() =>
                                                        handleCreatePO(
                                                            supplier.id,
                                                        )
                                                    }
                                                >
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Create Purchase Order
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Part Number
                                                    </TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>
                                                        Category
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Available
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Reorder Point
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Shortage
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Recommended Order
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Unit Cost
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Order Value
                                                    </TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {parts.map((part) => (
                                                    <TableRow key={part.id}>
                                                        <TableCell className="font-mono">
                                                            <div className="flex items-center space-x-2">
                                                                <span>
                                                                    {
                                                                        part.part_number
                                                                    }
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
                                                        </TableCell>
                                                        <TableCell>
                                                            {part.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {part.category
                                                                ?.name || (
                                                                <span className="text-muted-foreground">
                                                                    Uncategorized
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="font-semibold text-red-600">
                                                                {
                                                                    part.total_quantity_available
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {part.reorder_point}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="font-semibold text-amber-600">
                                                                {part.shortage}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="font-semibold">
                                                                {
                                                                    part.recommended_order
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            $
                                                            {part.unit_cost.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            $
                                                            {(
                                                                part.recommended_order *
                                                                part.unit_cost
                                                            ).toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `/spare-parts/${part.id}`,
                                                                    )
                                                                }
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            );
                        },
                    )
                )}
            </div>
        </AppLayout>
    );
}
