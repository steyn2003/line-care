import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Switch } from '@/components/ui/switch';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    ChevronLeft,
    Droplets,
    Gauge,
    ThermometerSun,
    Trash2,
    Zap,
} from 'lucide-react';
import { FormEventHandler } from 'react';

interface Sensor {
    id: number;
    machine_id: number;
    sensor_type: string;
    sensor_id: string;
    name: string;
    unit: string;
    protocol: string;
    mqtt_topic?: string;
    warning_threshold: number | null;
    critical_threshold: number | null;
    is_active: boolean;
    last_reading: number | null;
    last_reading_at: string | null;
}

interface Machine {
    id: number;
    name: string;
}

interface SensorType {
    value: string;
    label: string;
    unit: string;
}

interface Protocol {
    value: string;
    label: string;
    description: string;
}

interface EditSensorProps {
    sensor: Sensor;
    machines: Machine[];
    sensorTypes: SensorType[];
    protocols: Protocol[];
}

const SENSOR_ICONS = {
    vibration: Gauge,
    temperature: ThermometerSun,
    pressure: Droplets,
    current: Zap,
    speed: Activity,
};

export default function EditSensor({
    sensor,
    machines,
    protocols,
}: EditSensorProps) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        machine_id: sensor.machine_id.toString(),
        sensor_type: sensor.sensor_type,
        name: sensor.name,
        unit: sensor.unit,
        protocol: sensor.protocol,
        mqtt_topic: sensor.mqtt_topic || '',
        warning_threshold: sensor.warning_threshold?.toString() || '',
        critical_threshold: sensor.critical_threshold?.toString() || '',
        is_active: sensor.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/sensors/${sensor.id}`);
    };

    const handleDelete = () => {
        destroy(`/sensors/${sensor.id}`);
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

    const Icon =
        SENSOR_ICONS[sensor.sensor_type as keyof typeof SENSOR_ICONS] ||
        Activity;

    return (
        <AppLayout>
            <Head title={`Edit ${sensor.name}`} />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/iot/sensors">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit Sensor
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {sensor.name}
                            </p>
                        </div>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete Sensor?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the sensor "
                                    {sensor.name}". Historical readings will be
                                    preserved but the sensor will no longer
                                    receive new data. This action cannot be
                                    undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="py-12">
                    <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Current Status */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Icon className="h-5 w-5" />
                                            Current Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Sensor ID:
                                                </span>
                                                <span className="font-mono text-sm">
                                                    {sensor.sensor_id}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Last Reading:
                                                </span>
                                                <span className="font-semibold">
                                                    {sensor.last_reading !==
                                                    null
                                                        ? `${sensor.last_reading.toFixed(1)} ${sensor.unit}`
                                                        : 'No reading'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Last Update:
                                                </span>
                                                <span className="text-sm">
                                                    {formatTimestamp(
                                                        sensor.last_reading_at,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Type:
                                                </span>
                                                <span className="text-sm capitalize">
                                                    {sensor.sensor_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Protocol:
                                                </span>
                                                <span className="text-sm uppercase">
                                                    {sensor.protocol}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Machine */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Machine</CardTitle>
                                        <CardDescription>
                                            The machine this sensor monitors
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label htmlFor="machine_id">
                                                Machine
                                            </Label>
                                            <Select
                                                value={data.machine_id}
                                                onValueChange={(value) =>
                                                    setData('machine_id', value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
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
                                            {errors.machine_id && (
                                                <p className="text-sm text-red-600">
                                                    {errors.machine_id}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Sensor Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sensor Details</CardTitle>
                                        <CardDescription>
                                            Update sensor name and configuration
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Sensor Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="unit">
                                                    Unit
                                                </Label>
                                                <Input
                                                    id="unit"
                                                    value={data.unit}
                                                    onChange={(e) =>
                                                        setData(
                                                            'unit',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.unit && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.unit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Protocol Configuration */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Protocol Configuration
                                        </CardTitle>
                                        <CardDescription>
                                            Communication protocol settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="protocol">
                                                    Protocol
                                                </Label>
                                                <Select
                                                    value={data.protocol}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'protocol',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {protocols.map(
                                                            (protocol) => (
                                                                <SelectItem
                                                                    key={
                                                                        protocol.value
                                                                    }
                                                                    value={
                                                                        protocol.value
                                                                    }
                                                                >
                                                                    {
                                                                        protocol.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.protocol && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.protocol}
                                                    </p>
                                                )}
                                            </div>

                                            {data.protocol === 'mqtt' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="mqtt_topic">
                                                        MQTT Topic
                                                    </Label>
                                                    <Input
                                                        id="mqtt_topic"
                                                        value={data.mqtt_topic}
                                                        onChange={(e) =>
                                                            setData(
                                                                'mqtt_topic',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="sensors/vibration/machine-1"
                                                    />
                                                    {errors.mqtt_topic && (
                                                        <p className="text-sm text-red-600">
                                                            {errors.mqtt_topic}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Thresholds */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Alert Thresholds</CardTitle>
                                        <CardDescription>
                                            Update warning and critical
                                            thresholds
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="warning_threshold">
                                                        Warning Threshold
                                                    </Label>
                                                    <Input
                                                        id="warning_threshold"
                                                        type="number"
                                                        step="0.1"
                                                        value={
                                                            data.warning_threshold
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'warning_threshold',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.warning_threshold && (
                                                        <p className="text-sm text-red-600">
                                                            {
                                                                errors.warning_threshold
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-600">
                                                        Alert when reading
                                                        exceeds this value
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="critical_threshold">
                                                        Critical Threshold
                                                    </Label>
                                                    <Input
                                                        id="critical_threshold"
                                                        type="number"
                                                        step="0.1"
                                                        value={
                                                            data.critical_threshold
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'critical_threshold',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.critical_threshold && (
                                                        <p className="text-sm text-red-600">
                                                            {
                                                                errors.critical_threshold
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-600">
                                                        Create work order when
                                                        exceeded
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="is_active">
                                                    Active
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Enable or disable monitoring
                                                    for this sensor
                                                </p>
                                            </div>
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        'is_active',
                                                        checked,
                                                    )
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4">
                                    <Link href="/sensors">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
