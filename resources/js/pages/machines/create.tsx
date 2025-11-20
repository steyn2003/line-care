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
import { ArrowLeft, Save } from 'lucide-react';

interface Location {
    id: number;
    name: string;
}

interface Props {
    locations: Location[];
}

export default function CreateMachine({ locations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        location_id: '',
        criticality: 'medium' as 'low' | 'medium' | 'high',
        status: 'active' as 'active' | 'archived',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/machines', {
            onSuccess: () => {
                router.visit('/machines');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Add Machine" />

            <div className="container mx-auto max-w-2xl space-y-6 py-6">
                {/* Header */}
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/machines')}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Machines
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Add New Machine
                    </h1>
                    <p className="text-muted-foreground">
                        Register a new machine in the system
                    </p>
                </div>

                {/* Form */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Machine Information</CardTitle>
                        <CardDescription>
                            Fill in the details about the machine
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Machine Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Machine Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., CNC Machine 1, Press Brake, etc."
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="bg-background"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Machine Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    Machine Code / ID (optional)
                                </Label>
                                <Input
                                    id="code"
                                    placeholder="e.g., CNC-001, PB-02"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    className="bg-background"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Internal reference code or asset number
                                </p>
                                {errors.code && (
                                    <p className="text-sm text-destructive">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location_id">Location</Label>
                                <Select
                                    value={data.location_id || undefined}
                                    onValueChange={(value) =>
                                        setData('location_id', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Select location (optional)..." />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                <p className="text-xs text-muted-foreground">
                                    Leave empty if no specific location
                                </p>
                                {errors.location_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.location_id}
                                    </p>
                                )}
                            </div>

                            {/* Criticality */}
                            <div className="space-y-2">
                                <Label htmlFor="criticality">
                                    Criticality{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.criticality}
                                    onValueChange={(value: any) =>
                                        setData('criticality', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            Low - Minor impact on operations
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            Medium - Moderate impact
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High - Critical to operations
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    How critical is this machine to your
                                    operations?
                                </p>
                                {errors.criticality && (
                                    <p className="text-sm text-destructive">
                                        {errors.criticality}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value: any) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active - In use
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archived - Not in use
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description (optional)
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Additional notes, specifications, or details about this machine..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="resize-none bg-background"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/machines')}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.name}
                                    className="flex-1"
                                >
                                    {processing ? (
                                        'Adding Machine...'
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Add Machine
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
