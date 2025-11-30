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
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Clock,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface Location {
    id: number;
    name: string;
}

interface MachineDowntime {
    machine_id: number;
    machine_name: string;
    machine_code: string | null;
    criticality: 'low' | 'medium' | 'high';
    location_name: string | null;
    breakdown_count: number;
    total_downtime_minutes: number;
    avg_downtime_minutes: number;
    min_downtime_minutes: number;
    max_downtime_minutes: number;
}

interface Props {
    machine_downtime: MachineDowntime[];
    summary: {
        total_breakdowns: number;
        total_downtime_minutes: number;
        total_downtime_hours: number;
        total_machines_affected: number;
        avg_downtime_per_breakdown: number;
    };
    breakdowns_by_criticality: {
        low?: number;
        medium?: number;
        high?: number;
    };
    locations: Location[];
    filters: {
        location_id?: number;
        date_from: string;
        date_to: string;
    };
    user: {
        role: 'operator' | 'technician' | 'manager' | 'super_admin';
    };
}

const criticalityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function DowntimeReport({
    machine_downtime,
    summary,
    breakdowns_by_criticality,
    locations,
    filters,
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
            '/reports/downtime',
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

    const formatMinutes = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    return (
        <AppLayout>
            <Head title="Downtime Report" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Machine Downtime Report
                        </h1>
                        <p className="text-muted-foreground">
                            Detailed breakdown analysis and downtime metrics
                        </p>
                    </div>
                </div>

                {/* Filters */}
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
                                        onValueChange={handleLocationChange}
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
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Breakdowns
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {summary.total_breakdowns}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                In selected period
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Downtime
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {summary.total_downtime_hours}h
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {summary.total_downtime_minutes} minutes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Machines Affected
                            </CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {summary.total_machines_affected}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Different machines
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg Downtime
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {formatMinutes(
                                    summary.avg_downtime_per_breakdown,
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Per breakdown
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdowns by Criticality */}
                {Object.keys(breakdowns_by_criticality).length > 0 && (
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>
                                Breakdowns by Machine Criticality
                            </CardTitle>
                            <CardDescription>
                                Distribution of breakdowns across different
                                criticality levels
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                {breakdowns_by_criticality.high !==
                                    undefined && (
                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                High Criticality
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-foreground">
                                                {breakdowns_by_criticality.high}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="destructive"
                                            className="text-base"
                                        >
                                            High
                                        </Badge>
                                    </div>
                                )}
                                {breakdowns_by_criticality.medium !==
                                    undefined && (
                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Medium Criticality
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-foreground">
                                                {
                                                    breakdowns_by_criticality.medium
                                                }
                                            </p>
                                        </div>
                                        <Badge className="bg-amber-100 text-base text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                            Medium
                                        </Badge>
                                    </div>
                                )}
                                {breakdowns_by_criticality.low !==
                                    undefined && (
                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Low Criticality
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-foreground">
                                                {breakdowns_by_criticality.low}
                                            </p>
                                        </div>
                                        <Badge className="bg-green-100 text-base text-green-800 dark:bg-green-900 dark:text-green-300">
                                            Low
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Machine Downtime Table */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Machine Downtime Details</CardTitle>
                        <CardDescription>
                            Detailed downtime statistics for each machine
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {machine_downtime.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    No downtime data
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No completed breakdowns found for the
                                    selected period.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Machine</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead className="text-center">
                                                Criticality
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Breakdowns
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Total Downtime
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Avg Downtime
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Min / Max
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {machine_downtime.map((machine) => (
                                            <TableRow
                                                key={machine.machine_id}
                                                className="cursor-pointer hover:bg-accent"
                                                onClick={() =>
                                                    router.visit(
                                                        `/machines/${machine.machine_id}`,
                                                    )
                                                }
                                            >
                                                <TableCell>
                                                    <div>
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
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {machine.location_name ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={
                                                            criticalityColors[
                                                                machine
                                                                    .criticality
                                                            ]
                                                        }
                                                    >
                                                        {machine.criticality}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {machine.breakdown_count}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatMinutes(
                                                        machine.total_downtime_minutes,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatMinutes(
                                                        machine.avg_downtime_minutes,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {formatMinutes(
                                                        machine.min_downtime_minutes,
                                                    )}{' '}
                                                    /{' '}
                                                    {formatMinutes(
                                                        machine.max_downtime_minutes,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
