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
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    FileText,
    LogOut,
    Package,
    Send,
    Truck,
} from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
    status: string;
    total_amount: number;
    expected_delivery_date: string | null;
    created_at: string;
    items_count: number;
}

interface Stats {
    total_orders: number;
    pending: number;
    acknowledged: number;
    shipped: number;
    received: number;
}

interface Supplier {
    id: number;
    name: string;
    email: string | null;
}

interface DashboardProps {
    supplier: Supplier;
    purchaseOrders: PurchaseOrder[];
    stats: Stats;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
    draft: { label: 'Draft', variant: 'secondary', icon: FileText },
    sent: { label: 'Pending', variant: 'outline', icon: Clock },
    acknowledged: { label: 'Acknowledged', variant: 'default', icon: CheckCircle2 },
    shipped: { label: 'Shipped', variant: 'default', icon: Truck },
    received: { label: 'Received', variant: 'default', icon: Package },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: FileText },
};

export default function VendorPortalDashboard({
    supplier,
    purchaseOrders,
    stats,
}: DashboardProps) {
    const handleLogout = () => {
        router.post('/vendor-portal/logout');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
        const Icon = config.icon;
        return (
            <Badge variant={config.variant}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Vendor Portal - Dashboard" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Vendor Portal
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome, {supplier.name}
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="mb-8 grid gap-4 md:grid-cols-5">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_orders}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Send className="h-4 w-4" />
                                    Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {stats.pending}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Acknowledged
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.acknowledged}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Truck className="h-4 w-4" />
                                    Shipped
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {stats.shipped}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Package className="h-4 w-4" />
                                    Received
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.received}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Purchase Orders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Orders</CardTitle>
                            <CardDescription>
                                View and manage your purchase orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {purchaseOrders.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        No purchase orders yet
                                    </h3>
                                    <p className="text-gray-600">
                                        You will see your orders here once they are created.
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PO Number</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Expected Delivery</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseOrders.map((po) => (
                                            <TableRow key={po.id}>
                                                <TableCell className="font-medium">
                                                    {po.po_number}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(po.status)}</TableCell>
                                                <TableCell>{po.items_count} items</TableCell>
                                                <TableCell>
                                                    {formatCurrency(po.total_amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {po.expected_delivery_date || '-'}
                                                </TableCell>
                                                <TableCell>{po.created_at}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={`/vendor-portal/orders/${po.id}`}
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}
