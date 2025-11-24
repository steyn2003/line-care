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
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Bell,
    BellOff,
    CheckCircle,
    Droplets,
    Gauge,
    Minus,
    RefreshCw,
    ThermometerSun,
    TrendingDown,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Sensor {
    id: number;
    machine_id: number;
    machine_name: string;
    sensor_type: string;
    name: string;
    unit: string;
    last_reading: number | null;
    last_reading_at: string | null;
    warning_threshold: number | null;
    critical_threshold: number | null;
    is_active: boolean;
    status: 'normal' | 'warning' | 'critical' | 'inactive';
    trend: 'up' | 'down' | 'stable';
}

interface Alert {
    id: number;
    sensor_id: number;
    sensor_name: string;
    machine_name: string;
    alert_type: string;
    triggered_at: string;
    acknowledged_at: string | null;
    work_order_id: number | null;
}

interface IoTDashboardProps {
    sensors: Sensor[];
    alerts: Alert[];
    statistics: {
        total_sensors: number;
        active_sensors: number;
        warning_sensors: number;
        critical_sensors: number;
        unacknowledged_alerts: number;
    };
}

const SENSOR_ICONS = {
    vibration: Gauge,
    temperature: ThermometerSun,
    pressure: Droplets,
    current: Zap,
};

export default function IoTDashboard({
    sensors: initialSensors,
    alerts: initialAlerts,
    statistics,
}: IoTDashboardProps) {
    const [sensors] = useState(initialSensors);
    const [alerts, setAlerts] = useState(initialAlerts);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshData = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['sensors', 'alerts', 'statistics'],
            onFinish: () => {
                setLastUpdate(new Date());
                setIsRefreshing(false);
            },
        });
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const acknowledgeAlert = (alertId: number) => {
        router.post(
            `/api/sensor-alerts/${alertId}/acknowledge`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAlerts((prev) =>
                        prev.filter((alert) => alert.id !== alertId),
                    );
                },
            },
        );
    };

    const getSensorStatusColor = (status: string) => {
        switch (status) {
            case 'critical':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'normal':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-gray-400';
            default:
                return 'bg-gray-500';
        }
    };

    const getSensorStatusBadge = (status: string) => {
        switch (status) {
            case 'critical':
                return <Badge variant="destructive">Critical</Badge>;
            case 'warning':
                return <Badge className="bg-yellow-500">Warning</Badge>;
            case 'normal':
                return (
                    <Badge variant="default" className="bg-green-500">
                        Normal
                    </Badge>
                );
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-orange-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-blue-500" />;
            default:
                return <Minus className="h-4 w-4 text-gray-400" />;
        }
    };

    const formatTimestamp = (timestamp: string | null) => {
        if (!timestamp) return 'Never';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        return date.toLocaleDateString();
    };

    const groupedSensors = sensors.reduce(
        (acc, sensor) => {
            const machine = sensor.machine_name;
            if (!acc[machine]) {
                acc[machine] = [];
            }
            acc[machine].push(sensor);
            return acc;
        },
        {} as Record<string, Sensor[]>,
    );

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        IoT Dashboard
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Last update:{' '}
                            {formatTimestamp(lastUpdate.toISOString())}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            Refresh
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="IoT Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Sensors
                                    </CardTitle>
                                    <Activity className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {statistics.total_sensors}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active
                                    </CardTitle>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {statistics.active_sensors}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Warning
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {statistics.warning_sensors}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Critical
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {statistics.critical_sensors}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Alerts
                                    </CardTitle>
                                    <Bell className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {statistics.unacknowledged_alerts}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Active Alerts */}
                        {alerts.length > 0 && (
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-red-800">
                                        <AlertTriangle className="mr-2 h-5 w-5" />
                                        Active Alerts ({alerts.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Unacknowledged sensor alerts requiring
                                        attention
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {alerts.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className="flex items-center justify-between rounded-lg border bg-white p-4"
                                            >
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {alert.sensor_name}
                                                        </span>
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-xs uppercase"
                                                        >
                                                            {alert.alert_type}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {alert.machine_name} •{' '}
                                                        {formatTimestamp(
                                                            alert.triggered_at,
                                                        )}
                                                    </div>
                                                    {alert.work_order_id && (
                                                        <div className="mt-1 text-sm text-blue-600">
                                                            Work Order #
                                                            {
                                                                alert.work_order_id
                                                            }{' '}
                                                            created
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        acknowledgeAlert(
                                                            alert.id,
                                                        )
                                                    }
                                                >
                                                    <BellOff className="mr-1 h-3 w-3" />
                                                    Acknowledge
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Sensors by Machine */}
                        {Object.entries(groupedSensors).map(
                            ([machineName, machineSensors]) => (
                                <Card key={machineName}>
                                    <CardHeader>
                                        <CardTitle>{machineName}</CardTitle>
                                        <CardDescription>
                                            {machineSensors.length} sensor(s)
                                            monitoring this machine
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {machineSensors.map((sensor) => {
                                                const Icon =
                                                    SENSOR_ICONS[
                                                        sensor.sensor_type as keyof typeof SENSOR_ICONS
                                                    ] || Activity;

                                                return (
                                                    <div
                                                        key={sensor.id}
                                                        className="flex items-start gap-3 rounded-lg border p-4"
                                                    >
                                                        <div
                                                            className={`${getSensorStatusColor(sensor.status)} rounded-lg p-2`}
                                                        >
                                                            <Icon className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 flex items-center justify-between">
                                                                <span className="text-sm font-medium capitalize">
                                                                    {
                                                                        sensor.sensor_type
                                                                    }
                                                                </span>
                                                                {getSensorStatusBadge(
                                                                    sensor.status,
                                                                )}
                                                            </div>
                                                            <div className="mb-2 truncate text-xs text-gray-600">
                                                                {sensor.name}
                                                            </div>
                                                            {sensor.last_reading !==
                                                            null ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-2xl font-bold">
                                                                        {sensor.last_reading.toFixed(
                                                                            1,
                                                                        )}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {
                                                                            sensor.unit
                                                                        }
                                                                    </span>
                                                                    {getTrendIcon(
                                                                        sensor.trend,
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-400">
                                                                    No reading
                                                                </div>
                                                            )}
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {formatTimestamp(
                                                                    sensor.last_reading_at,
                                                                )}
                                                            </div>
                                                            {sensor.warning_threshold && (
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    Thresholds:{' '}
                                                                    {
                                                                        sensor.warning_threshold
                                                                    }
                                                                    /
                                                                    {
                                                                        sensor.critical_threshold
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ),
                        )}

                        {sensors.length === 0 && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Activity className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        No Sensors Configured
                                    </h3>
                                    <p className="max-w-md text-center text-gray-600">
                                        Start monitoring your machines by adding
                                        IoT sensors or configure your IoT
                                        integration to receive sensor data
                                        automatically.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
