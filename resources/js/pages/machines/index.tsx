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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Inbox, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

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
    created_at: string;
}

interface Props {
    machines: Machine[];
    locations: Location[];
    filters: {
        location_id?: number;
        status?: string;
    };
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

export default function MachinesIndex({ machines, locations, filters }: Props) {
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState<string>(
        filters.location_id?.toString() || 'all',
    );
    const [statusFilter, setStatusFilter] = useState<string>(
        filters.status || 'active',
    );

    const handleFilterChange = () => {
        router.get(
            '/machines',
            {
                location_id:
                    locationFilter !== 'all' ? locationFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const filteredMachines = machines.filter((machine) => {
        const matchesSearch =
            machine.name.toLowerCase().includes(search.toLowerCase()) ||
            machine.code?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <AppLayout>
            <Head title="Machines" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Machines
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your factory machines and equipment
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/machines/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Machine
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>
                            Filter machines by location and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Search
                                </label>
                                <Input
                                    placeholder="Search by name or code..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Location
                                </label>
                                <Select
                                    value={locationFilter}
                                    onValueChange={setLocationFilter}
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="All locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All locations
                                        </SelectItem>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={location.id.toString()}
                                            >
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Status
                                </label>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archived
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    onClick={handleFilterChange}
                                    className="w-full"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Machine List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMachines.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Inbox className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-center text-muted-foreground">
                                    No machines found. Add your first machine to
                                    get started.
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/machines/create">
                                        Add Machine
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredMachines.map((machine) => (
                            <Card
                                key={machine.id}
                                className="cursor-pointer border-border transition-shadow hover:shadow-lg"
                                onClick={() =>
                                    router.visit(`/machines/${machine.id}`)
                                }
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-1">
                                            <CardTitle className="text-lg text-foreground">
                                                {machine.name}
                                            </CardTitle>
                                            {machine.code && (
                                                <p className="font-mono text-sm text-muted-foreground">
                                                    {machine.code}
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            className={
                                                statusColors[machine.status]
                                            }
                                        >
                                            {machine.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {machine.location && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {machine.location.name}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Criticality:
                                            </span>
                                            <Badge
                                                className={
                                                    criticalityColors[
                                                        machine.criticality
                                                    ]
                                                }
                                            >
                                                {machine.criticality}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Summary */}
                {filteredMachines.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                        Showing {filteredMachines.length} of {machines.length}{' '}
                        machines
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
