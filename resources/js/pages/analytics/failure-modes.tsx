import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { AlertTriangle, BarChart3, Clock, Wrench } from 'lucide-react';

interface CategoryData {
    category_id: number | null;
    category_name: string;
    count: number;
    machines_affected: number;
    avg_repair_time_hours: number | null;
}

interface MonthlyTrend {
    month: string;
    count: number;
}

interface Props {
    failureModes: {
        by_category: CategoryData[];
        monthly_trends: MonthlyTrend[];
        summary: {
            total_failures: number;
            unique_machines: number;
            categories_count: number;
        };
        period: { from: string; to: string };
    };
}

export default function FailureModes({ failureModes }: Props) {
    const maxCount = Math.max(...failureModes.by_category.map((c) => c.count), 1);
    const maxMonthlyCount = Math.max(...failureModes.monthly_trends.map((t) => t.count), 1);

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <AppLayout>
            <Head title="Failure Mode Analysis" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Failure Mode Analysis</h1>
                    <p className="text-muted-foreground">
                        Analyze breakdown patterns and failure categories
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Failures
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {failureModes.summary.total_failures}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Breakdown incidents
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Machines Affected
                            </CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {failureModes.summary.unique_machines}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Unique machines with breakdowns
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Failure Categories
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {failureModes.summary.categories_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Different cause categories
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Period</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {failureModes.period.from}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                to {failureModes.period.to}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Failures by Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Failures by Category</CardTitle>
                            <CardDescription>
                                Breakdown distribution across cause categories
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {failureModes.by_category.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No failure data available
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {failureModes.by_category.map((category) => (
                                        <div key={category.category_id ?? 'uncategorized'} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium truncate max-w-[200px]">
                                                    {category.category_name}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {category.count} ({((category.count / failureModes.summary.total_failures) * 100).toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-secondary">
                                                <div
                                                    className="h-2 rounded-full bg-primary"
                                                    style={{
                                                        width: `${(category.count / maxCount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Failure Trends</CardTitle>
                            <CardDescription>
                                Number of breakdowns over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {failureModes.monthly_trends.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No trend data available
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {failureModes.monthly_trends.map((trend) => (
                                        <div key={trend.month} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">
                                                    {formatMonth(trend.month)}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {trend.count} failures
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-secondary">
                                                <div
                                                    className="h-2 rounded-full bg-blue-500"
                                                    style={{
                                                        width: `${(trend.count / maxMonthlyCount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                        <CardDescription>
                            Detailed breakdown analysis by failure category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Failures</TableHead>
                                    <TableHead className="text-right">% of Total</TableHead>
                                    <TableHead className="text-right">Machines Affected</TableHead>
                                    <TableHead className="text-right">Avg Repair Time</TableHead>
                                    <TableHead>Severity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {failureModes.by_category.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No failure data available for the selected period
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    failureModes.by_category.map((category) => {
                                        const percentage = (category.count / failureModes.summary.total_failures) * 100;
                                        let severity: 'destructive' | 'secondary' | 'default' = 'secondary';
                                        if (percentage >= 30) severity = 'destructive';
                                        else if (percentage >= 15) severity = 'default';

                                        return (
                                            <TableRow key={category.category_id ?? 'uncategorized'}>
                                                <TableCell className="font-medium">
                                                    {category.category_name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {category.count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {percentage.toFixed(1)}%
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {category.machines_affected}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {category.avg_repair_time_hours
                                                        ? `${category.avg_repair_time_hours.toFixed(1)} hrs`
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={severity}>
                                                        {severity === 'destructive'
                                                            ? 'High'
                                                            : severity === 'default'
                                                            ? 'Medium'
                                                            : 'Low'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recommendations */}
                {failureModes.by_category.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {failureModes.by_category.slice(0, 3).map((category, index) => (
                                    <li key={category.category_id ?? index} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                        <span>
                                            <strong>{category.category_name}</strong> accounts for{' '}
                                            {((category.count / failureModes.summary.total_failures) * 100).toFixed(1)}%
                                            of failures affecting {category.machines_affected} machine(s).
                                            {category.avg_repair_time_hours && category.avg_repair_time_hours > 2
                                                ? ' Consider improving repair procedures or training to reduce repair time.'
                                                : ' Focus on preventive measures to reduce occurrence.'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
