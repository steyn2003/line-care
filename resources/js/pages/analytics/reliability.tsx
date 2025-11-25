import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Activity, Clock, TrendingDown, TrendingUp, Wrench } from 'lucide-react';
import { useState } from 'react';

interface MachineReliability {
    machine_id: number;
    machine_name: string;
    operating_hours: number;
    failure_count: number;
    mtbf_hours: number | null;
    mtbf_days: number | null;
}

interface MachineMTTR {
    machine_id: number;
    machine_name: string;
    repair_count: number;
    total_repair_hours: number;
    mttr_minutes: number;
    mttr_hours: number;
}

interface Props {
    mtbf: {
        machines: MachineReliability[];
        summary: {
            total_operating_hours: number;
            total_failures: number;
            average_mtbf_hours: number | null;
            average_mtbf_days: number | null;
        };
        period: { from: string; to: string };
    };
    mttr: {
        machines: MachineMTTR[];
        summary: {
            total_repair_hours: number;
            total_repairs: number;
            average_mttr_minutes: number;
            average_mttr_hours: number;
        };
        period: { from: string; to: string };
    };
}

export default function Reliability({ mtbf, mttr }: Props) {
    const [activeTab, setActiveTab] = useState<'mtbf' | 'mttr'>('mtbf');

    const getMTBFBadge = (mtbfHours: number | null) => {
        if (mtbfHours === null) return <Badge variant="secondary">N/A</Badge>;
        if (mtbfHours >= 720) return <Badge className="bg-green-500">Excellent</Badge>;
        if (mtbfHours >= 336) return <Badge className="bg-blue-500">Good</Badge>;
        if (mtbfHours >= 168) return <Badge className="bg-yellow-500">Fair</Badge>;
        return <Badge variant="destructive">Poor</Badge>;
    };

    const getMTTRBadge = (mttrHours: number) => {
        if (mttrHours <= 1) return <Badge className="bg-green-500">Excellent</Badge>;
        if (mttrHours <= 2) return <Badge className="bg-blue-500">Good</Badge>;
        if (mttrHours <= 4) return <Badge className="bg-yellow-500">Fair</Badge>;
        return <Badge variant="destructive">Poor</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Reliability Metrics" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Reliability Metrics</h1>
                        <p className="text-muted-foreground">
                            MTBF and MTTR analysis for your machines
                        </p>
                    </div>
                    <Select
                        value={activeTab}
                        onValueChange={(v) => setActiveTab(v as 'mtbf' | 'mttr')}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mtbf">MTBF (Reliability)</SelectItem>
                            <SelectItem value="mttr">MTTR (Maintainability)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary Cards */}
                {activeTab === 'mtbf' ? (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Average MTBF
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mtbf.summary.average_mtbf_hours?.toFixed(1) ?? 'N/A'} hrs
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mtbf.summary.average_mtbf_days?.toFixed(1) ?? 'N/A'} days between failures
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Operating Hours
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mtbf.summary.total_operating_hours.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across all machines
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Failures
                                </CardTitle>
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mtbf.summary.total_failures}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Breakdown incidents
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Analysis Period
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold">
                                    {mtbf.period.from}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    to {mtbf.period.to}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Average MTTR
                                </CardTitle>
                                <Wrench className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mttr.summary.average_mttr_hours.toFixed(2)} hrs
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mttr.summary.average_mttr_minutes.toFixed(0)} minutes per repair
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Repair Time
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mttr.summary.total_repair_hours.toFixed(1)} hrs
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Total time spent on repairs
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Repairs
                                </CardTitle>
                                <Wrench className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {mttr.summary.total_repairs}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Completed repairs
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Analysis Period
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold">
                                    {mttr.period.from}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    to {mttr.period.to}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {activeTab === 'mtbf' ? 'MTBF by Machine' : 'MTTR by Machine'}
                        </CardTitle>
                        <CardDescription>
                            {activeTab === 'mtbf'
                                ? 'Mean Time Between Failures - Higher is better (more reliable)'
                                : 'Mean Time To Repair - Lower is better (faster repairs)'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeTab === 'mtbf' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Machine</TableHead>
                                        <TableHead className="text-right">Operating Hours</TableHead>
                                        <TableHead className="text-right">Failures</TableHead>
                                        <TableHead className="text-right">MTBF (Hours)</TableHead>
                                        <TableHead className="text-right">MTBF (Days)</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mtbf.machines.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                No data available for the selected period
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mtbf.machines.map((machine) => (
                                            <TableRow key={machine.machine_id}>
                                                <TableCell className="font-medium">
                                                    {machine.machine_name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.operating_hours.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.failure_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.mtbf_hours?.toFixed(1) ?? 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.mtbf_days?.toFixed(1) ?? 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {getMTBFBadge(machine.mtbf_hours)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Machine</TableHead>
                                        <TableHead className="text-right">Repairs</TableHead>
                                        <TableHead className="text-right">Total Hours</TableHead>
                                        <TableHead className="text-right">MTTR (Minutes)</TableHead>
                                        <TableHead className="text-right">MTTR (Hours)</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mttr.machines.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                No data available for the selected period
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mttr.machines.map((machine) => (
                                            <TableRow key={machine.machine_id}>
                                                <TableCell className="font-medium">
                                                    {machine.machine_name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.repair_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.total_repair_hours.toFixed(1)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.mttr_minutes.toFixed(0)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {machine.mttr_hours.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {getMTTRBadge(machine.mttr_hours)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                What is MTBF?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p className="mb-2">
                                <strong>Mean Time Between Failures (MTBF)</strong> measures the average time a machine operates before experiencing a breakdown.
                            </p>
                            <p className="mb-2">
                                <strong>Formula:</strong> MTBF = Total Operating Time / Number of Failures
                            </p>
                            <p>
                                <strong>Goal:</strong> Higher MTBF indicates better reliability. Aim for continuous improvement through preventive maintenance.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5" />
                                What is MTTR?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p className="mb-2">
                                <strong>Mean Time To Repair (MTTR)</strong> measures the average time it takes to repair a machine after a breakdown.
                            </p>
                            <p className="mb-2">
                                <strong>Formula:</strong> MTTR = Total Repair Time / Number of Repairs
                            </p>
                            <p>
                                <strong>Goal:</strong> Lower MTTR indicates faster repairs. Improve through better training, spare parts availability, and documentation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
