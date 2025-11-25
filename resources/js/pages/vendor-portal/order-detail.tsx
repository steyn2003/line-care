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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    LogOut,
    Package,
    Truck,
    Upload,
} from 'lucide-react';
import { useState } from 'react';

interface Item {
    id: number;
    part_number: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Document {
    type: string;
    path: string;
    filename: string;
    uploaded_at: string;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    status: string;
    total_amount: number;
    expected_delivery_date: string | null;
    shipping_address: string | null;
    notes: string | null;
    tracking_number: string | null;
    tracking_carrier: string | null;
    tracking_url: string | null;
    vendor_notes: string | null;
    vendor_documents: Document[];
    acknowledged_at: string | null;
    shipping_date: string | null;
    created_at: string;
    company_name: string;
    items: Item[];
}

interface Supplier {
    id: number;
    name: string;
}

interface PageProps {
    supplier: Supplier;
    purchaseOrder: PurchaseOrder;
    flash?: {
        success?: string;
        error?: string;
    };
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
    draft: { label: 'Draft', variant: 'secondary', icon: FileText },
    sent: { label: 'Pending', variant: 'outline', icon: Clock },
    acknowledged: { label: 'Acknowledged', variant: 'default', icon: CheckCircle2 },
    shipped: { label: 'Shipped', variant: 'default', icon: Truck },
    received: { label: 'Received', variant: 'default', icon: Package },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: FileText },
};

