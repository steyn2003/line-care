import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Supplier {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier: Supplier;
    status: 'draft' | 'sent' | 'received' | 'cancelled';
    total_cost: string;
    total_items: number;
    total_quantity: number;
    expected_delivery_date: string | null;
    created_at: string;
    creator: User;
}

interface Props {
    purchase_orders: {
        data: PurchaseOrder[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    suppliers: Supplier[];
    filters: {
        status?: string;
        supplier_id?: string;
        search?: string;
    };
}

export default function PurchaseOrdersIndex({
    purchase_orders,
    suppliers,
    filters,
}: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [supplierFilter, setSupplierFilter] = useState(
        filters.supplier_id || '',
    );

    const handleFilter = () => {
        router.get(
            '/purchase-orders',
            {
                status: statusFilter || undefined,
                supplier_id: supplierFilter || undefined,
                search: searchTerm || undefined,
            },
            { preserveState: true },
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setSupplierFilter('');
        router.get('/purchase-orders');
    };

    const getStatusColor = (status: PurchaseOrder['status']) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'received':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: PurchaseOrder['status']) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AppLayout>
            <Head title="Purchase Orders" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Purchase Orders
                        </h1>
                        <p className="text-muted-foreground">
                            Manage spare parts procurement and orders
                        </p>
                    </div>
                    <Button
                        onClick={() => router.visit('/purchase-orders/create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Purchase Order
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by PO number or supplier..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleFilter()
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="received">
                                        Received
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={supplierFilter}
                                onValueChange={setSupplierFilter}
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="All suppliers" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>Filter</Button>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Purchase Orders Table */}
                <Card>
                    <CardContent className="p-0">
                        {purchase_orders.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">
                                    No Purchase Orders
                                </h3>
                                <p className="mb-4 text-center text-sm text-muted-foreground">
                                    {filters.search ||
                                    filters.status ||
                                    filters.supplier_id
                                        ? 'No purchase orders match your filters.'
                                        : 'Get started by creating your first purchase order.'}
                                </p>
                                {!filters.search &&
                                    !filters.status &&
                                    !filters.supplier_id && (
                                        <Button
                                            onClick={() =>
                                                router.visit(
                                                    '/purchase-orders/create',
                                                )
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Purchase Order
                                        </Button>
                                    )}
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PO Number</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Items
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Total Quantity
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Amount
                                            </TableHead>
                                            <TableHead>
                                                Expected Delivery
                                            </TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Created By</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchase_orders.data.map((po) => (
                                            <TableRow
                                                key={po.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() =>
                                                    router.visit(
                                                        `/purchase-orders/${po.id}`,
                                                    )
                                                }
                                            >
                                                <TableCell className="font-mono font-semibold">
                                                    {po.po_number}
                                                </TableCell>
                                                <TableCell>
                                                    {po.supplier.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            po.status,
                                                        )}
                                                    >
                                                        {getStatusLabel(
                                                            po.status,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {po.total_items}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {po.total_quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    $
                                                    {parseFloat(
                                                        po.total_cost,
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {po.expected_delivery_date
                                                        ? new Date(
                                                              po.expected_delivery_date,
                                                          ).toLocaleDateString()
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        po.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {po.creator.name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {purchase_orders.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t px-6 py-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing{' '}
                                            {(purchase_orders.current_page -
                                                1) *
                                                purchase_orders.per_page +
                                                1}{' '}
                                            to{' '}
                                            {Math.min(
                                                purchase_orders.current_page *
                                                    purchase_orders.per_page,
                                                purchase_orders.total,
                                            )}{' '}
                                            of {purchase_orders.total} purchase
                                            orders
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    purchase_orders.current_page ===
                                                    1
                                                }
                                                onClick={() =>
                                                    router.get(
                                                        '/purchase-orders',
                                                        {
                                                            ...filters,
                                                            page:
                                                                purchase_orders.current_page -
                                                                1,
                                                        },
                                                    )
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    purchase_orders.current_page ===
                                                    purchase_orders.last_page
                                                }
                                                onClick={() =>
                                                    router.get(
                                                        '/purchase-orders',
                                                        {
                                                            ...filters,
                                                            page:
                                                                purchase_orders.current_page +
                                                                1,
                                                        },
                                                    )
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
