import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
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
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    Cpu,
    DollarSign,
    Gauge,
    Package,
    ShoppingCart,
    TrendingUp,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

interface Location {
    id: number;
    name: string;
}

interface TopMachine {
    machine_id: number;
    machine_name: string;
    machine_code: string | null;
    breakdown_count: number;
}

interface RecentWorkOrder {
    id: number;
    title: string;
    type: string;
    status: string;
    created_at: string;
    machine?: { id: number; name: string; code: string | null };
    assignee?: { id: number; name: string };
}

interface UpcomingTask {
    id: number;
    name: string;
    next_due_date: string;
    frequency: string;
    machine?: { id: number; name: string; code: string | null };
}

interface LowStockPart {
    id: number;
    name: string;
    part_number: string;
    quantity_on_hand: number;
    reorder_point: number;
}

interface RecentRun {
    id: number;
    start_time: string;
    end_time: string | null;
    oee_pct: number;
    availability_pct: number;
    performance_pct: number;
    quality_pct: number;
    machine?: { id: number; name: string };
    product?: { id: number; name: string };
}

interface CostMetrics {
    range_total: number;
    range_labor: number;
    range_parts: number;
    range_downtime: number;
    this_month_total: number;
    last_month_total: number;
    month_change_percent: number;
    budget_total: number;
    budget_used_percent: number;
}

interface InventoryMetrics {
    low_stock_count: number;
    low_stock_parts: LowStockPart[];
    critical_out_of_stock: number;
    total_inventory_value: number;
    total_parts_count: number;
    pending_pos_count: number;
}

interface OeeMetrics {
    avg_availability: number;
    avg_performance: number;
    avg_quality: number;
    avg_oee: number;
    run_count: number;
    today_oee: number;
    week_oee: number;
    recent_runs: RecentRun[];
}

interface DashboardMetrics {
    open_work_orders_count: number;
    in_progress_work_orders_count: number;
    overdue_preventive_tasks_count: number;
    breakdowns_in_range: number;
    breakdowns_last_7_days: number;
    breakdowns_last_30_days: number;
    completed_in_range: number;
    top_machines: TopMachine[];
    recent_work_orders: RecentWorkOrder[];
    upcoming_tasks: UpcomingTask[];
    costs: CostMetrics;
    inventory: InventoryMetrics;
    oee: OeeMetrics;
}

interface Props {
    metrics: DashboardMetrics;
    locations: Location[];
    filters: {
        location_id?: number;
        date_from: string;
        date_to: string;
    };
    user: {
        name: string;
        role: 'operator' | 'technician' | 'manager';
    };
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'open':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'in_progress':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
}