export default function VendorPortalOrderDetail() {
    const { supplier, purchaseOrder, flash } = usePage<PageProps>().props;
    const [isShipDialogOpen, setIsShipDialogOpen] = useState(false);
    const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const [shipFormData, setShipFormData] = useState({
        tracking_number: '',
        tracking_carrier: '',
        tracking_url: '',
        vendor_notes: '',
    });

    const [trackingFormData, setTrackingFormData] = useState({
        tracking_number: purchaseOrder.tracking_number || '',
        tracking_carrier: purchaseOrder.tracking_carrier || '',
        tracking_url: purchaseOrder.tracking_url || '',
    });

    const [uploadFormData, setUploadFormData] = useState({
        document: null as File | null,
        document_type: '',
    });

    const handleLogout = () => {
        router.post('/vendor-portal/logout');
    };

    const handleAcknowledge = () => {
        router.post(`/vendor-portal/orders/${purchaseOrder.id}/acknowledge`);
    };

    const handleShip = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/vendor-portal/orders/${purchaseOrder.id}/ship`, shipFormData, {
            onSuccess: () => setIsShipDialogOpen(false),
        });
    };

    const handleUpdateTracking = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/vendor-portal/orders/${purchaseOrder.id}/tracking`, trackingFormData, {
            onSuccess: () => setIsTrackingDialogOpen(false),
        });
    };

    const handleUploadDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFormData.document) return;

        const formData = new FormData();
        formData.append('document', uploadFormData.document);
        formData.append('document_type', uploadFormData.document_type);

        router.post(`/vendor-portal/orders/${purchaseOrder.id}/documents`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsUploadDialogOpen(false);
                setUploadFormData({ document: null, document_type: '' });
            },
        });
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
            <Badge variant={config.variant} className="text-sm">
                <Icon className="mr-1 h-4 w-4" />
                {config.label}
            </Badge>
        );
    };

    const canAcknowledge = purchaseOrder.status === 'sent';
    const canShip = ['sent', 'acknowledged'].includes(purchaseOrder.status);
    const canUpdateTracking = ['shipped'].includes(purchaseOrder.status);

    return (
        <>
            <Head title={`Vendor Portal - Order ${purchaseOrder.po_number}`} />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <Link href="/vendor-portal/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Order {purchaseOrder.po_number}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {supplier.name}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status and Actions */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Order Status</CardTitle>
                                            <CardDescription>
                                                From {purchaseOrder.company_name}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(purchaseOrder.status)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        {canAcknowledge && (
                                            <Button onClick={handleAcknowledge}>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Acknowledge Order
                                            </Button>
                                        )}
                                        {canShip && (
                                            <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="default">
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Mark as Shipped
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Mark Order as Shipped</DialogTitle>
                                                        <DialogDescription>
                                                            Enter shipping details for this order.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={handleShip}>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Tracking Number</Label>
                                                                <Input
                                                                    value={shipFormData.tracking_number}
                                                                    onChange={(e) =>
                                                                        setShipFormData({
                                                                            ...shipFormData,
                                                                            tracking_number: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="Enter tracking number"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Carrier</Label>
                                                                <Input
                                                                    value={shipFormData.tracking_carrier}
                                                                    onChange={(e) =>
                                                                        setShipFormData({
                                                                            ...shipFormData,
                                                                            tracking_carrier: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="e.g., FedEx, UPS, DHL"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Tracking URL</Label>
                                                                <Input
                                                                    type="url"
                                                                    value={shipFormData.tracking_url}
                                                                    onChange={(e) =>
                                                                        setShipFormData({
                                                                            ...shipFormData,
                                                                            tracking_url: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Notes</Label>
                                                                <Textarea
                                                                    value={shipFormData.vendor_notes}
                                                                    onChange={(e) =>
                                                                        setShipFormData({
                                                                            ...shipFormData,
                                                                            vendor_notes: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder="Any additional notes..."
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setIsShipDialogOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button type="submit">Confirm Shipment</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        {canUpdateTracking && (
                                            <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">
                                                        Update Tracking
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Update Tracking Information</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleUpdateTracking}>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Tracking Number</Label>
                                                                <Input
                                                                    value={trackingFormData.tracking_number}
                                                                    onChange={(e) =>
                                                                        setTrackingFormData({
                                                                            ...trackingFormData,
                                                                            tracking_number: e.target.value,
                                                                        })
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Carrier</Label>
                                                                <Input
                                                                    value={trackingFormData.tracking_carrier}
                                                                    onChange={(e) =>
                                                                        setTrackingFormData({
                                                                            ...trackingFormData,
                                                                            tracking_carrier: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Tracking URL</Label>
                                                                <Input
                                                                    type="url"
                                                                    value={trackingFormData.tracking_url}
                                                                    onChange={(e) =>
                                                                        setTrackingFormData({
                                                                            ...trackingFormData,
                                                                            tracking_url: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button type="submit">Update</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Upload Document
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Upload Document</DialogTitle>
                                                    <DialogDescription>
                                                        Upload invoices, packing slips, or certificates.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleUploadDocument}>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label>Document Type</Label>
                                                            <Select
                                                                value={uploadFormData.document_type}
                                                                onValueChange={(value) =>
                                                                    setUploadFormData({
                                                                        ...uploadFormData,
                                                                        document_type: value,
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="invoice">Invoice</SelectItem>
                                                                    <SelectItem value="packing_slip">Packing Slip</SelectItem>
                                                                    <SelectItem value="certificate">Certificate</SelectItem>
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>File</Label>
                                                            <Input
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) =>
                                                                    setUploadFormData({
                                                                        ...uploadFormData,
                                                                        document: e.target.files?.[0] || null,
                                                                    })
                                                                }
                                                            />
                                                            <p className="text-xs text-gray-500">
                                                                PDF, JPG, PNG (max 10MB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            disabled={!uploadFormData.document || !uploadFormData.document_type}
                                                        >
                                                            Upload
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Part Number</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-right">Qty</TableHead>
                                                <TableHead className="text-right">Unit Price</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {purchaseOrder.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.part_number}
                                                    </TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(item.unit_price)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(item.total_price)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-right font-bold">
                                                    Total
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatCurrency(purchaseOrder.total_amount)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Created</p>
                                        <p className="font-medium">{purchaseOrder.created_at}</p>
                                    </div>
                                    {purchaseOrder.expected_delivery_date && (
                                        <div>
                                            <p className="text-sm text-gray-500">Expected Delivery</p>
                                            <p className="font-medium">{purchaseOrder.expected_delivery_date}</p>
                                        </div>
                                    )}
                                    {purchaseOrder.acknowledged_at && (
                                        <div>
                                            <p className="text-sm text-gray-500">Acknowledged</p>
                                            <p className="font-medium">{purchaseOrder.acknowledged_at}</p>
                                        </div>
                                    )}
                                    {purchaseOrder.shipping_date && (
                                        <div>
                                            <p className="text-sm text-gray-500">Shipped</p>
                                            <p className="font-medium">{purchaseOrder.shipping_date}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            {purchaseOrder.shipping_address && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Shipping Address</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-line text-sm">
                                            {purchaseOrder.shipping_address}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tracking Info */}
                            {purchaseOrder.tracking_number && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tracking Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Tracking Number</p>
                                            <p className="font-medium">{purchaseOrder.tracking_number}</p>
                                        </div>
                                        {purchaseOrder.tracking_carrier && (
                                            <div>
                                                <p className="text-sm text-gray-500">Carrier</p>
                                                <p className="font-medium">{purchaseOrder.tracking_carrier}</p>
                                            </div>
                                        )}
                                        {purchaseOrder.tracking_url && (
                                            <a
                                                href={purchaseOrder.tracking_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:underline"
                                            >
                                                Track Shipment
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Documents */}
                            {purchaseOrder.vendor_documents.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {purchaseOrder.vendor_documents.map((doc, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-gray-400" />
                                                    <a
                                                        href={`/storage/${doc.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        {doc.filename}
                                                    </a>
                                                    <Badge variant="outline" className="text-xs">
                                                        {doc.type}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Notes */}
                            {(purchaseOrder.notes || purchaseOrder.vendor_notes) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {purchaseOrder.notes && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">From Buyer</p>
                                                <p className="text-sm">{purchaseOrder.notes}</p>
                                            </div>
                                        )}
                                        {purchaseOrder.vendor_notes && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Your Notes</p>
                                                <p className="text-sm">{purchaseOrder.vendor_notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
