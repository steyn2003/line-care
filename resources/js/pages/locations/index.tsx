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
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Edit,
    Inbox,
    MapPin,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Location {
    id: number;
    name: string;
    machines_count?: number;
    created_at: string;
}

interface Props {
    locations: Location[];
}

export default function LocationsIndex({ locations }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(
        null,
    );
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingLocation, setDeletingLocation] = useState<Location | null>(
        null,
    );

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
    });

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateDialog = () => {
        reset();
        setEditingLocation(null);
        setShowDialog(true);
    };

    const openEditDialog = (location: Location) => {
        setData('name', location.name);
        setEditingLocation(location);
        setShowDialog(true);
    };

    const openDeleteDialog = (location: Location) => {
        setDeletingLocation(location);
        setShowDeleteDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLocation) {
            put(`/locations/${editingLocation.id}`, {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        } else {
            post('/locations', {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingLocation) return;

        destroy(`/locations/${deletingLocation.id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeletingLocation(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Locations" />

            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Locations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your facility locations
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
                    </Button>
                </div>

                {/* Locations List */}
                {locations.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No locations yet
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                Add your first location to organize your
                                machines
                            </p>
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Location
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {locations.map((location) => (
                            <Card
                                key={location.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {location.name}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 text-sm text-muted-foreground">
                                        {location.machines_count || 0} machine
                                        {location.machines_count !== 1
                                            ? 's'
                                            : ''}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() =>
                                                openEditDialog(location)
                                            }
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                openDeleteDialog(location)
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
                            {editingLocation ? 'Edit Location' : 'Add Location'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingLocation
                                ? 'Update the location details'
                                : 'Create a new location to organize your machines'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Location Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Production Floor A"
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
                                    : editingLocation
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
                        <DialogTitle>Delete Location?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {deletingLocation?.name}"? This action cannot be
                            undone.
                            {deletingLocation?.machines_count &&
                                deletingLocation.machines_count > 0 && (
                                    <span className="mt-2 block font-medium text-destructive">
                                        Warning: This location has{' '}
                                        {deletingLocation.machines_count}{' '}
                                        machine
                                        {deletingLocation.machines_count !== 1
                                            ? 's'
                                            : ''}{' '}
                                        assigned to it.
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
