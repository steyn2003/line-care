import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    addDays,
    endOfWeek,
    format,
    isSameDay,
    parseISO,
    startOfWeek,
} from 'date-fns';
import {
    BarChart3,
    Calendar,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Cpu,
    Edit,
    ExternalLink,
    GripVertical,
    MapPin,
    MoreHorizontal,
    Play,
    Settings,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Machine {
    id: number;
    name: string;
    code: string;
}

interface Location {
    id: number;
    name: string;
}

interface Technician {
    id: number;
    name: string;
    planned_hours: number;
    available_hours: number;
    utilization_pct: number;
    status: 'optimal' | 'high' | 'low' | 'overbooked';
}

interface WorkOrder {
    id: number;
    title: string;
    type: string;
    status: string;
    machine_id: number;
    planning_priority: number;
}

interface PlanningSlot {
    id: number;
    work_order_id: number;
    technician_id: number;
    machine_id: number;
    location_id: number;
    start_at: string;
    end_at: string;
    duration_minutes: number;
    status: string;
    source: string;
    color: string | null;
    notes: string | null;
    work_order: WorkOrder;
    technician: { id: number; name: string };
    machine: Machine;
    location: Location;
}

interface UnplannedWorkOrder {
    id: number;
    title: string;
    type: string;
    status: string;
    planning_priority: number;
    machine: Machine;
    assignee: { id: number; name: string } | null;
}

interface Shutdown {
    id: number;
    name: string;
    start_at: string;
    end_at: string;
    status: string;
    machine: Machine | null;
    location: Location;
}

interface Props {
    slots: PlanningSlot[];
    technicians: Technician[];
    unplanned_work_orders: UnplannedWorkOrder[];
    shutdowns: Shutdown[];
    machines: Machine[];
    locations: Location[];
    filters: {
        date_from: string;
        date_to: string;
        technician_id?: number;
        machine_id?: number;
        location_id?: number;
    };
    user: {
        id: number;
        role: string;
    };
}

const statusColors: Record<string, string> = {
    tentative: 'bg-gray-200 border-gray-400 text-gray-700',
    planned: 'bg-blue-200 border-blue-400 text-blue-700',
    in_progress: 'bg-yellow-200 border-yellow-400 text-yellow-700',
    completed: 'bg-green-200 border-green-400 text-green-700',
    cancelled: 'bg-red-200 border-red-400 text-red-700',
};

const utilizationColors: Record<string, string> = {
    optimal: 'text-green-600',
    high: 'text-yellow-600',
    low: 'text-blue-600',
    overbooked: 'text-red-600',
};

const priorityColors: Record<number, string> = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-gray-500',
};

