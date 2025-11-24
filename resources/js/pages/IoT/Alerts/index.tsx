import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Filter } from 'lucide-react';

interface SensorAlert {
    id: number;
    sensor: {
        id: number;
        name: string;
        type: string;
        unit: string | null;
    };
    machine: {
        id: number;
        name: string;
    };
    reading_value: number;
    threshold_type: 'warning' | 'critical';
    threshold_value: number;
    acknowledged_at: string | null;
    acknowledged_by: {
        id: number;
        name: string;
    } | null;
    created_at: string;
}

interface PaginatedAlerts {
    data: SensorAlert[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface SensorAlertIndexProps {
    alerts: PaginatedAlerts;
    filters: {
        status: string | null;
        threshold_type: string | null;
        machine_id: string | null;
    };
    machines: Array<{
        id: number;
        name: string;
    }>;
}

export default function Index({
    alerts,
    filters,
    machines,
}: SensorAlertIndexProps) {
    const handleAcknowledge = (alertId: number) => {
        router.post(
            `/sensor-alerts/${alertId}/acknowledge`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (key: string, value: string | null) => {
        router.get(
            '/sensor-alerts',
            {
                ...filters,
                [key]: value === 'all' ? null : value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getSensorTypeLabel = (type: string) => {
        return type
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getThresholdBadge = (type: string) => {
        return type === 'critical' ? (
            <Badge className="border-red-200 bg-red-100 text-red-800">
                Critical
            </Badge>
        ) : (
            <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
                Warning
            </Badge>
        );
    };

    const unacknowledgedCount = alerts.data.filter(
        (a) => !a.acknowledged_at,
    ).length;

    return (
        <AppLayout
            title="Sensor Alerts"
            renderHeader={() => (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Sensor Alerts
                            </h2>
                            <p className="text-sm text-gray-600">
                                {unacknowledgedCount > 0
                                    ? `${unacknowledgedCount} unacknowledged alert${unacknowledgedCount !== 1 ? 's' : ''}`
                                    : 'All alerts acknowledged'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        >
            <Head title="Sensor Alerts" />

            <div className="space-y-6">
                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Status
                                    </label>
                                    <Select
                                        value={filters.status || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="unacknowledged">
                                                Unacknowledged Only
                                            </SelectItem>
                                            <SelectItem value="acknowledged">
                                                Acknowledged Only
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Severity
                                    </label>
                                    <Select
                                        value={filters.threshold_type || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                'threshold_type',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="critical">
                                                Critical Only
                                            </SelectItem>
                                            <SelectItem value="warning">
                                                Warning Only
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Machine
                                    </label>
                                    <Select
                                        value={filters.machine_id || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                'machine_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Machines
                                            </SelectItem>
                                            {machines.map((machine) => (
                                                <SelectItem
                                                    key={machine.id}
                                                    value={machine.id.toString()}
                                                >
                                                    {machine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts List */}
                {alerts.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No alerts
                            </h3>
                            <p className="text-gray-600">
                                {filters.status ||
                                filters.threshold_type ||
                                filters.machine_id
                                    ? 'No alerts match your filters.'
                                    : 'All systems operating normally. No sensor alerts.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {alerts.data.map((alert) => (
                            <Card
                                key={alert.id}
                                className={`transition-colors ${
                                    !alert.acknowledged_at
                                        ? alert.threshold_type === 'critical'
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-yellow-300 bg-yellow-50'
                                        : ''
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">
                                            {alert.threshold_type === 'critical'
                                                ? '🔴'
                                                : '⚠️'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <h3 className="font-medium text-gray-900">
                                                            {alert.machine.name}{' '}
                                                            -{' '}
                                                            {alert.sensor.name}
                                                        </h3>
                                                        {getThresholdBadge(
                                                            alert.threshold_type,
                                                        )}
                                                        {alert.acknowledged_at && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-green-300 bg-green-50 text-green-700"
                                                            >
                                                                Acknowledged
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="mb-3 space-y-1">
                                                        <p className="text-sm text-gray-700">
                                                            <strong>
                                                                {getSensorTypeLabel(
                                                                    alert.sensor
                                                                        .type,
                                                                )}
                                                            </strong>{' '}
                                                            reading exceeded{' '}
                                                            {
                                                                alert.threshold_type
                                                            }{' '}
                                                            threshold
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-gray-600">
                                                                Reading:{' '}
                                                                <strong
                                                                    className={
                                                                        alert.threshold_type ===
                                                                        'critical'
                                                                            ? 'text-red-700'
                                                                            : 'text-yellow-700'
                                                                    }
                                                                >
                                                                    {
                                                                        alert.reading_value
                                                                    }
                                                                    {alert
                                                                        .sensor
                                                                        .unit &&
                                                                        ` ${alert.sensor.unit}`}
                                                                </strong>
                                                            </span>
                                                            <span className="text-gray-400">
                                                                •
                                                            </span>
                                                            <span className="text-gray-600">
                                                                Threshold:{' '}
                                                                <strong>
                                                                    {
                                                                        alert.threshold_value
                                                                    }
                                                                </strong>
                                                                {alert.sensor
                                                                    .unit &&
                                                                    ` ${alert.sensor.unit}`}
                                                            </span>
                                                            <span className="text-gray-400">
                                                                •
                                                            </span>
                                                            <span className="text-gray-600">
                                                                Exceeded by:{' '}
                                                                <strong>
                                                                    {(
                                                                        ((alert.reading_value -
                                                                            alert.threshold_value) /
                                                                            alert.threshold_value) *
                                                                        100
                                                                    ).toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-500">
                                                            Alert triggered:{' '}
                                                            {new Date(
                                                                alert.created_at,
                                                            ).toLocaleString()}
                                                        </p>
                                                        {alert.acknowledged_at &&
                                                            alert.acknowledged_by && (
                                                                <p className="text-xs text-green-700">
                                                                    Acknowledged
                                                                    by{' '}
                                                                    {
                                                                        alert
                                                                            .acknowledged_by
                                                                            .name
                                                                    }{' '}
                                                                    on{' '}
                                                                    {new Date(
                                                                        alert.acknowledged_at,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>
                                                {!alert.acknowledged_at && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAcknowledge(
                                                                alert.id,
                                                            )
                                                        }
                                                        className="shrink-0"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Acknowledge
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex gap-2 border-t pt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/sensors/${alert.sensor.id}/edit`,
                                                        )
                                                    }
                                                >
                                                    View Sensor
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/machines/${alert.machine.id}`,
                                                        )
                                                    }
                                                >
                                                    View Machine
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {alerts.last_page > 1 && (
                    <Pagination
                        currentPage={alerts.current_page}
                        lastPage={alerts.last_page}
                        total={alerts.total}
                        perPage={alerts.per_page}
                        onPageChange={(page) => {
                            router.get(
                                '/sensor-alerts',
                                {
                                    ...filters,
                                    page,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