function getOeeColor(oee: number): string {
    if (oee >= 85) return 'text-green-600 dark:text-green-400';
    if (oee >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}

export default function Dashboard({
    metrics,
    locations,
    filters,
    user,
}: Props) {
    const [locationFilter, setLocationFilter] = useState<string>(
        filters.location_id?.toString() || 'all',
    );
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from);
    const [dateTo, setDateTo] = useState<string>(filters.date_to);

    const handleFilterChange = (params: {
        location?: string;
        date_from?: string;
        date_to?: string;
    }) => {
        router.get(
            '/dashboard',
            {
                location_id:
                    params.location !== undefined
                        ? params.location !== 'all'
                            ? params.location
                            : undefined
                        : locationFilter !== 'all'
                          ? locationFilter
                          : undefined,
                date_from: params.date_from ?? dateFrom,
                date_to: params.date_to ?? dateTo,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleLocationChange = (value: string) => {
        setLocationFilter(value);
        handleFilterChange({ location: value });
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDateFrom(newDate);
        handleFilterChange({ date_from: newDate });
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDateTo(newDate);
        handleFilterChange({ date_to: newDate });
    };

    const isManager = user.role === 'manager';
    const isTechnician = user.role === 'technician';

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Here's what's happening with your operations
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    {(isManager || isTechnician) && (
                        <Card className="border-border">
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap items-end gap-4">
                                    <div className="min-w-[200px] flex-1">
                                        <Label
                                            htmlFor="date-from"
                                            className="text-sm font-medium"
                                        >
                                            Date From
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="date-from"
                                                type="date"
                                                value={dateFrom}
                                                onChange={handleDateFromChange}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-[200px] flex-1">
                                        <Label
                                            htmlFor="date-to"
                                            className="text-sm font-medium"
                                        >
                                            Date To
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="date-to"
                                                type="date"
                                                value={dateTo}
                                                onChange={handleDateToChange}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {locations.length > 0 && (
                                        <div className="min-w-[200px] flex-1">
                                            <Label
                                                htmlFor="location-filter"
                                                className="text-sm font-medium"
                                            >
                                                Location
                                            </Label>
                                            <Select
                                                value={locationFilter}
                                                onValueChange={
                                                    handleLocationChange
                                                }
                                            >
                                                <SelectTrigger
                                                    id="location-filter"
                                                    className="mt-1.5 bg-background"
                                                >
                                                    <SelectValue placeholder="All locations" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All locations
                                                    </SelectItem>
                                                    {locations.map(
                                                        (location) => (
                                                            <SelectItem
                                                                key={
                                                                    location.id
                                                                }
                                                                value={location.id.toString()}
                                                            >
                                                                {location.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button
                        asChild
                        size="lg"
                        className="h-auto justify-start py-4"
                    >
                        <Link href="/work-orders/report-breakdown">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Report Breakdown
                                    </div>
                                    <div className="text-xs opacity-80">
                                        Quick report
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-auto justify-start py-4"
                    >
                        <Link href="/work-orders">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Work Orders
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {metrics.open_work_orders_count} open
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-auto justify-start py-4"
                    >
                        <Link href="/machines">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Machines
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Manage equipment
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-auto justify-start py-4"
                    >
                        <Link href="/spare-parts">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Spare Parts
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {metrics.inventory.total_parts_count}{' '}
                                        parts
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Button>
                </div>

                {/* Metrics Cards - Only for Managers and Technicians */}
                {(isManager || isTechnician) && (
                    <>
                        {/* Work Order Metrics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit('/work-orders?status=open')
                                }
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Open
                                    </CardTitle>
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {metrics.open_work_orders_count}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        work orders
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit(
                                        '/work-orders?status=in_progress',
                                    )
                                }
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        In Progress
                                    </CardTitle>
                                    <Wrench className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {metrics.in_progress_work_orders_count}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        being worked on
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit(
                                        '/preventive-tasks?overdue=true',
                                    )
                                }
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Overdue PM
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-destructive" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-destructive">
                                        {metrics.overdue_preventive_tasks_count}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        past due date
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Breakdowns
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {metrics.breakdowns_in_range}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        in selected period
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Completed
                                    </CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {metrics.completed_in_range}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        in selected period
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cost, Inventory, OEE Summary Row */}
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Cost Summary */}
                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() => router.visit('/costs/dashboard')}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Maintenance Costs
                                        </CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(
                                                metrics.costs.this_month_total,
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="text-muted-foreground">
                                                This month
                                            </span>
                                            {metrics.costs
                                                .month_change_percent !== 0 && (
                                                <span
                                                    className={
                                                        metrics.costs
                                                            .month_change_percent >
                                                        0
                                                            ? 'flex items-center text-red-500'
                                                            : 'flex items-center text-green-500'
                                                    }
                                                >
                                                    {metrics.costs
                                                        .month_change_percent >
                                                    0 ? (
                                                        <ArrowUp className="h-3 w-3" />
                                                    ) : (
                                                        <ArrowDown className="h-3 w-3" />
                                                    )}
                                                    {Math.abs(
                                                        metrics.costs
                                                            .month_change_percent,
                                                    )}
                                                    %
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {metrics.costs.budget_total > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Budget
                                                </span>
                                                <span
                                                    className={
                                                        metrics.costs
                                                            .budget_used_percent >
                                                        100
                                                            ? 'text-red-500'
                                                            : 'text-muted-foreground'
                                                    }
                                                >
                                                    {
                                                        metrics.costs
                                                            .budget_used_percent
                                                    }
                                                    % used
                                                </span>
                                            </div>
                                            <Progress
                                                value={Math.min(
                                                    metrics.costs
                                                        .budget_used_percent,
                                                    100,
                                                )}
                                                className="h-2"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Inventory Summary */}
                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit('/inventory/low-stock')
                                }
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Inventory Status
                                        </CardTitle>
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold">
                                            {formatCurrency(
                                                metrics.inventory
                                                    .total_inventory_value,
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            total value
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        {metrics.inventory.low_stock_count >
                                            0 && (
                                            <div className="flex items-center gap-1 text-orange-600">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span>
                                                    {
                                                        metrics.inventory
                                                            .low_stock_count
                                                    }{' '}
                                                    low stock
                                                </span>
                                            </div>
                                        )}
                                        {metrics.inventory
                                            .critical_out_of_stock > 0 && (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span>
                                                    {
                                                        metrics.inventory
                                                            .critical_out_of_stock
                                                    }{' '}
                                                    critical
                                                </span>
                                            </div>
                                        )}
                                        {metrics.inventory.pending_pos_count >
                                            0 && (
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <ShoppingCart className="h-3 w-3" />
                                                <span>
                                                    {
                                                        metrics.inventory
                                                            .pending_pos_count
                                                    }{' '}
                                                    POs pending
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* OEE Summary */}
                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() => router.visit('/oee/dashboard')}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            OEE Performance
                                        </CardTitle>
                                        <Gauge className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className={`text-2xl font-bold ${getOeeColor(metrics.oee.avg_oee)}`}
                                        >
                                            {metrics.oee.avg_oee}%
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            avg OEE
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-muted-foreground">
                                                Availability
                                            </div>
                                            <div className="font-medium">
                                                {metrics.oee.avg_availability}%
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">
                                                Performance
                                            </div>
                                            <div className="font-medium">
                                                {metrics.oee.avg_performance}%
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">
                                                Quality
                                            </div>
                                            <div className="font-medium">
                                                {metrics.oee.avg_quality}%
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Recent Work Orders */}
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Recent Work Orders
                                            </CardTitle>
                                            <CardDescription>
                                                Latest maintenance activities
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/work-orders">
                                                View All
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {metrics.recent_work_orders.length >
                                        0 ? (
                                            metrics.recent_work_orders.map(
                                                (wo) => (
                                                    <div
                                                        key={wo.id}
                                                        className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/work-orders/${wo.id}`,
                                                            )
                                                        }
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium">
                                                                {wo.title}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {wo.machine
                                                                    ?.name ||
                                                                    'No machine'}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={getStatusColor(
                                                                wo.status,
                                                            )}
                                                        >
                                                            {wo.status.replace(
                                                                '_',
                                                                ' ',
                                                            )}
                                                        </Badge>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="py-4 text-center text-muted-foreground">
                                                No recent work orders
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Preventive Tasks */}
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Upcoming PM Tasks
                                            </CardTitle>
                                            <CardDescription>
                                                Due in the next 7 days
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/preventive-tasks">
                                                View All
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {metrics.upcoming_tasks.length > 0 ? (
                                            metrics.upcoming_tasks.map(
                                                (task) => (
                                                    <div
                                                        key={task.id}
                                                        className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/preventive-tasks/${task.id}`,
                                                            )
                                                        }
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium">
                                                                {task.name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {task.machine
                                                                    ?.name ||
                                                                    'No machine'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium">
                                                                {formatDate(
                                                                    task.next_due_date,
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {task.frequency}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="py-4 text-center text-muted-foreground">
                                                No upcoming tasks
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Problem Machines & Low Stock */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Top Machines by Breakdown */}
                            {metrics.top_machines.length > 0 && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Problem Machines
                                                </CardTitle>
                                                <CardDescription>
                                                    Most breakdowns in period
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href="/reports/downtime">
                                                    Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {metrics.top_machines.map(
                                                (machine, index) => (
                                                    <div
                                                        key={machine.machine_id}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/machines/${machine.machine_id}`,
                                                            )
                                                        }
                                                    >
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-sm font-bold text-destructive">
                                                            {index + 1}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium">
                                                                {
                                                                    machine.machine_name
                                                                }
                                                            </p>
                                                            {machine.machine_code && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        machine.machine_code
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge variant="destructive">
                                                            {
                                                                machine.breakdown_count
                                                            }{' '}
                                                            breakdowns
                                                        </Badge>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Low Stock Parts */}
                            {metrics.inventory.low_stock_parts.length > 0 && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>
                                                    Low Stock Alert
                                                </CardTitle>
                                                <CardDescription>
                                                    Parts needing reorder
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href="/inventory/low-stock">
                                                    View All
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {metrics.inventory.low_stock_parts.map(
                                                (part) => (
                                                    <div
                                                        key={part.id}
                                                        className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/spare-parts/${part.id}`,
                                                            )
                                                        }
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium">
                                                                {part.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    part.part_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p
                                                                className={`text-sm font-medium ${part.quantity_on_hand === 0 ? 'text-red-600' : 'text-orange-600'}`}
                                                            >
                                                                {
                                                                    part.quantity_on_hand
                                                                }{' '}
                                                                in stock
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Reorder at{' '}
                                                                {
                                                                    part.reorder_point
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Recent Production Runs */}
                        {metrics.oee.recent_runs.length > 0 && (
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Recent Production Runs
                                            </CardTitle>
                                            <CardDescription>
                                                Latest OEE performance
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/production/runs">
                                                View All
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b text-left text-sm text-muted-foreground">
                                                    <th className="pb-2 font-medium">
                                                        Machine
                                                    </th>
                                                    <th className="pb-2 font-medium">
                                                        Product
                                                    </th>
                                                    <th className="pb-2 font-medium">
                                                        Date
                                                    </th>
                                                    <th className="pb-2 text-right font-medium">
                                                        OEE
                                                    </th>
                                                    <th className="pb-2 text-right font-medium">
                                                        A
                                                    </th>
                                                    <th className="pb-2 text-right font-medium">
                                                        P
                                                    </th>
                                                    <th className="pb-2 text-right font-medium">
                                                        Q
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {metrics.oee.recent_runs.map(
                                                    (run) => (
                                                        <tr
                                                            key={run.id}
                                                            className="cursor-pointer border-b last:border-0 hover:bg-accent"
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/production/runs/${run.id}`,
                                                                )
                                                            }
                                                        >
                                                            <td className="py-2">
                                                                {run.machine
                                                                    ?.name ||
                                                                    '-'}
                                                            </td>
                                                            <td className="py-2">
                                                                {run.product
                                                                    ?.name ||
                                                                    '-'}
                                                            </td>
                                                            <td className="py-2 text-muted-foreground">
                                                                {formatDate(
                                                                    run.start_time,
                                                                )}
                                                            </td>
                                                            <td
                                                                className={`py-2 text-right font-medium ${getOeeColor(run.oee_pct)}`}
                                                            >
                                                                {run.oee_pct}%
                                                            </td>
                                                            <td className="py-2 text-right text-sm text-muted-foreground">
                                                                {
                                                                    run.availability_pct
                                                                }
                                                                %
                                                            </td>
                                                            <td className="py-2 text-right text-sm text-muted-foreground">
                                                                {
                                                                    run.performance_pct
                                                                }
                                                                %
                                                            </td>
                                                            <td className="py-2 text-right text-sm text-muted-foreground">
                                                                {
                                                                    run.quality_pct
                                                                }
                                                                %
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                {/* Operator View - Simplified */}
                {user.role === 'operator' && (
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>Quick Access</CardTitle>
                            <CardDescription>
                                Most common actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Button asChild size="lg" className="h-20">
                                    <Link href="/work-orders/report-breakdown">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertTriangle className="h-6 w-6" />
                                            <span>Report Breakdown</span>
                                        </div>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-20"
                                >
                                    <Link href="/work-orders">
                                        <div className="flex flex-col items-center gap-2">
                                            <ClipboardList className="h-6 w-6" />
                                            <span>My Reports</span>
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Stats Footer */}
                {(isManager || isTechnician) && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-border bg-muted/50">
                            <CardContent className="flex items-center gap-3 pt-6">
                                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {metrics.breakdowns_last_7_days}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Breakdowns (7 days)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-muted/50">
                            <CardContent className="flex items-center gap-3 pt-6">
                                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {metrics.breakdowns_last_30_days}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Breakdowns (30 days)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-muted/50">
                            <CardContent className="flex items-center gap-3 pt-6">
                                <Gauge className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {metrics.oee.run_count}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Production runs
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-muted/50">
                            <CardContent className="flex items-center gap-3 pt-6">
                                <DollarSign className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(
                                            metrics.costs.range_total,
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Costs in period
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
