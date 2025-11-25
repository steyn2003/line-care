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
import { Head, router } from '@inertiajs/react';
import { BarChart3, Info, Target } from 'lucide-react';

interface ParetoItem {
    id: number;
    name: string;
    count?: number;
    total_hours?: number;
    total_cost?: number;
    percentage: number;
    cumulative_percentage: number;
    is_vital_few: boolean;
}

interface Props {
    pareto: {
        type: string;
        data: ParetoItem[];
        total: number;
        total_hours?: number;
        total_cost?: number;
        vital_few_count: number;
        period: { from: string; to: string };
    };
    analysisType: string;
}

export default function Pareto({ pareto, analysisType }: Props) {
    const handleTypeChange = (type: string) => {
        router.get('/analytics/pareto', { type }, { preserveState: true });
    };

    const getValueColumn = () => {
        switch (pareto.type) {
            case 'downtime':
                return 'Hours';
            case 'costs':
                return 'Cost';
            default:
                return 'Count';
        }
    };

    const getValue = (item: ParetoItem) => {
        switch (pareto.type) {
            case 'downtime':
                return `${item.total_hours?.toFixed(1)} hrs`;
            case 'costs':
                return `$${item.total_cost?.toLocaleString()}`;
            default:
                return item.count;
        }
    };

    const getTotal = () => {
        switch (pareto.type) {
            case 'downtime':
                return `${pareto.total_hours?.toFixed(1)} hours`;
            case 'costs':
                return `$${pareto.total_cost?.toLocaleString()}`;
            default:
                return `${pareto.total} incidents`;
        }
    };

    return (
        <AppLayout>
            <Head title="Pareto Analysis" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pareto Analysis</h1>
                        <p className="text-muted-foreground">
                            Identify the vital few causes responsible for most
                            issues (80/20 rule)
                        </p>
                    </div>
                    <Select
                        value={analysisType}
                        onValueChange={handleTypeChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="machines">By Machine</SelectItem>
                            <SelectItem value="causes">By Cause</SelectItem>
                            <SelectItem value="downtime">
                                By Downtime
                            </SelectItem>
                            <SelectItem value="costs">By Cost</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {getTotal()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                In the analysis period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Vital Few (80%)
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pareto.vital_few_count} items
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Causing 80% of issues
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Items
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pareto.data.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {pareto.type === 'machines'
                                    ? 'Machines'
                                    : pareto.type === 'causes'
                                      ? 'Cause categories'
                                      : pareto.type === 'downtime'
                                        ? 'Machines with downtime'
                                        : 'Machines with costs'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Period
                            </CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {pareto.period.from}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                to {pareto.period.to}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pareto Chart Visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pareto Distribution</CardTitle>
                        <CardDescription>
                            Items highlighted in green are the "vital few"
                            contributing to 80% of issues
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {pareto.data.slice(0, 10).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-32 truncate text-sm font-medium">
                                        {item.name}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex h-8 items-center">
                                            <div
                                                className={`h-6 rounded ${
                                                    item.is_vital_few
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300'
                                                }`}
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    minWidth: '4px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-16 text-right text-sm">
                                        {item.percentage.toFixed(1)}%
                                    </div>
                                    <div className="w-20 text-right text-sm text-muted-foreground">
                                        ({item.cumulative_percentage.toFixed(1)}
                                        %)
                                    </div>
                                </div>
                            ))}
                            {pareto.data.length > 10 && (
                                <p className="text-sm text-muted-foreground">
                                    ... and {pareto.data.length - 10} more items
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Analysis</CardTitle>
                        <CardDescription>
                            Complete breakdown by {pareto.type}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">
                                        {getValueColumn()}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        % of Total
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Cumulative %
                                    </TableHead>
                                    <TableHead>Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pareto.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            No data available for the selected
                                            period
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pareto.data.map((item, idx) => (
                                        <TableRow
                                            key={item.id}
                                            className={
                                                item.is_vital_few
                                                    ? 'bg-green-50 dark:bg-green-950'
                                                    : ''
                                            }
                                        >
                                            <TableCell className="font-medium">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">
                                                {getValue(item)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.percentage.toFixed(1)}%
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.cumulative_percentage.toFixed(
                                                    1,
                                                )}
                                                %
                                            </TableCell>
                                            <TableCell>
                                                {item.is_vital_few ? (
                                                    <Badge className="bg-green-500">
                                                        Vital Few
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Trivial Many
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            About Pareto Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p className="mb-2">
                            The <strong>Pareto Principle (80/20 Rule)</strong>{' '}
                            states that roughly 80% of effects come from 20% of
                            causes.
                        </p>
                        <p className="mb-2">
                            In maintenance, this means a small number of
                            machines, failure causes, or issues typically
                            account for the majority of your problems.
                        </p>
                        <p>
                            <strong>How to use:</strong> Focus your improvement
                            efforts on the "vital few" items highlighted in
                            green. Addressing these will have the greatest
                            impact on reducing overall maintenance burden.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
