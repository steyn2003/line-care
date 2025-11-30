import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
    Boxes,
    Building2,
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    UserCog,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    plan: string;
    created_at: string;
    users_count?: number;
    machines_count?: number;
    work_orders_count?: number;
}

interface Props {
    companies: {
        data: Company[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        plan?: string;
    };
    availablePlans: string[];
}

export default function CompaniesIndex({
    companies,
    filters,
    availablePlans,
}: Props) {
    const { t } = useTranslation();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [planFilter, setPlanFilter] = useState(filters.plan || '');

    const createForm = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        plan: 'basic',
    });

    const getPlanBadgeVariant = (plan: string) => {
        switch (plan) {
            case 'enterprise':
                return 'default';
            case 'pro':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/companies',
            { search: searchQuery, plan: planFilter },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePlanFilterChange = (value: string) => {
        setPlanFilter(value);
        router.get(
            '/admin/companies',
            { search: searchQuery, plan: value === 'all' ? '' : value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleImpersonate = (company: Company) => {
        router.post(`/admin/companies/${company.id}/impersonate`, undefined, {
            onSuccess: () => {
                toast.success(
                    t('admin.impersonation.started', {
                        company: company.name,
                    }),
                );
            },
            onError: (errors) => {
                if (errors.impersonation) {
                    toast.error(errors.impersonation as string);
                } else {
                    toast.error(t('admin.impersonation.error'));
                }
            },
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/companies', {
            preserveScroll: true,
            onSuccess: () => {
                setCreateDialogOpen(false);
                createForm.reset();
                toast.success('Company created successfully');
            },
            onError: () => {
                toast.error('Failed to create company');
            },
        });
    };

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        editForm.setData({
            name: company.name,
            email: company.email || '',
            phone: company.phone || '',
            address: company.address || '',
        });
        setEditDialogOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;

        editForm.put(`/admin/companies/${selectedCompany.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDialogOpen(false);
                setSelectedCompany(null);
                editForm.reset();
                toast.success('Company updated successfully');
            },
            onError: () => {
                toast.error('Failed to update company');
            },
        });
    };

    const handleDelete = (company: Company) => {
        setSelectedCompany(company);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedCompany) return;

        router.delete(`/admin/companies/${selectedCompany.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedCompany(null);
                toast.success('Company deleted successfully');
            },
            onError: (errors) => {
                setDeleteDialogOpen(false);
                if (errors.company) {
                    toast.error(errors.company);
                } else {
                    toast.error('Failed to delete company');
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Company Management - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Company Management
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Manage all companies in the system
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                    </Button>
                </div>

                {/* Search & Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t(
                                        'admin.companies.search_placeholder',
                                    )}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={planFilter || 'all'}
                                onValueChange={handlePlanFilterChange}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue
                                        placeholder={t(
                                            'admin.companies.filter_by_plan',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('admin.companies.all_plans')}
                                    </SelectItem>
                                    {availablePlans.map((plan) => (
                                        <SelectItem key={plan} value={plan}>
                                            {plan.charAt(0).toUpperCase() +
                                                plan.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit">{t('common.search')}</Button>
                            {(filters.search || filters.plan) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setPlanFilter('');
                                        router.get('/admin/companies');
                                    }}
                                >
                                    {t('common.clear')}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Companies Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {t('admin.companies.title')} ({companies.total})
                        </CardTitle>
                        <CardDescription>
                            {t('admin.companies.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t('admin.companies.name')}
                                    </TableHead>
                                    <TableHead>
                                        {t('admin.companies.plan')}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <Users className="mr-1 inline h-4 w-4" />
                                        {t('admin.companies.users')}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        <Boxes className="mr-1 inline h-4 w-4" />
                                        {t('admin.companies.machines')}
                                    </TableHead>
                                    <TableHead>
                                        {t('admin.companies.created')}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t('common.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companies.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            {t('admin.companies.no_companies')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    companies.data.map((company) => (
                                        <TableRow key={company.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/admin/companies/${company.id}`}
                                                    className="hover:underline"
                                                >
                                                    {company.name}
                                                </Link>
                                                {company.email && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {company.email}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getPlanBadgeVariant(
                                                        company.plan || 'basic',
                                                    )}
                                                >
                                                    {(company.plan || 'basic')
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        (
                                                            company.plan ||
                                                            'basic'
                                                        ).slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {company.users_count || 0}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {company.machines_count || 0}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    company.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/companies/${company.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleImpersonate(
                                                                company,
                                                            )
                                                        }
                                                        title={t(
                                                            'admin.impersonation.impersonate',
                                                        )}
                                                    >
                                                        <UserCog className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(company)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                company,
                                                            )
                                                        }
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {companies.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {companies.data.length} of{' '}
                                    {companies.total} companies
                                </div>
                                <div className="flex gap-2">
                                    {companies.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/admin/companies?page=${companies.current_page - 1}`,
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {companies.current_page <
                                        companies.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/admin/companies?page=${companies.current_page + 1}`,
                                                )
                                            }
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Create Company</DialogTitle>
                            <DialogDescription>
                                Add a new company to the system
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">
                                    Company Name *
                                </Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Acme Manufacturing"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-email">Email</Label>
                                <Input
                                    id="create-email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="contact@acme.com"
                                />
                                {createForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-phone">Phone</Label>
                                <Input
                                    id="create-phone"
                                    value={createForm.data.phone}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+1 (555) 123-4567"
                                />
                                {createForm.errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-address">Address</Label>
                                <Input
                                    id="create-address"
                                    value={createForm.data.address}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="123 Factory Street, Industrial Park"
                                />
                                {createForm.errors.address && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing
                                    ? 'Creating...'
                                    : 'Create Company'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Company</DialogTitle>
                            <DialogDescription>
                                Update company information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                    Company Name *
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="Acme Manufacturing"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="contact@acme.com"
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                    id="edit-phone"
                                    value={editForm.data.phone}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+1 (555) 123-4567"
                                />
                                {editForm.errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Input
                                    id="edit-address"
                                    value={editForm.data.address}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="123 Factory Street, Industrial Park"
                                />
                                {editForm.errors.address && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Updating...'
                                    : 'Update Company'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <strong>{selectedCompany?.name}</strong>.
                            {selectedCompany?.users_count &&
                            selectedCompany.users_count > 0 ? (
                                <span className="mt-2 block font-medium text-destructive">
                                    Warning: This company has{' '}
                                    {selectedCompany.users_count} user(s).
                                    Deletion will fail if users exist.
                                </span>
                            ) : (
                                <span className="mt-2 block">
                                    This action cannot be undone.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
