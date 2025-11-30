import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    Download,
    Inbox,
    MapPin,
    Pencil,
    Printer,
    QrCode,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Location {
    id: number;
    name: string;
}

interface Machine {
    id: number;
    name: string;
    code: string | null;
    location: Location | null;
    criticality: 'low' | 'medium' | 'high';
    status: 'active' | 'archived';
    qr_token: string | null;
    created_at: string;
}

interface WorkOrder {
    id: number;
    title: string;
    type: 'breakdown' | 'preventive';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
}

interface Analytics {
    breakdown_count: number;
    preventive_count: number;
    total_downtime_minutes: number;
    avg_resolution_time_minutes: number;
    breakdowns_by_cause: Array<{ cause: string; count: number }>;
}

interface Props {
    machine: Machine;
    work_orders: WorkOrder[];
    analytics: Analytics;
}

const criticalityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const typeColors = {
    breakdown: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    preventive: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const workOrderStatusColors = {
    open: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    in_progress:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function MachineShow({
    machine,
    work_orders,
    analytics,
}: Props) {
    const { t } = useTranslation('machines');

    const handleEdit = () => {
        router.visit(`/machines/${machine.id}/edit`);
    };

    const handleReportBreakdown = () => {
        router.visit(`/work-orders/report-breakdown?machine_id=${machine.id}`);
    };

    return (
        <AppLayout>
            <Head title={machine.name} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/machines')}
                                className="text-muted-foreground"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('show.back_to_machines')}
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {machine.name}
                        </h1>
                        {machine.code && (
                            <p className="font-mono text-muted-foreground">
                                {machine.code}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('show.edit')}
                        </Button>
                        <Button onClick={handleReportBreakdown}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            {t('show.report_breakdown')}
                        </Button>
                    </div>
                </div>

                {/* Machine Info */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>{t('show.machine_details')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t('show.status')}
                                </span>
                                <div className="mt-1">
                                    <Badge
                                        className={statusColors[machine.status]}
                                    >
                                        {t(`show.status_${machine.status}`)}
                                    </Badge>
                                </div>
                            </div>
                            {machine.location && (
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {t('show.location')}
                                    </span>
                                    <div className="mt-1 flex items-center text-sm text-foreground">
                                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {machine.location.name}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t('show.criticality')}
                                </span>
                                <div className="mt-1">
                                    <Badge
                                        className={
                                            criticalityColors[
                                                machine.criticality
                                            ]
                                        }
                                    >
                                        {t(
                                            `show.criticality_${machine.criticality}`,
                                        )}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t('show.added')}
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                    {new Date(
                                        machine.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Code Section */}
                {machine.qr_token && (
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5" />
                                {t('show.qr_code', 'QR Code')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'show.qr_description',
                                    'Scan this QR code to quickly report a breakdown for this machine',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                            <div className="rounded-lg border bg-white p-2">
                                <img
                                    src={`/machines/${machine.id}/qr-image`}
                                    alt={t(
                                        'show.qr_alt',
                                        'QR code for {{name}}',
                                        { name: machine.name },
                                    )}
                                    className="h-40 w-40"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        'show.qr_instructions',
                                        'Print this QR code and attach it to the machine. Operators can scan it to instantly report breakdowns.',
                                    )}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`/machines/${machine.id}/qr-download`}
                                            download
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            {t('show.download_qr', 'Download')}
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={`/machines/${machine.id}/qr-print`}
                                            target="_blank"
                                        >
                                            <Printer className="mr-2 h-4 w-4" />
                                            {t(
                                                'show.print_label',
                                                'Print Label',
                                            )}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Analytics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>
                                {t('show.breakdowns_90d')}
                            </CardDescription>
                            <CardTitle className="text-3xl text-destructive">
                                {analytics.breakdown_count}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>
                                {t('show.preventive_90d')}
                            </CardDescription>
                            <CardTitle className="text-3xl text-primary">
                                {analytics.preventive_count}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>
                                {t('show.total_downtime')}
                            </CardDescription>
                            <CardTitle className="text-3xl text-foreground">
                                {Math.round(
                                    analytics.total_downtime_minutes / 60,
                                )}
                                h
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {t('show.minutes', {
                                    count: analytics.total_downtime_minutes,
                                })}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardDescription>
                                {t('show.avg_resolution')}
                            </CardDescription>
                            <CardTitle className="text-3xl text-foreground">
                                {Math.round(
                                    analytics.avg_resolution_time_minutes,
                                )}
                                m
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Breakdowns by Cause */}
                {analytics.breakdowns_by_cause.length > 0 && (
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>
                                {t('show.breakdowns_by_cause')}
                            </CardTitle>
                            <CardDescription>
                                {t('show.common_failure_categories')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analytics.breakdowns_by_cause.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-sm text-foreground">
                                                {item.cause}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="border-border"
                                            >
                                                {item.count}
                                            </Badge>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Work Orders */}
                <Card className="border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    {t('show.recent_work_orders')}
                                </CardTitle>
                                <CardDescription>
                                    {t('show.last_10_work_orders')}
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/work-orders?machine_id=${machine.id}`}
                                >
                                    {t('show.view_all')}
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {work_orders.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Inbox className="mx-auto mb-2 h-12 w-12" />
                                <p>{t('show.no_work_orders')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {work_orders.map((wo) => (
                                    <div
                                        key={wo.id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                                        onClick={() =>
                                            router.visit(
                                                `/work-orders/${wo.id}`,
                                            )
                                        }
                                    >
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <Badge
                                                    className={
                                                        typeColors[wo.type]
                                                    }
                                                >
                                                    {t(`show.type_${wo.type}`)}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        workOrderStatusColors[
                                                            wo.status
                                                        ]
                                                    }
                                                >
                                                    {t(
                                                        `show.wo_status_${wo.status}`,
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {wo.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    wo.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
