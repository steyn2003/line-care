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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Cpu,
    Edit,
    MapPin,
    Play,
    CheckCircle,
    XCircle,
    Trash2,
    User,
    Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';
import axios from 'axios';
import { useState } from 'react';

interface Machine {
    id: number;
    name: string;
    code: string;
    location?: { id: number; name: string };
}

interface Location {
    id: number;
    name: string;
}

interface Shutdown {
    id: number;
    name: string;
    description: string | null;
    machine: Machine | null;
    location: Location;
    start_at: string;
    end_at: string;
    shutdown_type: string;
    status: string;
    creator: { id: number; name: string };
    created_at: string;
}

interface WorkOrder {
    id: number;
    title: string;
    type: string;
    status: string;
    machine: { id: number; name: string };
    assignee: { id: number; name: string } | null;
    planning_priority: number;
    planning_slots?: Array<{
        id: number;
        start_at: string;
        end_at: string;
        status: string;
    }>;
}

interface Props {
    shutdown: Shutdown;
    eligible_work_orders: WorkOrder[];
    scheduled_work_orders: WorkOrder[];
    shutdown_types: Array<{ value: string; label: string }>;
    shutdown_statuses: Array<{ value: string; label: string }>;
    user: {
        id: number;
        role: string;
    };
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const typeColors: Record<string, string> = {
    planned_maintenance: 'bg-purple-100 text-purple-800 border-purple-200',
    changeover: 'bg-orange-100 text-orange-800 border-orange-200',
    holiday: 'bg-teal-100 text-teal-800 border-teal-200',
};

const workOrderStatusColors: Record<string, string> = {
    open: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const priorityLabels: Record<number, string> = {
    1: 'Critical',
    2: 'High',
    3: 'Medium',
    4: 'Low',
    5: 'Very Low',
};

export default function ShutdownShow({
    shutdown,
    eligible_work_orders,
    scheduled_work_orders,
    shutdown_types,
    shutdown_statuses,
    user,
}: Props) {
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);
    const canEdit = user.role !== 'operator';

    const formatDuration = (startAt: string, endAt: string) => {
        const start = parseISO(startAt);
        const end = parseISO(endAt);
        const days = differenceInDays(end, start);
        const hours = differenceInHours(end, start) % 24;

        if (days > 0) {
            return `${days} days ${hours} hours`;
        }
        return `${hours} hours`;
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsProcessing(true);
        try {
            await axios.post(`/api/planned-shutdowns/${shutdown.id}/${newStatus}`);
            router.reload();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = () => {
        router.delete(`/planning/shutdowns/${shutdown.id}`);
    };

    const handlePlanWork = async () => {
        setIsProcessing(true);
        try {
            await axios.post(`/api/planned-shutdowns/${shutdown.id}/plan-work`);
            router.reload();
        } catch (error) {
            console.error('Failed to plan work:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout>
            <Head title={shutdown.name} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/planning/shutdowns')}
                            className="mb-2 text-muted-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('planning.shutdowns.back_to_list', 'Back to Shutdowns')}
                        </Button>
                        <div className="flex items-center gap-3">
                            <Badge className={typeColors[shutdown.shutdown_type] || 'bg-gray-100'}>
                                {shutdown_types.find(t => t.value === shutdown.shutdown_type)?.label || shutdown.shutdown_type}
                            </Badge>
                            <Badge className={statusColors[shutdown.status] || 'bg-gray-100'}>
                                {shutdown_statuses.find(s => s.value === shutdown.status)?.label || shutdown.status}
                            </Badge>
                        </div>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            {shutdown.name}
                        </h1>
                        {shutdown.description && (
                            <p className="mt-1 text-muted-foreground">
                                {shutdown.description}
                            </p>
                        )}
                    </div>

                    {canEdit && (
                        <div className="flex items-center gap-2">
                            {shutdown.status === 'scheduled' && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange('start')}
                                        disabled={isProcessing}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        {t('planning.shutdowns.start', 'Start Shutdown')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handlePlanWork}
                                        disabled={isProcessing}
                                    >
                                        <Wrench className="mr-2 h-4 w-4" />
                                        {t('planning.shutdowns.plan_work', 'Auto-Plan Work')}
                                    </Button>
                                </>
                            )}
                            {shutdown.status === 'in_progress' && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange('complete')}
                                    disabled={isProcessing}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {t('planning.shutdowns.complete', 'Complete')}
                                </Button>
                            )}
                            {(shutdown.status === 'scheduled' || shutdown.status === 'in_progress') && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange('cancel')}
                                    disabled={isProcessing}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            )}
                            <Button variant="outline" asChild>
                                <Link href={`/planning/shutdowns/${shutdown.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('common.edit', 'Edit')}
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('common.delete', 'Delete')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t('planning.shutdowns.delete_title', 'Delete Shutdown?')}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t('planning.shutdowns.delete_description', 'This will permanently delete this shutdown. Any scheduled work orders will be unscheduled.')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            {t('common.delete', 'Delete')}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Scheduled Work Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    {t('planning.shutdowns.scheduled_work', 'Scheduled Work')}
                                </CardTitle>
                                <CardDescription>
                                    {t('planning.shutdowns.scheduled_work_description', 'Work orders planned during this shutdown')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scheduled_work_orders.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">
                                            {t('planning.shutdowns.no_scheduled_work', 'No work orders scheduled yet')}
                                        </p>
                                        {canEdit && shutdown.status === 'scheduled' && (
                                            <Button
                                                className="mt-4"
                                                onClick={handlePlanWork}
                                                disabled={isProcessing}
                                            >
                                                <Wrench className="mr-2 h-4 w-4" />
                                                {t('planning.shutdowns.plan_work', 'Auto-Plan Work')}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('planning.work_order', 'Work Order')}</TableHead>
                                                <TableHead>{t('planning.machine', 'Machine')}</TableHead>
                                                <TableHead>{t('planning.technician', 'Technician')}</TableHead>
                                                <TableHead>{t('planning.schedule', 'Schedule')}</TableHead>
                                                <TableHead>{t('planning.status', 'Status')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {scheduled_work_orders.map((wo) => (
                                                <TableRow key={wo.id}>
                                                    <TableCell>
                                                        <Link
                                                            href={`/work-orders/${wo.id}`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {wo.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{wo.machine.name}</TableCell>
                                                    <TableCell>
                                                        {wo.assignee?.name || (
                                                            <span className="text-muted-foreground">
                                                                {t('common.unassigned', 'Unassigned')}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {wo.planning_slots?.[0] && (
                                                            <span className="text-sm">
                                                                {format(parseISO(wo.planning_slots[0].start_at), 'MMM d HH:mm')}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={workOrderStatusColors[wo.status]}>
                                                            {wo.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        {/* Eligible Work Orders */}
                        {eligible_work_orders.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t('planning.shutdowns.eligible_work', 'Eligible Work Orders')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('planning.shutdowns.eligible_work_description', 'Work orders that could be scheduled during this shutdown')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('planning.work_order', 'Work Order')}</TableHead>
                                                <TableHead>{t('planning.type', 'Type')}</TableHead>
                                                <TableHead>{t('planning.machine', 'Machine')}</TableHead>
                                                <TableHead>{t('planning.priority', 'Priority')}</TableHead>
                                                <TableHead>{t('planning.status', 'Status')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {eligible_work_orders.map((wo) => (
                                                <TableRow key={wo.id}>
                                                    <TableCell>
                                                        <Link
                                                            href={`/work-orders/${wo.id}`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {wo.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="capitalize">{wo.type}</TableCell>
                                                    <TableCell>{wo.machine.name}</TableCell>
                                                    <TableCell>
                                                        {priorityLabels[wo.planning_priority] || wo.planning_priority}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={workOrderStatusColors[wo.status]}>
                                                            {wo.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('common.details', 'Details')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('planning.location', 'Location')}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{shutdown.location.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('planning.machine', 'Machine')}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {shutdown.machine?.name || t('planning.shutdowns.all_machines', 'All machines')}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('planning.schedule', 'Schedule')}
                                    </p>
                                    <div className="mt-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {format(parseISO(shutdown.start_at), 'MMM d, yyyy HH:mm')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {format(parseISO(shutdown.end_at), 'MMM d, yyyy HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('planning.duration', 'Duration')}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {formatDuration(shutdown.start_at, shutdown.end_at)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Creator Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('planning.shutdowns.created_by', 'Created By')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{shutdown.creator.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(parseISO(shutdown.created_at), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('planning.shutdowns.statistics', 'Statistics')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('planning.shutdowns.scheduled_count', 'Scheduled Work Orders')}
                                    </span>
                                    <span className="font-bold">{scheduled_work_orders.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('planning.shutdowns.eligible_count', 'Eligible Work Orders')}
                                    </span>
                                    <span className="font-bold">{eligible_work_orders.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
