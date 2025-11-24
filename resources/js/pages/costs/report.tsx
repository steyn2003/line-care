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
    ArrowLeft,
    Download,
    Filter,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

interface Machine {
    id: number;
    name: string;
    code: string;
    labor_cost: number;
    parts_cost: number;
    external_service_cost: number;
    downtime_cost: number;
    total_cost: number;
    work_order_count: number;
}

interface CategoryCost {
    id?: number;
    category_name: string;
    labor_cost: number;
    parts_cost: number;
    external_service_cost: number;
    downtime_cost: number;
    total_cost: number;
    work_order_count: number;
}

interface TrendData {
    month: string;
    labor_cost: number;
    parts_cost: number;
    external_service_cost: number;
    downtime_cost: number;
    total_cost: number;
    work_order_count: number;
}

interface Props {
    machines: Machine[];
    categories: CategoryCost[];
    trends: TrendData[];
    filters: {
        date_from: string;
        date_to: string;
        group_by: string;
    };
}

export default function CostReport({
    machines,
    categories,
    trends,
    filters,
}: Props) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/costs/report',
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const exportToCSV = () => {
        const headers = [
            'Machine/Category',
            'Labor Cost',
            'Parts Cost',
            'External Service',
            'Downtime Cost',
            'Total Cost',
            'Work Orders',
        ];
        const data =
            filters.group_by === 'machine'
                ? machines.map((m) => [
                      m.name + (m.code ? ` (${m.code})` : ''),
                      m.labor_cost,
                      m.parts_cost,
                      m.external_service_cost,
                      m.downtime_cost,
                      m.total_cost,
                      m.work_order_count,
                  ])
                : categories.map((c) => [
                      c.category_name,
                      c.labor_cost,
                      c.parts_cost,
                      c.external_service_cost,
                      c.downtime_cost,
                      c.total_cost,
                      c.work_order_count,
                  ]);

        const csv = [
            headers.join(','),
            ...data.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost-report-${filters.date_from}-to-${filters.date_to}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const totalCosts = machines.reduce(
        (acc, m) => ({
            labor: acc.labor + parseFloat(m.labor_cost.toString()),
            parts: acc.parts + parseFloat(m.parts_cost.toString()),
            external:
                acc.external + parseFloat(m.external_service_cost.toString()),
            downtime: acc.downtime + parseFloat(m.downtime_cost.toString()),
            total: acc.total + parseFloat(m.total_cost.toString()),
        }),
        { labor: 0, parts: 0, external: 0, downtime: 0, total: 0 },
    );

    return (
        <AppLayout>
            <Head title="Cost Report" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/costs/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Detailed Cost Report
                            </h1>
                            <p className="text-muted-foreground">
                                Comprehensive cost breakdown and analysis
                            </p>
                        </div>
                    </div>
                    <Button onClick={exportToCSV} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="date-from">Date From</Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={filters.date_from}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'date_from',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date-to">Date To</Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={filters.date_to}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'date_to',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-by">Group By</Label>
                                <Select
                                    value={filters.group_by}
                                    onValueChange={(value) =>
                                        handleFilterChange('group_by', value)
                                    }
                                >
                                    <SelectTrigger id="group-by">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="machine">
                                            Machine
                                        </SelectItem>
                                        <SelectItem value="type">
                                            Work Order Type
                                        </SelectItem>
                                        <SelectItem value="cause_category">
                                            Cause Category
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Totals */}
                {machines.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Total Costs ({filters.date_from} to{' '}
                                {filters.date_to})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-5">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Labor
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(totalCosts.labor)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Parts
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(totalCosts.parts)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        External
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(totalCosts.external)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Downtime
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(totalCosts.downtime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Grand Total
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {formatCurrency(totalCosts.total)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Cost Breakdown by{' '}
                            {filters.group_by === 'machine'
                                ? 'Machine'
                                : filters.group_by === 'type'
                                  ? 'Work Order Type'
                                  : 'Cause Category'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {filters.group_by === 'machine'
                                            ? 'Machine'
                                            : 'Category'}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Labor
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Parts
                                    </TableHead>
                                    <TableHead className="text-right">
                                        External
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Downtime
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Work Orders
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filters.group_by === 'machine'
                                    ? machines.map((machine) => (
                                          <TableRow key={machine.id}>
                                              <TableCell className="font-medium">
                                                  {machine.name}
                                                  {machine.code && (
                                                      <span className="ml-2 text-sm text-muted-foreground">
                                                          ({machine.code})
                                                      </span>
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      machine.labor_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      machine.parts_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      machine.external_service_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      machine.downtime_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right font-bold">
                                                  {formatCurrency(
                                                      machine.total_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {machine.work_order_count}
                                              </TableCell>
                                          </TableRow>
                                      ))
                                    : categories.map((category, index) => (
                                          <TableRow key={category.id || index}>
                                              <TableCell className="font-medium">
                                                  {category.category_name ||
                                                      'Uncategorized'}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      category.labor_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      category.parts_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      category.external_service_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {formatCurrency(
                                                      category.downtime_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right font-bold">
                                                  {formatCurrency(
                                                      category.total_cost,
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  {category.work_order_count}
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Monthly Trends */}
                {trends.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Cost Trends</CardTitle>
                            <CardDescription>
                                Cost progression over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead className="text-right">
                                            Labor
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Parts
                                        </TableHead>
                                        <TableHead className="text-right">
                                            External
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Downtime
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Trend
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trends.map((trend, index) => {
                                        const prevTrend =
                                            index > 0
                                                ? trends[index - 1]
                                                : null;
                                        const trendChange = prevTrend
                                            ? ((parseFloat(
                                                  trend.total_cost.toString(),
                                              ) -
                                                  parseFloat(
                                                      prevTrend.total_cost.toString(),
                                                  )) /
                                                  parseFloat(
                                                      prevTrend.total_cost.toString(),
                                                  )) *
                                              100
                                            : 0;

                                        return (
                                            <TableRow key={trend.month}>
                                                <TableCell className="font-medium">
                                                    {new Date(
                                                        trend.month + '-01',
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        trend.labor_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        trend.parts_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        trend.external_service_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        trend.downtime_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatCurrency(
                                                        trend.total_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {prevTrend && (
                                                        <div
                                                            className={`flex items-center justify-end gap-1 ${trendChange > 0 ? 'text-red-600' : 'text-green-600'}`}
                                                        >
                                                            {trendChange > 0 ? (
                                                                <TrendingUp className="h-4 w-4" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4" />
                                                            )}
                                                            <span className="text-sm">
                                                                {Math.abs(
                                                                    trendChange,
                                                                ).toFixed(1)}
                                                                %
                                                            </span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {machines.length === 0 && (
                    <Card>
                        <CardContent className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-medium">
                                    No cost data found
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting the date range or filters
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
