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
import { Switch } from '@/components/ui/switch';
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
import { Edit, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    sku: string | null;
    description: string | null;
    theoretical_cycle_time: number;
    target_units_per_hour: number;
    is_active: boolean;
    formatted_cycle_time?: string;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function ProductsIndex({ products, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showDialog, setShowDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: deleteProduct,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        sku: '',
        description: '',
        theoretical_cycle_time: '',
        target_units_per_hour: '',
        is_active: true,
    });

    const handleSearch = () => {
        router.get(
            '/products',
            {
                search: searchTerm || undefined,
            },
            { preserveState: true },
        );
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.get('/products');
    };

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setData({
                name: product.name,
                sku: product.sku || '',
                description: product.description || '',
                theoretical_cycle_time:
                    product.theoretical_cycle_time.toString(),
                target_units_per_hour: product.target_units_per_hour.toString(),
                is_active: product.is_active,
            });
        } else {
            setEditingProduct(null);
            reset();
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingProduct(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        } else {
            post('/products', {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        }
    };

    const handleDelete = (product: Product) => {
        if (
            confirm(
                `Are you sure you want to delete ${product.name}? This cannot be undone.`,
            )
        ) {
            deleteProduct(`/products/${product.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert(errors.message || 'Failed to delete product');
                },
            });
        }
    };

    const formatCycleTime = (seconds: number): string => {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (remainingSeconds === 0) {
            return `${minutes}m`;
        }
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Products
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your product catalog for production tracking
                        </p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-6 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            <Button onClick={handleSearch}>Search</Button>
                            {filters.search && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearSearch}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>

                        {products.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No products found
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {filters.search
                                        ? 'Try adjusting your search'
                                        : 'Get started by adding your first product'}
                                </p>
                                {!filters.search && (
                                    <Button
                                        className="mt-4"
                                        onClick={() => handleOpenDialog()}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Product
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Cycle Time</TableHead>
                                        <TableHead>Target/Hour</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                {product.sku || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {formatCycleTime(
                                                    product.theoretical_cycle_time,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.target_units_per_hour}{' '}
                                                units
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        product.is_active
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-gray-50 text-gray-700'
                                                    }`}
                                                >
                                                    {product.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product,
                                                            )
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
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? 'Edit Product' : 'Add Product'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProduct
                                ? 'Update product information'
                                : 'Add a new product to your catalog'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Product Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    value={data.sku}
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    placeholder="Optional"
                                />
                                {errors.sku && (
                                    <p className="text-sm text-destructive">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="theoretical_cycle_time">
                                    Cycle Time (seconds){' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="theoretical_cycle_time"
                                    type="number"
                                    min="1"
                                    value={data.theoretical_cycle_time}
                                    onChange={(e) =>
                                        setData(
                                            'theoretical_cycle_time',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Time in seconds to produce one unit
                                </p>
                                {errors.theoretical_cycle_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.theoretical_cycle_time}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="target_units_per_hour">
                                    Target Units/Hour{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="target_units_per_hour"
                                    type="number"
                                    min="0"
                                    value={data.target_units_per_hour}
                                    onChange={(e) =>
                                        setData(
                                            'target_units_per_hour',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Expected production per hour
                                </p>
                                {errors.target_units_per_hour && (
                                    <p className="text-sm text-destructive">
                                        {errors.target_units_per_hour}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked)
                                }
                            />
                            <Label htmlFor="is_active">Active</Label>
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
                                {editingProduct ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
