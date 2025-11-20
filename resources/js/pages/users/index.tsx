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
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Edit,
    Inbox,
    Mail,
    Plus,
    Save,
    Shield,
    Trash2,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'operator' | 'technician' | 'manager';
    created_at: string;
}

interface Props {
    users: UserData[];
}

export default function UsersIndex({ users }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'technician' as 'operator' | 'technician' | 'manager',
        password: '',
        password_confirmation: '',
    });

    const { delete: destroy, processing: deleting } = useForm();

    const openCreateDialog = () => {
        reset();
        setEditingUser(null);
        setShowDialog(true);
    };

    const openEditDialog = (user: UserData) => {
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setEditingUser(user);
        setShowDialog(true);
    };

    const openDeleteDialog = (user: UserData) => {
        setDeletingUser(user);
        setShowDeleteDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setShowDialog(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingUser) return;

        destroy(`/users/${deletingUser.id}`, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeletingUser(null);
            },
        });
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<
            string,
            { variant: any; label: string; color: string }
        > = {
            manager: {
                variant: 'default',
                label: 'Manager',
                color: 'bg-purple-100 text-purple-800',
            },
            technician: {
                variant: 'secondary',
                label: 'Technician',
                color: 'bg-blue-100 text-blue-800',
            },
            operator: {
                variant: 'outline',
                label: 'Operator',
                color: 'bg-gray-100 text-gray-800',
            },
        };

        const config = variants[role] || variants.operator;
        return (
            <Badge className={config.color} variant="outline">
                {config.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Users
                        </h1>
                        <p className="text-muted-foreground">
                            Manage team members and their roles
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Users List */}
                {users.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No users yet
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                Add team members to get started
                            </p>
                            <Button onClick={openCreateDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {user.name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {getRoleBadge(user.role)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    <div className="mb-4 text-xs text-muted-foreground">
                                        Added{' '}
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => openEditDialog(user)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => openDeleteDialog(user)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Add User'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? 'Update user details and role'
                                : 'Create a new user account for your team'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Full Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., John Doe"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="bg-background"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="bg-background"
                                />
                                {errors.email && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Role{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value: any) =>
                                        setData('role', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="role"
                                        className="bg-background"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operator">
                                            Operator - Report breakdowns only
                                        </SelectItem>
                                        <SelectItem value="technician">
                                            Technician - Complete work orders
                                        </SelectItem>
                                        <SelectItem value="manager">
                                            Manager - Full access
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password{' '}
                                    {!editingUser && (
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    )}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={
                                        editingUser
                                            ? 'Leave blank to keep current password'
                                            : 'Enter password'
                                    }
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="bg-background"
                                />
                                {errors.password && (
                                    <p className="flex items-center gap-1 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            {data.password && (
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="bg-background"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.name ||
                                    !data.email ||
                                    !data.role ||
                                    (!editingUser && !data.password)
                                }
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Saving...'
                                    : editingUser
                                      ? 'Update'
                                      : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingUser?.name}
                            "? This action cannot be undone. All work orders
                            created or assigned to this user will remain but will
                            show as unassigned.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
