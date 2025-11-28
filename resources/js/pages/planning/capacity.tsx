import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { addDays, endOfWeek, format, parseISO, startOfWeek } from 'date-fns';
import {
    ArrowLeft,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Clock,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TechnicianCapacity {
    id: number;
    name: string;
    available_hours: number;
    planned_hours: number;
    utilization_pct: number;
    status: 'optimal' | 'high' | 'low' | 'overbooked';
}

interface DailyCapacity {
    date: string;
    day_name: string;
    technicians: TechnicianCapacity[];
    total_available: number;
    total_planned: number;
    utilization_pct: number;
}

interface Props {
    daily: DailyCapacity[];
    summary: {
        total_available: number;
        total_planned: number;
        utilization: number;
    };
    technicians: Array<{ id: number; name: string }>;
    filters: {
        date_from: string;
        date_to: string;
    };
}

const statusColors: Record<string, string> = {
    optimal: 'bg-green-100 text-green-800 border-green-200',
    high: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    overbooked: 'bg-red-100 text-red-800 border-red-200',
};

export default function CapacityDashboard({
    daily,
    summary,
    technicians,
    filters,
}: Props) {
    const { t } = useTranslation();

    const dateFrom = parseISO(filters.date_from);
    const dateTo = parseISO(filters.date_to);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const offset = direction === 'prev' ? -7 : 7;
        const newStart = addDays(dateFrom, offset);
        const newEnd = addDays(dateTo, offset);
        router.get('/planning/capacity', {
            date_from: format(newStart, 'yyyy-MM-dd'),
            date_to: format(newEnd, 'yyyy-MM-dd'),
        });
    };

    const goToThisWeek = () => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        router.get('/planning/capacity', {
            date_from: format(weekStart, 'yyyy-MM-dd'),
            date_to: format(weekEnd, 'yyyy-MM-dd'),
        });
    };

    const getUtilizationColor = (pct: number) => {
        if (pct > 100) return 'text-red-600';
        if (pct > 90) return 'text-yellow-600';
        if (pct < 50) return 'text-blue-600';
        return 'text-green-600';
    };

    return (
        <AppLayout>
            <Head title={t('planning.capacity.title', 'Capacity Dashboard')} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/planning')}
                            className="mb-2 text-muted-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t(
                                'planning.back_to_board',
                                'Back to Planning Board',
                            )}
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('planning.capacity.title', 'Capacity Dashboard')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t(
                                'planning.capacity.subtitle',
                                'Monitor technician workload and availability',
                            )}
                        </p>
                    </div>

                    {/* Date Navigation */}
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
                            onClick={goToThisWeek}
                        >
                            {t('planning.this_week', 'This Week')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateWeek('next')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <span className="ml-2 font-medium">
                            {format(dateFrom, 'MMM d')} -{' '}
                            {format(dateTo, 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.capacity.total_available',
                                    'Total Available',
                                )}
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_available}h
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.capacity.across_technicians',
                                    'Across all technicians',
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.capacity.total_planned',
                                    'Total Planned',
                                )}
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_planned}h
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.capacity.scheduled_work',
                                    'Scheduled work hours',
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.capacity.utilization',
                                    'Utilization',
                                )}
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${getUtilizationColor(summary.utilization)}`}
                            >
                                {summary.utilization}%
                            </div>
                            <Progress
                                value={Math.min(summary.utilization, 100)}
                                className="mt-2 h-2"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.capacity.technicians',
                                    'Technicians',
                                )}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {technicians.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.capacity.active_technicians',
                                    'Active technicians',
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                'planning.capacity.daily_breakdown',
                                'Daily Breakdown',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'planning.capacity.daily_breakdown_description',
                                'Capacity utilization by day',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-7">
                            {daily.map((day) => (
                                <div
                                    key={day.date}
                                    className="rounded-lg border p-4 text-center"
                                >
                                    <p className="text-sm font-medium">
                                        {day.day_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(parseISO(day.date), 'MMM d')}
                                    </p>
                                    <div
                                        className={`mt-2 text-lg font-bold ${getUtilizationColor(day.utilization_pct)}`}
                                    >
                                        {day.utilization_pct}%
                                    </div>
                                    <Progress
                                        value={Math.min(
                                            day.utilization_pct,
                                            100,
                                        )}
                                        className="mt-2 h-2"
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {day.total_planned.toFixed(1)}h /{' '}
                                        {day.total_available.toFixed(1)}h
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Technician Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                'planning.capacity.technician_workload',
                                'Technician Workload',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'planning.capacity.technician_workload_description',
                                'Individual capacity by technician and day',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        {t('planning.technician', 'Technician')}
                                    </TableHead>
                                    {daily.map((day) => (
                                        <TableHead
                                            key={day.date}
                                            className="text-center"
                                        >
                                            <div>
                                                {format(
                                                    parseISO(day.date),
                                                    'EEE',
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(
                                                    parseISO(day.date),
                                                    'MMM d',
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-center">
                                        {t(
                                            'planning.capacity.week_total',
                                            'Week Total',
                                        )}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {technicians.map((tech) => {
                                    const weekData = daily.map((day) =>
                                        day.technicians.find(
                                            (t) => t.id === tech.id,
                                        ),
                                    );
                                    const weekPlanned = weekData.reduce(
                                        (sum, d) =>
                                            sum + (d?.planned_hours || 0),
                                        0,
                                    );
                                    const weekAvailable = weekData.reduce(
                                        (sum, d) =>
                                            sum + (d?.available_hours || 0),
                                        0,
                                    );
                                    const weekUtilization =
                                        weekAvailable > 0
                                            ? (weekPlanned / weekAvailable) *
                                              100
                                            : 0;

                                    return (
                                        <TableRow key={tech.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {tech.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            {weekData.map((dayData, idx) => (
                                                <TableCell
                                                    key={idx}
                                                    className="text-center"
                                                >
                                                    {dayData ? (
                                                        <div>
                                                            <Badge
                                                                className={
                                                                    statusColors[
                                                                        dayData
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    dayData.utilization_pct
                                                                }
                                                                %
                                                            </Badge>
                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                {dayData.planned_hours.toFixed(
                                                                    1,
                                                                )}
                                                                h
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center">
                                                <div
                                                    className={`font-bold ${getUtilizationColor(weekUtilization)}`}
                                                >
                                                    {weekUtilization.toFixed(0)}
                                                    %
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {weekPlanned.toFixed(1)}h /{' '}
                                                    {weekAvailable.toFixed(1)}h
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                'planning.capacity.legend',
                                'Utilization Legend',
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-sm">
                                    {t(
                                        'planning.capacity.optimal',
                                        'Optimal (50-90%)',
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <span className="text-sm">
                                    {t(
                                        'planning.capacity.high',
                                        'High (90-100%)',
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                <span className="text-sm">
                                    {t('planning.capacity.low', 'Low (<50%)')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <span className="text-sm">
                                    {t(
                                        'planning.capacity.overbooked',
                                        'Overbooked (>100%)',
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
