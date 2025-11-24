import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Factory, Filter, Play, Square, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Machine {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface Shift {
    id: number;
    name: string;
}

interface ProductionRun {
    id: number;
    machine: Machine;
    product: Product;
    shift: Shift;
    start_time: string;
    end_time: string | null;
    oee_pct: number | null;
    availability_pct: number | null;
    performance_pct: number | null;
    quality_pct: number | null;
    actual_output: number;
    good_output: number;
    defect_output: number;
}

interface Props {
    productionRuns: {
        data: ProductionRun[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    machines: Machine[];
    products: Product[];
    shifts: Shift[];
    filters: {
        machine_id?: number;
        status?: string;
    };
}

export default function ProductionRunsIndex({
    productionRuns,
    machines,
    products,
    shifts,
    filters,
}: Props) {
    const [showStartDialog, setShowStartDialog] = useState(false);
    const [showEndDialog, setShowEndDialog] = useState(false);
    const [endingRun, setEndingRun] = useState<ProductionRun | null>(null);

    const {
        data: startData,
        setData: setStartData,
        post: postStart,
        processing: startProcessing,
        errors: startErrors,
        reset: resetStart,
    } = useForm({
        machine_id: '',
        product_id: '',
        shift_id: '',
        planned_production_time: '',
    });

    const {
        data: endData,
        setData: setEndData,
        put: putEnd,
        processing: endProcessing,
        errors: endErrors,
        reset: resetEnd,
    } = useForm({
        actual_output: '',
        good_output: '',
        defect_output: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/production/runs',
            {
                ...filters,
                [key]: value || undefined,
            },
            { preserveState: true },
        );
    };

    const handleStartRun = (e: React.FormEvent) => {
        e.preventDefault();

        postStart('/production-runs', {
            preserveScroll: true,
            onSuccess: () => {
                setShowStartDialog(false);
                resetStart();
            },
        });
    };

    const handleOpenEndDialog = (run: ProductionRun) => {
        setEndingRun(run);
        resetEnd();
        setShowEndDialog(true);
    };

    const handleEndRun = (e: React.FormEvent) => {
        e.preventDefault();

        if (!endingRun) return;

        putEnd(`/production-runs/${endingRun.id}/end`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEndDialog(false);
                setEndingRun(null);
                resetEnd();
            },
        });
    };

    const getOEEColor = (oee: number | null): string => {
        if (oee === null) return 'text-gray-500';
        if (oee >= 85) return 'text-green-600';
        if (oee >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDateTime = (datetime: string): string => {
        return new Date(datetime).toLocaleString();
    };

    return (
        <AppLayout>
            <Head title="Production Runs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Production Runs
                        </h1>
                        <p className="text-muted-foreground">
                            Track and manage production runs with OEE metrics
                        </p>
                    </div>
                    <Button onClick={() => setShowStartDialog(true)}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Production Run
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select
                                    value={
                                        filters.machine_id?.toString() || 'all'
                                    }
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            'machine_id',
                                            value === 'all' ? '' : value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-[200px]">
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

                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange(
                                        'status',
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {productionRuns.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Factory className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No production runs found
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Start a production run to begin tracking OEE
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => setShowStartDialog(true)}
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Production Run
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Machine</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Started</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>OEE</TableHead>
                                        <TableHead>Output</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productionRuns.data.map((run) => (
                                        <TableRow key={run.id}>
                                            <TableCell className="font-medium">
                                                {run.machine.name}
                                            </TableCell>
                                            <TableCell>
                                                {run.product.name}
                                            </TableCell>
                                            <TableCell>
                                                {run.shift.name}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(run.start_time)}
                                            </TableCell>
                                            <TableCell>
                                                {run.end_time ? (
                                                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                                        Active
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {run.oee_pct !== null &&
                                                run.oee_pct !== undefined ? (
                                                    <span
                                                        className={`font-semibold ${getOEEColor(run.oee_pct)}`}
                                                    >
                                                        {typeof run.oee_pct ===
                                                        'number'
                                                            ? run.oee_pct.toFixed(
                                                                  1,
                                                              )
                                                            : parseFloat(
                                                                  String(
                                                                      run.oee_pct,
                                                                  ),
                                                              ).toFixed(1)}
                                                        %
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {run.actual_output > 0
                                                    ? `${run.good_output}/${run.actual_output}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/production/runs/${run.id}`}
                                                        >
                                                            <TrendingUp className="mr-1 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    {!run.end_time && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOpenEndDialog(
                                                                    run,
                                                                )
                                                            }
                                                        >
                                                            <Square className="mr-1 h-4 w-4" />
                                                            End
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Start Production Run Dialog */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start Production Run</DialogTitle>
                        <DialogDescription>
                            Begin tracking a new production run with OEE metrics
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleStartRun} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="machine_id">
                                Machine{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={startData.machine_id}
                                onValueChange={(value) =>
                                    setStartData('machine_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select machine" />
                                </SelectTrigger>
                                <SelectContent>
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
                            {startErrors.machine_id && (
                                <p className="text-sm text-destructive">
                                    {startErrors.machine_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_id">
                                Product{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={startData.product_id}
                                onValueChange={(value) =>
                                    setStartData('product_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem
                                            key={product.id}
                                            value={product.id.toString()}
                                        >
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {startErrors.product_id && (
                                <p className="text-sm text-destructive">
                                    {startErrors.product_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shift_id">
                                Shift{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={startData.shift_id}
                                onValueChange={(value) =>
                                    setStartData('shift_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
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
                            {startErrors.shift_id && (
                                <p className="text-sm text-destructive">
                                    {startErrors.shift_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planned_production_time">
                                Planned Time (minutes){' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="planned_production_time"
                                type="number"
                                min="1"
                                value={startData.planned_production_time}
                                onChange={(e) =>
                                    setStartData(
                                        'planned_production_time',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {startErrors.planned_production_time && (
                                <p className="text-sm text-destructive">
                                    {startErrors.planned_production_time}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowStartDialog(false)}
                                disabled={startProcessing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={startProcessing}>
                                <Play className="mr-2 h-4 w-4" />
                                Start Run
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* End Production Run Dialog */}
            <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>End Production Run</DialogTitle>
                        <DialogDescription>
                            Enter production output to calculate OEE
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEndRun} className="space-y-4">
                        {endingRun && (
                            <div className="rounded-md bg-muted p-4">
                                <p className="text-sm font-medium">
                                    {endingRun.machine.name} -{' '}
                                    {endingRun.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Started:{' '}
                                    {formatDateTime(endingRun.start_time)}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="actual_output">
                                Total Units Produced{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="actual_output"
                                type="number"
                                min="0"
                                value={endData.actual_output}
                                onChange={(e) =>
                                    setEndData('actual_output', e.target.value)
                                }
                                required
                            />
                            {endErrors.actual_output && (
                                <p className="text-sm text-destructive">
                                    {endErrors.actual_output}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="good_output">
                                Good Units{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="good_output"
                                type="number"
                                min="0"
                                value={endData.good_output}
                                onChange={(e) =>
                                    setEndData('good_output', e.target.value)
                                }
                                required
                            />
                            {endErrors.good_output && (
                                <p className="text-sm text-destructive">
                                    {endErrors.good_output}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defect_output">
                                Defective Units{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="defect_output"
                                type="number"
                                min="0"
                                value={endData.defect_output}
                                onChange={(e) =>
                                    setEndData('defect_output', e.target.value)
                                }
                                required
                            />
                            {endErrors.defect_output && (
                                <p className="text-sm text-destructive">
                                    {endErrors.defect_output}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEndDialog(false)}
                                disabled={endProcessing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={endProcessing}>
                                <Square className="mr-2 h-4 w-4" />
                                End Run & Calculate OEE
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
