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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface Machine {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string | null;
}

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
}

interface DowntimeCategory {
    id: number;
    name: string;
    type: 'planned' | 'unplanned';
    is_included_in_oee: boolean;
}

interface Downtime {
    id: number;
    category: DowntimeCategory;
    start_time: string;
    end_time: string | null;
    duration_minutes: number;
    description: string | null;
}

interface ProductionRun {
    id: number;
    machine: Machine;
    product: Product;
    shift: Shift;
    creator: User;
    start_time: string;
    end_time: string | null;
    planned_production_time: number;
    theoretical_output: number;
    actual_output: number;
    good_output: number;
    defect_output: number;
    availability_pct: number | null;
    performance_pct: number | null;
    quality_pct: number | null;
    oee_pct: number | null;
    status: 'active' | 'completed';
    downtimes: Downtime[];
    created_at: string;
}

interface DowntimeCategory {
    id: number;
    name: string;
    category_type: 'planned' | 'unplanned';
}

interface Props {
    productionRun: ProductionRun;
    downtimeCategories: DowntimeCategory[];
}

export default function ShowProductionRun({
    productionRun,
    downtimeCategories,
}: Props) {
    const [showDowntimeDialog, setShowDowntimeDialog] = useState(false);
    const [showEndDialog, setShowEndDialog] = useState(false);

    const {
        data: downtimeData,
        setData: setDowntimeData,
        post: postDowntime,
        reset: resetDowntime,
    } = useForm({
        production_run_id: productionRun.id,
        category_id: '',
        description: '',
    });

    const {
        data: endData,
        setData: setEndData,
        put: putEnd,
    } = useForm({
        actual_output: productionRun.actual_output || 0,
        good_output: productionRun.good_output || 0,
        defect_output: productionRun.defect_output || 0,
    });

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

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleStartDowntime = (e: React.FormEvent) => {
        e.preventDefault();
        postDowntime('/downtime', {
            preserveScroll: true,
            onSuccess: () => {
                setShowDowntimeDialog(false);
                resetDowntime();
                router.reload();
            },
        });
    };

    const handleEndDowntime = (downtimeId: number) => {
        router.put(
            `/downtime/${downtimeId}/end`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
            },
        );
    };

    const handleEndRun = (e: React.FormEvent) => {
        e.preventDefault();
        putEnd(`/production-runs/${productionRun.id}/end`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEndDialog(false);
                router.reload();
            },
        });
    };

    const activeDowntime = productionRun.downtimes.find(
        (d) => d.end_time === null,
    );
    const totalDowntime = productionRun.downtimes.reduce(
        (sum, d) => sum + d.duration_minutes,
        0,
    );
    const unplannedDowntime = productionRun.downtimes
        .filter((d) => d.category.category_type === 'unplanned')
        .reduce((sum, d) => sum + d.duration_minutes, 0);

    return (
        <AppLayout>
            <Head title={`Production Run #${productionRun.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.visit('/production/runs')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Production Run #{productionRun.id}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {productionRun.machine.name} •{' '}
                                    {productionRun.product.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {productionRun.status === 'active' && (
                                <>
                                    {activeDowntime ? (
                                        <Button
                                            variant="default"
                                            onClick={() =>
                                                handleEndDowntime(
                                                    activeDowntime.id,
                                                )
                                            }
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            End Downtime
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setShowDowntimeDialog(true)
                                            }
                                        >
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Log Downtime
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => setShowEndDialog(true)}
                                    >
                                        End Production Run
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Status and OEE Overview */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge
                                    variant={
                                        productionRun.status === 'active'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {productionRun.status === 'active'
                                        ? 'Active'
                                        : 'Completed'}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Overall OEE
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-3xl font-bold ${getOEEColor(productionRun.oee_pct)}`}
                                >
                                    {productionRun.oee_pct
                                        ? `${typeof productionRun.oee_pct === 'number' ? productionRun.oee_pct.toFixed(1) : parseFloat(String(productionRun.oee_pct)).toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Availability
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {productionRun.availability_pct
                                        ? `${typeof productionRun.availability_pct === 'number' ? productionRun.availability_pct.toFixed(1) : parseFloat(String(productionRun.availability_pct)).toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {productionRun.performance_pct
                                        ? `${typeof productionRun.performance_pct === 'number' ? productionRun.performance_pct.toFixed(1) : parseFloat(String(productionRun.performance_pct)).toFixed(1)}%`
                                        : 'N/A'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Run Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Run Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Machine
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {productionRun.machine.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Product
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {productionRun.product.name}
                                        </p>
                                        {productionRun.product.sku && (
                                            <p className="text-sm text-muted-foreground">
                                                {productionRun.product.sku}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Shift
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {productionRun.shift.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {productionRun.shift.start_time} -{' '}
                                            {productionRun.shift.end_time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Started By
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {productionRun.creator.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Start Time
                                        </p>
                                        <p className="font-medium">
                                            {formatDateTime(
                                                productionRun.start_time,
                                            )}
                                        </p>
                                    </div>
                                    {productionRun.end_time && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                End Time
                                            </p>
                                            <p className="font-medium">
                                                {formatDateTime(
                                                    productionRun.end_time,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Planned Time
                                        </p>
                                        <p className="font-medium">
                                            {formatDuration(
                                                productionRun.planned_production_time,
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Downtime
                                        </p>
                                        <p className="font-medium text-red-600">
                                            {formatDuration(totalDowntime)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Output & Quality */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Output & Quality</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Target Output
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {productionRun.theoretical_output}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Actual Output
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {productionRun.actual_output}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Good Units
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {productionRun.good_output}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Defective Units
                                        </p>
                                        <p className="text-3xl font-bold text-red-600">
                                            {productionRun.defect_output}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Quality Rate
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {productionRun.quality_pct
                                                ? `${typeof productionRun.quality_pct === 'number' ? productionRun.quality_pct.toFixed(1) : parseFloat(String(productionRun.quality_pct)).toFixed(1)}%`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Performance Rate
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {productionRun.performance_pct
                                                ? `${typeof productionRun.performance_pct === 'number' ? productionRun.performance_pct.toFixed(1) : parseFloat(String(productionRun.performance_pct)).toFixed(1)}%`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Downtime Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Downtime Events</CardTitle>
                            <CardDescription>
                                {productionRun.downtimes.length} event(s) •{' '}
                                {formatDuration(totalDowntime)} total •{' '}
                                {formatDuration(unplannedDowntime)} unplanned
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productionRun.downtimes.length > 0 ? (
                                <div className="space-y-3">
                                    {productionRun.downtimes.map((downtime) => (
                                        <div
                                            key={downtime.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            downtime.category
                                                                .category_type ===
                                                            'unplanned'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {downtime.category.name}
                                                    </Badge>
                                                    {downtime.end_time ===
                                                        null && (
                                                        <Badge variant="default">
                                                            Active
                                                        </Badge>
                                                    )}
                                                    {!downtime.category
                                                        .is_included_in_oee && (
                                                        <Badge variant="outline">
                                                            Not in OEE
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mb-1 text-sm text-muted-foreground">
                                                    {formatDateTime(
                                                        downtime.start_time,
                                                    )}
                                                    {downtime.end_time &&
                                                        ` - ${formatDateTime(downtime.end_time)}`}
                                                </p>
                                                {downtime.description && (
                                                    <p className="text-sm">
                                                        {downtime.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">
                                                    {formatDuration(
                                                        downtime.duration_minutes,
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Duration
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    No downtime events recorded
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Log Downtime Dialog */}
            <Dialog
                open={showDowntimeDialog}
                onOpenChange={setShowDowntimeDialog}
            >
                <DialogContent>
                    <form onSubmit={handleStartDowntime}>
                        <DialogHeader>
                            <DialogTitle>Log Downtime</DialogTitle>
                            <DialogDescription>
                                Record a downtime event for this production run
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category *</Label>
                                <Select
                                    value={downtimeData.category_id}
                                    onValueChange={(value) =>
                                        setDowntimeData('category_id', value)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                            Unplanned
                                        </div>
                                        {downtimeCategories
                                            .filter(
                                                (cat) =>
                                                    cat.category_type ===
                                                    'unplanned',
                                            )
                                            .map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                            Planned
                                        </div>
                                        {downtimeCategories
                                            .filter(
                                                (cat) =>
                                                    cat.category_type ===
                                                    'planned',
                                            )
                                            .map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={downtimeData.description}
                                    onChange={(e) =>
                                        setDowntimeData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Optional description of the issue"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDowntimeDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Start Downtime</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* End Production Run Dialog */}
            <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <DialogContent>
                    <form onSubmit={handleEndRun}>
                        <DialogHeader>
                            <DialogTitle>End Production Run</DialogTitle>
                            <DialogDescription>
                                Enter the final output numbers to complete this
                                production run
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="actual_output">
                                    Actual Output (Units) *
                                </Label>
                                <Input
                                    id="actual_output"
                                    type="number"
                                    min="0"
                                    value={endData.actual_output}
                                    onChange={(e) =>
                                        setEndData({
                                            ...endData,
                                            actual_output:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="good_output">
                                    Good Output (Units) *
                                </Label>
                                <Input
                                    id="good_output"
                                    type="number"
                                    min="0"
                                    max={endData.actual_output}
                                    value={endData.good_output}
                                    onChange={(e) =>
                                        setEndData({
                                            ...endData,
                                            good_output:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="defect_output">
                                    Defective Output (Units) *
                                </Label>
                                <Input
                                    id="defect_output"
                                    type="number"
                                    min="0"
                                    value={endData.defect_output}
                                    onChange={(e) =>
                                        setEndData({
                                            ...endData,
                                            defect_output:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Target output:{' '}
                                {productionRun.theoretical_output} units
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEndDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">End Production Run</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
