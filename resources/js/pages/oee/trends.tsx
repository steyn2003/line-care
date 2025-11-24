import axios from '@/bootstrap';
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
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Machine {
    id: number;
    name: string;
}

interface Shift {
    id: number;
    name: string;
}

interface TrendData {
    date: string;
    average_oee: number;
    average_availability: number;
    average_performance: number;
    average_quality: number;
    total_output: number;
    total_runs: number;
}

interface Props {
    machines: Machine[];
    shifts: Shift[];
}

export default function OEETrends({ machines, shifts }: Props) {
    const [filters, setFilters] = useState({
        machine_id: 'all',
        shift_id: 'all',
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        date_to: new Date().toISOString().split('T')[0],
        period: 'daily',
    });

    const [trends, setTrends] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState<
        'oee' | 'availability' | 'performance' | 'quality'
    >('oee');

    const fetchTrends = useCallback(async () => {
        setLoading(true);
        try {
            // Convert 'all' to empty string for API
            const apiParams = {
                ...filters,
                machine_id:
                    filters.machine_id === 'all' ? '' : filters.machine_id,
                shift_id: filters.shift_id === 'all' ? '' : filters.shift_id,
            };
            const response = await axios.get('/api/oee/trends', {
                params: apiParams,
            });
            setTrends(response.data);
        } catch (error) {
            console.error('Failed to fetch OEE trends:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTrends();
    }, [fetchTrends]);

    const exportToCSV = () => {
        if (trends.length === 0) return;

        const headers = [
            'Date',
            'OEE (%)',
            'Availability (%)',
            'Performance (%)',
            'Quality (%)',
            'Output',
            'Runs',
        ];
        const rows = trends.map((t) => [
            t.date,
            t.average_oee.toFixed(2),
            t.average_availability.toFixed(2),
            t.average_performance.toFixed(2),
            t.average_quality.toFixed(2),
            t.total_output,
            t.total_runs,
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `oee-trends-${filters.date_from}-to-${filters.date_to}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getMetricValue = (trend: TrendData): number => {
        switch (selectedMetric) {
            case 'availability':
                return trend.average_availability;
            case 'performance':
                return trend.average_performance;
            case 'quality':
                return trend.average_quality;
            default:
                return trend.average_oee;
        }
    };

    const getMetricColor = (value: number): string => {
        if (value >= 85) return 'rgb(34, 197, 94)'; // green-600
        if (value >= 60) return 'rgb(234, 179, 8)'; // yellow-600
        return 'rgb(239, 68, 68)'; // red-600
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const maxValue = Math.max(...trends.map(getMetricValue), 100);
    const avgValue =
        trends.length > 0
            ? trends.reduce((sum, t) => sum + getMetricValue(t), 0) /
              trends.length
            : 0;

    return (
        <AppLayout>
            <Head title="OEE Trends" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">OEE Trends</h1>
                            <p className="text-sm text-muted-foreground">
                                Historical OEE performance analysis
                            </p>
                        </div>
                        <Button
                            onClick={exportToCSV}
                            disabled={trends.length === 0}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export to CSV
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Period
                                    </label>
                                    <Select
                                        value={filters.period}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                period: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="weekly">
                                                Weekly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Machine
                                    </label>
                                    <Select
                                        value={filters.machine_id}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                machine_id: value,
                                            })
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
                                        value={filters.shift_id}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                shift_id: value,
                                            })
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
                                        value={filters.date_from}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_from: e.target.value,
                                            })
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
                                        value={filters.date_to}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_to: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {loading ? (
                        <Card>
                            <CardContent className="py-12">
                                <p className="text-center text-muted-foreground">
                                    Loading trend data...
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium">
                                            Average OEE
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {avgValue.toFixed(1)}%
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Across {trends.length}{' '}
                                            {filters.period === 'daily'
                                                ? 'days'
                                                : 'weeks'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium">
                                            Best Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-600">
                                            {maxValue.toFixed(1)}%
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Peak performance achieved
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium">
                                            Total Production Runs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {trends.reduce(
                                                (sum, t) => sum + t.total_runs,
                                                0,
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {trends
                                                .reduce(
                                                    (sum, t) =>
                                                        sum + t.total_output,
                                                    0,
                                                )
                                                .toLocaleString()}{' '}
                                            total units
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Metric Selector */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Performance Trends
                                            </CardTitle>
                                            <CardDescription>
                                                Visualize OEE components over
                                                time
                                            </CardDescription>
                                        </div>
                                        <Select
                                            value={selectedMetric}
                                            onValueChange={(
                                                value:
                                                    | 'oee'
                                                    | 'availability'
                                                    | 'performance'
                                                    | 'quality',
                                            ) => setSelectedMetric(value)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="oee">
                                                    Overall OEE
                                                </SelectItem>
                                                <SelectItem value="availability">
                                                    Availability
                                                </SelectItem>
                                                <SelectItem value="performance">
                                                    Performance
                                                </SelectItem>
                                                <SelectItem value="quality">
                                                    Quality
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {trends.length > 0 ? (
                                        <div className="space-y-6">
                                            {/* Simple Bar Chart */}
                                            <div className="space-y-3">
                                                {trends.map((trend, index) => {
                                                    const value =
                                                        getMetricValue(trend);
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="space-y-1"
                                                        >
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="font-medium">
                                                                    {formatDate(
                                                                        trend.date,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className="font-bold"
                                                                    style={{
                                                                        color: getMetricColor(
                                                                            value,
                                                                        ),
                                                                    }}
                                                                >
                                                                    {value.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="relative h-6 w-full rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-6 rounded-full transition-all"
                                                                    style={{
                                                                        width: `${value}%`,
                                                                        backgroundColor:
                                                                            getMetricColor(
                                                                                value,
                                                                            ),
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <span>
                                                                    {
                                                                        trend.total_runs
                                                                    }{' '}
                                                                    runs
                                                                </span>
                                                                <span>
                                                                    {
                                                                        trend.total_output
                                                                    }{' '}
                                                                    units
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Reference Lines */}
                                            <div className="space-y-2 border-t pt-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded bg-green-600"></div>
                                                        <span>
                                                            World-class (≥85%)
                                                        </span>
                                                    </div>
                                                    <span className="text-muted-foreground">
                                                        {
                                                            trends.filter(
                                                                (t) =>
                                                                    getMetricValue(
                                                                        t,
                                                                    ) >= 85,
                                                            ).length
                                                        }{' '}
                                                        periods
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded bg-yellow-600"></div>
                                                        <span>
                                                            Good (60-85%)
                                                        </span>
                                                    </div>
                                                    <span className="text-muted-foreground">
                                                        {
                                                            trends.filter(
                                                                (t) => {
                                                                    const v =
                                                                        getMetricValue(
                                                                            t,
                                                                        );
                                                                    return (
                                                                        v >=
                                                                            60 &&
                                                                        v < 85
                                                                    );
                                                                },
                                                            ).length
                                                        }{' '}
                                                        periods
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded bg-red-600"></div>
                                                        <span>
                                                            Needs Improvement
                                                            (&lt;60%)
                                                        </span>
                                                    </div>
                                                    <span className="text-muted-foreground">
                                                        {
                                                            trends.filter(
                                                                (t) =>
                                                                    getMetricValue(
                                                                        t,
                                                                    ) < 60,
                                                            ).length
                                                        }{' '}
                                                        periods
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="py-12 text-center text-muted-foreground">
                                            No trend data available for selected
                                            period
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* All Metrics Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detailed Breakdown</CardTitle>
                                    <CardDescription>
                                        Complete OEE metrics by period
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {trends.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="px-4 py-3 text-left">
                                                            Date
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            OEE
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Availability
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Performance
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Quality
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Output
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Runs
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {trends.map(
                                                        (trend, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b hover:bg-accent"
                                                            >
                                                                <td className="px-4 py-3 font-medium">
                                                                    {formatDate(
                                                                        trend.date,
                                                                    )}
                                                                </td>
                                                                <td
                                                                    className="px-4 py-3 text-right font-bold"
                                                                    style={{
                                                                        color: getMetricColor(
                                                                            trend.average_oee,
                                                                        ),
                                                                    }}
                                                                >
                                                                    {trend.average_oee.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {trend.average_availability.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {trend.average_performance.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {trend.average_quality.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {trend.total_output.toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {
                                                                        trend.total_runs
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="py-8 text-center text-muted-foreground">
                                            No data available
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
