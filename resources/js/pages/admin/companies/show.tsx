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
import { Switch } from '@/components/ui/switch';
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
    Check,
    ClipboardList,
    Edit,
    Mail,
    MapPin,
    Phone,
    Settings,
    UserCog,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface CompanyUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    plan: string;
    feature_flags: Record<string, boolean> | null;
    is_trial: boolean;
    trial_ends_at: string | null;
    is_demo: boolean;
    industry: string | null;
    company_size: string | null;
    created_at: string;
    updated_at: string;
    users_count: number;
    machines_count: number;
    work_orders_count: number;
    locations_count: number;
    users: CompanyUser[];
}

interface FeatureInfo {
    key: string;
    enabled: boolean;
    name: string;
    description: string;
}

interface FeatureDefinition {
    name: string;
    description: string;
}

interface Props {
    company: Company;
    featureSummary: Record<string, FeatureInfo>;
    availablePlans: string[];
    featureDefinitions: Record<string, FeatureDefinition>;
}

export default function CompanyShow({
    company,
    featureSummary,
    availablePlans,
}: Props) {
    const { t } = useTranslation();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [planDialogOpen, setPlanDialogOpen] = useState(false);
    const [extendTrialDialogOpen, setExtendTrialDialogOpen] = useState(false);
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);

    const extendTrialForm = useForm({
        days: 14,
    });

    const convertForm = useForm({
        plan: 'basic',
    });

    const editForm = useForm({
        name: company.name,
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
    });

    const planForm = useForm({
        plan: company.plan || 'basic',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(`/admin/companies/${company.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDialogOpen(false);
                toast.success(t('admin.companies.updated'));
            },
            onError: () => {
                toast.error(t('admin.companies.update_error'));
            },
        });
    };

    const handlePlanUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        planForm.put(`/admin/companies/${company.id}/plan`, {
            preserveScroll: true,
            onSuccess: () => {
                setPlanDialogOpen(false);
                toast.success(t('admin.companies.plan_updated'));
            },
            onError: () => {
                toast.error(t('admin.companies.plan_update_error'));
            },
        });
    };

    const handleExtendTrial = (e: React.FormEvent) => {
        e.preventDefault();
        extendTrialForm.post(`/admin/companies/${company.id}/extend-trial`, {
            preserveScroll: true,
            onSuccess: () => {
                setExtendTrialDialogOpen(false);
                toast.success(t('admin.companies.trial_extended'));
            },
            onError: () => {
                toast.error(t('admin.companies.trial_extend_error'));
            },
        });
    };

    const handleConvertToPaid = (e: React.FormEvent) => {
        e.preventDefault();
        convertForm.post(`/admin/companies/${company.id}/convert-to-paid`, {
            preserveScroll: true,
            onSuccess: () => {
                setConvertDialogOpen(false);
                toast.success(t('admin.companies.converted_to_paid'));
            },
            onError: () => {
                toast.error(t('admin.companies.convert_error'));
            },
        });
    };

    const handleFeatureToggle = (feature: string, enabled: boolean) => {
        router.put(
            `/admin/companies/${company.id}/features/${feature}`,
            { enabled },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('admin.companies.feature_toggled'));
                },
                onError: () => {
                    toast.error(t('admin.companies.feature_toggle_error'));
                },
            },
        );
    };

    const handleImpersonate = () => {
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

    const features = Object.values(featureSummary);
    const enabledCount = features.filter((f) => f.enabled).length;

    return (
        <AppLayout>
            <Head title={`${company.name} - Admin`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/companies"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {company.name}
                            </h1>
                            <Badge
                                variant={getPlanBadgeVariant(
                                    company.plan || 'basic',
                                )}
                            >
                                {(company.plan || 'basic')
                                    .charAt(0)
                                    .toUpperCase() +
                                    (company.plan || 'basic').slice(1)}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            {t('admin.companies.company_details')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(true)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                        </Button>
                        <Button onClick={handleImpersonate}>
                            <UserCog className="mr-2 h-4 w-4" />
                            {t('admin.impersonation.impersonate')}
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin.companies.users')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {company.users_count}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin.companies.machines')}
                            </CardTitle>
                            <Boxes className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {company.machines_count}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin.companies.work_orders')}
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {company.work_orders_count}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin.companies.locations')}
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {company.locations_count}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Company Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                {t('admin.companies.company_info')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{company.email || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{company.phone || '-'}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <span>{company.address || '-'}</span>
                            </div>
                            {company.industry && (
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{company.industry}</span>
                                </div>
                            )}
                            {company.company_size && (
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {company.company_size}{' '}
                                        {t(
                                            'admin.companies.employees',
                                            'medewerkers',
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className="pt-2 text-sm text-muted-foreground">
                                {t('admin.companies.created_at')}:{' '}
                                {new Date(
                                    company.created_at,
                                ).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trial Management (only shown for trial companies) */}
                    {company.is_trial && (
                        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                    {t(
                                        'admin.companies.trial_management',
                                        'Trial Beheer',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'admin.companies.trial_management_description',
                                        'Beheer de proefperiode van dit bedrijf',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t(
                                            'admin.companies.trial_status',
                                            'Status',
                                        )}
                                        :
                                    </span>
                                    {company.trial_ends_at &&
                                    new Date(company.trial_ends_at) >
                                        new Date() ? (
                                        <Badge
                                            variant="default"
                                            className="bg-amber-500"
                                        >
                                            {t(
                                                'admin.companies.trial_active',
                                                'Actief',
                                            )}
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            {t(
                                                'admin.companies.trial_expired',
                                                'Verlopen',
                                            )}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t(
                                            'admin.companies.trial_ends_at',
                                            'Eindigt op',
                                        )}
                                        :
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {company.trial_ends_at
                                                ? new Date(
                                                      company.trial_ends_at,
                                                  ).toLocaleDateString(
                                                      'nl-NL',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                                {company.trial_ends_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {t(
                                                'admin.companies.days_remaining',
                                                'Dagen over',
                                            )}
                                            :
                                        </span>
                                        <span className="font-medium">
                                            {Math.max(
                                                0,
                                                Math.ceil(
                                                    (new Date(
                                                        company.trial_ends_at,
                                                    ).getTime() -
                                                        new Date().getTime()) /
                                                        (1000 * 60 * 60 * 24),
                                                ),
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setExtendTrialDialogOpen(true)
                                        }
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        {t(
                                            'admin.companies.extend_trial',
                                            'Verleng Trial',
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setConvertDialogOpen(true)
                                        }
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        {t(
                                            'admin.companies.convert_to_paid',
                                            'Activeer Abonnement',
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Plan & Features Summary */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    {t('admin.companies.plan_features')}
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPlanDialogOpen(true)}
                                >
                                    {t('admin.companies.change_plan')}
                                </Button>
                            </div>
                            <CardDescription>
                                {t('admin.companies.features_enabled', {
                                    count: enabledCount,
                                    total: features.length,
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {t('admin.companies.current_plan')}:
                                </span>
                                <Badge
                                    variant={getPlanBadgeVariant(
                                        company.plan || 'basic',
                                    )}
                                >
                                    {(company.plan || 'basic')
                                        .charAt(0)
                                        .toUpperCase() +
                                        (company.plan || 'basic').slice(1)}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature) => (
                                    <Badge
                                        key={feature.key}
                                        variant={
                                            feature.enabled
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="flex items-center gap-1"
                                    >
                                        {feature.enabled ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            <X className="h-3 w-3" />
                                        )}
                                        {feature.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('admin.companies.feature_overrides')}
                        </CardTitle>
                        <CardDescription>
                            {t('admin.companies.feature_overrides_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {features.map((feature) => (
                                <div
                                    key={feature.key}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium">
                                            {feature.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {feature.description}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={feature.enabled}
                                        onCheckedChange={(checked) =>
                                            handleFeatureToggle(
                                                feature.key,
                                                checked,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                {company.users.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {t('admin.companies.recent_users')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.companies.recent_users_description', {
                                    count: company.users_count,
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('admin.users.name')}
                                        </TableHead>
                                        <TableHead>
                                            {t('admin.users.email')}
                                        </TableHead>
                                        <TableHead>
                                            {t('admin.users.role')}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {company.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.post(
                                                            `/admin/users/${user.id}/impersonate`,
                                                        )
                                                    }
                                                >
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {company.users_count > 10 && (
                                <div className="mt-4 text-center">
                                    <Link
                                        href={`/admin/users?company=${company.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {t('admin.companies.view_all_users')}
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>
                                {t('admin.companies.edit_company')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('admin.companies.edit_company_description')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                    {t('admin.companies.name')} *
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">
                                    {t('admin.companies.email')}
                                </Label>
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
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">
                                    {t('admin.companies.phone')}
                                </Label>
                                <Input
                                    id="edit-phone"
                                    value={editForm.data.phone}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'phone',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.phone && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-address">
                                    {t('admin.companies.address')}
                                </Label>
                                <Input
                                    id="edit-address"
                                    value={editForm.data.address}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'address',
                                            e.target.value,
                                        )
                                    }
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
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? t('common.saving')
                                    : t('common.save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Plan Dialog */}
            <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                <DialogContent>
                    <form onSubmit={handlePlanUpdate}>
                        <DialogHeader>
                            <DialogTitle>
                                {t('admin.companies.change_plan')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('admin.companies.change_plan_description')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="plan">
                                    {t('admin.companies.plan')}
                                </Label>
                                <Select
                                    value={planForm.data.plan}
                                    onValueChange={(value) =>
                                        planForm.setData('plan', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePlans.map((plan) => (
                                            <SelectItem key={plan} value={plan}>
                                                {plan.charAt(0).toUpperCase() +
                                                    plan.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {planForm.errors.plan && (
                                    <p className="text-sm text-destructive">
                                        {planForm.errors.plan}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPlanDialogOpen(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={planForm.processing}
                            >
                                {planForm.processing
                                    ? t('common.saving')
                                    : t('admin.companies.update_plan')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Extend Trial Dialog */}
            <Dialog
                open={extendTrialDialogOpen}
                onOpenChange={setExtendTrialDialogOpen}
            >
                <DialogContent>
                    <form onSubmit={handleExtendTrial}>
                        <DialogHeader>
                            <DialogTitle>
                                {t(
                                    'admin.companies.extend_trial',
                                    'Verleng Trial',
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {t(
                                    'admin.companies.extend_trial_description',
                                    'Verleng de proefperiode met een aantal dagen.',
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="extend-days">
                                    {t(
                                        'admin.companies.days_to_extend',
                                        'Aantal dagen',
                                    )}
                                </Label>
                                <Input
                                    id="extend-days"
                                    type="number"
                                    min={1}
                                    max={90}
                                    value={extendTrialForm.data.days}
                                    onChange={(e) =>
                                        extendTrialForm.setData(
                                            'days',
                                            parseInt(e.target.value) || 14,
                                        )
                                    }
                                />
                                {extendTrialForm.errors.days && (
                                    <p className="text-sm text-destructive">
                                        {extendTrialForm.errors.days}
                                    </p>
                                )}
                            </div>
                            {company.trial_ends_at && (
                                <div className="rounded-lg bg-muted p-3 text-sm">
                                    <p className="text-muted-foreground">
                                        {t(
                                            'admin.companies.new_end_date',
                                            'Nieuwe einddatum',
                                        )}
                                        :{' '}
                                        <span className="font-medium text-foreground">
                                            {new Date(
                                                new Date(
                                                    company.trial_ends_at,
                                                ).getTime() +
                                                    extendTrialForm.data.days *
                                                        24 *
                                                        60 *
                                                        60 *
                                                        1000,
                                            ).toLocaleDateString('nl-NL', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setExtendTrialDialogOpen(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={extendTrialForm.processing}
                            >
                                {extendTrialForm.processing
                                    ? t('common.saving')
                                    : t(
                                          'admin.companies.extend_trial',
                                          'Verleng Trial',
                                      )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Convert to Paid Dialog */}
            <Dialog
                open={convertDialogOpen}
                onOpenChange={setConvertDialogOpen}
            >
                <DialogContent>
                    <form onSubmit={handleConvertToPaid}>
                        <DialogHeader>
                            <DialogTitle>
                                {t(
                                    'admin.companies.convert_to_paid',
                                    'Activeer Abonnement',
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {t(
                                    'admin.companies.convert_description',
                                    'Converteer deze trial naar een betaald abonnement.',
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="convert-plan">
                                    {t(
                                        'admin.companies.select_plan',
                                        'Kies abonnement',
                                    )}
                                </Label>
                                <Select
                                    value={convertForm.data.plan}
                                    onValueChange={(value) =>
                                        convertForm.setData('plan', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePlans
                                            .filter((plan) => plan !== 'trial')
                                            .map((plan) => (
                                                <SelectItem
                                                    key={plan}
                                                    value={plan}
                                                >
                                                    {plan
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        plan.slice(1)}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {convertForm.errors.plan && (
                                    <p className="text-sm text-destructive">
                                        {convertForm.errors.plan}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/50">
                                <p className="text-amber-800 dark:text-amber-200">
                                    {t(
                                        'admin.companies.convert_warning',
                                        'Let op: Deze actie verwijdert de trial status en activeert het gekozen abonnement.',
                                    )}
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setConvertDialogOpen(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={convertForm.processing}
                            >
                                {convertForm.processing
                                    ? t('common.saving')
                                    : t(
                                          'admin.companies.activate',
                                          'Activeren',
                                      )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
