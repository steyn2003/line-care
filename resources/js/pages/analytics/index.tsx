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
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Clock,
    TrendingDown,
    TrendingUp,
    Wrench,
} from 'lucide-react';

interface Machine {
    id: number;
    name: string;
}

interface MTBFMachine {
    machine_id: number;
    machine_name: string;
    operating_hours: number;
    failure_count: number;
    mtbf_hours: number | null;
    mtbf_days: number | null;
}

interface MTTRMachine {
    machine_id: number;
    machine_name: string;
    repair_count: number;
    total_repair_hours: number;
    mttr_minutes: number;
    mttr_hours: number;
}

interface MTBFData {
    machines: MTBFMachine[];
    summary: {
        total_operating_hours: number;
        total_failures: number;
        average_mtbf_hours: number | null;
        average_mtbf_days: number | null;
    };
    period: { from: string; to: string };
}

interface MTTRData {
    machines: MTTRMachine[];
    summary: {
        total_repair_hours: number;
        total_repairs: number;
        average_mttr_minutes: number;
        average_mttr_hours: number;
    };
    period: { from: string; to: string };
}

interface ParetoItem {
    id: number;
    name: string;
    count: number;
    percentage: number;
    cumulative_percentage: number;
    is_vital_few: boolean;
}

interface ParetoData {
    type: string;
    data: ParetoItem[];
    total: number;
    vital_few_count: number;
    period: { from: string; to: string };
}

interface EffectivenessMonth {
    month: string;
    preventive_count: number;
    breakdown_count: number;
    pm_ratio: number;
}

interface EffectivenessData {
    monthly: EffectivenessMonth[];
    summary: {
        total_preventive: number;
        total_breakdowns: number;
        pm_percentage: number;
        breakdown_percentage: number;
        pm_to_breakdown_ratio: number | null;
    };
    recommendation: string;
    period: { from: string; to: string };
}

interface Filters {
    date_from: string;
    date_to: string;
    machine_id?: string;
}

interface Props {
    mtbf: MTBFData;
    mttr: MTTRData;
    paretoMachines: ParetoData;
    paretoCauses: ParetoData;
    effectiveness: EffectivenessData;
    machines: Machine[];
    filters: Filters;
}

