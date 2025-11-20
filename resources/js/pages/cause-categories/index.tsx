import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Edit,
    Inbox,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface CauseCategory {
    id: number;
    name: string;
    description: string | null;
    work_orders_count?: number;
    created_at: string;
}

interface Props {
    categories: CauseCategory[];
}

export default function CauseCategoriesIndex({ categories }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<CauseCategory | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingCategory, setDeletingCategory] =
        useState<CauseCategory | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateDialog = () => {
        reset();
        setEditingCategory(null);
        setShowDialog(true);
    };

    const openEditDialog = (category: CauseCategory) => {
        setData({
            name: category.name,
            description: category.description || '',
        });
        setEditingCategory(category);
        setShowDialog(true);
    };

    const openDeleteDialog = (category: CauseCategory) => {
        setDeletingCategory(category);
        setShowDeleteDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(`/cause-categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        } else {
            post('/cause-categories', {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingCategory) return;

        destroy(`/cause-categories/${deletingCategory.id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeletingCategory(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Cause Categories" />

            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Cause Categories
                        </h1>
                        <p className="text-muted-foreground">
                            Categorize breakdown root causes for better analysis
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                {/* Categories List */}
                {categories.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No cause categories yet
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                Add categories to track breakdown root causes
                            </p>
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {category.name}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {category.description && (
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            {category.description}
                                        </p>
                                    )}
                                    <div className="mb-4 text-sm text-muted-foreground">
                                        {category.work_orders_count || 0} work
                                        order
                                        {category.work_orders_count !== 1
                                            ? 's'
                                            : ''}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() =>
                                                openEditDialog(category)
                                            }
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                openDeleteDialog(category)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                                ? 'Edit Cause Category'
                                : 'Add Cause Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Update the category details'
                                : 'Create a new category for breakdown root causes'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Category Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Electrical, Mechanical, Operator Error"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="bg-background"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Optional description..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={3}
                                    className="resize-none bg-background"
                                />
                                {errors.description && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.name}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Saving...'
                                    : editingCategory
                                      ? 'Update'
                                      : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Cause Category?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {deletingCategory?.name}"? This action cannot be
                            undone.
                            {deletingCategory?.work_orders_count &&
                                deletingCategory.work_orders_count > 0 && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        Warning: This category is used in{' '}
                                        {deletingCategory.work_orders_count}{' '}
                                        work order
                                        {deletingCategory.work_orders_count !==
                                        1
                                            ? 's'
                                            : ''}
                                        .
                                    </span>
                                )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
