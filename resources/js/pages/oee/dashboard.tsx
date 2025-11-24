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
import { Head, router } from '@inertiajs/react';
import { Activity, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface Machine {
    id: number;
    name: string;
}

interface Shift {
    id: number;
    name: string;
}

interface ActiveRun {
    id: number;
    machine: Machine;
    product: { name: string };
    shift: { name: string };
    start_time: string;
    oee_pct: number | null;
    availability_pct: number | null;
    performance_pct: number | null;
    quality_pct: number | null;
}

interface Metrics {
    average_availability: number;
    average_performance: number;
    average_quality: number;
    average_oee: number;
    total_runs: number;
    total_output: number;
    total_good_output: number;
    total_downtime: number;
}

interface LossData {
    category: string;
    category_type: string;
    total_duration: number;
    occurrences: number;
    percentage: number;
    cumulative_percentage: number;
}

interface Filters {
    machine_id?: string;
    shift_id?: string;
    date_from: string;
    date_to: string;
}

interface MachineComparison {
    machine_id: number;
    machine_name: string;
    average_oee: number;
    total_runs: number;
    total_downtime: number;
}

interface Props {
    machines: Machine[];
    shifts: Shift[];
    metrics: Metrics;
    activeRuns: ActiveRun[];
    lossData: LossData[];
    machineComparison: MachineComparison[];
    filters: Filters;
}

export default function OEEDashboard({
    machines,
    shifts,
    metrics,
    activeRuns,
    lossData,
    machineComparison,
    filters: initialFilters,
}: Props) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/oee/dashboard',
            {
                ...initialFilters,
                [key]: value || undefined,
            },
            { preserveState: true },
        );
    };

    const getOEEColor = (oee: number | null) => {
        if (oee === null) return 'text-gray-500';
        if (oee >= 85) return 'text-green-600';
        if (oee >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    const maxLoss = Math.max(...lossData.map((l) => l.total_duration), 1);

    return (
        <AppLayout>
            <Head title="OEE Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                OEE Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Overall Equipment Effectiveness monitoring and
                                analysis
                            </p>
                        </div>
                        <Button
                            onClick={() => router.visit('/production/runs')}
                        >
                            View All Production Runs
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Machine
                                    </label>
                                    <Select
                                        value={
                                            initialFilters.machine_id || 'all'
                                        }
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                'machine_id',
                                                value === 'all' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Machines" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Machines
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
                                    <label className="text-sm font-medium">
                                        Shift
                                    </label>
                                    <Select
                                        value={initialFilters.shift_id || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                'shift_id',
                                                value === 'all' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Shifts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Shifts
                                            </SelectItem>
                                            {shifts.map((shift) => (
                                                <SelectItem
                                                    key={shift.id}
                                                    value={shift.id.toString()}
                                                >
                                                    {shift.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={initialFilters.date_from}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'date_from',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={initialFilters.date_to}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'date_to',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main OEE Metrics */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Activity className="h-4 w-4" />
                                    Overall OEE
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-4xl font-bold ${getOEEColor(metrics?.average_oee || null)}`}
                                >
                                    {metrics?.average_oee
                                        ? `${metrics.average_oee.toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {metrics &&
                                        metrics.average_oee >= 85 &&
                                        'World-class performance'}
                                    {metrics &&
                                        metrics.average_oee >= 60 &&
                                        metrics.average_oee < 85 &&
                                        'Good performance'}
                                    {metrics &&
                                        metrics.average_oee < 60 &&
                                        'Needs improvement'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    Availability
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {metrics?.average_availability
                                        ? `${metrics.average_availability.toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {metrics?.total_downtime
                                        ? `${formatDuration(metrics.total_downtime)} downtime`
                                        : 'No downtime'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {metrics?.average_performance
                                        ? `${metrics.average_performance.toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {metrics?.total_output
                                        ? `${metrics.total_output} units produced`
                                        : 'No production'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Quality
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {metrics?.average_quality
                                        ? `${metrics.average_quality.toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {metrics?.total_runs
                                        ? `${metrics.total_runs} production runs`
                                        : 'No runs'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Production Runs */}
                    {activeRuns.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Production Runs</CardTitle>
                                <CardDescription>
                                    {activeRuns.length} machine(s) currently
                                    running
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {activeRuns.map((run) => (
                                        <div
                                            key={run.id}
                                            className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent"
                                            onClick={() =>
                                                router.visit(
                                                    `/production/runs/${run.id}`,
                                                )
                                            }
                                        >
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h4 className="font-semibold">
                                                        {run.machine.name}
                                                    </h4>
                                                    <Badge variant="default">
                                                        Active
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {run.product.name} •{' '}
                                                    {run.shift.name}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-center">
                                                <div>
                                                    <p
                                                        className={`text-2xl font-bold ${getOEEColor(run.oee_pct)}`}
                                                    >
                                                        {run.oee_pct
                                                            ? `${run.oee_pct.toFixed(0)}%`
                                                            : '-'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        OEE
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {run.availability_pct
                                                            ? `${run.availability_pct.toFixed(0)}%`
                                                            : '-'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Avail
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {run.performance_pct
                                                            ? `${run.performance_pct.toFixed(0)}%`
                                                            : '-'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Perf
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {run.quality_pct
                                                            ? `${run.quality_pct.toFixed(0)}%`
                                                            : '-'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Qual
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Machine Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Machine Comparison</CardTitle>
                            <CardDescription>
                                Average OEE by machine for selected period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {machineComparison.length > 0 ? (
                                <div className="space-y-4">
                                    {machineComparison.map((machine) => (
                                        <div
                                            key={machine.machine_id}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {machine.machine_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {machine.total_runs}{' '}
                                                        runs •{' '}
                                                        {formatDuration(
                                                            machine.total_downtime,
                                                        )}{' '}
                                                        downtime
                                                    </p>
                                                </div>
                                                <div
                                                    className={`text-2xl font-bold ${getOEEColor(machine.average_oee)}`}
                                                >
                                                    {machine.average_oee.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </div>
                                            </div>
                                            <div className="h-3 w-full rounded-full bg-gray-200">
                                                <div
                                                    className={`h-3 rounded-full ${
                                                        machine.average_oee >=
                                                        85
                                                            ? 'bg-green-600'
                                                            : machine.average_oee >=
                                                                60
                                                              ? 'bg-yellow-600'
                                                              : 'bg-red-600'
                                                    }`}
                                                    style={{
                                                        width: `${machine.average_oee}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    No machine data available for selected
                                    period
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Loss Analysis (Pareto Chart) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Downtime Categories</CardTitle>
                            <CardDescription>
                                Pareto analysis - Focus on the top categories
                                for maximum impact
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {lossData.length > 0 ? (
                                <div className="space-y-4">
                                    {lossData.map((loss, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <span className="font-medium">
                                                        {loss.category}
                                                    </span>
                                                    {loss.cumulative_percentage <=
                                                        80 && (
                                                        <Badge variant="destructive">
                                                            Top 80%
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">
                                                        {formatDuration(
                                                            loss.total_duration,
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {loss.percentage.toFixed(
                                                            1,
                                                        )}
                                                        % • Cumulative:{' '}
                                                        {loss.cumulative_percentage.toFixed(
                                                            0,
                                                        )}
                                                        %
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="relative h-4 w-full rounded-full bg-gray-200">
                                                <div
                                                    className={`h-4 rounded-full ${
                                                        loss.cumulative_percentage <=
                                                        80
                                                            ? 'bg-red-500'
                                                            : 'bg-gray-400'
                                                    }`}
                                                    style={{
                                                        width: `${(loss.total_duration / maxLoss) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    No downtime data available for selected
                                    period
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
