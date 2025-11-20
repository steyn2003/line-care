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
    breakdowns_last_7_days: number;
    breakdowns_last_30_days: number;
    top_machines: TopMachine[];
}

interface Props {
    metrics: DashboardMetrics;
    locations: Location[];
    user: {
        name: string;
        role: 'operator' | 'technician' | 'manager';
    };
}

export default function Dashboard({ metrics, locations, user }: Props) {
    const [locationFilter, setLocationFilter] = useState<string>('all');

    const handleLocationChange = (value: string) => {
        setLocationFilter(value);
        router.get(
            '/dashboard',
            {
                location_id: value !== 'all' ? value : undefined,
            },
            {
                preserveState: true,
            },
        );
    };

    const isManager = user.role === 'manager';
    const isTechnician = user.role === 'technician';

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Here's what's happening with your operations
                        </p>
                    </div>

                    {locations.length > 0 && (isManager || isTechnician) && (
                        <div className="w-64">
                            <Select
                                value={locationFilter}
                                onValueChange={handleLocationChange}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="All locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All locations
                                    </SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem
                                            key={location.id}
                                            value={location.id.toString()}
                                        >
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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

                            {/* Breakdowns Last 7 Days */}
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Breakdowns (7d)
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
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

                            {/* Breakdowns Last 30 Days */}
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Breakdowns (30d)
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">
                                        {metrics.breakdowns_last_30_days}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Last month
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
