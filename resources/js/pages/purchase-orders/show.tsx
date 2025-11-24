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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Ban, PackageCheck, Send } from 'lucide-react';
import { useState } from 'react';

interface Stock {
    location_id: number;
    quantity_on_hand: number;
    location?: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    category?: Category;
    stocks: Stock[];
    pivot: {
        quantity: number;
        unit_cost: number;
        received_quantity: number;
    };
}

interface Supplier {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
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
    notes: string | null;
    expected_delivery_date: string | null;
    sent_at: string | null;
    received_at: string | null;
    created_at: string;
    creator: User;
    spare_parts: SparePart[];
}

interface Props {
    purchase_order: PurchaseOrder;
}

export default function PurchaseOrderShow({ purchase_order }: Props) {
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [receivedQuantities, setReceivedQuantities] = useState<
        Record<number, number>
    >({});

    const { post: sendPO, processing: sendingPO } = useForm();
    const { post: receivePO, processing: receivingPO } = useForm();
    const { post: cancelPO, processing: cancellingPO } = useForm();
    const { delete: deletePO, processing: deletingPO } = useForm();

    const handleSend = () => {
        sendPO(`/api/purchase-orders/${purchase_order.id}/send`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleOpenReceiveDialog = () => {
        // Initialize with expected quantities
        const initialQuantities: Record<number, number> = {};
        purchase_order.spare_parts.forEach((part) => {
            initialQuantities[part.id] = part.pivot.quantity;
        });
        setReceivedQuantities(initialQuantities);
        setShowReceiveDialog(true);
    };

    const handleReceive = () => {
        const parts = purchase_order.spare_parts.map((part) => ({
            spare_part_id: part.id,
            quantity_received: receivedQuantities[part.id] || 0,
        }));

        receivePO(`/api/purchase-orders/${purchase_order.id}/receive`, {
            data: { parts },
            preserveScroll: true,
            onSuccess: () => {
                setShowReceiveDialog(false);
                router.reload();
            },
        });
    };

    const handleCancel = () => {
        if (
            confirm(
                'Are you sure you want to cancel this purchase order? This action cannot be undone.',
            )
        ) {
            cancelPO(`/api/purchase-orders/${purchase_order.id}/cancel`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
            });
        }
    };

    const handleDelete = () => {
        if (
            confirm(
                'Are you sure you want to delete this purchase order? This will permanently remove it from the system.',
            )
        ) {
            deletePO(`/purchase-orders/${purchase_order.id}`, {
                onSuccess: () => {
                    router.visit('/purchase-orders');
                },
            });
        }
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

    const totalItems = purchase_order.spare_parts.length;
    const totalQuantity = purchase_order.spare_parts.reduce(
        (sum, part) => sum + part.pivot.quantity,
        0,
    );

    return (
        <AppLayout>
            <Head title={`Purchase Order ${purchase_order.po_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/purchase-orders')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {purchase_order.po_number}
                                </h1>
                                <Badge
                                    className={getStatusColor(
                                        purchase_order.status,
                                    )}
                                >
                                    {getStatusLabel(purchase_order.status)}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Purchase order details
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {purchase_order.status === 'draft' && (
                            <>
                                <Button
                                    onClick={handleSend}
                                    disabled={sendingPO}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {sendingPO
                                        ? 'Sending...'
                                        : 'Send to Supplier'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deletingPO}
                                >
                                    <Ban className="mr-2 h-4 w-4" />
                                    {deletingPO ? 'Deleting...' : 'Delete'}
                                </Button>
                            </>
                        )}
                        {purchase_order.status === 'sent' && (
                            <>
                                <Button
                                    onClick={handleOpenReceiveDialog}
                                    disabled={receivingPO}
                                >
                                    <PackageCheck className="mr-2 h-4 w-4" />
                                    Receive Shipment
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={cancellingPO}
                                >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Cancel Order
                                </Button>
                            </>
                        )}
                        {purchase_order.status === 'cancelled' && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deletingPO}
                            >
                                <Ban className="mr-2 h-4 w-4" />
                                {deletingPO ? 'Deleting...' : 'Delete'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* PO Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">
                                    PO Number
                                </Label>
                                <p className="font-mono font-semibold">
                                    {purchase_order.po_number}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Created
                                </Label>
                                <p>
                                    {new Date(
                                        purchase_order.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Created By
                                </Label>
                                <p>{purchase_order.creator.name}</p>
                            </div>
                            {purchase_order.expected_delivery_date && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Expected Delivery
                                    </Label>
                                    <p>
                                        {new Date(
                                            purchase_order.expected_delivery_date,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {purchase_order.sent_at && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Sent At
                                    </Label>
                                    <p>
                                        {new Date(
                                            purchase_order.sent_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {purchase_order.received_at && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Received At
                                    </Label>
                                    <p>
                                        {new Date(
                                            purchase_order.received_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {purchase_order.notes && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Notes
                                    </Label>
                                    <p className="text-sm">
                                        {purchase_order.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Supplier Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">
                                    Name
                                </Label>
                                <p className="font-semibold">
                                    {purchase_order.supplier.name}
                                </p>
                            </div>
                            {purchase_order.supplier.email && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Email
                                    </Label>
                                    <p>{purchase_order.supplier.email}</p>
                                </div>
                            )}
                            {purchase_order.supplier.phone && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Phone
                                    </Label>
                                    <p>{purchase_order.supplier.phone}</p>
                                </div>
                            )}
                            {purchase_order.supplier.address && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Address
                                    </Label>
                                    <p className="text-sm">
                                        {purchase_order.supplier.address}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalItems}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Quantity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalQuantity}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Amount
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {parseFloat(
                                    purchase_order.total_cost,
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Line Items</CardTitle>
                        <CardDescription>
                            Parts included in this purchase order
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Part Number</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">
                                        Quantity Ordered
                                    </TableHead>
                                    {purchase_order.status === 'received' && (
                                        <TableHead className="text-right">
                                            Quantity Received
                                        </TableHead>
                                    )}
                                    <TableHead className="text-right">
                                        Unit Cost
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchase_order.spare_parts.map((part) => (
                                    <TableRow key={part.id}>
                                        <TableCell className="font-mono">
                                            {part.part_number}
                                        </TableCell>
                                        <TableCell>{part.name}</TableCell>
                                        <TableCell>
                                            {part.category?.name || (
                                                <span className="text-muted-foreground">
                                                    Uncategorized
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {part.pivot.quantity}
                                        </TableCell>
                                        {purchase_order.status ===
                                            'received' && (
                                            <TableCell className="text-right">
                                                {part.pivot.received_quantity}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            $
                                            {part.pivot.unit_cost.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                },
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            $
                                            {(
                                                part.pivot.quantity *
                                                part.pivot.unit_cost
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Receive Shipment Dialog */}
            <Dialog
                open={showReceiveDialog}
                onOpenChange={setShowReceiveDialog}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Receive Shipment</DialogTitle>
                        <DialogDescription>
                            Enter the actual quantities received for each part
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] space-y-4 overflow-y-auto">
                        {purchase_order.spare_parts.map((part) => (
                            <div
                                key={part.id}
                                className="flex items-center gap-4"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{part.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {part.part_number} • Ordered:{' '}
                                        {part.pivot.quantity}
                                    </p>
                                </div>
                                <div className="w-32">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={receivedQuantities[part.id] || 0}
                                        onChange={(e) =>
                                            setReceivedQuantities({
                                                ...receivedQuantities,
                                                [part.id]:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowReceiveDialog(false)}
                            disabled={receivingPO}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleReceive} disabled={receivingPO}>
                            {receivingPO ? 'Processing...' : 'Confirm Receipt'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
