import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';

interface Machine {
    id: number;
    name: string;
    code: string | null;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    machines: Machine[];
    users: User[];
    task?: {
        id: number;
        title: string;
        description: string | null;
        machine_id: number;
        schedule_interval_value: number;
        schedule_interval_unit: 'days' | 'weeks' | 'months';
        assigned_to: number | null;
        is_active: boolean;
    };
}

export default function CreatePreventiveTask({
    machines,
    users,
    task,
}: Props) {
    const isEditing = !!task;

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        machine_id: task?.machine_id.toString() || '',
        schedule_interval_value: task?.schedule_interval_value.toString() || '1',
        schedule_interval_unit: task?.schedule_interval_unit || 'months',
        assigned_to: task?.assigned_to?.toString() || '',
        is_active: task?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/preventive-tasks/${task.id}`, {
                onSuccess: () => {
                    router.visit(`/preventive-tasks/${task.id}`);
                },
            });
        } else {
            post('/preventive-tasks', {
                onSuccess: () => {
                    router.visit('/preventive-tasks');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head
                title={
                    isEditing
                        ? 'Edit Preventive Task'
                        : 'Create Preventive Task'
                }
            />

            <div className="container mx-auto max-w-2xl py-6">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.visit(
                                isEditing
                                    ? `/preventive-tasks/${task.id}`
                                    : '/preventive-tasks',
                            )
                        }
                        className="mb-2 text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {isEditing
                            ? 'Edit Preventive Task'
                            : 'Create Preventive Task'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing
                            ? 'Update the preventive maintenance schedule'
                            : 'Schedule regular maintenance for a machine'}
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                        <CardDescription>
                            Fill in the maintenance task information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Task Title{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Monthly lubrication check"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="bg-background"
                                />
                                {errors.title && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Machine */}
                            <div className="space-y-2">
                                <Label htmlFor="machine_id">
                                    Machine{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.machine_id}
                                    onValueChange={(value) =>
                                        setData('machine_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="machine_id"
                                        className="bg-background"
                                    >
                                        <SelectValue placeholder="Select a machine..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {machines.map((machine) => (
                                            <SelectItem
                                                key={machine.id}
                                                value={machine.id.toString()}
                                            >
                                                {machine.name}
                                                {machine.code &&
                                                    ` (${machine.code})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.machine_id && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.machine_id}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what needs to be done..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="resize-none bg-background"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional details about the maintenance task
                                </p>
                                {errors.description && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Schedule */}
                            <div className="space-y-2">
                                <Label>
                                    Schedule{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label
                                            htmlFor="schedule_interval_value"
                                            className="text-xs text-muted-foreground"
                                        >
                                            Every
                                        </Label>
                                        <Input
                                            id="schedule_interval_value"
                                            type="number"
                                            min="1"
                                            value={data.schedule_interval_value}
                                            onChange={(e) =>
                                                setData(
                                                    'schedule_interval_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-background"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="schedule_interval_unit"
                                            className="text-xs text-muted-foreground"
                                        >
                                            Period
                                        </Label>
                                        <Select
                                            value={data.schedule_interval_unit}
                                            onValueChange={(value: any) =>
                                                setData(
                                                    'schedule_interval_unit',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="schedule_interval_unit"
                                                className="bg-background"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="days">
                                                    Days
                                                </SelectItem>
                                                <SelectItem value="weeks">
                                                    Weeks
                                                </SelectItem>
                                                <SelectItem value="months">
                                                    Months
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    How often should this maintenance be
                                    performed?
                                </p>
                                {(errors.schedule_interval_value ||
                                    errors.schedule_interval_unit) && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.schedule_interval_value ||
                                            errors.schedule_interval_unit}
                                    </p>
                                )}
                            </div>

                            {/* Assigned To */}
                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Assign To</Label>
                                <Select
                                    value={data.assigned_to || undefined}
                                    onValueChange={(value) =>
                                        setData('assigned_to', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="assigned_to"
                                        className="bg-background"
                                    >
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Optional - Work orders will be automatically
                                    assigned to this person
                                </p>
                                {errors.assigned_to && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.assigned_to}
                                    </p>
                                )}
                            </div>

                            {/* Status (only when editing) */}
                            {isEditing && (
                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Status</Label>
                                    <Select
                                        value={data.is_active ? 'true' : 'false'}
                                        onValueChange={(value) =>
                                            setData('is_active', value === 'true')
                                        }
                                    >
                                        <SelectTrigger
                                            id="is_active"
                                            className="bg-background"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="false">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Inactive tasks won't generate new work
                                        orders
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={
                                        processing ||
                                        !data.title ||
                                        !data.machine_id ||
                                        !data.schedule_interval_value
                                    }
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Saving...'
                                        : isEditing
                                          ? 'Update Task'
                                          : 'Create Task'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(
                                            isEditing
                                                ? `/preventive-tasks/${task.id}`
                                                : '/preventive-tasks',
                                        )
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
