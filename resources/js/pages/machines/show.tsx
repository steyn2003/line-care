import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    Inbox,
    MapPin,
    Pencil,
} from 'lucide-react';

interface Location {
    id: number;
    name: string;
}

interface Machine {
    id: number;
    name: string;
    code: string | null;
    location: Location | null;
    criticality: 'low' | 'medium' | 'high';
    status: 'active' | 'archived';
    created_at: string;
}

interface WorkOrder {
    id: number;
    title: string;
    type: 'breakdown' | 'preventive';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
}

interface Analytics {
    breakdown_count: number;
    preventive_count: number;
    total_downtime_minutes: number;
    avg_resolution_time_minutes: number;
    breakdowns_by_cause: Array<{ cause: string; count: number }>;
}

interface Props {
    machine: Machine;
    work_orders: WorkOrder[];
    analytics: Analytics;
}

const criticalityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const typeColors = {
    breakdown: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    preventive: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const workOrderStatusColors = {
    open: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    in_progress:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function MachineShow({
    machine,
    work_orders,
    analytics,
}: Props) {
    const handleEdit = () => {
        router.visit(`/machines/${machine.id}/edit`);
    };

    const handleReportBreakdown = () => {
        router.visit(`/work-orders/report-breakdown?machine_id=${machine.id}`);
    };

    return (
        <AppLayout>
            <Head title={machine.name} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/machines')}
                                className="text-muted-foreground"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Machines
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {machine.name}
                        </h1>
                        {machine.code && (
                            <p className="font-mono text-muted-foreground">
                                {machine.code}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button onClick={handleReportBreakdown}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Report Breakdown
                        </Button>
                    </div>
                </div>

                {/* Machine Info */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Machine Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Status
                                </span>
                                <div className="mt-1">
                                    <Badge
                                        className={statusColors[machine.status]}
                                    >
                                        {machine.status}
                                    </Badge>
                                </div>
                            </div>
                            {machine.location && (
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Location
                                    </span>
                                    <div className="mt-1 flex items-center text-sm text-foreground">
                                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {machine.location.name}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Criticality
                                </span>
                                <div className="mt-1">
                                    <Badge
                                        className={
                                            criticalityColors[
                                                machine.criticality
                                            ]
                                        }
                                    >
                                        {machine.criticality}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    Added
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                    {new Date(
                                        machine.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Analytics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>Breakdowns (90d)</CardDescription>
                            <CardTitle className="text-3xl text-destructive">
                                {analytics.breakdown_count}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>Preventive (90d)</CardDescription>
                            <CardTitle className="text-3xl text-primary">
                                {analytics.preventive_count}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>Total Downtime</CardDescription>
                            <CardTitle className="text-3xl text-foreground">
                                {Math.round(
                                    analytics.total_downtime_minutes / 60,
                                )}
                                h
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {analytics.total_downtime_minutes} minutes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>Avg Resolution</CardDescription>
                            <CardTitle className="text-3xl text-foreground">
                                {Math.round(
                                    analytics.avg_resolution_time_minutes,
                                )}
                                m
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Breakdowns by Cause */}
                {analytics.breakdowns_by_cause.length > 0 && (
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>Breakdowns by Cause</CardTitle>
                            <CardDescription>
                                Common failure categories
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analytics.breakdowns_by_cause.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-sm text-foreground">
                                                {item.cause}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="border-border"
                                            >
                                                {item.count}
                                            </Badge>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Work Orders */}
                <Card className="border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Work Orders</CardTitle>
                                <CardDescription>
                                    Last 10 work orders for this machine
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/work-orders?machine_id=${machine.id}`}
                                >
                                    View All
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {work_orders.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Inbox className="mx-auto mb-2 h-12 w-12" />
                                <p>No work orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {work_orders.map((wo) => (
                                    <div
                                        key={wo.id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                                        onClick={() =>
                                            router.visit(
                                                `/work-orders/${wo.id}`,
                                            )
                                        }
                                    >
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <Badge
                                                    className={
                                                        typeColors[wo.type]
                                                    }
                                                >
                                                    {wo.type}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        workOrderStatusColors[
                                                            wo.status
                                                        ]
                                                    }
                                                >
                                                    {wo.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {wo.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    wo.created_at,
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
        </AppLayout>
    );
}
