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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Cpu,
    Eye,
    MapPin,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, parseISO, differenceInHours, differenceInDays } from 'date-fns';

interface Machine {
    id: number;
    name: string;
    code: string;
}

interface Location {
    id: number;
    name: string;
}

interface Shutdown {
    id: number;
    name: string;
    description: string | null;
    machine: Machine | null;
    location: Location;
    start_at: string;
    end_at: string;
    shutdown_type: string;
    status: string;
    creator: { id: number; name: string };
    created_at: string;
}

interface Props {
    shutdowns: {
        data: Shutdown[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
    };
    locations: Location[];
    machines: Machine[];
    shutdown_types: Array<{ value: string; label: string }>;
    shutdown_statuses: Array<{ value: string; label: string }>;
    filters: {
        status?: string;
        location_id?: number;
        machine_id?: number;
        date_from?: string;
        date_to?: string;
    };
    user: {
        id: number;
        role: string;
    };
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const typeColors: Record<string, string> = {
    planned_maintenance: 'bg-purple-100 text-purple-800 border-purple-200',
    changeover: 'bg-orange-100 text-orange-800 border-orange-200',
    holiday: 'bg-teal-100 text-teal-800 border-teal-200',
};

export default function ShutdownsIndex({
    shutdowns,
    locations,
    machines,
    shutdown_types,
    shutdown_statuses,
    filters,
    user,
}: Props) {
    const { t } = useTranslation();
    const canEdit = user.role !== 'operator';

    const handleFilterChange = (key: string, value: string | undefined) => {
        router.get(
            '/planning/shutdowns',
            {
                ...filters,
                [key]: value === 'all' ? undefined : value,
            },
            { preserveState: true },
        );
    };

    const formatDuration = (startAt: string, endAt: string) => {
        const start = parseISO(startAt);
        const end = parseISO(endAt);
        const days = differenceInDays(end, start);
        const hours = differenceInHours(end, start) % 24;

        if (days > 0) {
            return `${days}d ${hours}h`;
        }
        return `${hours}h`;
    };

    const handleDelete = (shutdown: Shutdown) => {
        if (confirm(t('planning.shutdowns.confirm_delete', 'Are you sure you want to delete this shutdown?'))) {
            router.delete(`/planning/shutdowns/${shutdown.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={t('planning.shutdowns.title', 'Planned Shutdowns')} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/planning')}
                            className="mb-2 text-muted-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('planning.back_to_board', 'Back to Planning Board')}
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('planning.shutdowns.title', 'Planned Shutdowns')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('planning.shutdowns.subtitle', 'Manage planned maintenance windows and shutdowns')}
                        </p>
                    </div>
                    {canEdit && (
                        <Button asChild>
                            <Link href="/planning/shutdowns/create">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('planning.shutdowns.create', 'Plan Shutdown')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('common.filters', 'Filters')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('planning.shutdowns.filter_status', 'Filter by status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all_statuses', 'All Statuses')}</SelectItem>
                                    {shutdown_statuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.location_id?.toString() || 'all'}
                                onValueChange={(value) => handleFilterChange('location_id', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('planning.shutdowns.filter_location', 'Filter by location')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all_locations', 'All Locations')}</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={location.id.toString()}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.machine_id?.toString() || 'all'}
                                onValueChange={(value) => handleFilterChange('machine_id', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('planning.shutdowns.filter_machine', 'Filter by machine')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all_machines', 'All Machines')}</SelectItem>
                                    {machines.map((machine) => (
                                        <SelectItem key={machine.id} value={machine.id.toString()}>
                                            {machine.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="w-[150px]"
                                />
                                <span className="text-muted-foreground">-</span>
                                <Input
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shutdowns Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('planning.shutdowns.list', 'Shutdowns')}</CardTitle>
                        <CardDescription>
                            {t('planning.shutdowns.list_description', 'View and manage all planned shutdowns')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {shutdowns.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">
                                    {t('planning.shutdowns.no_shutdowns', 'No shutdowns found')}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t('planning.shutdowns.no_shutdowns_description', 'Get started by planning a new shutdown.')}
                                </p>
                                {canEdit && (
                                    <Button asChild className="mt-4">
                                        <Link href="/planning/shutdowns/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            {t('planning.shutdowns.create', 'Plan Shutdown')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('common.name', 'Name')}</TableHead>
                                        <TableHead>{t('planning.type', 'Type')}</TableHead>
                                        <TableHead>{t('planning.machine', 'Machine')}</TableHead>
                                        <TableHead>{t('planning.location', 'Location')}</TableHead>
                                        <TableHead>{t('planning.schedule', 'Schedule')}</TableHead>
                                        <TableHead>{t('planning.duration', 'Duration')}</TableHead>
                                        <TableHead>{t('planning.status', 'Status')}</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shutdowns.data.map((shutdown) => (
                                        <TableRow key={shutdown.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/planning/shutdowns/${shutdown.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {shutdown.name}
                                                </Link>
                                                {shutdown.description && (
                                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                                        {shutdown.description}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={typeColors[shutdown.shutdown_type] || 'bg-gray-100'}>
                                                    {shutdown_types.find(t => t.value === shutdown.shutdown_type)?.label || shutdown.shutdown_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {shutdown.machine ? (
                                                    <div className="flex items-center gap-1">
                                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                                        <span>{shutdown.machine.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        {t('planning.shutdowns.all_machines', 'All machines')}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{shutdown.location.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(parseISO(shutdown.start_at), 'MMM d, yyyy HH:mm')}</div>
                                                    <div className="text-muted-foreground">
                                                        {format(parseISO(shutdown.end_at), 'MMM d, yyyy HH:mm')}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{formatDuration(shutdown.start_at, shutdown.end_at)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[shutdown.status] || 'bg-gray-100'}>
                                                    {shutdown_statuses.find(s => s.value === shutdown.status)?.label || shutdown.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/planning/shutdowns/${shutdown.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {t('common.view', 'View')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {canEdit && (
                                                            <>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/planning/shutdowns/${shutdown.id}/edit`}>
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        {t('common.edit', 'Edit')}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDelete(shutdown)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    {t('common.delete', 'Delete')}
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination */}
                        {shutdowns.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {shutdowns.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
