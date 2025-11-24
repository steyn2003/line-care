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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DowntimeCategory {
    id: number;
    name: string;
    category_type: 'planned' | 'unplanned';
    is_included_in_oee: boolean;
    description: string | null;
}

interface Props {
    categories: DowntimeCategory[];
}

export default function DowntimeCategoriesIndex({ categories }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<DowntimeCategory | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: deleteCategory,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        category_type: 'unplanned' as 'planned' | 'unplanned',
        is_included_in_oee: true,
        description: '',
    });

    const handleOpenDialog = (category?: DowntimeCategory) => {
        if (category) {
            setEditingCategory(category);
            setData({
                name: category.name,
                category_type: category.category_type,
                is_included_in_oee: category.is_included_in_oee,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            reset();
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingCategory(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(`/downtime-categories/${editingCategory.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        } else {
            post('/downtime-categories', {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        }
    };

    const handleDelete = (category: DowntimeCategory) => {
        if (
            confirm(
                `Are you sure you want to delete ${category.name}? This cannot be undone.`,
            )
        ) {
            deleteCategory(`/downtime-categories/${category.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert(errors.message || 'Failed to delete category');
                },
            });
        }
    };

    const plannedCategories = categories.filter(
        (c) => c.category_type === 'planned',
    );
    const unplannedCategories = categories.filter(
        (c) => c.category_type === 'unplanned',
    );

    return (
        <AppLayout>
            <Head title="Downtime Categories" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Downtime Categories
                        </h1>
                        <p className="text-muted-foreground">
                            Categorize downtime events for OEE tracking
                        </p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                {categories.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No categories configured
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Get started by adding downtime categories
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => handleOpenDialog()}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <div className="border-b p-6">
                                <h2 className="text-lg font-semibold">
                                    Unplanned Downtime
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Unexpected stoppages (breakdowns, shortages)
                                </p>
                            </div>
                            <CardContent className="pt-6">
                                {unplannedCategories.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No unplanned categories
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>In OEE</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {unplannedCategories.map(
                                                (category) => (
                                                    <TableRow key={category.id}>
                                                        <TableCell className="font-medium">
                                                            {category.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    category.is_included_in_oee
                                                                        ? 'bg-blue-50 text-blue-700'
                                                                        : 'bg-gray-50 text-gray-700'
                                                                }`}
                                                            >
                                                                {category.is_included_in_oee
                                                                    ? 'Yes'
                                                                    : 'No'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleOpenDialog(
                                                                            category,
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
                                                                            category,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <div className="border-b p-6">
                                <h2 className="text-lg font-semibold">
                                    Planned Downtime
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Scheduled stoppages (maintenance,
                                    changeovers)
                                </p>
                            </div>
                            <CardContent className="pt-6">
                                {plannedCategories.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No planned categories
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>In OEE</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {plannedCategories.map(
                                                (category) => (
                                                    <TableRow key={category.id}>
                                                        <TableCell className="font-medium">
                                                            {category.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    category.is_included_in_oee
                                                                        ? 'bg-blue-50 text-blue-700'
                                                                        : 'bg-gray-50 text-gray-700'
                                                                }`}
                                                            >
                                                                {category.is_included_in_oee
                                                                    ? 'Yes'
                                                                    : 'No'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleOpenDialog(
                                                                            category,
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
                                                                            category,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                                ? 'Edit Downtime Category'
                                : 'Add Downtime Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Update category information'
                                : 'Add a new downtime category'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Category Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g., Breakdown, Changeover"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_type">
                                Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.category_type}
                                onValueChange={(value) =>
                                    setData(
                                        'category_type',
                                        value as 'planned' | 'unplanned',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unplanned">
                                        Unplanned
                                    </SelectItem>
                                    <SelectItem value="planned">
                                        Planned
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Planned: scheduled stops. Unplanned: unexpected
                                failures
                            </p>
                            {errors.category_type && (
                                <p className="text-sm text-destructive">
                                    {errors.category_type}
                                </p>
                            )}
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

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_included_in_oee"
                                checked={data.is_included_in_oee}
                                onCheckedChange={(checked) =>
                                    setData('is_included_in_oee', checked)
                                }
                            />
                            <div>
                                <Label htmlFor="is_included_in_oee">
                                    Include in OEE Calculation
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Affects availability metric when enabled
                                </p>
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
                                {editingCategory ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
