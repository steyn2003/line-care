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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Check,
    DollarSign,
    ExternalLink,
    MapPin,
    Package,
    Play,
    Plus,
    Trash2,
    User,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

interface Stock {
    location_id: number;
    quantity_on_hand: number;
    quantity_reserved: number;
    location?: {
        id: number;
        name: string;
    };
}

interface PartCategory {
    id: number;
    name: string;
}

interface SparePart {
    id: number;
    part_number: string;
    name: string;
    unit_cost: number;
    category?: PartCategory;
    stocks: Stock[];
    total_quantity_available: number;
    pivot?: {
        quantity_used: number;
        unit_cost: number;
        location_id: number;
    };
}

interface Location {
    id: number;
    name: string;
}

interface WorkOrderCost {
    id: number;
    work_order_id: number;
    labor_cost: number;
    parts_cost: number;
    external_service_cost: number;
    downtime_cost: number;
    total_cost: number;
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
    spare_parts: SparePart[];
    cost: WorkOrderCost | null;
}

interface Props {
    work_order: WorkOrder;
    cause_categories: CauseCategory[];
    spare_parts: SparePart[];
    locations: Location[];
    user: {
        id: number;
        role: 'operator' | 'technician' | 'manager' | 'super_admin';
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
    spare_parts,
    user,
}: Props) {
    const { t } = useTranslation('workorders');
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedParts, setSelectedParts] = useState<
        Array<{
            spare_part_id: number;
            quantity: number;
            location_id: number;
        }>
    >([]);

    const { data, setData, post, processing, errors } = useForm({
        completed_at: new Date().toISOString().slice(0, 16),
        time_started: work_order.started_at
            ? new Date(work_order.started_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        time_completed: new Date().toISOString().slice(0, 16),
        break_time: '0',
        cause_category_id: work_order.cause_category?.id || '',
        notes: '',
        work_done: '',
        parts_used: '',
        spare_parts: [] as Array<{
            spare_part_id: number;
            quantity: number;
            location_id: number;
        }>,
    });

    const canEdit = user.role !== 'operator';
    const canStart = canEdit && work_order.status === 'open';
    const canComplete = canEdit && work_order.status === 'in_progress';

    const handleStartWork = () => {
        router.post(`/work-orders/${work_order.id}/status`, {
            status: 'in_progress',
        });
    };

    const handleAddPart = () => {
        const newPart = {
            spare_part_id: 0,
            quantity: 1,
            location_id: 0,
        };
        setSelectedParts([...selectedParts, newPart]);
    };

    const handleRemovePart = (index: number) => {
        setSelectedParts(selectedParts.filter((_, i) => i !== index));
    };

    const handlePartChange = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        const updated = [...selectedParts];
        updated[index] = { ...updated[index], [field]: value };
        setSelectedParts(updated);
    };

    const getAvailableQuantity = (sparePartId: number, locationId: number) => {
        const part = spare_parts.find((p) => p.id === sparePartId);
        if (!part) return 0;

        const stock = part.stocks.find((s) => s.location_id === locationId);
        if (!stock) return 0;

        return Math.max(0, stock.quantity_on_hand - stock.quantity_reserved);
    };

    const handleComplete = () => {
        // Filter out empty parts and update form data
        const validParts = selectedParts.filter(
            (part) =>
                part.spare_part_id > 0 &&
                part.quantity > 0 &&
                part.location_id > 0,
        );

        setData('spare_parts', validParts);

        // Submit with updated spare_parts
        post(`/work-orders/${work_order.id}/complete`, {
            data: {
                ...data,
                spare_parts: validParts,
            },
            onSuccess: () => {
                setShowCompleteModal(false);
                setSelectedParts([]);
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
                            {t('detail.back_to_work_orders')}
                        </Button>
                        <div className="flex items-center gap-2">
                            <Badge className={typeColors[work_order.type]}>
                                {work_order.type === 'breakdown' ? (
                                    <>
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        {t('type.breakdown')}
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {t('type.preventive')}
                                    </>
                                )}
                            </Badge>
                            <Badge className={statusColors[work_order.status]}>
                                {t(`status.${work_order.status}`)}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {work_order.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('detail.wo_number', { id: work_order.id })}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {canStart && (
                            <Button onClick={handleStartWork}>
                                <Play className="mr-2 h-4 w-4" />
                                {t('actions.start_work')}
                            </Button>
                        )}
                        {canComplete && (
                            <Button onClick={() => setShowCompleteModal(true)}>
                                <Check className="mr-2 h-4 w-4" />
                                {t('actions.complete')}
                            </Button>
                        )}
                        {!work_order.assignee && canEdit && (
                            <Button
                                variant="outline"
                                onClick={handleAssignToMe}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t('actions.assign')}
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
                                <CardTitle>{t('detail.details')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {t('detail.machine')}
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
                                            {t('detail.description')}
                                        </span>
                                        <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                            {work_order.description}
                                        </p>
                                    </div>
                                )}

                                {work_order.cause_category && (
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {t('detail.cause_category')}
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
                                <CardTitle>{t('detail.timeline')}</CardTitle>
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
                                                {t('detail.created')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t('detail.by')}{' '}
                                                {work_order.creator.name}
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
                                                    {t('detail.started')}
                                                </p>
                                                {work_order.assignee && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('detail.by')}{' '}
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
                                                    {t('detail.completed')}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        work_order.completed_at,
                                                    )}
                                                </p>
                                                {calculateDowntime() && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('detail.downtime')}:{' '}
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
                                    <CardTitle>
                                        {t('detail.maintenance_logs')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'detail.maintenance_logs_description',
                                        )}
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
                                                                {t(
                                                                    'detail.work_done',
                                                                )}
                                                                :
                                                            </p>
                                                            <p className="text-sm whitespace-pre-wrap text-foreground">
                                                                {log.work_done}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {log.parts_used && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                {t(
                                                                    'detail.parts_used',
                                                                )}
                                                                :
                                                            </p>
                                                            <p className="text-sm text-foreground">
                                                                {log.parts_used}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {log.notes && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground">
                                                                {t(
                                                                    'detail.notes',
                                                                )}
                                                                :
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

                        {/* Spare Parts Used */}
                        {work_order.spare_parts &&
                            work_order.spare_parts.length > 0 && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <CardTitle>
                                            {t('detail.spare_parts_used')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t(
                                                'detail.spare_parts_description',
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        {t(
                                                            'detail.part_number',
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t('detail.name')}
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        {t('detail.quantity')}
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        {t('detail.unit_cost')}
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        {t('detail.total')}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {work_order.spare_parts.map(
                                                    (part) => (
                                                        <TableRow key={part.id}>
                                                            <TableCell className="font-mono">
                                                                {
                                                                    part.part_number
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {part.name}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {part.pivot
                                                                    ?.quantity_used ||
                                                                    0}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                $
                                                                {(
                                                                    part.pivot
                                                                        ?.unit_cost ||
                                                                    0
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                $
                                                                {(
                                                                    (part.pivot
                                                                        ?.quantity_used ||
                                                                        0) *
                                                                    (part.pivot
                                                                        ?.unit_cost ||
                                                                        0)
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Assignment */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>{t('detail.assignment')}</CardTitle>
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
                                        {t('detail.unassigned')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Cost Breakdown */}
                        {work_order.cost &&
                            work_order.status === 'completed' && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                            {t('detail.cost_breakdown')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('detail.cost_description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {t('detail.labor_cost')}
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {Number(
                                                        work_order.cost
                                                            .labor_cost,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {t('detail.parts_cost')}
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {Number(
                                                        work_order.cost
                                                            .parts_cost,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {t('detail.downtime_cost')}
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {Number(
                                                        work_order.cost
                                                            .downtime_cost,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                            {Number(
                                                work_order.cost
                                                    .external_service_cost,
                                            ) > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {t(
                                                            'detail.external_services',
                                                        )}
                                                    </span>
                                                    <span className="font-medium">
                                                        $
                                                        {Number(
                                                            work_order.cost
                                                                .external_service_cost,
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-foreground">
                                                    {t('detail.total_cost')}
                                                </span>
                                                <span className="text-lg font-bold text-primary">
                                                    $
                                                    {Number(
                                                        work_order.cost
                                                            .total_cost,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/costs/report"
                                            className="block text-center text-sm text-primary hover:underline"
                                        >
                                            {t('detail.view_cost_report')}
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Created By */}
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>{t('detail.reported_by')}</CardTitle>
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
                        <DialogTitle>{t('complete_form.title')}</DialogTitle>
                        <DialogDescription>
                            {t('complete_form.description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="completed_at">
                                {t('complete_form.completion_time')}
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

                        {/* Time Tracking Section */}
                        <div className="space-y-3 rounded-md border bg-muted/30 p-3">
                            <p className="text-sm font-medium">
                                {t('complete_form.time_tracking')}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="time_started">
                                        {t('complete_form.time_started')}
                                    </Label>
                                    <Input
                                        id="time_started"
                                        type="datetime-local"
                                        value={data.time_started}
                                        onChange={(e) =>
                                            setData(
                                                'time_started',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time_completed">
                                        {t('complete_form.time_completed')}
                                    </Label>
                                    <Input
                                        id="time_completed"
                                        type="datetime-local"
                                        value={data.time_completed}
                                        onChange={(e) =>
                                            setData(
                                                'time_completed',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="break_time">
                                    {t('complete_form.break_time')}
                                </Label>
                                <Input
                                    id="break_time"
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    value={data.break_time}
                                    onChange={(e) =>
                                        setData('break_time', e.target.value)
                                    }
                                    placeholder={t(
                                        'complete_form.break_time_placeholder',
                                    )}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('complete_form.labor_cost_note')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cause_category_id">
                                {t('complete_form.cause_category')}
                            </Label>
                            <Select
                                value={data.cause_category_id.toString()}
                                onValueChange={(value) =>
                                    setData('cause_category_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'complete_form.select_cause',
                                        )}
                                    />
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
                            <Label htmlFor="work_done">
                                {t('complete_form.work_done')}
                            </Label>
                            <Textarea
                                id="work_done"
                                placeholder={t(
                                    'complete_form.work_done_placeholder',
                                )}
                                value={data.work_done}
                                onChange={(e) =>
                                    setData('work_done', e.target.value)
                                }
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parts_used">
                                {t('complete_form.parts_used_legacy')}
                            </Label>
                            <Input
                                id="parts_used"
                                placeholder={t(
                                    'complete_form.parts_used_placeholder',
                                )}
                                value={data.parts_used}
                                onChange={(e) =>
                                    setData('parts_used', e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('complete_form.parts_used_note')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">
                                {t('complete_form.additional_notes')}
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder={t(
                                    'complete_form.additional_notes_placeholder',
                                )}
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={2}
                            />
                        </div>

                        {/* Spare Parts Selection */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>
                                    {t('complete_form.spare_parts_used')}
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddPart}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('complete_form.add_part')}
                                </Button>
                            </div>

                            {selectedParts.length > 0 && (
                                <div className="space-y-3 rounded-md border p-3">
                                    {selectedParts.map((part, index) => {
                                        const selectedPart = spare_parts.find(
                                            (p) => p.id === part.spare_part_id,
                                        );
                                        const availableQty =
                                            getAvailableQuantity(
                                                part.spare_part_id,
                                                part.location_id,
                                            );

                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-12 items-start gap-2"
                                            >
                                                <div className="col-span-5">
                                                    <Select
                                                        value={part.spare_part_id.toString()}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handlePartChange(
                                                                index,
                                                                'spare_part_id',
                                                                parseInt(value),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'complete_form.select_part',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {spare_parts.map(
                                                                (sp) => (
                                                                    <SelectItem
                                                                        key={
                                                                            sp.id
                                                                        }
                                                                        value={sp.id.toString()}
                                                                    >
                                                                        {
                                                                            sp.part_number
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            sp.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-3">
                                                    <Select
                                                        value={part.location_id.toString()}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handlePartChange(
                                                                index,
                                                                'location_id',
                                                                parseInt(value),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'complete_form.select_location',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedPart?.stocks.map(
                                                                (stock) => (
                                                                    <SelectItem
                                                                        key={
                                                                            stock.location_id
                                                                        }
                                                                        value={stock.location_id.toString()}
                                                                    >
                                                                        {
                                                                            stock
                                                                                .location
                                                                                ?.name
                                                                        }{' '}
                                                                        (
                                                                        {Math.max(
                                                                            0,
                                                                            stock.quantity_on_hand -
                                                                                stock.quantity_reserved,
                                                                        )}{' '}
                                                                        avail)
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-3">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={availableQty}
                                                        value={part.quantity}
                                                        onChange={(e) =>
                                                            handlePartChange(
                                                                index,
                                                                'quantity',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 1,
                                                            )
                                                        }
                                                        placeholder="Qty"
                                                    />
                                                    {part.location_id > 0 && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {t(
                                                                'complete_form.max',
                                                            )}
                                                            : {availableQty}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemovePart(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {selectedParts.length === 0 && (
                                <p className="rounded-md border py-4 text-center text-sm text-muted-foreground">
                                    <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                    {t('complete_form.no_parts_added')}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCompleteModal(false);
                                setSelectedParts([]);
                            }}
                            disabled={processing}
                        >
                            {t('actions.cancel')}
                        </Button>
                        <Button onClick={handleComplete} disabled={processing}>
                            {processing
                                ? t('complete_form.completing')
                                : t('complete_form.complete_work_order')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
