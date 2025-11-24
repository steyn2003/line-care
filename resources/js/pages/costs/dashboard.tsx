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
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Clock,
    DollarSign,
    Package,
    TrendingDown,
    TrendingUp,
    Users,
    Wrench,
} from 'lucide-react';

interface CostSummary {
    labor_total: number;
    parts_total: number;
    external_total: number;
    downtime_total: number;
    grand_total: number;
    work_order_count: number;
}

interface BudgetComparison {
    budget: {
        id: number;
        year: number;
        month: number;
        budgeted_total: number;
        actual_total: number;
        variance: number;
    };
    is_over_budget: boolean;
    percentage_used: number;
}

interface TopMachineCost {
    id: number;
    name: string;
    code: string;
    total_cost: number;
    labor_cost: number;
    parts_cost: number;
    downtime_cost: number;
    work_order_count: number;
}

interface Props {
    costSummary: CostSummary;
    topMachines: TopMachineCost[];
    budgetComparison: BudgetComparison | null;
    dateRange: string;
}

export default function CostDashboard({
    costSummary,
    topMachines,
    budgetComparison,
    dateRange,
}: Props) {
    const handleDateRangeChange = (value: string) => {
        router.get(
            '/costs/dashboard',
            { date_range: value },
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

    return (
        <AppLayout>
            <Head title="Cost Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Cost Dashboard</h1>
                        <p className="text-muted-foreground">
                            Track and analyze maintenance costs
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={dateRange}
                            onValueChange={handleDateRangeChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Link href="/costs/report">
                            <Button variant="outline">Detailed Report</Button>
                        </Link>
                        <Link href="/costs/budget">
                            <Button>Manage Budget</Button>
                        </Link>
                    </div>
                </div>

                {/* Cost Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Labor Costs
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(costSummary.labor_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Technician time
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Parts Costs
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(costSummary.parts_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Spare parts used
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                External Services
                            </CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(costSummary.external_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Contractors & vendors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Downtime Costs
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(costSummary.downtime_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Production loss
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Costs
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(costSummary.grand_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {costSummary.work_order_count} work orders
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget vs Actual */}
                {budgetComparison && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Budget vs Actual (Current Month)
                            </CardTitle>
                            <CardDescription>
                                Track spending against monthly budget
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Budgeted
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                budgetComparison.budget
                                                    .budgeted_total,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Actual
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                budgetComparison.budget
                                                    .actual_total,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Variance
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p
                                                className={`text-2xl font-bold ${budgetComparison.is_over_budget ? 'text-red-600' : 'text-green-600'}`}
                                            >
                                                {formatCurrency(
                                                    Math.abs(
                                                        budgetComparison.budget
                                                            .variance,
                                                    ),
                                                )}
                                            </p>
                                            {budgetComparison.is_over_budget ? (
                                                <TrendingUp className="h-5 w-5 text-red-600" />
                                            ) : (
                                                <TrendingDown className="h-5 w-5 text-green-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Budget Usage
                                        </span>
                                        <span className="font-medium">
                                            {budgetComparison.percentage_used.toFixed(
                                                1,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-200">
                                        <div
                                            className={`h-2 rounded-full ${budgetComparison.percentage_used > 100 ? 'bg-red-600' : budgetComparison.percentage_used > 80 ? 'bg-yellow-600' : 'bg-green-600'}`}
                                            style={{
                                                width: `${Math.min(budgetComparison.percentage_used, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    {budgetComparison.is_over_budget && (
                                        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span>
                                                Budget exceeded for this month
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Top 5 Machines by Cost */}
                {topMachines.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Top Machines by Maintenance Cost
                            </CardTitle>
                            <CardDescription>
                                Machines with highest maintenance costs in
                                selected period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topMachines.map((machine, index) => (
                                    <div
                                        key={machine.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {machine.name}
                                                </p>
                                                {machine.code && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {machine.code}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">
                                                {formatCurrency(
                                                    machine.total_cost,
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {machine.work_order_count} work
                                                orders
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
