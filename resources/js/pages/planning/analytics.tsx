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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    CheckCircle,
    Clock,
    Target,
    TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Variance {
    slot_id: number;
    work_order_id: number;
    work_order_title: string;
    technician_name: string;
    machine_name: string;
    planned_start: string;
    actual_start: string | null;
    planned_duration: number;
    actual_duration: number | null;
    start_variance_minutes: number | null;
    duration_variance_minutes: number | null;
}

interface Props {
    metrics: {
        on_time_start_rate: number;
        duration_accuracy: number;
        avg_delay_minutes: number;
        total_slots_analyzed: number;
        schedule_adherence: number;
    };
    variances: Variance[];
    filters: {
        date_from: string;
        date_to: string;
    };
}

export default function PlanningAnalytics({
    metrics,
    variances,
    filters,
}: Props) {
    const { t } = useTranslation();

    const handleDateChange = (key: 'date_from' | 'date_to', value: string) => {
        router.get('/planning/analytics', {
            ...filters,
            [key]: value,
        });
    };

    const getVarianceColor = (variance: number | null) => {
        if (variance === null) return 'text-muted-foreground';
        if (Math.abs(variance) <= 15) return 'text-green-600';
        if (Math.abs(variance) <= 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getVarianceBadge = (variance: number | null) => {
        if (variance === null) return null;
        if (variance <= 0) {
            return <Badge className="bg-green-100 text-green-800">Early</Badge>;
        }
        if (variance <= 15) {
            return (
                <Badge className="bg-green-100 text-green-800">On Time</Badge>
            );
        }
        if (variance <= 30) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
            );
        }
        return <Badge className="bg-red-100 text-red-800">Very Late</Badge>;
    };

    const formatMinutes = (minutes: number | null) => {
        if (minutes === null) return '-';
        const absMinutes = Math.abs(minutes);
        if (absMinutes < 60) {
            return `${minutes > 0 ? '+' : ''}${minutes}m`;
        }
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        return `${minutes > 0 ? '+' : '-'}${hours}h ${mins}m`;
    };

    return (
        <AppLayout>
            <Head title={t('planning.analytics.title', 'Planning Analytics')} />

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
                            {t(
                                'planning.analytics.title',
                                'Planning Analytics',
                            )}
                        </h1>
                        <p className="text-muted-foreground">
                            {t(
                                'planning.analytics.subtitle',
                                'Analyze planning accuracy and schedule adherence',
                            )}
                        </p>
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">
                                {t('common.from', 'From')}
                            </Label>
                            <Input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) =>
                                    handleDateChange(
                                        'date_from',
                                        e.target.value,
                                    )
                                }
                                className="w-[150px]"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">
                                {t('common.to', 'To')}
                            </Label>
                            <Input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) =>
                                    handleDateChange('date_to', e.target.value)
                                }
                                className="w-[150px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.analytics.schedule_adherence',
                                    'Schedule Adherence',
                                )}
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    metrics.schedule_adherence >= 80
                                        ? 'text-green-600'
                                        : metrics.schedule_adherence >= 60
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                }`}
                            >
                                {metrics.schedule_adherence.toFixed(0)}%
                            </div>
                            <Progress
                                value={metrics.schedule_adherence}
                                className="mt-2 h-2"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.analytics.on_time_rate',
                                    'On-Time Start Rate',
                                )}
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    metrics.on_time_start_rate >= 80
                                        ? 'text-green-600'
                                        : metrics.on_time_start_rate >= 60
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                }`}
                            >
                                {metrics.on_time_start_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.analytics.within_15_min',
                                    'Started within 15 minutes',
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.analytics.duration_accuracy',
                                    'Duration Accuracy',
                                )}
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    metrics.duration_accuracy >= 0.9 &&
                                    metrics.duration_accuracy <= 1.1
                                        ? 'text-green-600'
                                        : metrics.duration_accuracy >= 0.7 &&
                                            metrics.duration_accuracy <= 1.3
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                }`}
                            >
                                {(metrics.duration_accuracy * 100).toFixed(0)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.analytics.actual_vs_planned',
                                    'Actual vs Planned ratio',
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.analytics.avg_delay',
                                    'Avg. Start Delay',
                                )}
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${
                                    metrics.avg_delay_minutes <= 15
                                        ? 'text-green-600'
                                        : metrics.avg_delay_minutes <= 30
                                          ? 'text-yellow-600'
                                          : 'text-red-600'
                                }`}
                            >
                                {metrics.avg_delay_minutes}m
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.analytics.average_delay',
                                    'Average start delay',
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t(
                                    'planning.analytics.slots_analyzed',
                                    'Slots Analyzed',
                                )}
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.total_slots_analyzed}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    'planning.analytics.completed_slots',
                                    'Completed slots in period',
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Insights Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('planning.analytics.insights', 'Insights')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'planning.analytics.insights_description',
                                'Key findings from your planning data',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics.on_time_start_rate >= 80 ? (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium text-green-700">
                                            {t(
                                                'planning.analytics.good_on_time',
                                                'Good on-time performance',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'planning.analytics.good_on_time_desc',
                                                'Most work orders are starting on schedule. Keep up the good work!',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="font-medium text-yellow-700">
                                            {t(
                                                'planning.analytics.improve_on_time',
                                                'Start times need improvement',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'planning.analytics.improve_on_time_desc',
                                                'Consider adding buffer time to schedules or reviewing resource allocation.',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {metrics.duration_accuracy >= 0.9 &&
                            metrics.duration_accuracy <= 1.1 ? (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium text-green-700">
                                            {t(
                                                'planning.analytics.accurate_estimates',
                                                'Accurate duration estimates',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'planning.analytics.accurate_estimates_desc',
                                                'Your planned durations closely match actual completion times.',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : metrics.duration_accuracy > 1.1 ? (
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="font-medium text-yellow-700">
                                            {t(
                                                'planning.analytics.underestimated',
                                                'Durations often underestimated',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'planning.analytics.underestimated_desc',
                                                'Work often takes longer than planned. Consider increasing time estimates.',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium text-blue-700">
                                            {t(
                                                'planning.analytics.overestimated',
                                                'Durations often overestimated',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'planning.analytics.overestimated_desc',
                                                'Work is often completed faster than planned. You could optimize schedules.',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Variance Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                'planning.analytics.variance_details',
                                'Variance Details',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'planning.analytics.variance_details_description',
                                'Detailed breakdown of planned vs actual times',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {variances.length === 0 ? (
                            <div className="py-12 text-center">
                                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">
                                    {t(
                                        'planning.analytics.no_data',
                                        'No data available',
                                    )}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t(
                                        'planning.analytics.no_data_desc',
                                        'Complete some planned work orders to see analytics.',
                                    )}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t(
                                                'planning.work_order',
                                                'Work Order',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'planning.technician',
                                                'Technician',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t('planning.machine', 'Machine')}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'planning.analytics.planned_start',
                                                'Planned Start',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'planning.analytics.actual_start',
                                                'Actual Start',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'planning.analytics.start_variance',
                                                'Start Variance',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'planning.analytics.duration_variance',
                                                'Duration Variance',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t('planning.status', 'Status')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variances.map((variance) => (
                                        <TableRow key={variance.slot_id}>
                                            <TableCell>
                                                <Link
                                                    href={`/work-orders/${variance.work_order_id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {variance.work_order_title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {variance.technician_name}
                                            </TableCell>
                                            <TableCell>
                                                {variance.machine_name}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    parseISO(
                                                        variance.planned_start,
                                                    ),
                                                    'MMM d, HH:mm',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {variance.actual_start
                                                    ? format(
                                                          parseISO(
                                                              variance.actual_start,
                                                          ),
                                                          'MMM d, HH:mm',
                                                      )
                                                    : '-'}
                                            </TableCell>
                                            <TableCell
                                                className={getVarianceColor(
                                                    variance.start_variance_minutes,
                                                )}
                                            >
                                                {formatMinutes(
                                                    variance.start_variance_minutes,
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={getVarianceColor(
                                                    variance.duration_variance_minutes,
                                                )}
                                            >
                                                {formatMinutes(
                                                    variance.duration_variance_minutes,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getVarianceBadge(
                                                    variance.start_variance_minutes,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
