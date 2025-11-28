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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Machine {
    id: number;
    name: string;
    code: string;
    location_id: number;
}

interface Location {
    id: number;
    name: string;
}

interface Props {
    locations: Location[];
    machines: Machine[];
    shutdown_types: Array<{ value: string; label: string }>;
}

export default function ShutdownCreate({
    locations,
    machines,
    shutdown_types,
}: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        machine_id: '',
        location_id: '',
        start_at: '',
        end_at: '',
        shutdown_type: 'planned_maintenance',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/planning/shutdowns');
    };

    // Filter machines by selected location
    const filteredMachines = data.location_id
        ? machines.filter((m) => m.location_id === parseInt(data.location_id))
        : machines;

    return (
        <AppLayout>
            <Head title={t('planning.shutdowns.create', 'Plan Shutdown')} />

            <div className="container mx-auto max-w-2xl space-y-6 py-6">
                {/* Header */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/planning/shutdowns')}
                        className="mb-2 text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('planning.shutdowns.back_to_list', 'Back to Shutdowns')}
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('planning.shutdowns.create', 'Plan Shutdown')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('planning.shutdowns.create_description', 'Schedule a planned maintenance window or shutdown')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {t('planning.shutdowns.details', 'Shutdown Details')}
                            </CardTitle>
                            <CardDescription>
                                {t('planning.shutdowns.details_description', 'Enter the shutdown information')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {t('common.name', 'Name')} *
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('planning.shutdowns.name_placeholder', 'e.g., Q1 Preventive Maintenance')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    {t('common.description', 'Description')}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder={t('planning.shutdowns.description_placeholder', 'Describe the purpose of this shutdown...')}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="shutdown_type">
                                    {t('planning.type', 'Type')} *
                                </Label>
                                <Select
                                    value={data.shutdown_type}
                                    onValueChange={(value) => setData('shutdown_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shutdown_types.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.shutdown_type && (
                                    <p className="text-sm text-destructive">{errors.shutdown_type}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location_id">
                                    {t('planning.location', 'Location')} *
                                </Label>
                                <Select
                                    value={data.location_id}
                                    onValueChange={(value) => {
                                        setData('location_id', value);
                                        // Reset machine if location changes
                                        if (data.machine_id) {
                                            const machine = machines.find(m => m.id === parseInt(data.machine_id));
                                            if (machine && machine.location_id !== parseInt(value)) {
                                                setData('machine_id', '');
                                            }
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('planning.shutdowns.select_location', 'Select a location')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem key={location.id} value={location.id.toString()}>
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.location_id && (
                                    <p className="text-sm text-destructive">{errors.location_id}</p>
                                )}
                            </div>

                            {/* Machine (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="machine_id">
                                    {t('planning.machine', 'Machine')}
                                    <span className="ml-1 text-xs text-muted-foreground">
                                        ({t('common.optional', 'Optional')})
                                    </span>
                                </Label>
                                <Select
                                    value={data.machine_id}
                                    onValueChange={(value) => setData('machine_id', value === 'none' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('planning.shutdowns.all_machines_in_location', 'All machines in location')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            {t('planning.shutdowns.all_machines_in_location', 'All machines in location')}
                                        </SelectItem>
                                        {filteredMachines.map((machine) => (
                                            <SelectItem key={machine.id} value={machine.id.toString()}>
                                                {machine.name} ({machine.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {t('planning.shutdowns.machine_hint', 'Leave empty to apply to all machines in the location')}
                                </p>
                                {errors.machine_id && (
                                    <p className="text-sm text-destructive">{errors.machine_id}</p>
                                )}
                            </div>

                            {/* Schedule */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_at">
                                        {t('planning.start', 'Start')} *
                                    </Label>
                                    <Input
                                        id="start_at"
                                        type="datetime-local"
                                        value={data.start_at}
                                        onChange={(e) => setData('start_at', e.target.value)}
                                    />
                                    {errors.start_at && (
                                        <p className="text-sm text-destructive">{errors.start_at}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_at">
                                        {t('planning.end', 'End')} *
                                    </Label>
                                    <Input
                                        id="end_at"
                                        type="datetime-local"
                                        value={data.end_at}
                                        onChange={(e) => setData('end_at', e.target.value)}
                                    />
                                    {errors.end_at && (
                                        <p className="text-sm text-destructive">{errors.end_at}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/planning/shutdowns')}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? t('common.creating', 'Creating...')
                                        : t('planning.shutdowns.create', 'Plan Shutdown')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
