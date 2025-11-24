import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Warehouse } from 'lucide-react';
import { useState } from 'react';

interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    spare_parts_count: number;
    purchase_orders_count: number;
}

interface Props {
    suppliers: {
        data: Supplier[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showDialog, setShowDialog] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(
        null,
    );

    const {
        data,
        setData,
        post,
        put,
        delete: deleteSupplier,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSearch = () => {
        router.get(
            '/suppliers',
            {
                search: searchTerm || undefined,
            },
            { preserveState: true },
        );
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.get('/suppliers');
    };

    const handleOpenDialog = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setData({
                name: supplier.name,
                contact_person: supplier.contact_person || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
            });
        } else {
            setEditingSupplier(null);
            reset();
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingSupplier(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSupplier) {
            put(`/suppliers/${editingSupplier.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        } else {
            post('/suppliers', {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        }
    };

    const handleDelete = (supplier: Supplier) => {
        if (
            supplier.spare_parts_count > 0 ||
            supplier.purchase_orders_count > 0
        ) {
            alert(
                'Cannot delete supplier with associated spare parts or purchase orders. Please remove those first.',
            );
            return;
        }

        if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
            deleteSupplier(`/suppliers/${supplier.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Suppliers" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Suppliers
                        </h1>
                        <p className="text-muted-foreground">
                            Manage spare parts suppliers and vendors
                        </p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Supplier
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleSearch()
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSearch}>Search</Button>
                            <Button
                                variant="outline"
                                onClick={handleClearSearch}
                            >
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Suppliers Table */}
                <Card>
                    <CardContent className="p-0">
                        {suppliers.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Warehouse className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">
                                    No Suppliers
                                </h3>
                                <p className="mb-4 text-center text-sm text-muted-foreground">
                                    {filters.search
                                        ? 'No suppliers match your search.'
                                        : 'Get started by adding your first supplier.'}
                                </p>
                                {!filters.search && (
                                    <Button onClick={() => handleOpenDialog()}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Supplier
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>
                                                Contact Person
                                            </TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead className="text-right">
                                                Parts
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Orders
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {suppliers.data.map((supplier) => (
                                            <TableRow key={supplier.id}>
                                                <TableCell className="font-semibold">
                                                    {supplier.name}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.contact_person || (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.email || (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.phone || (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.address ? (
                                                        <span className="line-clamp-1 text-sm">
                                                            {supplier.address}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {supplier.spare_parts_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {
                                                        supplier.purchase_orders_count
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    supplier,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    supplier,
                                                                )
                                                            }
                                                            disabled={
                                                                supplier.spare_parts_count >
                                                                    0 ||
                                                                supplier.purchase_orders_count >
                                                                    0
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {suppliers.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t px-6 py-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing{' '}
                                            {(suppliers.current_page - 1) *
                                                suppliers.per_page +
                                                1}{' '}
                                            to{' '}
                                            {Math.min(
                                                suppliers.current_page *
                                                    suppliers.per_page,
                                                suppliers.total,
                                            )}{' '}
                                            of {suppliers.total} suppliers
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    suppliers.current_page === 1
                                                }
                                                onClick={() =>
                                                    router.get('/suppliers', {
                                                        ...filters,
                                                        page:
                                                            suppliers.current_page -
                                                            1,
                                                    })
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    suppliers.current_page ===
                                                    suppliers.last_page
                                                }
                                                onClick={() =>
                                                    router.get('/suppliers', {
                                                        ...filters,
                                                        page:
                                                            suppliers.current_page +
                                                            1,
                                                    })
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

            {/* Create/Edit Supplier Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSupplier
                                ? 'Update the supplier information below.'
                                : 'Add a new supplier to your system.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., ABC Industrial Supplies"
                                    className={
                                        errors.name ? 'border-red-500' : ''
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_person">
                                    Contact Person
                                </Label>
                                <Input
                                    id="contact_person"
                                    value={data.contact_person}
                                    onChange={(e) =>
                                        setData(
                                            'contact_person',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., John Smith"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="e.g., sales@supplier.com"
                                    className={
                                        errors.email ? 'border-red-500' : ''
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    placeholder="e.g., +1 234 567 8900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Full address"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : editingSupplier
                                      ? 'Save Changes'
                                      : 'Create Supplier'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