export default function AnalyticsIndex({
    mtbf,
    mttr,
    paretoMachines,
    paretoCauses,
    effectiveness,
    machines,
    filters: initialFilters,
}: Props) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/analytics',
            {
                ...initialFilters,
                [key]: value || undefined,
            },
            { preserveState: true },
        );
    };

    const formatHours = (hours: number | null) => {
        if (hours === null) return 'N/A';
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.round(hours % 24);
            return `${days}d ${remainingHours}h`;
        }
        return `${hours.toFixed(1)}h`;
    };

    const formatMinutes = (minutes: number) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = Math.round(minutes % 60);
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${Math.round(minutes)}m`;
    };

    return (
        <AppLayout>
            <Head title="Advanced Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Advanced Analytics
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                MTBF, MTTR, Pareto analysis, and maintenance
                                effectiveness metrics
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.visit('/analytics/predictions')
                                }
                            >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Predictions
                            </Button>
                            <Button
                                onClick={() =>
                                    router.visit('/analytics/failure-modes')
                                }
                            >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Failure Analysis
                            </Button>
                        </div>
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

                    {/* Summary Cards */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Activity className="h-4 w-4" />
                                    Average MTBF
                                </CardTitle>
                                <CardDescription>
                                    Mean Time Between Failures
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {formatHours(mtbf.summary.average_mtbf_hours)}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {mtbf.summary.total_failures} failures in{' '}
                                    {mtbf.summary.total_operating_hours.toFixed(0)}h
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Wrench className="h-4 w-4" />
                                    Average MTTR
                                </CardTitle>
                                <CardDescription>
                                    Mean Time To Repair
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatMinutes(mttr.summary.average_mttr_minutes)}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {mttr.summary.total_repairs} repairs,{' '}
                                    {mttr.summary.total_repair_hours.toFixed(1)}h total
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    PM Ratio
                                </CardTitle>
                                <CardDescription>
                                    Preventive vs Total
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-3xl font-bold ${
                                        effectiveness.summary.pm_percentage >= 60
                                            ? 'text-green-600'
                                            : effectiveness.summary.pm_percentage >= 40
                                              ? 'text-yellow-600'
                                              : 'text-red-600'
                                    }`}
                                >
                                    {effectiveness.summary.pm_percentage.toFixed(0)}%
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {effectiveness.summary.total_preventive} PM vs{' '}
                                    {effectiveness.summary.total_breakdowns} breakdowns
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <TrendingDown className="h-4 w-4" />
                                    Vital Few Machines
                                </CardTitle>
                                <CardDescription>
                                    80/20 Rule (Pareto)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-600">
                                    {paretoMachines.vital_few_count}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    machines cause 80% of breakdowns
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* MTBF & MTTR Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* MTBF by Machine */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    MTBF by Machine
                                </CardTitle>
                                <CardDescription>
                                    Higher is better - More reliable machines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {mtbf.machines.length > 0 ? (
                                    <div className="space-y-4">
                                        {mtbf.machines.slice(0, 8).map((machine) => (
                                            <div
                                                key={machine.machine_id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {machine.machine_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {machine.failure_count} failures
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p
                                                        className={`text-lg font-bold ${
                                                            machine.mtbf_hours === null
                                                                ? 'text-gray-400'
                                                                : machine.mtbf_hours >= 240
                                                                  ? 'text-green-600'
                                                                  : machine.mtbf_hours >= 120
                                                                    ? 'text-yellow-600'
                                                                    : 'text-red-600'
                                                        }`}
                                                    >
                                                        {formatHours(machine.mtbf_hours)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-muted-foreground">
                                        No MTBF data available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* MTTR by Machine */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    MTTR by Machine
                                </CardTitle>
                                <CardDescription>
                                    Lower is better - Faster repairs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {mttr.machines.length > 0 ? (
                                    <div className="space-y-4">
                                        {mttr.machines.slice(0, 8).map((machine) => (
                                            <div
                                                key={machine.machine_id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {machine.machine_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {machine.repair_count} repairs
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p
                                                        className={`text-lg font-bold ${
                                                            machine.mttr_minutes <= 60
                                                                ? 'text-green-600'
                                                                : machine.mttr_minutes <= 180
                                                                  ? 'text-yellow-600'
                                                                  : 'text-red-600'
                                                        }`}
                                                    >
                                                        {formatMinutes(machine.mttr_minutes)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-muted-foreground">
                                        No MTTR data available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pareto Analysis */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Pareto by Machine */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pareto: Machines by Breakdowns</CardTitle>
                                <CardDescription>
                                    Focus on vital few (red) for maximum impact
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {paretoMachines.data.length > 0 ? (
                                    <div className="space-y-3">
                                        {paretoMachines.data.slice(0, 8).map((item) => (
                                            <div key={item.id} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {item.name}
                                                        </span>
                                                        {item.is_vital_few && (
                                                            <Badge variant="destructive">
                                                                Vital Few
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-sm">
                                                        {item.count} ({item.percentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            item.is_vital_few
                                                                ? 'bg-red-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                        style={{
                                                            width: `${item.percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-muted-foreground">
                                        No breakdown data available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pareto by Cause */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pareto: Causes by Frequency</CardTitle>
                                <CardDescription>
                                    Top causes to address first
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {paretoCauses.data.length > 0 ? (
                                    <div className="space-y-3">
                                        {paretoCauses.data.slice(0, 8).map((item) => (
                                            <div key={item.id} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {item.name}
                                                        </span>
                                                        {item.is_vital_few && (
                                                            <Badge variant="destructive">
                                                                Vital Few
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-sm">
                                                        {item.count} ({item.percentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            item.is_vital_few
                                                                ? 'bg-red-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                        style={{
                                                            width: `${item.percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-muted-foreground">
                                        No cause data available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Maintenance Effectiveness */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Effectiveness</CardTitle>
                            <CardDescription>
                                {effectiveness.recommendation}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {effectiveness.monthly.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-lg border p-4 text-center">
                                            <p className="text-3xl font-bold text-blue-600">
                                                {effectiveness.summary.total_preventive}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Preventive Work Orders
                                            </p>
                                        </div>
                                        <div className="rounded-lg border p-4 text-center">
                                            <p className="text-3xl font-bold text-red-600">
                                                {effectiveness.summary.total_breakdowns}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Breakdown Work Orders
                                            </p>
                                        </div>
                                        <div className="rounded-lg border p-4 text-center">
                                            <p className="text-3xl font-bold text-green-600">
                                                {effectiveness.summary.pm_to_breakdown_ratio
                                                    ? `${effectiveness.summary.pm_to_breakdown_ratio}:1`
                                                    : 'N/A'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                PM to Breakdown Ratio
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <p className="text-sm font-medium">Monthly Trend</p>
                                        <div className="grid grid-cols-6 gap-2 md:grid-cols-12">
                                            {effectiveness.monthly.map((month) => (
                                                <div
                                                    key={month.month}
                                                    className="text-center"
                                                >
                                                    <div className="mb-1 h-20 flex flex-col justify-end">
                                                        <div
                                                            className="bg-blue-500 rounded-t"
                                                            style={{
                                                                height: `${(month.preventive_count / Math.max(...effectiveness.monthly.map((m) => m.preventive_count + m.breakdown_count), 1)) * 100}%`,
                                                            }}
                                                        />
                                                        <div
                                                            className="bg-red-500 rounded-b"
                                                            style={{
                                                                height: `${(month.breakdown_count / Math.max(...effectiveness.monthly.map((m) => m.preventive_count + m.breakdown_count), 1)) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {month.month.slice(5)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center gap-4 text-xs">
                                            <div className="flex items-center gap-1">
                                                <div className="h-3 w-3 rounded bg-blue-500" />
                                                <span>Preventive</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="h-3 w-3 rounded bg-red-500" />
                                                <span>Breakdown</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    No maintenance data available
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
