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
    ArrowRight,
    BookOpen,
    Calendar,
    CalendarX,
    ClipboardList,
    Cpu,
    HelpCircle,
    Mail,
    TrendingUp,
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

interface DashboardMetrics {
    open_work_orders_count: number;
    overdue_preventive_tasks_count: number;
    breakdowns_in_range: number;
    breakdowns_last_7_days: number;
    breakdowns_last_30_days: number;
    top_machines: TopMachine[];
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Button
                        asChild
                        size="lg"
                        className="h-auto justify-start py-6"
                    >
                        <Link href="/work-orders/report-breakdown">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                                    <AlertTriangle className="h-6 w-6 text-destructive" />
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
                        className="h-auto justify-start py-6"
                    >
                        <Link href="/work-orders">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <ClipboardList className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">
                                        Work Orders
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        View all
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-auto justify-start py-6"
                    >
                        <Link href="/machines">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-300" />
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
                </div>

                {/* Metrics Cards - Only for Managers and Technicians */}
                {(isManager || isTechnician) && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Open Work Orders */}
                            <Card
                                className="cursor-pointer border-border transition-shadow hover:shadow-md"
                                onClick={() =>
                                    router.visit('/work-orders?status=open')
                                }
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Open Work Orders
                                    </CardTitle>
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {metrics.open_work_orders_count}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Needs attention
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Overdue Preventive Tasks */}
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
                                        Overdue PM Tasks
                                    </CardTitle>
                                    <CalendarX className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-destructive">
                                        {metrics.overdue_preventive_tasks_count}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Past due date
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Breakdowns in Selected Range */}
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Breakdowns (Range)
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {metrics.breakdowns_in_range}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        In selected period
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Breakdowns Last 7 Days */}
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Breakdowns (7d)
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {metrics.breakdowns_last_7_days}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Last week
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Machines by Breakdown Count */}
                        {metrics.top_machines.length > 0 && (
                            <Card className="border-border">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Problem Machines
                                            </CardTitle>
                                            <CardDescription>
                                                Machines with the most
                                                breakdowns
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/reports/downtime">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {metrics.top_machines.map(
                                            (machine, index) => (
                                                <div
                                                    key={machine.machine_id}
                                                    className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/machines/${machine.machine_id}`,
                                                        )
                                                    }
                                                >
                                                    <div className="flex flex-1 items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 font-bold text-destructive">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-foreground">
                                                                {
                                                                    machine.machine_name
                                                                }
                                                            </p>
                                                            {machine.machine_code && (
                                                                <p className="font-mono text-sm text-muted-foreground">
                                                                    {
                                                                        machine.machine_code
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="destructive"
                                                        className="px-3 py-1 text-base"
                                                    >
                                                        {
                                                            machine.breakdown_count
                                                        }
                                                    </Badge>
                                                </div>
                                            ),
                                        )}
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

                {/* Help Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <HelpCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="font-semibold text-foreground">
                                    Need Help?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Check out our guides or contact support if
                                    you need assistance.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/help">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            User Guide
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Contact Support
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
