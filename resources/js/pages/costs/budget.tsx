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
    DialogTrigger,
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
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Edit,
    Plus,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Budget {
    id: number;
    year: number;
    month: number;
    budgeted_labor: number;
    budgeted_parts: number;
    budgeted_total: number;
    actual_labor: number;
    actual_parts: number;
    actual_total: number;
    variance: number;
}

interface Props {
    budgets: Budget[];
    selectedYear: number;
}

export default function BudgetManagement({ budgets, selectedYear }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        budgeted_labor: '',
        budgeted_parts: '',
    });

    // Update form data when editing a budget

    useEffect(() => {
        if (editingBudget) {
            setData({
                year: editingBudget.year,
                month: editingBudget.month,
                budgeted_labor: editingBudget.budgeted_labor.toString(),
                budgeted_parts: editingBudget.budgeted_parts.toString(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingBudget]);

    const handleYearChange = (year: string) => {
        router.get(
            '/costs/budget',
            { year },
            {
                preserveState: false,
            },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            year: parseInt(data.year.toString()),
            month: parseInt(data.month.toString()),
            budgeted_labor: parseFloat(data.budgeted_labor.toString()),
            budgeted_parts: parseFloat(data.budgeted_parts.toString()),
        };

        if (editingBudget) {
            put(`/costs/budget/${editingBudget.id}`, {
                data: submitData,
                onSuccess: () => {
                    toast.success('Budget updated successfully');
                    setIsDialogOpen(false);
                    setEditingBudget(null);
                    reset();
                },
                onError: () => {
                    toast.error(errors.month || 'Failed to update budget');
                },
            });
        } else {
            post('/costs/budget', {
                data: submitData,
                onSuccess: () => {
                    toast.success('Budget created successfully');
                    setIsDialogOpen(false);
                    reset();
                },
                onError: () => {
                    toast.error(errors.month || 'Failed to create budget');
                },
            });
        }
    };

    const handleEdit = (budget: Budget) => {
        setEditingBudget(budget);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;

        router.delete(`/costs/budget/${id}`, {
            onSuccess: () => {
                toast.success('Budget deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete budget');
            },
        });
    };

    const handleUpdateActuals = () => {
        router.reload({ only: ['budgets'] });
        toast.success('Actual costs refreshed successfully');
    };

    const resetForm = () => {
        reset();
        setEditingBudget(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getMonthName = (month: number) => {
        return new Date(2000, month - 1, 1).toLocaleDateString('en-US', {
            month: 'long',
        });
    };

    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - 2 + i,
    );

    return (
        <AppLayout>
            <Head title="Budget Management" />

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
                                Budget Management
                            </h1>
                            <p className="text-muted-foreground">
                                Set and track monthly maintenance budgets
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateActuals} variant="outline">
                            Update Actuals
                        </Button>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setEditingBudget(null);
                                    resetForm();
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Budget
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingBudget
                                            ? 'Edit Budget'
                                            : 'Create Budget'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Set monthly budget for labor and parts
                                        costs
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year</Label>
                                            <Select
                                                value={data.year.toString()}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'year',
                                                        parseInt(value),
                                                    )
                                                }
                                                disabled={
                                                    !!editingBudget ||
                                                    processing
                                                }
                                            >
                                                <SelectTrigger id="year">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.map((year) => (
                                                        <SelectItem
                                                            key={year}
                                                            value={year.toString()}
                                                        >
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="month">Month</Label>
                                            <Select
                                                value={data.month.toString()}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'month',
                                                        parseInt(value),
                                                    )
                                                }
                                                disabled={
                                                    !!editingBudget ||
                                                    processing
                                                }
                                            >
                                                <SelectTrigger id="month">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => i + 1,
                                                    ).map((month) => (
                                                        <SelectItem
                                                            key={month}
                                                            value={month.toString()}
                                                        >
                                                            {getMonthName(
                                                                month,
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budgeted-labor">
                                            Budgeted Labor Cost
                                        </Label>
                                        <Input
                                            id="budgeted-labor"
                                            type="number"
                                            step="0.01"
                                            value={data.budgeted_labor}
                                            onChange={(e) =>
                                                setData(
                                                    'budgeted_labor',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budgeted-parts">
                                            Budgeted Parts Cost
                                        </Label>
                                        <Input
                                            id="budgeted-parts"
                                            type="number"
                                            step="0.01"
                                            value={data.budgeted_parts}
                                            onChange={(e) =>
                                                setData(
                                                    'budgeted_parts',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            required
                                        />
                                    </div>
                                    <div className="rounded-md bg-gray-50 p-3">
                                        <p className="text-sm text-muted-foreground">
                                            Total Budget
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                (parseFloat(
                                                    data.budgeted_labor.toString(),
                                                ) || 0) +
                                                    (parseFloat(
                                                        data.budgeted_parts.toString(),
                                                    ) || 0),
                                            )}
                                        </p>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsDialogOpen(false);
                                                setEditingBudget(null);
                                                resetForm();
                                            }}
                                            disabled={processing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Saving...'
                                                : editingBudget
                                                  ? 'Update'
                                                  : 'Create'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Budgets Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Budgets for {selectedYear}</CardTitle>
                        <CardDescription>
                            Monthly budget tracking with actual costs comparison
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {budgets.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead className="text-right">
                                            Budgeted Labor
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Budgeted Parts
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Budgeted Total
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actual Total
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Variance
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {budgets.map((budget) => {
                                        const isOverBudget =
                                            budget.variance < 0;
                                        const percentageUsed =
                                            budget.budgeted_total > 0
                                                ? (budget.actual_total /
                                                      budget.budgeted_total) *
                                                  100
                                                : 0;

                                        return (
                                            <TableRow key={budget.id}>
                                                <TableCell className="font-medium">
                                                    {getMonthName(budget.month)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        budget.budgeted_labor,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        budget.budgeted_parts,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        budget.budgeted_total,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        budget.actual_total,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={
                                                            isOverBudget
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }
                                                    >
                                                        {formatCurrency(
                                                            Math.abs(
                                                                budget.variance,
                                                            ),
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isOverBudget ? (
                                                        <Badge
                                                            variant="destructive"
                                                            className="gap-1"
                                                        >
                                                            <TrendingUp className="h-3 w-3" />
                                                            Over{' '}
                                                            {percentageUsed.toFixed(
                                                                0,
                                                            )}
                                                            %
                                                        </Badge>
                                                    ) : percentageUsed > 80 ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 border-yellow-600 text-yellow-600"
                                                        >
                                                            <AlertTriangle className="h-3 w-3" />
                                                            {percentageUsed.toFixed(
                                                                0,
                                                            )}
                                                            %
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 border-green-600 text-green-600"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            {percentageUsed.toFixed(
                                                                0,
                                                            )}
                                                            %
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    budget,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    budget.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex h-64 items-center justify-center">
                                <div className="text-center">
                                    <p className="text-lg font-medium">
                                        No budgets found
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first budget to start
                                        tracking
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
