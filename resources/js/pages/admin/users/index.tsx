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
    Building2,
    Edit,
    Filter,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Company {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company_id: number;
    company: Company;
    created_at: string;
}

interface RoleOption {
    value: string;
    label: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    companies: Company[];
    roles: RoleOption[];
    filters: {
        search?: string;
        company_id?: number;
        role?: string;
    };
}

export default function UsersIndex({
    users,
    companies,
    roles,
    filters,
}: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [companyFilter, setCompanyFilter] = useState(
        filters.company_id?.toString() || '',
    );
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const createForm = useForm({
        company_id: '',
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const editForm = useForm({
        company_id: '',
        name: '',
        email: '',
        role: '',
        password: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            {
                search: searchQuery,
                company_id: companyFilter || undefined,
                role: roleFilter || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setCompanyFilter('');
        setRoleFilter('');
        router.get('/admin/users');
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                setCreateDialogOpen(false);
                createForm.reset();
                toast.success('User created successfully');
            },
            onError: () => {
                toast.error('Failed to create user');
            },
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            company_id: user.company_id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
        setEditDialogOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        editForm.put(`/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDialogOpen(false);
                setSelectedUser(null);
                editForm.reset();
                toast.success('User updated successfully');
            },
            onError: () => {
                toast.error('Failed to update user');
            },
        });
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;

        router.delete(`/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedUser(null);
                toast.success('User deleted successfully');
            },
            onError: (errors) => {
                setDeleteDialogOpen(false);
                if (errors.user) {
                    toast.error(errors.user);
                } else {
                    toast.error('Failed to delete user');
                }
            },
        });
    };

    const getRoleBadgeVariant = (
        role: string,
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (role) {
            case 'manager':
                return 'default';
            case 'technician':
                return 'secondary';
            case 'operator':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const hasActiveFilters =
        filters.search || filters.company_id || filters.role;

    return (
        <AppLayout>
            <Head title="User Management - Admin" />

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
                                User Management
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Manage users across all companies
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Select
                                    value={companyFilter}
                                    onValueChange={setCompanyFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Companies" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem
                                                key={company.id}
                                                value={company.id.toString()}
                                            >
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={roleFilter}
                                    onValueChange={setRoleFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Apply Filters
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users ({users.total})
                        </CardTitle>
                        <CardDescription>
                            All users in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>
                                        <Building2 className="mr-1 inline h-4 w-4" />
                                        Company
                                    </TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.company.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getRoleBadgeVariant(
                                                        user.role,
                                                    )}
                                                >
                                                    {roles.find(
                                                        (r) =>
                                                            r.value ===
                                                            user.role,
                                                    )?.label || user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(user)
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
                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.data.length} of {users.total}{' '}
                                    users
                                </div>
                                <div className="flex gap-2">
                                    {users.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/admin/users?page=${users.current_page - 1}`,
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {users.current_page < users.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/admin/users?page=${users.current_page + 1}`,
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
                            <DialogTitle>Create User</DialogTitle>
                            <DialogDescription>
                                Add a new user to the system
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-company">
                                    Company *
                                </Label>
                                <Select
                                    value={createForm.data.company_id}
                                    onValueChange={(value) =>
                                        createForm.setData('company_id', value)
                                    }
                                >
                                    <SelectTrigger id="create-company">
                                        <SelectValue placeholder="Select company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem
                                                key={company.id}
                                                value={company.id.toString()}
                                            >
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.company_id && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.company_id}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Name *</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="John Doe"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-email">Email *</Label>
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
                                    placeholder="john@example.com"
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-password">
                                    Password *
                                </Label>
                                <Input
                                    id="create-password"
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                                {createForm.errors.password && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-role">Role *</Label>
                                <Select
                                    value={createForm.data.role}
                                    onValueChange={(value) =>
                                        createForm.setData('role', value)
                                    }
                                >
                                    <SelectTrigger id="create-role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.role && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.role}
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
                                    : 'Create User'}
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
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Update user information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-company">Company *</Label>
                                <Select
                                    value={editForm.data.company_id}
                                    onValueChange={(value) =>
                                        editForm.setData('company_id', value)
                                    }
                                >
                                    <SelectTrigger id="edit-company">
                                        <SelectValue placeholder="Select company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem
                                                key={company.id}
                                                value={company.id.toString()}
                                            >
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.company_id && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.company_id}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    placeholder="John Doe"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email *</Label>
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
                                    placeholder="john@example.com"
                                    required
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">Password</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Leave blank to keep current password"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep current password
                                </p>
                                {editForm.errors.password && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role *</Label>
                                <Select
                                    value={editForm.data.role}
                                    onValueChange={(value) =>
                                        editForm.setData('role', value)
                                    }
                                >
                                    <SelectTrigger id="edit-role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.role && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.role}
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
                                    : 'Update User'}
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
                            <strong>{selectedUser?.name}</strong> from{' '}
                            {selectedUser?.company.name}.
                            <span className="mt-2 block font-medium text-destructive">
                                This action cannot be undone.
                            </span>
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
