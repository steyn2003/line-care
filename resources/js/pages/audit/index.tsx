import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    Clock,
    Edit,
    ExternalLink,
    FileText,
    Filter,
    Plus,
    RefreshCw,
    Trash2,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AuditLogEntry {
    id: number;
    action: string;
    action_label: string;
    model_type: string;
    model_name: string;
    model_id: number | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    changes_summary: string | null;
    user: {
        id: number;
        name: string;
    } | null;
    ip_address: string | null;
    created_at: string;
}

interface FilterOption {
    value: string;
    label: string;
}

interface UserOption {
    id: number;
    name: string;
}

interface Props {
    logs: {
        data: AuditLogEntry[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        model_type?: string;
        model_id?: string;
        user_id?: string;
        action?: string;
        date_from?: string;
        date_to?: string;
    };
    modelTypes: FilterOption[];
    actions: FilterOption[];
    users: UserOption[];
}

function getActionIcon(action: string) {
    if (action.includes('created')) return Plus;
    if (action.includes('updated')) return Edit;
    if (action.includes('deleted')) return Trash2;
    if (action.includes('status_changed')) return RefreshCw;
    if (action.includes('assigned')) return UserCheck;
    if (action.includes('completed')) return Check;
    return FileText;
}

function getActionBadgeVariant(
    action: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (action.includes('created')) return 'default';
    if (action.includes('deleted')) return 'destructive';
    if (action.includes('status_changed')) return 'secondary';
    return 'outline';
}

function getModelRoute(modelName: string, modelId: number | null): string | null {
    if (!modelId) return null;

    const routes: Record<string, string> = {
        WorkOrder: `/work-orders/${modelId}`,
        Machine: `/machines/${modelId}`,
        SparePart: `/spare-parts/${modelId}`,
        PurchaseOrder: `/purchase-orders/${modelId}`,
        PreventiveTask: `/preventive/${modelId}`,
        User: `/settings/users`,
        Location: `/locations/${modelId}`,
        Supplier: `/suppliers/${modelId}`,
    };

    return routes[modelName] || null;
}

export default function AuditIndex({
    logs,
    filters,
    modelTypes,
    actions,
    users,
}: Props) {
    const { t } = useTranslation();
    const [localFilters, setLocalFilters] = useState(filters);
    const [showFilters, setShowFilters] = useState(
        Object.values(filters).some((v) => v),
    );

    const applyFilters = () => {
        router.get('/audit', localFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/audit', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <AppLayout>
            <Head title={t('audit.title')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('audit.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('audit.description')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        {t('audit.filters')}
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-2">
                                {
                                    Object.values(filters).filter((v) => v)
                                        .length
                                }
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {t('audit.filter_logs')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                                <div className="space-y-2">
                                    <Label>{t('audit.model_type')}</Label>
                                    <Select
                                        value={localFilters.model_type || ''}
                                        onValueChange={(v) =>
                                            setLocalFilters({
                                                ...localFilters,
                                                model_type:
                                                    v === 'all' ? undefined : v,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t('audit.all')}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('audit.all')}
                                            </SelectItem>
                                            {modelTypes.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('audit.action')}</Label>
                                    <Select
                                        value={localFilters.action || ''}
                                        onValueChange={(v) =>
                                            setLocalFilters({
                                                ...localFilters,
                                                action:
                                                    v === 'all' ? undefined : v,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t('audit.all')}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('audit.all')}
                                            </SelectItem>
                                            {actions.map((action) => (
                                                <SelectItem
                                                    key={action.value}
                                                    value={action.value}
                                                >
                                                    {action.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('audit.user')}</Label>
                                    <Select
                                        value={localFilters.user_id || ''}
                                        onValueChange={(v) =>
                                            setLocalFilters({
                                                ...localFilters,
                                                user_id:
                                                    v === 'all' ? undefined : v,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t('audit.all')}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('audit.all')}
                                            </SelectItem>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={String(user.id)}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('audit.date_from')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_from || ''}
                                        onChange={(e) =>
                                            setLocalFilters({
                                                ...localFilters,
                                                date_from:
                                                    e.target.value || undefined,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('audit.date_to')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_to || ''}
                                        onChange={(e) =>
                                            setLocalFilters({
                                                ...localFilters,
                                                date_to:
                                                    e.target.value || undefined,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-end gap-2">
                                    <Button onClick={applyFilters}>
                                        {t('audit.apply')}
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            onClick={clearFilters}
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            {t('audit.clear')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Audit Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            {t('audit.logs')} ({logs.total})
                        </CardTitle>
                        <CardDescription>
                            {t('audit.logs_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('audit.timestamp')}</TableHead>
                                    <TableHead>{t('audit.action')}</TableHead>
                                    <TableHead>{t('audit.resource')}</TableHead>
                                    <TableHead>{t('audit.changes')}</TableHead>
                                    <TableHead>{t('audit.user')}</TableHead>
                                    <TableHead>{t('audit.ip')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            {t('audit.no_logs')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => {
                                        const Icon = getActionIcon(log.action);
                                        const route = getModelRoute(
                                            log.model_name,
                                            log.model_id,
                                        );

                                        return (
                                            <TableRow key={log.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="text-sm">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getActionBadgeVariant(
                                                            log.action,
                                                        )}
                                                        className="gap-1"
                                                    >
                                                        <Icon className="h-3 w-3" />
                                                        {log.action_label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {log.model_name}
                                                        </span>
                                                        {log.model_id && (
                                                            <span className="text-muted-foreground">
                                                                #{log.model_id}
                                                            </span>
                                                        )}
                                                        {route && (
                                                            <Link
                                                                href={route}
                                                                className="text-primary hover:underline"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                                                    {log.changes_summary ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {log.user ? (
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {log.user.name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            System
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {log.ip_address || '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {t('audit.showing')} {logs.data.length}{' '}
                                    {t('audit.of')} {logs.total}{' '}
                                    {t('audit.entries')}
                                </div>
                                <div className="flex gap-2">
                                    {logs.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/audit?page=${logs.current_page - 1}`,
                                                    filters,
                                                )
                                            }
                                        >
                                            {t('pagination.previous')}
                                        </Button>
                                    )}
                                    {logs.current_page < logs.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    `/audit?page=${logs.current_page + 1}`,
                                                    filters,
                                                )
                                            }
                                        >
                                            {t('pagination.next')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
