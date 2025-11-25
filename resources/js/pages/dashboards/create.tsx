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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreateDashboard() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_default: false,
        is_shared: false,
        shared_with_role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboards');
    };

    return (
        <AppLayout>
            <Head title="Create Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/dashboards')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Create Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Set up a new custom dashboard
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Details</CardTitle>
                            <CardDescription>
                                Configure your dashboard settings. You can add
                                widgets after creating the dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="My Custom Dashboard"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Describe what this dashboard is for..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>Set as Default</Label>
                                        <p className="text-sm text-muted-foreground">
                                            This dashboard will be shown by
                                            default when you open custom
                                            dashboards
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_default}
                                        onCheckedChange={(checked) =>
                                            setData('is_default', checked)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>Share with Team</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow others in your company to view
                                            this dashboard
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_shared}
                                        onCheckedChange={(checked) =>
                                            setData('is_shared', checked)
                                        }
                                    />
                                </div>

                                {data.is_shared && (
                                    <div className="space-y-2">
                                        <Label htmlFor="shared_with_role">
                                            Share with Role (optional)
                                        </Label>
                                        <Select
                                            value={data.shared_with_role}
                                            onValueChange={(value) =>
                                                setData(
                                                    'shared_with_role',
                                                    value === 'all'
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Roles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Roles
                                                </SelectItem>
                                                <SelectItem value="operator">
                                                    Operators Only
                                                </SelectItem>
                                                <SelectItem value="technician">
                                                    Technicians Only
                                                </SelectItem>
                                                <SelectItem value="manager">
                                                    Managers Only
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            Leave empty to share with everyone
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.visit('/dashboards')
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Dashboard
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
