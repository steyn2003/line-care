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
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Copy,
    Key,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface ApiKey {
    id: number;
    name: string;
    masked_key: string;
    is_active: boolean;
    last_used_at: string | null;
    expires_at: string | null;
    created_at: string;
}

interface Supplier {
    id: number;
    name: string;
    email: string | null;
    api_keys: ApiKey[];
}

interface PageProps {
    suppliers: Supplier[];
    flash?: {
        success?: string;
        new_api_key?: string;
        new_api_key_id?: number;
    };
}

export default function VendorApiKeysIndex() {
    const { suppliers = [], flash } = usePage<PageProps>().props;

    // Initialize state from flash data using useMemo to avoid effect issues
    const initialNewKeyState = useMemo(
        () => ({
            key: flash?.new_api_key ?? null,
            isOpen: !!flash?.new_api_key,
        }),
        [flash?.new_api_key],
    );

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isNewKeyOpen, setIsNewKeyOpen] = useState(initialNewKeyState.isOpen);
    const newKey = initialNewKeyState.key;
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        supplier_id: '',
        name: '',
        expires_at: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/settings/vendor-api-keys', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFormData({ supplier_id: '', name: '', expires_at: '' });
            },
        });
    };

    const handleToggle = (keyId: number) => {
        router.post(
            `/settings/vendor-api-keys/${keyId}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleRevoke = (keyId: number) => {
        if (
            confirm(
                'Are you sure you want to revoke this API key? This action cannot be undone.',
            )
        ) {
            router.delete(`/settings/vendor-api-keys/${keyId}`, {
                preserveScroll: true,
            });
        }
    };

    const copyToClipboard = async () => {
        if (newKey) {
            await navigator.clipboard.writeText(newKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (key: ApiKey) => {
        if (!key.is_active) {
            return (
                <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Inactive
                </Badge>
            );
        }

        if (key.expires_at && new Date(key.expires_at) < new Date()) {
            return (
                <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Expired
                </Badge>
            );
        }

        return (
            <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active
            </Badge>
        );
    };

    const totalKeys = suppliers.reduce((sum, s) => sum + s.api_keys.length, 0);
    const activeKeys = suppliers.reduce(
        (sum, s) => sum + s.api_keys.filter((k) => k.is_active).length,
        0,
    );

    return (
        <AppLayout>
            <Head title="Vendor API Keys" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Vendor API Keys
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage API keys for supplier access to the
                                vendor portal
                            </p>
                        </div>
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create API Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create New API Key
                                    </DialogTitle>
                                    <DialogDescription>
                                        Generate a new API key for a supplier to
                                        access the vendor portal.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate}>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="supplier_id">
                                                Supplier
                                            </Label>
                                            <Select
                                                value={formData.supplier_id}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        supplier_id: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a supplier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {suppliers.map(
                                                        (supplier) => (
                                                            <SelectItem
                                                                key={
                                                                    supplier.id
                                                                }
                                                                value={supplier.id.toString()}
                                                            >
                                                                {supplier.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Key Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g., Production Access"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expires_at">
                                                Expiration Date (Optional)
                                            </Label>
                                            <Input
                                                id="expires_at"
                                                type="datetime-local"
                                                value={formData.expires_at}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        expires_at:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <p className="text-xs text-gray-500">
                                                Leave empty for a key that never
                                                expires
                                            </p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsCreateOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Create Key
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* New API Key Modal */}
                    <Dialog open={isNewKeyOpen} onOpenChange={setIsNewKeyOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-green-500" />
                                    API Key Created
                                </DialogTitle>
                                <DialogDescription>
                                    Make sure to copy your API key now. You
                                    won&apos;t be able to see it again!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="rounded-md bg-gray-100 p-4">
                                    <code className="text-sm break-all">
                                        {newKey}
                                    </code>
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-3 w-full"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy to Clipboard
                                        </>
                                    )}
                                </Button>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsNewKeyOpen(false)}>
                                    Done
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Stats Cards */}
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Suppliers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {suppliers.length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total API Keys
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalKeys}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Active Keys
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {activeKeys}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Suppliers and Keys */}
                    <div className="space-y-6">
                        {suppliers.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Key className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        No Suppliers Found
                                    </h3>
                                    <p className="mb-4 max-w-md text-center text-gray-600">
                                        You need to add suppliers before you can
                                        create API keys for them.
                                    </p>
                                    <Button variant="outline" asChild>
                                        <a href="/suppliers">
                                            Manage Suppliers
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            suppliers.map((supplier) => (
                                <Card key={supplier.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    {supplier.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {supplier.email ||
                                                        'No email configured'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline">
                                                {supplier.api_keys.length} key
                                                {supplier.api_keys.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {supplier.api_keys.length === 0 ? (
                                            <p className="py-4 text-center text-sm text-gray-500">
                                                No API keys for this supplier
                                            </p>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Name
                                                        </TableHead>
                                                        <TableHead>
                                                            Key
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Last Used
                                                        </TableHead>
                                                        <TableHead>
                                                            Expires
                                                        </TableHead>
                                                        <TableHead>
                                                            Active
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {supplier.api_keys.map(
                                                        (apiKey) => (
                                                            <TableRow
                                                                key={apiKey.id}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        apiKey.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <code className="text-xs text-gray-600">
                                                                        {
                                                                            apiKey.masked_key
                                                                        }
                                                                    </code>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getStatusBadge(
                                                                        apiKey,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-600">
                                                                    {apiKey.last_used_at ? (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {formatDate(
                                                                                apiKey.last_used_at,
                                                                            )}
                                                                        </span>
                                                                    ) : (
                                                                        'Never'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-600">
                                                                    {apiKey.expires_at
                                                                        ? formatDate(
                                                                              apiKey.expires_at,
                                                                          )
                                                                        : 'Never'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Switch
                                                                        checked={
                                                                            apiKey.is_active
                                                                        }
                                                                        onCheckedChange={() =>
                                                                            handleToggle(
                                                                                apiKey.id,
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-700"
                                                                        onClick={() =>
                                                                            handleRevoke(
                                                                                apiKey.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Documentation Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>
                                Vendor Portal API Documentation
                            </CardTitle>
                            <CardDescription>
                                How suppliers can use their API keys to access
                                the vendor portal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="mb-2 font-medium">
                                    Authentication
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Suppliers should include the API key in the
                                    request header:
                                </p>
                                <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
                                    <code>
                                        X-Vendor-API-Key: vak_xxxxxxxxxxxxxxxx
                                    </code>
                                </pre>
                                <p className="mt-2 text-sm text-gray-600">
                                    Or as a Bearer token:
                                </p>
                                <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
                                    <code>
                                        Authorization: Bearer
                                        vak_xxxxxxxxxxxxxxxx
                                    </code>
                                </pre>
                            </div>
                            <div>
                                <h4 className="mb-2 font-medium">
                                    Available Endpoints
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            GET /api/vendor/purchase-orders
                                        </code>{' '}
                                        - List purchase orders
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            GET /api/vendor/purchase-orders/:id
                                        </code>{' '}
                                        - View purchase order details
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            PUT
                                            /api/vendor/purchase-orders/:id/acknowledge
                                        </code>{' '}
                                        - Acknowledge receipt
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            PUT
                                            /api/vendor/purchase-orders/:id/shipped
                                        </code>{' '}
                                        - Mark as shipped
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            POST
                                            /api/vendor/purchase-orders/:id/tracking
                                        </code>{' '}
                                        - Add tracking info
                                    </li>
                                    <li>
                                        <code className="rounded bg-gray-100 px-1">
                                            POST
                                            /api/vendor/purchase-orders/:id/documents
                                        </code>{' '}
                                        - Upload documents
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
