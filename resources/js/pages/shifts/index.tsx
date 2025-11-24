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
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    formatted_duration?: string;
}

interface Props {
    shifts: Shift[];
}

export default function ShiftsIndex({ shifts }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: deleteShift,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        start_time: '',
        end_time: '',
        is_active: true,
    });

    const handleOpenDialog = (shift?: Shift) => {
        if (shift) {
            setEditingShift(shift);
            // Convert time format from HH:MM:SS to HH:MM for input
            const startTime = shift.start_time.substring(0, 5);
            const endTime = shift.end_time.substring(0, 5);
            setData({
                name: shift.name,
                start_time: startTime,
                end_time: endTime,
                is_active: shift.is_active,
            });
        } else {
            setEditingShift(null);
            reset();
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingShift(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingShift) {
            put(`/shifts/${editingShift.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        } else {
            post('/shifts', {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseDialog();
                    router.reload();
                },
            });
        }
    };

    const handleDelete = (shift: Shift) => {
        if (
            confirm(
                `Are you sure you want to delete ${shift.name}? This cannot be undone.`,
            )
        ) {
            deleteShift(`/shifts/${shift.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert(errors.message || 'Failed to delete shift');
                },
            });
        }
    };

    const calculateDuration = (startTime: string, endTime: string): string => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        let totalMinutes =
            endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

        // Handle shifts that cross midnight
        if (totalMinutes < 0) {
            totalMinutes += 24 * 60;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    return (
        <AppLayout>
            <Head title="Shifts" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Shifts
                        </h1>
                        <p className="text-muted-foreground">
                            Manage work shifts for production tracking
                        </p>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Shift
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        {shifts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No shifts configured
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Get started by adding your first shift
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => handleOpenDialog()}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Shift
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shifts.map((shift) => (
                                        <TableRow key={shift.id}>
                                            <TableCell className="font-medium">
                                                {shift.name}
                                            </TableCell>
                                            <TableCell>
                                                {shift.start_time.substring(
                                                    0,
                                                    5,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {shift.end_time.substring(0, 5)}
                                            </TableCell>
                                            <TableCell>
                                                {calculateDuration(
                                                    shift.start_time,
                                                    shift.end_time,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        shift.is_active
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-gray-50 text-gray-700'
                                                    }`}
                                                >
                                                    {shift.is_active
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
                                                                shift,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(shift)
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingShift ? 'Edit Shift' : 'Add Shift'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingShift
                                ? 'Update shift information'
                                : 'Add a new work shift'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Shift Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g., Day Shift, Night Shift"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_time">
                                    Start Time{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        setData('start_time', e.target.value)
                                    }
                                    required
                                />
                                {errors.start_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.start_time}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_time">
                                    End Time{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        setData('end_time', e.target.value)
                                    }
                                    required
                                />
                                {errors.end_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.end_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {data.start_time && data.end_time && (
                            <p className="text-sm text-muted-foreground">
                                Duration:{' '}
                                {calculateDuration(
                                    data.start_time,
                                    data.end_time,
                                )}
                            </p>
                        )}

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
                                {editingShift ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
