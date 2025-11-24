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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Integration {
    id: number;
    integration_type: string;
    provider: string;
    config: Record<string, unknown>;
    is_enabled: boolean;
    sync_frequency: string;
}

interface EditIntegrationProps {
    integration: Integration;
    integrationTypes: Array<{
        value: string;
        label: string;
        description: string;
    }>;
    providers: Record<string, string[]>;
}

export default function EditIntegration({ integration }: EditIntegrationProps) {
    const [configFields, setConfigFields] = useState<Record<string, string>>(
        Object.entries(integration.config || {}).reduce(
            (acc, [key, value]) => {
                acc[key] =
                    typeof value === 'boolean'
                        ? value.toString()
                        : String(value);
                return acc;
            },
            {} as Record<string, string>,
        ),
    );

    const { data, setData, put, processing } = useForm({
        provider: integration.provider,
        config: integration.config,
        is_enabled: integration.is_enabled,
        sync_frequency: integration.sync_frequency,
    });

    const handleConfigChange = (key: string, value: string) => {
        setConfigFields((prev) => ({ ...prev, [key]: value }));
        setData('config', { ...data.config, [key]: value });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/integrations/${integration.id}`);
    };

    // Uncomment when needed:
    // const handleDelete = () => {
    //     if (confirm('Are you sure you want to delete this integration?')) {
    //         destroy(`/integrations/${integration.id}`);
    //     }
    // };

    // const integrationTypeLabel =
    //     integrationTypes.find((t) => t.value === integration.integration_type)
    //         ?.label || 'Integration';

    return (
        <AppLayout
        // header={
        //     <div className="flex items-center justify-between">
        //         <div className="flex items-center gap-4">
        //             <Link href="/integrations">
        //                 <Button variant="ghost" size="icon">
        //                     <ChevronLeft className="h-5 w-5" />
        //                 </Button>
        //             </Link>
        //             <div>
        //                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
        //                     Edit Integration
        //                 </h2>
        //                 <p className="text-sm text-gray-600">{integration.provider} ({integrationTypeLabel})</p>
        //             </div>
        //         </div>

        //         <AlertDialog>
        //             <AlertDialogTrigger asChild>
        //                 <Button variant="destructive" size="sm">
        //                     <Trash2 className="h-4 w-4 mr-2" />
        //                     Delete
        //                 </Button>
        //             </AlertDialogTrigger>
        //             <AlertDialogContent>
        //                 <AlertDialogHeader>
        //                     <AlertDialogTitle>Delete Integration?</AlertDialogTitle>
        //                     <AlertDialogDescription>
        //                         This will permanently delete the {integration.provider} integration.
        //                         This action cannot be undone.
        //                     </AlertDialogDescription>
        //                 </AlertDialogHeader>
        //                 <AlertDialogFooter>
        //                     <AlertDialogCancel>Cancel</AlertDialogCancel>
        //                     <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
        //                         Delete
        //                     </AlertDialogAction>
        //                 </AlertDialogFooter>
        //             </AlertDialogContent>
        //         </AlertDialog>
        //     </div>
        // }
        >
            <Head title={`Edit ${integration.provider} Integration`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Configuration Fields */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuration</CardTitle>
                                    <CardDescription>
                                        Update the connection details for{' '}
                                        {integration.provider}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(configFields).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="space-y-2"
                                                >
                                                    <Label htmlFor={key}>
                                                        {key
                                                            .split('_')
                                                            .map(
                                                                (word) =>
                                                                    word
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase() +
                                                                    word.slice(
                                                                        1,
                                                                    ),
                                                            )
                                                            .join(' ')}
                                                    </Label>
                                                    {key.includes('password') ||
                                                    key.includes('token') ||
                                                    key.includes('secret') ||
                                                    key.includes('key') ? (
                                                        <Input
                                                            id={key}
                                                            type="password"
                                                            value={value}
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="••••••••"
                                                        />
                                                    ) : value === 'true' ||
                                                      value === 'false' ? (
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={
                                                                    value ===
                                                                    'true'
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    handleConfigChange(
                                                                        key,
                                                                        checked.toString(),
                                                                    )
                                                                }
                                                            />
                                                            <span className="text-sm text-gray-600">
                                                                {value ===
                                                                'true'
                                                                    ? 'Enabled'
                                                                    : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            id={key}
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) =>
                                                                handleConfigChange(
                                                                    key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                    <CardDescription>
                                        Configure integration behavior
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sync_frequency">
                                                Sync Frequency
                                            </Label>
                                            <Select
                                                value={data.sync_frequency}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'sync_frequency',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="real_time">
                                                        Real-time
                                                    </SelectItem>
                                                    <SelectItem value="hourly">
                                                        Hourly
                                                    </SelectItem>
                                                    <SelectItem value="daily">
                                                        Daily
                                                    </SelectItem>
                                                    <SelectItem value="weekly">
                                                        Weekly
                                                    </SelectItem>
                                                    <SelectItem value="manual">
                                                        Manual
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-gray-600">
                                                How often should this
                                                integration sync data
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="is_enabled">
                                                    Enable Integration
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Enable or disable this
                                                    integration
                                                </p>
                                            </div>
                                            <Switch
                                                id="is_enabled"
                                                checked={data.is_enabled}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        'is_enabled',
                                                        checked,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Integration Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Integration Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Type:
                                            </span>
                                            <span className="font-medium capitalize">
                                                {integration.integration_type}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Provider:
                                            </span>
                                            <span className="font-medium">
                                                {integration.provider}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Status:
                                            </span>
                                            <span
                                                className={`font-medium ${integration.is_enabled ? 'text-green-600' : 'text-gray-600'}`}
                                            >
                                                {integration.is_enabled
                                                    ? 'Enabled'
                                                    : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <Link href="/integrations">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