export default function PlanningIndex({
    slots,
    technicians,
    unplanned_work_orders,
    shutdowns,
    machines,
    filters,
    user,
}: Props) {
    const { t } = useTranslation();
    const [selectedSlot, setSelectedSlot] = useState<PlanningSlot | null>(null);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedWorkOrder, setSelectedWorkOrder] =
        useState<UnplannedWorkOrder | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [dropTarget, setDropTarget] = useState<{
        technicianId: number;
        day: Date;
    } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Edit slot form state
    const [editData, setEditData] = useState({
        start_at: '',
        end_at: '',
        notes: '',
        status: '',
    });

    // Create slot form state
    const [createData, setCreateData] = useState({
        work_order_id: 0,
        technician_id: 0,
        start_at: '',
        end_at: '',
        notes: '',
    });

    // Date navigation
    const currentWeekStart = parseISO(filters.date_from);
    const currentWeekEnd = parseISO(filters.date_to);

    const weekDays = useMemo(() => {
        const days = [];
        let current = currentWeekStart;
        while (current <= currentWeekEnd) {
            days.push(current);
            current = addDays(current, 1);
        }
        return days;
    }, [currentWeekStart, currentWeekEnd]);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const offset = direction === 'prev' ? -7 : 7;
        const newStart = addDays(currentWeekStart, offset);
        const newEnd = addDays(currentWeekEnd, offset);
        router.get(
            '/planning',
            {
                date_from: format(newStart, 'yyyy-MM-dd'),
                date_to: format(newEnd, 'yyyy-MM-dd'),
            },
            { preserveState: true },
        );
    };

    const goToToday = () => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        router.get(
            '/planning',
            {
                date_from: format(weekStart, 'yyyy-MM-dd'),
                date_to: format(weekEnd, 'yyyy-MM-dd'),
            },
            { preserveState: true },
        );
    };

    // Get slots for a specific technician and day
    const getSlotsForTechnicianDay = (technicianId: number, day: Date) => {
        return slots.filter((slot) => {
            const slotStart = parseISO(slot.start_at);
            return (
                slot.technician_id === technicianId && isSameDay(slotStart, day)
            );
        });
    };

    // Handle slot click
    const handleSlotClick = (slot: PlanningSlot) => {
        setSelectedSlot(slot);
        setIsEditMode(false);
        setEditData({
            start_at: slot.start_at.slice(0, 16),
            end_at: slot.end_at.slice(0, 16),
            notes: slot.notes || '',
            status: slot.status,
        });
        setIsSlotModalOpen(true);
    };

    // Handle slot edit
    const handleEditSlot = () => {
        if (!selectedSlot) return;
        setIsProcessing(true);
        router.put(`/planning/slots/${selectedSlot.id}`, editData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSlotModalOpen(false);
                setIsEditMode(false);
            },
            onError: (errors) => {
                console.error('Failed to update slot:', errors);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    // Handle slot status change
    const handleStatusChange = (newStatus: string) => {
        if (!selectedSlot) return;
        setIsProcessing(true);
        router.put(
            `/planning/slots/${selectedSlot.id}`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSlotModalOpen(false);
                },
                onError: (errors) => {
                    console.error('Failed to update status:', errors);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handle slot deletion
    const handleDeleteSlot = () => {
        if (!selectedSlot) return;
        setIsProcessing(true);
        router.delete(`/planning/slots/${selectedSlot.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSlotModalOpen(false);
                setIsDeleteDialogOpen(false);
            },
            onError: (errors) => {
                console.error('Failed to delete slot:', errors);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    // Handle creating new slot from drag-drop
    const handleCreateSlot = () => {
        if (!selectedWorkOrder || !dropTarget) return;
        setIsProcessing(true);

        // Use the times from createData which user can modify
        const startAt =
            createData.start_at || format(dropTarget.day, "yyyy-MM-dd'T'08:00");
        const endAt =
            createData.end_at || format(dropTarget.day, "yyyy-MM-dd'T'10:00");

        router.post(
            '/planning/slots',
            {
                work_order_id: selectedWorkOrder.id,
                technician_id: dropTarget.technicianId,
                machine_id: selectedWorkOrder.machine.id,
                start_at: startAt,
                end_at: endAt,
                status: 'tentative',
                source: 'manual',
                notes: createData.notes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsScheduleModalOpen(false);
                    setDropTarget(null);
                    setSelectedWorkOrder(null);
                    setCreateData({
                        work_order_id: 0,
                        technician_id: 0,
                        start_at: '',
                        end_at: '',
                        notes: '',
                    });
                },
                onError: (errors) => {
                    console.error('Failed to create slot:', errors);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handle work order drag start
    const handleDragStart = (
        e: React.DragEvent,
        workOrder: UnplannedWorkOrder,
    ) => {
        e.dataTransfer.setData('work_order_id', workOrder.id.toString());
    };

    // Handle drop on schedule cell
    const handleDrop = (
        e: React.DragEvent,
        technicianId: number,
        day: Date,
    ) => {
        e.preventDefault();
        const workOrderId = e.dataTransfer.getData('work_order_id');
        if (workOrderId) {
            const workOrder = unplanned_work_orders.find(
                (wo) => wo.id === parseInt(workOrderId),
            );
            if (workOrder) {
                setSelectedWorkOrder(workOrder);
                setDropTarget({ technicianId, day });
                setCreateData({
                    work_order_id: workOrder.id,
                    technician_id: technicianId,
                    start_at: format(day, "yyyy-MM-dd'T'08:00"),
                    end_at: format(day, "yyyy-MM-dd'T'10:00"),
                    notes: '',
                });
                setIsScheduleModalOpen(true);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <AppLayout>
            <Head title={t('planning.title', 'Planning Board')} />

            <div className="flex h-[calc(100vh-4rem)] flex-col">
                {/* Header */}
                <div className="border-b bg-background p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('planning.title', 'Planning Board')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t(
                                    'planning.subtitle',
                                    'Schedule and manage maintenance work',
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a href="/planning/shutdowns">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {t('planning.shutdowns', 'Shutdowns')}
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href="/planning/capacity">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    {t('planning.capacity', 'Capacity')}
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href="/planning/analytics">
                                    <Settings className="mr-2 h-4 w-4" />
                                    {t('planning.analytics', 'Analytics')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Date Navigation */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek('prev')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToToday}
                            >
                                {t('planning.today', 'Today')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek('next')}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <span className="ml-2 font-medium">
                                {format(currentWeekStart, 'MMM d')} -{' '}
                                {format(currentWeekEnd, 'MMM d, yyyy')}
                            </span>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <Select
                                value={filters.machine_id?.toString() || 'all'}
                                onValueChange={(value) => {
                                    router.get(
                                        '/planning',
                                        {
                                            ...filters,
                                            machine_id:
                                                value !== 'all'
                                                    ? value
                                                    : undefined,
                                        },
                                        { preserveState: true },
                                    );
                                }}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue
                                        placeholder={t(
                                            'planning.all_machines',
                                            'All Machines',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t(
                                            'planning.all_machines',
                                            'All Machines',
                                        )}
                                    </SelectItem>
                                    {machines.map((machine) => (
                                        <SelectItem
                                            key={machine.id}
                                            value={machine.id.toString()}
                                        >
                                            {machine.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Unplanned Work Orders Sidebar */}
                    <div className="w-64 flex-shrink-0 overflow-y-auto border-r bg-muted/30 p-4">
                        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            {t('planning.unplanned', 'Unplanned Work Orders')}
                        </h3>
                        <div className="space-y-2">
                            {unplanned_work_orders.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    {t(
                                        'planning.no_unplanned',
                                        'No unplanned work orders',
                                    )}
                                </p>
                            ) : (
                                unplanned_work_orders.map((wo) => (
                                    <Card
                                        key={wo.id}
                                        className="cursor-grab active:cursor-grabbing"
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(e, wo)
                                        }
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-start gap-2">
                                                <div
                                                    className={`h-full w-1 rounded ${priorityColors[wo.planning_priority] || priorityColors[3]}`}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {wo.title}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Cpu className="h-3 w-3" />
                                                        <span className="truncate">
                                                            {wo.machine.name}
                                                        </span>
                                                    </div>
                                                    {wo.assignee && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <User className="h-3 w-3" />
                                                            <span>
                                                                {
                                                                    wo.assignee
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <GripVertical className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Shutdowns Section */}
                        {shutdowns.length > 0 && (
                            <>
                                <h3 className="mt-6 mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    {t(
                                        'planning.upcoming_shutdowns',
                                        'Upcoming Shutdowns',
                                    )}
                                </h3>
                                <div className="space-y-2">
                                    {shutdowns.map((shutdown) => (
                                        <Card
                                            key={shutdown.id}
                                            className="border-orange-200 bg-orange-50"
                                        >
                                            <CardContent className="p-3">
                                                <p className="text-sm font-medium">
                                                    {shutdown.name}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {format(
                                                            parseISO(
                                                                shutdown.start_at,
                                                            ),
                                                            'MMM d',
                                                        )}{' '}
                                                        -{' '}
                                                        {format(
                                                            parseISO(
                                                                shutdown.end_at,
                                                            ),
                                                            'MMM d',
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full min-w-[900px] table-fixed border-collapse">
                            {/* Header Row - Days */}
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-muted/50">
                                    <th className="w-[180px] border-r border-b p-3 text-left text-sm font-medium">
                                        {t('planning.technician', 'Technician')}
                                    </th>
                                    {weekDays.map((day) => (
                                        <th
                                            key={day.toISOString()}
                                            className={`border-r border-b p-3 text-center ${
                                                isSameDay(day, new Date())
                                                    ? 'bg-primary/10'
                                                    : ''
                                            }`}
                                        >
                                            <div className="text-sm font-medium">
                                                {format(day, 'EEE')}
                                            </div>
                                            <div className="text-xs font-normal text-muted-foreground">
                                                {format(day, 'MMM d')}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Technician Rows */}
                            <tbody>
                                {technicians.map((technician) => (
                                    <tr key={technician.id}>
                                        {/* Technician Info */}
                                        <td className="border-r border-b bg-muted/20 p-3 align-top">
                                            <div className="text-sm font-medium">
                                                {technician.name}
                                            </div>
                                            <div className="mt-1">
                                                <Progress
                                                    value={Math.min(
                                                        technician.utilization_pct,
                                                        100,
                                                    )}
                                                    className="h-2"
                                                />
                                            </div>
                                            <div
                                                className={`mt-1 text-xs ${utilizationColors[technician.status]}`}
                                            >
                                                {technician.planned_hours.toFixed(
                                                    1,
                                                )}
                                                h /{' '}
                                                {technician.available_hours.toFixed(
                                                    1,
                                                )}
                                                h (
                                                {technician.utilization_pct.toFixed(
                                                    0,
                                                )}
                                                %)
                                            </div>
                                        </td>

                                        {/* Day Cells */}
                                        {weekDays.map((day) => {
                                            const daySlots =
                                                getSlotsForTechnicianDay(
                                                    technician.id,
                                                    day,
                                                );
                                            return (
                                                <td
                                                    key={day.toISOString()}
                                                    className={`h-[90px] border-r border-b p-1.5 align-top ${
                                                        isSameDay(
                                                            day,
                                                            new Date(),
                                                        )
                                                            ? 'bg-primary/5'
                                                            : ''
                                                    }`}
                                                    onDrop={(e) =>
                                                        handleDrop(
                                                            e,
                                                            technician.id,
                                                            day,
                                                        )
                                                    }
                                                    onDragOver={handleDragOver}
                                                >
                                                    <div className="flex h-full flex-col gap-1 overflow-hidden">
                                                        {daySlots.map(
                                                            (slot) => (
                                                                <div
                                                                    key={
                                                                        slot.id
                                                                    }
                                                                    className={`cursor-pointer rounded border p-1.5 text-xs transition-shadow hover:shadow-md ${statusColors[slot.status] || statusColors.planned}`}
                                                                    onClick={() =>
                                                                        handleSlotClick(
                                                                            slot,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="truncate leading-tight font-medium">
                                                                        {slot
                                                                            .work_order
                                                                            ?.title ||
                                                                            'Untitled'}
                                                                    </div>
                                                                    <div className="mt-0.5 flex items-center gap-1 text-[10px] opacity-75">
                                                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                                                        <span>
                                                                            {format(
                                                                                parseISO(
                                                                                    slot.start_at,
                                                                                ),
                                                                                'HH:mm',
                                                                            )}
                                                                            -
                                                                            {format(
                                                                                parseISO(
                                                                                    slot.end_at,
                                                                                ),
                                                                                'HH:mm',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slot Detail Modal */}
            <Dialog
                open={isSlotModalOpen}
                onOpenChange={(open) => {
                    setIsSlotModalOpen(open);
                    if (!open) setIsEditMode(false);
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>
                                {isEditMode
                                    ? t('planning.edit_slot', 'Edit Slot')
                                    : t(
                                          'planning.slot_details',
                                          'Slot Details',
                                      )}
                            </DialogTitle>
                            {selectedSlot &&
                                !isEditMode &&
                                user.role !== 'operator' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setIsEditMode(true)
                                                }
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                {t('common.edit', 'Edit')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {selectedSlot.status ===
                                                'tentative' && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            'planned',
                                                        )
                                                    }
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'planning.confirm_slot',
                                                        'Confirm Slot',
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                            {selectedSlot.status ===
                                                'planned' && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            'in_progress',
                                                        )
                                                    }
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'planning.start_work',
                                                        'Start Work',
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                            {selectedSlot.status ===
                                                'in_progress' && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            'completed',
                                                        )
                                                    }
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'planning.complete',
                                                        'Complete',
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                            {selectedSlot.status !==
                                                'completed' &&
                                                selectedSlot.status !==
                                                    'cancelled' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    'cancelled',
                                                                )
                                                            }
                                                        >
                                                            <X className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'planning.cancel_slot',
                                                                'Cancel Slot',
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() =>
                                                    setIsDeleteDialogOpen(true)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t('common.delete', 'Delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                        </div>
                        <DialogDescription>
                            {selectedSlot?.work_order?.title || 'Untitled'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSlot && !isEditMode && (
                        <div className="space-y-4">
                            {/* Work Order Link */}
                            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.work_order', 'Work Order')}
                                    </Label>
                                    <p className="font-medium">
                                        {selectedSlot.work_order?.title ||
                                            'Untitled'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        #{selectedSlot.work_order_id} -{' '}
                                        {selectedSlot.work_order?.type}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={`/work-orders/${selectedSlot.work_order_id}`}
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        {t('common.view', 'View')}
                                    </a>
                                </Button>
                            </div>

                            {/* Machine & Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.machine', 'Machine')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {selectedSlot.machine?.name}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.location', 'Location')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {selectedSlot.location?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Technician */}
                            <div>
                                <Label className="text-xs text-muted-foreground">
                                    {t('planning.technician', 'Technician')}
                                </Label>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">
                                        {selectedSlot.technician?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Time & Duration */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.start', 'Start')}
                                    </Label>
                                    <p className="font-medium">
                                        {format(
                                            parseISO(selectedSlot.start_at),
                                            'MMM d, HH:mm',
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.end', 'End')}
                                    </Label>
                                    <p className="font-medium">
                                        {format(
                                            parseISO(selectedSlot.end_at),
                                            'MMM d, HH:mm',
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.duration', 'Duration')}
                                    </Label>
                                    <p className="font-medium">
                                        {Math.floor(
                                            selectedSlot.duration_minutes / 60,
                                        )}
                                        h {selectedSlot.duration_minutes % 60}m
                                    </p>
                                </div>
                            </div>

                            {/* Status & Source */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.status', 'Status')}
                                    </Label>
                                    <Badge
                                        className={
                                            statusColors[selectedSlot.status]
                                        }
                                    >
                                        {selectedSlot.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.source', 'Source')}
                                    </Label>
                                    <p className="text-sm capitalize">
                                        {selectedSlot.source}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedSlot.notes && (
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t('planning.notes', 'Notes')}
                                    </Label>
                                    <p className="rounded-md bg-muted/30 p-2 text-sm whitespace-pre-wrap">
                                        {selectedSlot.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Edit Mode */}
                    {selectedSlot && isEditMode && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_start_at">
                                        {t('planning.start', 'Start')}
                                    </Label>
                                    <Input
                                        id="edit_start_at"
                                        type="datetime-local"
                                        value={editData.start_at}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                start_at: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_end_at">
                                        {t('planning.end', 'End')}
                                    </Label>
                                    <Input
                                        id="edit_end_at"
                                        type="datetime-local"
                                        value={editData.end_at}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                end_at: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_status">
                                    {t('planning.status', 'Status')}
                                </Label>
                                <Select
                                    value={editData.status}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tentative">
                                            {t(
                                                'planning.status_tentative',
                                                'Tentative',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="planned">
                                            {t(
                                                'planning.status_planned',
                                                'Planned',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            {t(
                                                'planning.status_in_progress',
                                                'In Progress',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            {t(
                                                'planning.status_completed',
                                                'Completed',
                                            )}
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            {t(
                                                'planning.status_cancelled',
                                                'Cancelled',
                                            )}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_notes">
                                    {t('planning.notes', 'Notes')}
                                </Label>
                                <Textarea
                                    id="edit_notes"
                                    value={editData.notes}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            notes: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    placeholder={t(
                                        'planning.notes_placeholder',
                                        'Add notes about this slot...',
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {isEditMode ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditMode(false)}
                                    disabled={isProcessing}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button
                                    onClick={handleEditSlot}
                                    disabled={isProcessing}
                                >
                                    {isProcessing
                                        ? t('common.saving', 'Saving...')
                                        : t('common.save', 'Save')}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setIsSlotModalOpen(false)}
                            >
                                {t('common.close', 'Close')}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Work Order Modal (from drag-drop) */}
            <Dialog
                open={isScheduleModalOpen}
                onOpenChange={(open) => {
                    setIsScheduleModalOpen(open);
                    if (!open) {
                        setSelectedWorkOrder(null);
                        setDropTarget(null);
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {t(
                                'planning.schedule_work_order',
                                'Schedule Work Order',
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedWorkOrder?.title}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedWorkOrder && dropTarget && (
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Cpu className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {selectedWorkOrder.machine.name}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {
                                            technicians.find(
                                                (t) =>
                                                    t.id ===
                                                    dropTarget.technicianId,
                                            )?.name
                                        }
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {format(
                                            dropTarget.day,
                                            'EEEE, MMMM d, yyyy',
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="create_start_at">
                                        {t('planning.start_time', 'Start Time')}
                                    </Label>
                                    <Input
                                        id="create_start_at"
                                        type="datetime-local"
                                        value={createData.start_at}
                                        onChange={(e) =>
                                            setCreateData({
                                                ...createData,
                                                start_at: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create_end_at">
                                        {t('planning.end_time', 'End Time')}
                                    </Label>
                                    <Input
                                        id="create_end_at"
                                        type="datetime-local"
                                        value={createData.end_at}
                                        onChange={(e) =>
                                            setCreateData({
                                                ...createData,
                                                end_at: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create_notes">
                                    {t('planning.notes', 'Notes')}
                                </Label>
                                <Textarea
                                    id="create_notes"
                                    value={createData.notes}
                                    onChange={(e) =>
                                        setCreateData({
                                            ...createData,
                                            notes: e.target.value,
                                        })
                                    }
                                    rows={2}
                                    placeholder={t(
                                        'planning.notes_placeholder',
                                        'Add notes about this slot...',
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsScheduleModalOpen(false)}
                            disabled={isProcessing}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            onClick={handleCreateSlot}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? t('common.scheduling', 'Scheduling...')
                                : t('planning.schedule', 'Schedule')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t(
                                'planning.delete_slot_title',
                                'Delete Planning Slot?',
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                'planning.delete_slot_description',
                                'This will remove the slot from the schedule. The work order will become unplanned again.',
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>
                            {t('common.cancel', 'Cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSlot}
                            disabled={isProcessing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isProcessing
                                ? t('common.deleting', 'Deleting...')
                                : t('common.delete', 'Delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
