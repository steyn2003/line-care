import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    ChevronRight,
    Clock,
    Cpu,
    Inbox,
    Plus,
    User,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Machine {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface WorkOrder {
    id: number;
    title: string;
    type: 'breakdown' | 'preventive';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    machine: Machine;
    creator: User;
    assignee: User | null;
    created_at: string;
}

interface Props {
    work_orders: {
        data: WorkOrder[];
        current_page: number;
        per_page: number;
        total: number;
    };
    machines: Machine[];
    filters: {
        status?: string;
        type?: string;
        machine_id?: number;
        date_from?: string;
        date_to?: string;
    };
    user: {
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

export default function WorkOrdersIndex({
    work_orders,
    machines,
    filters,
    user,
}: Props) {
    const { t } = useTranslation('workorders');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(
        filters.status || 'all',
    );
    const [typeFilter, setTypeFilter] = useState<string>(filters.type || 'all');
    const [machineFilter, setMachineFilter] = useState<string>(
        filters.machine_id?.toString() || 'all',
    );
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from || '');
    const [dateTo, setDateTo] = useState<string>(filters.date_to || '');

    const handleFilterChange = (params?: {
        status?: string;
        type?: string;
        machine?: string;
        date_from?: string;
        date_to?: string;
    }) => {
        router.get(
            '/work-orders',
            {
                status:
                    (params?.status ?? statusFilter) !== 'all'
                        ? (params?.status ?? statusFilter)
                        : undefined,
                type:
                    (params?.type ?? typeFilter) !== 'all'
                        ? (params?.type ?? typeFilter)
                        : undefined,
                machine_id:
                    (params?.machine ?? machineFilter) !== 'all'
                        ? (params?.machine ?? machineFilter)
                        : undefined,
                date_from: params?.date_from ?? (dateFrom || undefined),
                date_to: params?.date_to ?? (dateTo || undefined),
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const filteredWorkOrders = work_orders.data.filter((wo) => {
        const matchesSearch =
            wo.title.toLowerCase().includes(search.toLowerCase()) ||
            wo.machine.name.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const getTimeSince = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        return `${diffMins}m ago`;
    };

    return (
        <AppLayout>
            <Head title={t('title')} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('list.title')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {t('list.subtitle')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {user.role !== 'operator' && (
                            <Button variant="outline" asChild>
                                <Link href="/work-orders/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('list.new_work_order')}
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/work-orders/report-breakdown">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                {t('list.report_breakdown')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>{t('list.filters')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="search"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.search')}
                                    </Label>
                                    <Input
                                        id="search"
                                        placeholder={t(
                                            'list.search_placeholder',
                                        )}
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="status-filter"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.status')}
                                    </Label>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(value) => {
                                            setStatusFilter(value);
                                            handleFilterChange({
                                                status: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger
                                            id="status-filter"
                                            className="bg-background"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('list.all_status')}
                                            </SelectItem>
                                            <SelectItem value="open">
                                                {t('status.open')}
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                {t('status.in_progress')}
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                {t('status.completed')}
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                {t('status.cancelled')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="type-filter"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.type')}
                                    </Label>
                                    <Select
                                        value={typeFilter}
                                        onValueChange={(value) => {
                                            setTypeFilter(value);
                                            handleFilterChange({ type: value });
                                        }}
                                    >
                                        <SelectTrigger
                                            id="type-filter"
                                            className="bg-background"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('list.all_types')}
                                            </SelectItem>
                                            <SelectItem value="breakdown">
                                                {t('type.breakdown')}
                                            </SelectItem>
                                            <SelectItem value="preventive">
                                                {t('type.preventive')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="machine-filter"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.machine')}
                                    </Label>
                                    <Select
                                        value={machineFilter}
                                        onValueChange={(value) => {
                                            setMachineFilter(value);
                                            handleFilterChange({
                                                machine: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger
                                            id="machine-filter"
                                            className="bg-background"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('list.all_machines')}
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

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date-from"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.date_from')}
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="date-from"
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e.target.value);
                                                handleFilterChange({
                                                    date_from: e.target.value,
                                                });
                                            }}
                                            className="bg-background pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date-to"
                                        className="text-sm font-medium"
                                    >
                                        {t('list.date_to')}
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="date-to"
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => {
                                                setDateTo(e.target.value);
                                                handleFilterChange({
                                                    date_to: e.target.value,
                                                });
                                            }}
                                            className="bg-background pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {(statusFilter !== 'all' ||
                                typeFilter !== 'all' ||
                                machineFilter !== 'all' ||
                                dateFrom ||
                                dateTo) && (
                                <div className="flex items-center justify-between border-t pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t('list.filters_applied')}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setTypeFilter('all');
                                            setMachineFilter('all');
                                            setDateFrom('');
                                            setDateTo('');
                                            router.get(
                                                '/work-orders',
                                                {},
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                    >
                                        {t('list.clear_all_filters')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Work Order List */}
                <div className="space-y-3">
                    {filteredWorkOrders.length === 0 ? (
                        <Card className="border-border">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Inbox className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="mb-4 text-center text-muted-foreground">
                                    {t('list.empty')}
                                </p>
                                <Button asChild>
                                    <Link href="/work-orders/report-breakdown">
                                        {t('list.report_breakdown')}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredWorkOrders.map((wo) => (
                            <Card
                                key={wo.id}
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit(`/work-orders/${wo.id}`)
                                }
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={
                                                        typeColors[wo.type]
                                                    }
                                                >
                                                    {wo.type === 'breakdown' ? (
                                                        <>
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                            {t(
                                                                'type.breakdown',
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {t(
                                                                'type.preventive',
                                                            )}
                                                        </>
                                                    )}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        statusColors[wo.status]
                                                    }
                                                >
                                                    {t(`status.${wo.status}`)}
                                                </Badge>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {wo.title}
                                            </h3>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Cpu className="mr-1 h-4 w-4" />
                                                    {wo.machine.name}
                                                </div>
                                                <div className="flex items-center">
                                                    <User className="mr-1 h-4 w-4" />
                                                    {wo.creator.name}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 h-4 w-4" />
                                                    {getTimeSince(
                                                        wo.created_at,
                                                    )}
                                                </div>
                                            </div>

                                            {/* Assignee */}
                                            {wo.assignee && (
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <UserCheck className="mr-1 h-4 w-4" />
                                                    {t('list.assigned_to')}{' '}
                                                    {wo.assignee.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="ml-4 flex items-center gap-2">
                                            {wo.status === 'open' &&
                                                user.role !== 'operator' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.post(
                                                                `/work-orders/${wo.id}/start`,
                                                            );
                                                        }}
                                                    >
                                                        {t('list.start')}
                                                    </Button>
                                                )}
                                            {wo.status === 'in_progress' &&
                                                user.role !== 'operator' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.visit(
                                                                `/work-orders/${wo.id}/complete`,
                                                            );
                                                        }}
                                                    >
                                                        {t('actions.complete')}
                                                    </Button>
                                                )}
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination Info */}
                {filteredWorkOrders.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                        {t('list.showing', {
                            count: filteredWorkOrders.length,
                            total: work_orders.total,
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
