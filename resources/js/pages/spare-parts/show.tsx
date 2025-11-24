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
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Package, TrendingDown } from 'lucide-react';

interface PartCategory {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
}

interface Location {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    location: Location | null;
    last_counted_at: string | null;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    description: string | null;
    manufacturer: string | null;
    unit_of_measure: string;
    unit_cost: string;
    reorder_point: number;
    reorder_quantity: number;
    lead_time_days: number;
    location: string | null;
    is_critical: boolean;
    status: 'active' | 'discontinued';
    category: PartCategory | null;
    supplier: Supplier | null;
    stocks: Stock[];
    created_at: string;
}

interface Props {
    spare_part: SparePart;
}

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    discontinued:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function SparePartShow({ spare_part }: Props) {
    const totalOnHand = spare_part.stocks.reduce(
        (sum, stock) => sum + stock.quantity_on_hand,
        0,
    );
    const totalReserved = spare_part.stocks.reduce(
        (sum, stock) => sum + stock.quantity_reserved,
        0,
    );
    const totalAvailable = totalOnHand - totalReserved;
    const isLowStock = totalAvailable < spare_part.reorder_point;

    return (
        <AppLayout>
            <Head title={`${spare_part.name} - Spare Parts`} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/spare-parts">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {spare_part.name}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Part Number: {spare_part.part_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/spare-parts/${spare_part.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Alert for low stock */}
                {isLowStock && (
                    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                <TrendingDown className="h-5 w-5" />
                                <span className="font-semibold">
                                    Low Stock Alert:
                                </span>
                                <span>
                                    Available quantity ({totalAvailable}) is
                                    below reorder point (
                                    {spare_part.reorder_point})
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Part Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Part Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Part Number
                                    </dt>
                                    <dd className="mt-1 font-mono text-sm">
                                        {spare_part.part_number}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd className="mt-1">
                                        <Badge
                                            className={
                                                statusColors[spare_part.status]
                                            }
                                        >
                                            {spare_part.status}
                                        </Badge>
                                        {spare_part.is_critical && (
                                            <Badge
                                                variant="destructive"
                                                className="ml-2"
                                            >
                                                Critical
                                            </Badge>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Category
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.category?.name || '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Manufacturer
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.manufacturer || '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Unit of Measure
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.unit_of_measure}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Unit Cost
                                    </dt>
                                    <dd className="mt-1 font-mono text-sm">
                                        ${spare_part.unit_cost}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Reorder Point
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.reorder_point}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Reorder Quantity
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.reorder_quantity}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Lead Time
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.lead_time_days} days
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Storage Location
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        {spare_part.location || '—'}
                                    </dd>
                                </div>
                                {spare_part.description && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Description
                                        </dt>
                                        <dd className="mt-1 text-sm">
                                            {spare_part.description}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Stock Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        On Hand
                                    </div>
                                    <div className="text-3xl font-bold">
                                        {totalOnHand}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Reserved
                                    </div>
                                    <div className="text-2xl font-semibold text-amber-600">
                                        {totalReserved}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Available
                                    </div>
                                    <div
                                        className={`text-2xl font-semibold ${
                                            isLowStock
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        {totalAvailable}
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Total Value
                                    </div>
                                    <div className="text-xl font-semibold">
                                        $
                                        {(
                                            totalOnHand *
                                            parseFloat(spare_part.unit_cost)
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Supplier Information */}
                {spare_part.supplier && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Supplier Name
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {spare_part.supplier.name}
                                    </dd>
                                </div>
                                {spare_part.supplier.email && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </dt>
                                        <dd className="mt-1 text-sm">
                                            <a
                                                href={`mailto:${spare_part.supplier.email}`}
                                                className="text-primary hover:underline"
                                            >
                                                {spare_part.supplier.email}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {spare_part.supplier.phone && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </dt>
                                        <dd className="mt-1 text-sm">
                                            {spare_part.supplier.phone}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>
                )}

                {/* Stock by Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stock by Location</CardTitle>
                        <CardDescription>
                            Current inventory levels across all locations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {spare_part.stocks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    No stock records found
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">
                                            On Hand
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Reserved
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Available
                                        </TableHead>
                                        <TableHead>Last Counted</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {spare_part.stocks.map((stock) => {
                                        const available =
                                            stock.quantity_on_hand -
                                            stock.quantity_reserved;
                                        return (
                                            <TableRow key={stock.id}>
                                                <TableCell className="font-medium">
                                                    {stock.location?.name ||
                                                        'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {stock.quantity_on_hand}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {stock.quantity_reserved}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {available}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {stock.last_counted_at
                                                        ? format(
                                                              new Date(
                                                                  stock.last_counted_at,
                                                              ),
                                                              'MMM d, yyyy',
                                                          )
                                                        : 'Never'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
