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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Check,
    ExternalLink,
    MapPin,
    Play,
    Plus,
    User,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';

interface Machine {
    id: number;
    name: string;
    location: { id: number; name: string } | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface CauseCategory {
    id: number;
    name: string;
}

interface MaintenanceLog {
    id: number;
    user: User;
    notes: string | null;
    work_done: string | null;
    parts_used: string | null;
    created_at: string;
}

interface WorkOrder {
    id: number;
    title: string;
    description: string | null;
    type: 'breakdown' | 'preventive';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    machine: Machine;
    creator: User;
    assignee: User | null;
    cause_category: CauseCategory | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    maintenance_logs: MaintenanceLog[];
}

interface Props {
    work_order: WorkOrder;
    cause_categories: CauseCategory[];
    user: {
        id: number;
        role: 'operator' | 'technician' | 'manager';
    };
}

const typeColors = {
    breakdown:
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
    preventive:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200',
};

const statusColors = {
    open: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    in_progress:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function WorkOrderShow({
    work_order,
    cause_categories,
    user,
}: Props) {
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        completed_at: new Date().toISOString().slice(0, 16),
        cause_category_id: work_order.cause_category?.id || '',
        notes: '',
        work_done: '',
        parts_used: '',
    });

    const canEdit = user.role !== 'operator';
    const canStart = canEdit && work_order.status === 'open';
    const canComplete = canEdit && work_order.status === 'in_progress';

    const handleStartWork = () => {
        router.post(`/work-orders/${work_order.id}/status`, {
            status: 'in_progress',
        });
    };

    const handleComplete = () => {
        post(`/work-orders/${work_order.id}/complete`, {
            onSuccess: () => {
                setShowCompleteModal(false);
            },
        });
    };

    const handleAssignToMe = () => {
        router.post(`/work-orders/${work_order.id}/assign`, {
            assigned_to: user.id,
        });
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const calculateDowntime = () => {
        if (!work_order.started_at || !work_order.completed_at) return null;
        const start = new Date(work_order.started_at);
        const end = new Date(work_order.completed_at);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        <AppLayout>
            <Head title={work_order.title} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/work-orders')}
                            className="text-muted-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Work Orders
                        </Button>
                        <div className="flex items-center gap-2">
                            <Badge className={typeColors[work_order.type]}>
                                {work_order.type === 'breakdown' ? (
                                    <>
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        Breakdown
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="mr-1 h-3 w-3" />
                                        Preventive
                                    </>
                                )}
                            </Badge>
                            <Badge className={statusColors[work_order.status]}>
                                {work_order.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {work_order.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            WO #{work_order.id}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {canStart && (
                            <Button onClick={handleStartWork}>
                                <Play className="mr-2 h-4 w-4" />
                                Start Work
                            </Button>
                        )}
                        {canComplete && (
                            <Button onClick={() => setShowCompleteModal(true)}>
                                <Check className="mr-2 h-4 w-4" />
                                Complete
                            </Button>
                        )}
                        {!work_order.assignee && canEdit && (
                            <Button
                                variant="outline"
                                onClick={handleAssignToMe}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign to Me
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Summary */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Machine
                                    </span>
                                    <div className="mt-1">
                                        <Link
                                            href={`/machines/${work_order.machine.id}`}
                                            className="flex items-center font-medium text-primary hover:underline"
                                        >
                                            {work_order.machine.name}
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </Link>
                                        {work_order.machine.location && (
                                            <p className="mt-1 flex items-center text-sm text-muted-foreground">
                                                <MapPin className="mr-1 h-3 w-3" />
                                                {
                                                    work_order.machine.location
                                                        .name
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {work_order.description && (
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Description
                                        </span>
                                        <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                            {work_order.description}
                                        </p>
                                    </div>
                                )}

                                {work_order.cause_category && (
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Cause Category
                                        </span>
                                        <p className="mt-1 text-sm text-foreground">
                                            {work_order.cause_category.name}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Created */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <Plus className="h-4 w-4 text-primary" />
                                            </div>
                                            {(work_order.started_at ||
                                                work_order.completed_at) && (
                                                <div className="h-8 w-px bg-border" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm font-medium text-foreground">
                                                Created
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                by {work_order.creator.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDateTime(
                                                    work_order.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Started */}
                                    {work_order.started_at && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                                                    <Play className="h-4 w-4 text-amber-800 dark:text-amber-300" />
                                                </div>
                                                {work_order.completed_at && (
                                                    <div className="h-8 w-px bg-border" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="text-sm font-medium text-foreground">
                                                    Started
                                                </p>
                                                {work_order.assignee && (
                                                    <p className="text-xs text-muted-foreground">
                                                        by{' '}
                                                        {
                                                            work_order.assignee
                                                                .name
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        work_order.started_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Completed */}
                                    {work_order.completed_at && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                                    <Check className="h-4 w-4 text-green-800 dark:text-green-300" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">
                                                    Completed
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        work_order.completed_at,
                                                    )}
                                                </p>
                                                {calculateDowntime() && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Downtime:{' '}
                                                        {calculateDowntime()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Maintenance Logs */}
                        {work_order.maintenance_logs.length > 0 && (
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Maintenance Logs</CardTitle>
                                    <CardDescription>
                                        Work performed and notes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {work_order.maintenance_logs.map(
                                            (log) => (
                                                <div
                                                    key={log.id}
                                                    className="space-y-2 border-l-2 border-primary pl-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {log.user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDateTime(
                                                                log.created_at,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {log.work_done && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                Work Done:
                                                            </p>
                                                            <p className="text-sm whitespace-pre-wrap text-foreground">
                                                                {log.work_done}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {log.parts_used && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                Parts Used:
                                                            </p>
                                                            <p className="text-sm text-foreground">
                                                                {log.parts_used}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {log.notes && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                Notes:
                                                            </p>
                                                            <p className="text-sm whitespace-pre-wrap text-foreground">
                                                                {log.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Assignment */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Assignment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {work_order.assignee ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {work_order.assignee.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {work_order.assignee.email}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Unassigned
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Created By */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Reported By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {work_order.creator.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {work_order.creator.email}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Complete Modal */}
            <Dialog
                open={showCompleteModal}
                onOpenChange={setShowCompleteModal}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Complete Work Order</DialogTitle>
                        <DialogDescription>
                            Fill in the completion details and notes
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="completed_at">
                                Completion Time
                            </Label>
                            <Input
                                id="completed_at"
                                type="datetime-local"
                                value={data.completed_at}
                                onChange={(e) =>
                                    setData('completed_at', e.target.value)
                                }
                            />
                            {errors.completed_at && (
                                <p className="text-sm text-destructive">
                                    {errors.completed_at}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cause_category_id">
                                Cause Category
                            </Label>
                            <Select
                                value={data.cause_category_id.toString()}
                                onValueChange={(value) =>
                                    setData('cause_category_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cause..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cause_categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.cause_category_id && (
                                <p className="text-sm text-destructive">
                                    {errors.cause_category_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="work_done">Work Done</Label>
                            <Textarea
                                id="work_done"
                                placeholder="Describe what was done to fix the issue..."
                                value={data.work_done}
                                onChange={(e) =>
                                    setData('work_done', e.target.value)
                                }
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parts_used">Parts Used</Label>
                            <Input
                                id="parts_used"
                                placeholder="List any parts replaced..."
                                value={data.parts_used}
                                onChange={(e) =>
                                    setData('parts_used', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional observations or notes..."
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCompleteModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleComplete} disabled={processing}>
                            {processing
                                ? 'Completing...'
                                : 'Complete Work Order'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
