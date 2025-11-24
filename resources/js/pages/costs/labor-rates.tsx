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
    ArrowLeft,
    Clock,
    Edit,
    Plus,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LaborRate {
    id: number;
    user_id: number | null;
    role: string | null;
    hourly_rate: number;
    overtime_rate: number | null;
    effective_from: string;
    effective_to: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    laborRates: LaborRate[];
    users: User[];
}

export default function LaborRateManagement({ laborRates, users }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRate, setEditingRate] = useState<LaborRate | null>(null);
    const [rateType, setRateType] = useState<'user' | 'role'>('user');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: '',
        role: '',
        hourly_rate: '',
        overtime_rate: '',
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            user_id:
                rateType === 'user' && data.user_id
                    ? parseInt(data.user_id)
                    : null,
            role: rateType === 'role' && data.role ? data.role : null,
            hourly_rate: parseFloat(data.hourly_rate.toString()),
            overtime_rate: data.overtime_rate
                ? parseFloat(data.overtime_rate.toString())
                : null,
            effective_from: data.effective_from,
            effective_to: data.effective_to || null,
        };

        if (editingRate) {
            put(`/costs/labor-rates/${editingRate.id}`, {
                data: submitData,
                onSuccess: () => {
                    toast.success('Labor rate updated successfully');
                    setIsDialogOpen(false);
                    setEditingRate(null);
                    reset();
                },
                onError: () => {
                    toast.error(
                        Object.values(errors)[0] ||
                            'Failed to update labor rate',
                    );
                },
            });
        } else {
            post('/costs/labor-rates', {
                data: submitData,
                onSuccess: () => {
                    toast.success('Labor rate created successfully');
                    setIsDialogOpen(false);
                    reset();
                },
                onError: () => {
                    toast.error(
                        Object.values(errors)[0] ||
                            'Failed to create labor rate',
                    );
                },
            });
        }
    };

    const handleEdit = (rate: LaborRate) => {
        setEditingRate(rate);
        setRateType(rate.user_id ? 'user' : 'role');
        setData({
            user_id: rate.user_id?.toString() || '',
            role: rate.role || '',
            hourly_rate: rate.hourly_rate.toString(),
            overtime_rate: rate.overtime_rate?.toString() || '',
            effective_from: rate.effective_from,
            effective_to: rate.effective_to || '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this labor rate?'))
            return;

        router.delete(`/costs/labor-rates/${id}`, {
            onSuccess: () => {
                toast.success('Labor rate deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete labor rate');
            },
        });
    };

    const resetForm = () => {
        reset();
        setEditingRate(null);
        setRateType('user');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isRateActive = (rate: LaborRate) => {
        const now = new Date();
        const effectiveFrom = new Date(rate.effective_from);
        const effectiveTo = rate.effective_to
            ? new Date(rate.effective_to)
            : null;

        return effectiveFrom <= now && (!effectiveTo || effectiveTo >= now);
    };

    const getRateStatus = (rate: LaborRate) => {
        const now = new Date();
        const effectiveFrom = new Date(rate.effective_from);
        const effectiveTo = rate.effective_to
            ? new Date(rate.effective_to)
            : null;

        if (effectiveFrom > now) {
            return { label: 'Scheduled', variant: 'secondary' as const };
        }
        if (effectiveTo && effectiveTo < now) {
            return { label: 'Expired', variant: 'outline' as const };
        }
        return { label: 'Active', variant: 'default' as const };
    };

    // Separate active and inactive rates
    const activeRates = laborRates.filter(isRateActive);
    const inactiveRates = laborRates.filter((rate) => !isRateActive(rate));

    return (
        <AppLayout>
            <Head title="Labor Rate Management" />

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
                                Labor Rate Management
                            </h1>
                            <p className="text-muted-foreground">
                                Configure hourly rates for users and roles
                            </p>
                        </div>
                    </div>
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) {
                                resetForm();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Labor Rate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingRate
                                        ? 'Edit Labor Rate'
                                        : 'Create Labor Rate'}
                                </DialogTitle>
                                <DialogDescription>
                                    Set hourly rates for specific users or roles
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Rate Type Selection */}
                                <div className="space-y-2">
                                    <Label>Rate Type</Label>
                                    <Select
                                        value={rateType}
                                        onValueChange={(value) =>
                                            setRateType(
                                                value as 'user' | 'role',
                                            )
                                        }
                                        disabled={!!editingRate || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>Specific User</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="role">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>Role-Based</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* User or Role Selection */}
                                {rateType === 'user' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="user">User</Label>
                                        <Select
                                            value={data.user_id}
                                            onValueChange={(value) =>
                                                setData('user_id', value)
                                            }
                                            disabled={
                                                !!editingRate || processing
                                            }
                                        >
                                            <SelectTrigger id="user">
                                                <SelectValue placeholder="Select a user" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id.toString()}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {user.email} •{' '}
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) =>
                                                setData('role', value)
                                            }
                                            disabled={
                                                !!editingRate || processing
                                            }
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="operator">
                                                    Operator
                                                </SelectItem>
                                                <SelectItem value="technician">
                                                    Technician
                                                </SelectItem>
                                                <SelectItem value="manager">
                                                    Manager
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="hourly-rate">
                                            Hourly Rate
                                        </Label>
                                        <Input
                                            id="hourly-rate"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.hourly_rate}
                                            onChange={(e) =>
                                                setData(
                                                    'hourly_rate',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="overtime-rate">
                                            Overtime Rate (Optional)
                                        </Label>
                                        <Input
                                            id="overtime-rate"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.overtime_rate}
                                            onChange={(e) =>
                                                setData(
                                                    'overtime_rate',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            placeholder="e.g., 1.5x hourly rate"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="effective-from">
                                            Effective From
                                        </Label>
                                        <Input
                                            id="effective-from"
                                            type="date"
                                            value={data.effective_from}
                                            onChange={(e) =>
                                                setData(
                                                    'effective_from',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="effective-to">
                                            Effective To (Optional)
                                        </Label>
                                        <Input
                                            id="effective-to"
                                            type="date"
                                            value={data.effective_to}
                                            onChange={(e) =>
                                                setData(
                                                    'effective_to',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                {data.overtime_rate && (
                                    <div className="rounded-md bg-blue-50 p-3">
                                        <p className="text-sm text-blue-900">
                                            <Clock className="mr-1 mb-1 inline h-4 w-4" />
                                            Overtime rate will be applied for
                                            work completed after 6 PM
                                        </p>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            resetForm();
                                        }}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : editingRate
                                              ? 'Update'
                                              : 'Create'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Active Labor Rates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Labor Rates</CardTitle>
                        <CardDescription>
                            Currently effective rates for cost calculation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeRates.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>User / Role</TableHead>
                                        <TableHead className="text-right">
                                            Hourly Rate
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Overtime Rate
                                        </TableHead>
                                        <TableHead>Effective From</TableHead>
                                        <TableHead>Effective To</TableHead>
                                        <TableHead className="text-right">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeRates.map((rate) => {
                                        const status = getRateStatus(rate);
                                        return (
                                            <TableRow key={rate.id}>
                                                <TableCell>
                                                    {rate.user_id ? (
                                                        <Badge variant="outline">
                                                            <User className="mr-1 h-3 w-3" />
                                                            User
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            <Users className="mr-1 h-3 w-3" />
                                                            Role
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {rate.user ? (
                                                        <div>
                                                            <p className="font-medium">
                                                                {rate.user.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    rate.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="capitalize">
                                                            {rate.role}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        rate.hourly_rate,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {rate.overtime_rate
                                                        ? formatCurrency(
                                                              rate.overtime_rate,
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        rate.effective_from,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {rate.effective_to
                                                        ? formatDate(
                                                              rate.effective_to,
                                                          )
                                                        : 'Ongoing'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={status.variant}
                                                    >
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEdit(rate)
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    rate.id,
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
                                        No active labor rates
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first labor rate to start
                                        tracking costs
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Inactive/Scheduled Labor Rates */}
                {inactiveRates.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduled & Expired Rates</CardTitle>
                            <CardDescription>
                                Future and past labor rates for reference
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>User / Role</TableHead>
                                        <TableHead className="text-right">
                                            Hourly Rate
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Overtime Rate
                                        </TableHead>
                                        <TableHead>Effective From</TableHead>
                                        <TableHead>Effective To</TableHead>
                                        <TableHead className="text-right">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inactiveRates.map((rate) => {
                                        const status = getRateStatus(rate);
                                        return (
                                            <TableRow
                                                key={rate.id}
                                                className="opacity-60"
                                            >
                                                <TableCell>
                                                    {rate.user_id ? (
                                                        <Badge variant="outline">
                                                            <User className="mr-1 h-3 w-3" />
                                                            User
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            <Users className="mr-1 h-3 w-3" />
                                                            Role
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {rate.user ? (
                                                        <div>
                                                            <p className="font-medium">
                                                                {rate.user.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    rate.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="capitalize">
                                                            {rate.role}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        rate.hourly_rate,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {rate.overtime_rate
                                                        ? formatCurrency(
                                                              rate.overtime_rate,
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        rate.effective_from,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {rate.effective_to
                                                        ? formatDate(
                                                              rate.effective_to,
                                                          )
                                                        : 'Ongoing'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={status.variant}
                                                    >
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEdit(rate)
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    rate.id,
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
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
