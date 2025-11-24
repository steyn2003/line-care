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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    Cpu,
    Edit,
    Inbox,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface Machine {
    id: number;
    name: string;
    code: string | null;
}

interface AssignedUser {
    id: number;
    name: string;
}

interface WorkOrder {
    id: number;
    title: string;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    completed_at: string | null;
    machine: Machine;
}

interface PreventiveTask {
    id: number;
    title: string;
    description: string | null;
    machine_id: number;
    machine: Machine;
    schedule_interval_value: number;
    schedule_interval_unit: 'days' | 'weeks' | 'months';
    assigned_to: number | null;
    assignee?: AssignedUser;
    next_due_date: string;
    last_completed_at: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    task: PreventiveTask;
    work_orders: WorkOrder[];
}

export default function PreventiveTaskShow({ task, work_orders }: Props) {
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

    const { delete: destroy, processing } = useForm();

    const isOverdue = new Date(task.next_due_date) < new Date();

    const formatSchedule = (value: number, unit: string) => {
        const unitLabel = value === 1 ? unit.slice(0, -1) : unit;
        return `Every ${value} ${unitLabel}`;
    };

    const formatDueDate = (dueDate: string) => {
        const date = new Date(dueDate);
        const today = new Date();
        const diffDays = Math.ceil(
            (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else {
            return `Due in ${diffDays} days`;
        }
    };

    const handleDeactivate = () => {
        destroy(`/preventive-tasks/${task.id}`, {
            onSuccess: () => {
                router.visit('/preventive-tasks');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<
            string,
            {
                variant: 'default' | 'secondary' | 'destructive' | 'outline';
                label: string;
            }
        > = {
            open: { variant: 'secondary', label: 'Open' },
            in_progress: { variant: 'default', label: 'In Progress' },
            completed: { variant: 'outline', label: 'Completed' },
            cancelled: { variant: 'destructive', label: 'Cancelled' },
        };

        const config = variants[status] || variants.open;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const upcomingWorkOrders = work_orders.filter(
        (wo) => wo.status === 'open' || wo.status === 'in_progress',
    );
    const completedWorkOrders = work_orders.filter(
        (wo) => wo.status === 'completed',
    );

    return (
        <AppLayout>
            <Head title={`${task.title} - Preventive Task`} />

            <div className="container mx-auto max-w-5xl py-6">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/preventive-tasks')}
                        className="mb-2 text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Tasks
                    </Button>

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {task.title}
                                </h1>
                                {!task.is_active && (
                                    <Badge variant="secondary">Inactive</Badge>
                                )}
                                {task.is_active && isOverdue && (
                                    <Badge
                                        variant="destructive"
                                        className="flex items-center gap-1"
                                    >
                                        <AlertCircle className="h-3 w-3" />
                                        Overdue
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">
                                {formatSchedule(
                                    task.schedule_interval_value,
                                    task.schedule_interval_unit,
                                )}{' '}
                                for {task.machine.name}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.visit(
                                        `/preventive-tasks/${task.id}/edit`,
                                    )
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                            {task.is_active && (
                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        setShowDeactivateDialog(true)
                                    }
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deactivate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Task Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Machine */}
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                        Machine
                                    </div>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-base font-semibold text-foreground"
                                        onClick={() =>
                                            router.visit(
                                                `/machines/${task.machine.id}`,
                                            )
                                        }
                                    >
                                        <Cpu className="mr-2 h-4 w-4" />
                                        {task.machine.name}
                                        {task.machine.code &&
                                            ` (${task.machine.code})`}
                                    </Button>
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-muted-foreground">
                                            Description
                                        </div>
                                        <p className="text-sm text-foreground">
                                            {task.description}
                                        </p>
                                    </div>
                                )}

                                <Separator />

                                {/* Schedule */}
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                        Schedule
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {formatSchedule(
                                                task.schedule_interval_value,
                                                task.schedule_interval_unit,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Next Due Date */}
                                <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                        Next Due Date
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span
                                            className={
                                                isOverdue
                                                    ? 'font-medium text-destructive'
                                                    : 'text-foreground'
                                            }
                                        >
                                            {new Date(
                                                task.next_due_date,
                                            ).toLocaleDateString()}{' '}
                                            ({formatDueDate(task.next_due_date)}
                                            )
                                        </span>
                                    </div>
                                </div>

                                {/* Last Completed */}
                                {task.last_completed_at && (
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-muted-foreground">
                                            Last Completed
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span>
                                                {new Date(
                                                    task.last_completed_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Assigned To */}
                                {task.assignee && (
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-muted-foreground">
                                            Assigned To
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{task.assignee.name}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Work Orders */}
                        {upcomingWorkOrders.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Upcoming Work Orders (
                                        {upcomingWorkOrders.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Work orders generated from this task
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {upcomingWorkOrders.map((wo) => (
                                            <div
                                                key={wo.id}
                                                className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                                onClick={() =>
                                                    router.visit(
                                                        `/work-orders/${wo.id}`,
                                                    )
                                                }
                                            >
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="font-medium text-foreground">
                                                            {wo.title}
                                                        </span>
                                                        {getStatusBadge(
                                                            wo.status,
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Created{' '}
                                                        {new Date(
                                                            wo.created_at,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Completion History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Completion History (
                                    {completedWorkOrders.length})
                                </CardTitle>
                                <CardDescription>
                                    Past work orders completed for this task
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {completedWorkOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Inbox className="mb-2 h-12 w-12 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            No completed work orders yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {completedWorkOrders.map((wo) => (
                                            <div
                                                key={wo.id}
                                                className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                                onClick={() =>
                                                    router.visit(
                                                        `/work-orders/${wo.id}`,
                                                    )
                                                }
                                            >
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="font-medium text-foreground">
                                                            {wo.title}
                                                        </span>
                                                        <Badge variant="outline">
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                            Completed
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Completed{' '}
                                                        {wo.completed_at &&
                                                            new Date(
                                                                wo.completed_at,
                                                            ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {work_orders.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total work orders
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {completedWorkOrders.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Completed
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {upcomingWorkOrders.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Pending
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <div className="mb-1 text-muted-foreground">
                                        Created
                                    </div>
                                    <div className="text-foreground">
                                        {new Date(
                                            task.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 text-muted-foreground">
                                        Status
                                    </div>
                                    <div className="text-foreground">
                                        {task.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Deactivate Dialog */}
            <Dialog
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deactivate Preventive Task?</DialogTitle>
                        <DialogDescription>
                            This will stop generating new work orders for this
                            task. Existing work orders will not be affected. You
                            can reactivate this task later if needed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeactivateDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeactivate}
                            disabled={processing}
                        >
                            {processing ? 'Deactivating...' : 'Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
