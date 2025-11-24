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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Activity,
    Droplets,
    Edit,
    Gauge,
    Plus,
    ThermometerSun,
    Trash2,
    Zap,
} from 'lucide-react';

interface Sensor {
    id: number;
    machine_id: number;
    machine: {
        id: number;
        name: string;
    };
    sensor_type: string;
    sensor_id: string;
    name: string;
    unit: string;
    protocol: string;
    last_reading: number | null;
    last_reading_at: string | null;
    warning_threshold: number | null;
    critical_threshold: number | null;
    is_active: boolean;
}

interface SensorsIndexProps {
    sensors: Sensor[];
}

const SENSOR_ICONS = {
    vibration: Gauge,
    temperature: ThermometerSun,
    pressure: Droplets,
    current: Zap,
    speed: Activity,
};

export default function SensorsIndex({ sensors }: SensorsIndexProps) {
    const handleDelete = (sensorId: number) => {
        router.delete(`/sensors/${sensorId}`);
    };

    const groupedSensors = sensors.reduce(
        (acc, sensor) => {
            const machineName = sensor.machine.name;
            if (!acc[machineName]) {
                acc[machineName] = [];
            }
            acc[machineName].push(sensor);
            return acc;
        },
        {} as Record<string, Sensor[]>,
    );

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

    return (
        <AppLayout
        // header={
        //     <div className="flex items-center justify-between">
        //         <h2 className="text-xl font-semibold leading-tight text-gray-800">
        //             Sensors
        //         </h2>
        //         <Link href={route('sensors.create')}>
        //             <Button>
        //                 <Plus className="w-4 h-4 mr-2" />
        //                 Add Sensor
        //             </Button>
        //         </Link>
        //     </div>
        // }
        >
            <Head title="Sensors" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {sensors.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Activity className="mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    No Sensors Configured
                                </h3>
                                <p className="mb-4 max-w-md text-center text-gray-600">
                                    Add IoT sensors to monitor your machines in
                                    real-time and receive alerts when readings
                                    exceed thresholds.
                                </p>
                                <Link href="/sensors/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Sensor
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedSensors).map(
                                ([machineName, machineSensors]) => (
                                    <Card key={machineName}>
                                        <CardHeader>
                                            <CardTitle>{machineName}</CardTitle>
                                            <p className="text-sm text-gray-600">
                                                {machineSensors.length} sensor
                                                {machineSensors.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Sensor
                                                        </TableHead>
                                                        <TableHead>
                                                            Type
                                                        </TableHead>
                                                        <TableHead>
                                                            Protocol
                                                        </TableHead>
                                                        <TableHead>
                                                            Last Reading
                                                        </TableHead>
                                                        <TableHead>
                                                            Thresholds
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {machineSensors.map(
                                                        (sensor) => {
                                                            const Icon =
                                                                SENSOR_ICONS[
                                                                    sensor.sensor_type as keyof typeof SENSOR_ICONS
                                                                ] || Activity;

                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        sensor.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <Icon className="h-4 w-4 text-gray-600" />
                                                                            <div>
                                                                                <p className="font-medium">
                                                                                    {
                                                                                        sensor.name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-gray-600">
                                                                                    {
                                                                                        sensor.sensor_id
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="capitalize">
                                                                        {
                                                                            sensor.sensor_type
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-sm uppercase">
                                                                        {
                                                                            sensor.protocol
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {sensor.last_reading !==
                                                                        null ? (
                                                                            <div>
                                                                                <p className="font-medium">
                                                                                    {sensor.last_reading.toFixed(
                                                                                        1,
                                                                                    )}{' '}
                                                                                    {
                                                                                        sensor.unit
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-gray-600">
                                                                                    {formatTimestamp(
                                                                                        sensor.last_reading_at,
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-500">
                                                                                No
                                                                                reading
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {sensor.warning_threshold &&
                                                                        sensor.critical_threshold ? (
                                                                            <div className="text-sm">
                                                                                <p className="text-yellow-600">
                                                                                    ⚠{' '}
                                                                                    {
                                                                                        sensor.warning_threshold
                                                                                    }
                                                                                </p>
                                                                                <p className="text-red-600">
                                                                                    🔴{' '}
                                                                                    {
                                                                                        sensor.critical_threshold
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-500">
                                                                                Not
                                                                                set
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {sensor.is_active ? (
                                                                            <Badge
                                                                                variant="default"
                                                                                className="bg-green-600"
                                                                            >
                                                                                Active
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="secondary">
                                                                                Inactive
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Link
                                                                                href={`/sensors/${sensor.id}/edit`}
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                >
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </Link>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Delete
                                                                                            Sensor?
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            This
                                                                                            will
                                                                                            permanently
                                                                                            delete
                                                                                            the
                                                                                            sensor
                                                                                            "
                                                                                            {
                                                                                                sensor.name
                                                                                            }
                                                                                            ".
                                                                                            All
                                                                                            historical
                                                                                            readings
                                                                                            will
                                                                                            be
                                                                                            preserved
                                                                                            but
                                                                                            the
                                                                                            sensor
                                                                                            will
                                                                                            no
                                                                                            longer
                                                                                            receive
                                                                                            new
                                                                                            data.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>
                                                                                            Cancel
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={() =>
                                                                                                handleDelete(
                                                                                                    sensor.id,
                                                                                                )
                                                                                            }
                                                                                            className="bg-red-600 hover:bg-red-700"
                                                                                        >
                                                                                            Delete
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        },
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
